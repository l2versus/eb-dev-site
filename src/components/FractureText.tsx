import type { CSSProperties } from "react";

type FractureTextProps = {
  text: string;
  className?: string;
  style?: CSSProperties;
};

export function FractureText({ text, className = "", style }: FractureTextProps) {
  const words = text.split(" ");

  return (
    <span className={`fracture-text ${className}`} style={style} aria-label={text}>
      {words.map((word, wordIndex) => (
        <span className="fracture-word" aria-hidden="true" key={`${word}-${wordIndex}`}>
          {word.split("").map((char, charIndex) => (
            <span
              className="fracture-char"
              data-char={char}
              key={`${char}-${wordIndex}-${charIndex}`}
            >
              {char}
            </span>
          ))}
          {wordIndex < words.length - 1 && <span className="fracture-space">&nbsp;</span>}
        </span>
      ))}
    </span>
  );
}
