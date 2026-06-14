"""LLM service — swap the provider once decided."""

from app.config import settings


async def match_answers(question: str, answer_1: str, answer_2: str) -> dict:
    """
    Compare two answers to the same question and return a compatibility
    score + explanation.

    TODO: implement with chosen LLM provider.
    Stub returns a placeholder so the rest of the app can be wired up first.
    """
    # Example shape — keep this contract stable when implementing for real
    return {
        "score": 0,
        "explanation": "LLM provider not configured yet.",
        "question": question,
        "answer_1": answer_1,
        "answer_2": answer_2,
    }
