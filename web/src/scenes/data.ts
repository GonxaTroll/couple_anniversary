import type { Scene, Riddle } from "./types";

export const RIDDLE: Riddle = {
  question: "¿Cuál era el nombre del lugar donde nos tomamos de la mano por primera vez?",
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
        text: "¡Descansa pronto! Estoy relajándome, leyendo ese libro que me recomendaste.",
        time: "22:33",
      },
      {
        id: "h4",
        speaker: "her",
        text: "Casi termino. ¡Te llamo cuando acabe! Te echo de menos.",
        time: "22:35",
      },
    ],
    quiz: {
      questionKey: "first_late_night",
      question: "¿Recuerdas qué libro estaba leyendo esa noche?",
      options: [
        { id: "a", text: "El que ella recomendó" },
        { id: "b", text: "Un libro de ciencia de datos" },
        { id: "c", text: "No estaba leyendo, solo desplazándose" },
      ],
    },
    transition: { type: "quiz" },
  },
  {
    id: "muvim",
    compositionId: "MuVimScene",
    messages: [],
    transition: { type: "button", label: "Continuar" },
  },
];
