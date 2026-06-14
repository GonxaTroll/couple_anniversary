from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.anniversary import Anniversary

router = APIRouter(prefix="/anniversary", tags=["anniversary"])


class AnniversaryCreate(BaseModel):
    person_1_name: str
    person_2_name: str
    anniversary_date: str  # ISO format: YYYY-MM-DD
    story: str | None = None


class AnniversaryOut(AnniversaryCreate):
    id: int

    model_config = {"from_attributes": True}


@router.post("/", response_model=AnniversaryOut, status_code=201)
async def create_anniversary(
    data: AnniversaryCreate, db: AsyncSession = Depends(get_db)
):
    record = Anniversary(**data.model_dump())
    db.add(record)
    await db.commit()
    await db.refresh(record)
    return record


@router.get("/{anniversary_id}", response_model=AnniversaryOut)
async def get_anniversary(
    anniversary_id: int, db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Anniversary).where(Anniversary.id == anniversary_id)
    )
    record = result.scalar_one_or_none()
    if not record:
        raise HTTPException(status_code=404, detail="Anniversary not found")
    return record
