"use client";
import { ChangeEvent } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { metersToFeet } from "../utils/calculations";

interface FieldProps {
  label: string;
  value: string | number;
  onChange: (value: string | number) => void;
  type?: "text" | "number";
}

function Field({ label, value, onChange, type = "text" }: FieldProps) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm opacity-80">{label}</span>
      <input
        className="sheet-input rounded-md px-3 py-2 outline-none ring-0 focus:border-[var(--primary)] focus:outline-none dark:sheet-input-dark"
        value={value}
        type={type}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
      />
    </label>
  );
}

export default function OtherFieldsSection() {
  const [xp, setXp] = useLocalStorage<number>("xp", 0);
  const [size, setSize] = useLocalStorage<string>("size", "Médio");
  const [speed, setSpeed] = useLocalStorage<number>("speed", 9);

  return (
    <section className="parchment rounded-lg p-4">
      <div className="ribbon section-title mb-4 inline-block text-sm uppercase tracking-wide">Outros</div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Field label="Pontos de Experiência" type="number" value={xp} onChange={(v)=> setXp(Number(v)||0)} />
        <Field label="Tamanho" value={size} onChange={setSize} />
        <label className="flex flex-col gap-1">
          <span className="text-sm opacity-80">Deslocamento</span>
          <div className="flex items-center gap-2">
            <input
              type="number"
              className="sheet-input w-24 rounded-md px-2 py-1 outline-none focus:border-[var(--primary)] dark:sheet-input-dark"
              value={speed}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSpeed(Number(e.target.value||0))}
            />
            <span className="opacity-80">m ({metersToFeet(speed)} ft)</span>
          </div>
        </label>
      </div>
    </section>
  );
}

