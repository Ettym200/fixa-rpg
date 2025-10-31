"use client";
import useLocalStorage from "../hooks/useLocalStorage";

export default function ProficienciesSection() {
  const [text, setText] = useLocalStorage("proficiencies", "");
  return (
    <section className="parchment rounded-lg p-4">
      <details>
        <summary className="cursor-pointer select-none font-serif text-xl" style={{ color: "var(--primary)" }}>
          Proficiências e Outras Características
        </summary>
        <div className="mt-3">
          <textarea
            rows={6}
            className="w-full rounded-md border border-black/10 bg-white/80 p-3 text-black outline-none focus:border-[var(--primary)] dark:border-white/20 dark:bg-black dark:text-white"
            value={text}
            onChange={(e)=> setText(e.target.value)}
            placeholder="Proficiências, poderes, habilidades, características de origem/classe..."
          />
        </div>
      </details>
    </section>
  );
}


