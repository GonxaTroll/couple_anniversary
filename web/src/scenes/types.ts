export type ChatMessage = {
  id: string;
  speaker: "him" | "her";
  text: string;
  time: string;
};

export type QuizOption = {
  id: string;
  text: string;
  nextMessages?: ChatMessage[];
  isCorrect?: boolean;
};

export type Quiz = {
  questionKey: string;
  question: string;
  options: QuizOption[];
};

export type TransitionTrigger =
  | { type: "quiz" }          // next scene unlocked after quiz answer
  | { type: "button"; label: string; delayMs?: number }  // explicit CTA with optional delay
  | { type: "auto"; delayMs: number }; // auto-advance after delay

export type Riddle = {
  question: string;
  answer: string;
  placeholder?: string;
  buttonLabel?: string;
};

export type DayOption = {
  id: string;
  label: string;
  day: string;
};

export type DayPicker = {
  options: DayOption[];
  correctId: string;
};

export type NarratorPopup = {
  text: string;
  durationMs?: number;
};

export type Scene = {
  id: string;
  compositionId: "HomeScene" | "MuVimScene" | "HomeBothScene" | "TripsScene";
  narrator?: NarratorPopup;
  loopAnimation?: boolean;
  messages: ChatMessage[];
  postQuizMessages?: ChatMessage[];
  quiz?: Quiz;
  riddle?: Riddle;
  dayPicker?: DayPicker;
  postDayPickerMessages?: ChatMessage[];
  transition: TransitionTrigger;
};
