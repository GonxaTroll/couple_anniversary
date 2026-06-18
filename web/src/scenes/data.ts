import type { Scene, Riddle } from "./types";

export const RIDDLE: Riddle = {
  question: "What was the name of the place where we first held hands?",
  answer: "malvarrosa",
};

export const SCENES: Scene[] = [
  {
    id: "home",
    compositionId: "HomeScene",
    messages: [
      {
        id: "h1",
        speaker: "him",
        text: "Are you still studying? You've been at it for hours.",
        time: "10:30 PM",
      },
      {
        id: "h2",
        speaker: "her",
        text: "Yeah, trying to finish this physics chapter. Prime numbers are melting my brain.",
        time: "10:32 PM",
      },
      {
        id: "h3",
        speaker: "him",
        text: "Take a break soon! I'm just relaxing, reading that book you recommended.",
        time: "10:33 PM",
      },
      {
        id: "h4",
        speaker: "her",
        text: "Almost done. I'll call you when I finish! Miss you.",
        time: "10:35 PM",
      },
    ],
    quiz: {
      questionKey: "first_late_night",
      question: "Do you remember what book he was reading that night?",
      options: [
        { id: "a", text: "The one she recommended" },
        { id: "b", text: "A data science textbook" },
        { id: "c", text: "He wasn't reading, just scrolling" },
      ],
    },
    transition: { type: "quiz" },
  },
  {
    id: "muvim",
    compositionId: "MuVimScene",
    messages: [],
    transition: { type: "button", label: "Continue" },
  },
];
