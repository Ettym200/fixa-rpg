"use client";
import { ChangeEvent } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

export default function ProficienciesSection() {
  const [text, setText] = useLocalStorage<string>("proficiencies", "");
  return (
    <section className="parchment rounded-lg p-4">
      <details>
        <summary className="cursor-pointer select-none font-serif text-xl" style={{ color: "var(--primary)" }}>
          Proficiências e Outras Características
        </summary>
        <div className="mt-3">
          <textarea
            rows={6}
            className="sheet-input w-full rounded-md p-3 outline-none focus:border-[var(--primary)] dark:sheet-input-dark"
            value={text}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)}
            placeholder="Proficiências, poderes, habilidades, características de origem/classe..."
          />
        </div>
      </details>
    </section>
  );
}

