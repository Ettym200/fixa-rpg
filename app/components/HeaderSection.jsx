"use client";
import { useSheet } from "../state/SheetContext";

export default function HeaderSection() {
  const { name, setName, player, setPlayer, race, setRace, origin, setOrigin, classes, setClasses, level, setLevel, deity, setDeity } = useSheet();
  return (
    <section className="parchment rounded-lg p-4">
      <div className="ribbon section-title mb-4 inline-block text-sm uppercase tracking-wide">Cabeçalho</div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <RibbonField label="Personagem" value={name} onChange={setName} />
        <RibbonField label="Jogador(a)" value={player} onChange={setPlayer} />
        <RibbonField label="Raça" value={race} onChange={setRace} />
        <RibbonField label="Origem" value={origin} onChange={setOrigin} />
        <RibbonField label="Classe(s)" value={classes} onChange={setClasses} />
        <RibbonField label="Nível" type="number" value={level} onChange={(v)=>setLevel(Number(v)||0)} />
        <RibbonField label="Divindade" value={deity} onChange={setDeity} />
      </div>
    </section>
  );
}

function RibbonField({ label, value, onChange, type = "text" }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="ribbon section-title text-xs">{label}</span>
      <input
        className="sheet-input rounded-md px-3 py-2 text-black outline-none ring-0 focus:border-[var(--primary)] focus:outline-none dark:sheet-input-dark dark:text-white"
        value={value}
        type={type}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}


