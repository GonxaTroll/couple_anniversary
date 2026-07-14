import type { Scene, Riddle } from "./types";

export const RIDDLE: Riddle = {
  question: "¿Qué día nos conocimos? (día/mes/año)",
  answer: "",
};

export const SCENES: Scene[] = [
  {
    id: "home",
    compositionId: "HomeScene",
    messages: [
      {
        id: "h1",
        speaker: "him",
        text: "¿Todavía estás estudiando? Llevas horas con eso.",
        time: "22:30",
      },
      {
        id: "h2",
        speaker: "her",
        text: "Sí, intentando terminar este capítulo de física. Los números primos me están derritiendo el cerebro.",
        time: "22:32",
      },
      {
        id: "h3",
        speaker: "him",
        text: "Damn. ¿Sabías que yo...",
        time: "22:33",
      },
    ],
    quiz: {
      questionKey: "first_late_night",
      question: "¿A qué se ha dedicado Gonzalo anteriormente?",
      options: [
        {
          id: "a",
          text: "Profesor de física.",
          isCorrect: true,
          nextMessages: [
            {
              id: "pq1",
              speaker: "him",
              text: "...he sido profesor particular? Te podría ayudar.",
              time: "22:34",
            },
            {
              id: "pq2",
              speaker: "her",
              text: "No estaría mal...",
              time: "22:35",
            },
            {
              id: "pq3",
              speaker: "him",
              text: "Bueno... aquí tienes mi disponibilidad.",
              time: "22:36",
            },
          ],
        },
        {
          id: "b",
          text: "A estar en su Prime (como los números)",
          nextMessages: [
            {
              id: "pq1b",
              speaker: "him",
              text: "... estoy mamadísimo?",
              time: "22:34",
            },
            {
              id: "pq2b",
              speaker: "her",
              text: "bruh wtf",
              time: "22:35",
            },
            {
              id: "pq3b",
              speaker: "her",
              text: "Bueno... igual tengo algo planeado para este finde.",
              time: "22:36",
            },
          ],
        },
        {
          id: "c",
          text: "Chocolatero",
          nextMessages: [
            {
              id: "pq1c",
              speaker: "him",
              text: "Ojalá, pero no...",
              time: "22:34",
            },
            {
              id: "pq2c",
              speaker: "her",
              text: "¿Entonces qué?",
              time: "22:35",
            },
            {
              id: "pq3c",
              speaker: "him",
              text: "Bueno... igual tengo algo planeado para este finde.",
              time: "22:36",
            },
          ],
        },
      ],
    },
    dayPicker: {
      options: [
        { id: "fri", label: "Vie", day: "13" },
        { id: "sat", label: "Sáb", day: "14" },
        { id: "sun", label: "Dom", day: "15" },
      ],
      correctId: "sat",
    },
    postDayPickerMessages: [
      {
        id: "pd1",
        speaker: "her",
        text: "Pues supongo que ahora puedes pasarte.",
        time: "22:37",
      },
      {
        id: "pd2",
        speaker: "him",
        text: "Ahora te veo",
        time: "22:38",
      }
    ],
    transition: { type: "button", label: "Continuar" },
  },
  {
    id: "muvim",
    compositionId: "MuVimScene",
    loopAnimation: false,
    messages: [
      {
        id: "m1",
        speaker: "him",
        text: "Estoy fuera del MuViM. Llegaré en 10 minutos.",
        time: "21:15",
      },
      {
        id: "m2",
        speaker: "her",
        text: "Ah, me suena... Está bien, te espero.",
        time: "21:16",
      },
      {
        id: "m3",
        speaker: "him",
        text: "Traigo mis apuntes, seguro que te sirven para tu examen.",
        time: "21:17",
      },
    ],
    transition: { type: "button", label: "Continuar" },
  },
  {
    id: "home_both",
    compositionId: "HomeBothScene",
    loopAnimation: false,
    narrator: {
      text: "Comienzan a hablar durante horas...",
      durationMs: 3500,
    },
    messages: [
      {
        id: "hb1",
        speaker: "him",
        text: "Bueno, ¿por qué tema empezamos?",
        time: "23:00",
      },
    ],
    quiz: {
      questionKey: "study_topic",
      question: "¿Qué tema estudiamos?",
      options: [
        {
          id: "optics",
          text: "Óptica",
          isCorrect: true,
          nextMessages: [
            {
              id: "hb_opt1",
              speaker: "her",
              text: "Óptica.",
              time: "23:01",
            },
            {
              id: "hb_opt2",
              speaker: "her",
              text: "Tocará estudiar algo de física.",
              time: "23:02",
            },
          ],
        },
        {
          id: "emag",
          text: "Electromagnetismo",
          isCorrect: true,
          nextMessages: [
            {
              id: "hb_em1",
              speaker: "her",
              text: "Electromagnetismo.",
              time: "23:01",
            },
            {
              id: "hb_em2",
              speaker: "her",
              text: "Tocará estudiar algo de física.",
              time: "23:02",
            },
          ],
        },
        {
          id: "amazon",
          text: "Amazon Prime",
          isCorrect: true,
          nextMessages: [
            {
              id: "hb_am1",
              speaker: "her",
              text: "Vamos a ver una peli.",
              time: "23:01",
            },
            {
              id: "hb_am2",
              speaker: "her",
              text: "Ya estudiaré mañana.",
              time: "23:02",
            },
          ],
        },
      ],
    },
    transition: { type: "button", label: "Continuar" },
  },
  {
    id: "trips",
    compositionId: "TripsScene",
    loopAnimation: false,
    messages: [],
    transition: { type: "button", label: "Fin", delayMs: 20000 },
  },
];
