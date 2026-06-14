import type { Scene } from "./types";

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
    messages: [
      {
        id: "m1",
        speaker: "him",
        text: "I'm outside MuViM. It's even more beautiful at night.",
        time: "9:14 PM",
      },
      {
        id: "m2",
        speaker: "her",
        text: "You're early! I'm two streets away, just ran out of the metro.",
        time: "9:15 PM",
      },
      {
        id: "m3",
        speaker: "him",
        text: "Take your time. I could wait here forever.",
        time: "9:15 PM",
      },
    ],
    quiz: {
      questionKey: "muvim_night",
      question: "What was the first thing she said when she finally arrived?",
      options: [
        { id: "a", text: "Sorry, sorry, sorry!" },
        { id: "b", text: "You look nice tonight" },
        { id: "c", text: "I told you I'd make it" },
      ],
    },
    transition: { type: "quiz" },
  },
];
