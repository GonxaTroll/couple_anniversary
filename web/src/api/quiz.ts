const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export async function submitQuizAnswer(payload: {
  anniversary_id: number;
  person: string;
  question_key: string;
  answer_text: string;
}): Promise<void> {
  const res = await fetch(`${BASE}/quiz/answer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    console.error("Failed to submit answer", await res.text());
  }
}
