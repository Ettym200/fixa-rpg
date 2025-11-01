"use client";
import { ChangeEvent } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

export default function WeaponAbilitiesSection() {
  const [text, setText] = useLocalStorage<string>("weaponAbilities", "");
  return (
    <section className="parchment rounded-lg p-4">
      <details>
        <summary className="cursor-pointer select-none font-serif text-xl" style={{ color: "var(--primary)" }}>
          Habilidades de Armas
        </summary>
        <div className="mt-3">
          <textarea
            rows={6}
            className="sheet-input w-full rounded-md p-3 outline-none focus:border-[var(--primary)] dark:sheet-input-dark"
            value={text}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)}
            placeholder="Habilidades especiais, poderes, modificadores ou efeitos das suas armas..."
          />
        </div>
      </details>
    </section>
  );
}

