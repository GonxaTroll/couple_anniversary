from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.anniversary import QuizAnswer
from app.services.llm import match_answers

router = APIRouter(prefix="/quiz", tags=["quiz"])


class AnswerSubmit(BaseModel):
    anniversary_id: int
    person: str  # "person_1" or "person_2"
    question_key: str
    answer_text: str


class MatchRequest(BaseModel):
    anniversary_id: int
    question_key: str
    answer_1: str
    answer_2: str


@router.post("/answer", status_code=201)
async def submit_answer(
    data: AnswerSubmit, db: AsyncSession = Depends(get_db)
):
    record = QuizAnswer(**data.model_dump())
    db.add(record)
    await db.commit()
    return {"status": "saved"}


@router.post("/match")
async def match(data: MatchRequest):
    result = await match_answers(
        data.question_key, data.answer_1, data.answer_2
    )
    return result
