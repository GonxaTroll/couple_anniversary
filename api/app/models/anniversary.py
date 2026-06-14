from datetime import datetime

from sqlalchemy import DateTime, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Anniversary(Base):
    """Core anniversary record — dates, names, shared story."""

    __tablename__ = "anniversaries"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    person_1_name: Mapped[str] = mapped_column(String(100))
    person_2_name: Mapped[str] = mapped_column(String(100))
    anniversary_date: Mapped[str] = mapped_column(String(20))  # ISO date
    story: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now()
    )


class QuizAnswer(Base):
    """Stores answers collected from the users for LLM matching."""

    __tablename__ = "quiz_answers"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    anniversary_id: Mapped[int] = mapped_column(Integer)
    person: Mapped[str] = mapped_column(String(100))  # person_1 | person_2
    question_key: Mapped[str] = mapped_column(String(200))
    answer_text: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now()
    )
