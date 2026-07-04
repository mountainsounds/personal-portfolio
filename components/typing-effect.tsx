"use client";

import { useEffect, useState } from "react";

const WORDS = [
  "Developer",
  "Tech Lover",
  "Team Player",
  "Outdoor Enthusiast",
  "Climber",
];

// Timings preserved from the original helpers/typingEffect.js.
const TYPE_MS = 300;
const DELETE_MS = 100;
const HOLD_WORD_MS = 3000;
const NEXT_WORD_MS = 500;

export default function TypingEffect() {
  const [text, setText] = useState("");

  useEffect(() => {
    let wordIndex = 0;
    let current = "";
    let deleting = false;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      const word = WORDS[wordIndex % WORDS.length];
      current = word.substring(0, current.length + (deleting ? -1 : 1));
      setText(current);

      let delay = deleting ? DELETE_MS : TYPE_MS;
      if (!deleting && current === word) {
        delay = HOLD_WORD_MS;
        deleting = true;
      } else if (deleting && current === "") {
        deleting = false;
        wordIndex += 1;
        delay = NEXT_WORD_MS;
      }
      timer = setTimeout(tick, delay);
    };

    tick();
    return () => clearTimeout(timer);
  }, []);

  return <p className="showcase__content--para">{text}</p>;
}
