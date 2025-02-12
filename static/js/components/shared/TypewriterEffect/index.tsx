import type React from "react";
import { useState, useEffect } from "react";

interface TypewriterEffectProps {
  text: string;
  speed?: number;
}

export const TypewriterEffect: React.FC<TypewriterEffectProps> = ({
  text,
  speed = 50,
}) => {
  const [displayedText, setDisplayedText] = useState<string>("");
  const words = text.split(" ");

  useEffect(() => {
    let currentIndex = 0;
    const intervalId = setInterval(() => {
      if (currentIndex < words.length - 1) {
        setDisplayedText(
          (prev) => `${prev}${prev ? " " : ""}${words[currentIndex]}`
        );
        currentIndex++;
      } else {
        clearInterval(intervalId);
      }
    }, speed);

    return () => clearInterval(intervalId);
  }, [speed]); // Removed unnecessary dependency 'text'

  return <div className="typewriter-text">{displayedText}</div>;
};
