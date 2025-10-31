"use client";
import useLocalStorage from "../hooks/useLocalStorage";

export default function HealthManaSection() {
  const [pvMax, setPvMax] = useLocalStorage("pvMax", 10);
  const [pv, setPv] = useLocalStorage("pv", 10);
  const [pmMax, setPmMax] = useLocalStorage("pmMax", 10);
  const [pm, setPm] = useLocalStorage("pm", 10);

  return (
    <section className="parchment rounded-lg p-4">
      <div className="ribbon section-title mb-4 inline-block text-sm uppercase tracking-wide">Pontos de Vida & Mana</div>
      <div className="grid grid-cols-2 gap-3">
        <StatBlock label="PV Máx" value={pvMax} onChange={setPvMax} color="#b71c1c" />
        <StatBlock label="PV Atuais" value={pv} onChange={setPv} color="#b71c1c" />
        <StatBlock label="PM Máx" value={pmMax} onChange={setPmMax} color="#1e88e5" />
        <StatBlock label="PM Atuais" value={pm} onChange={setPm} color="#1e88e5" />
      </div>
    </section>
  );
}

function StatBlock({ label, value, onChange, color }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm opacity-80">{label}</span>
      <input
        type="number"
        className="sheet-input rounded-md px-3 py-2 text-black outline-none focus:outline-none dark:sheet-input-dark dark:text-white"
        value={value}
        onChange={(e)=> onChange(Number(e.target.value||0))}
        style={{ boxShadow: `inset 0 0 0 1px ${color}` }}
      />
    </label>
  );
}


