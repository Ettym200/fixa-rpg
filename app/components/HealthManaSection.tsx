"use client";
import { ChangeEvent } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

interface StatBlockProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  color: string;
}

function StatBlock({ label, value, onChange, color }: StatBlockProps) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm opacity-80">{label}</span>
      <input
        type="number"
        className="sheet-input rounded-md px-3 py-2 outline-none focus:outline-none dark:sheet-input-dark"
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(Number(e.target.value||0))}
        style={{ boxShadow: `inset 0 0 0 1px ${color}` }}
      />
    </label>
  );
}

export default function HealthManaSection() {
  const [pvMax, setPvMax] = useLocalStorage<number>("pvMax", 10);
  const [pv, setPv] = useLocalStorage<number>("pv", 10);
  const [pmMax, setPmMax] = useLocalStorage<number>("pmMax", 10);
  const [pm, setPm] = useLocalStorage<number>("pm", 10);
  const [damageReduction, setDamageReduction] = useLocalStorage<number>("damageReduction", 0);

  return (
    <section className="parchment rounded-lg p-4">
      <div className="ribbon section-title mb-4 inline-block text-sm uppercase tracking-wide">Pontos de Vida & Mana</div>
      <div className="grid grid-cols-2 gap-3">
        <StatBlock label="PV Máx" value={pvMax} onChange={setPvMax} color="#b71c1c" />
        <StatBlock label="PV Atuais" value={pv} onChange={setPv} color="#b71c1c" />
        <StatBlock label="PM Máx" value={pmMax} onChange={setPmMax} color="#1e88e5" />
        <StatBlock label="PM Atuais" value={pm} onChange={setPm} color="#1e88e5" />
      </div>
      <div className="mt-4">
        <label className="flex flex-col gap-1">
          <span className="text-sm opacity-80">Redução de Dano</span>
          <input
            type="number"
            className="sheet-input rounded-md px-3 py-2 outline-none focus:outline-none dark:sheet-input-dark text-center font-semibold"
            value={damageReduction}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setDamageReduction(Number(e.target.value || 0))}
            style={{ boxShadow: "inset 0 0 0 1px #f59e0b", color: "#f59e0b" }}
          />
        </label>
      </div>
    </section>
  );
}

