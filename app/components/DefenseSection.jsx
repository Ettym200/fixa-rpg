"use client";
import { useSheet } from "../state/SheetContext";
import useLocalStorage from "../hooks/useLocalStorage";
import { calcDefense } from "../utils/calculations";

export default function DefenseSection() {
  const { mods } = useSheet();
  const [armor, setArmor] = useLocalStorage("def_armor", 0);
  const [shield, setShield] = useLocalStorage("def_shield", 0);
  const [others, setOthers] = useLocalStorage("def_others", 0);
  const [penalty, setPenalty] = useLocalStorage("def_penalty", 0);

  const total = calcDefense(mods.DES, Number(armor), Number(shield), Number(others)) - Number(penalty || 0);

  return (
    <section className="parchment rounded-lg p-4">
      <div className="ribbon section-title mb-4 inline-block text-sm uppercase tracking-wide">Defesa</div>
      <div className="mb-3 rounded-md border border-white/15 bg-black/60 p-4 text-center text-white">
        <div className="text-sm opacity-80">Defesa</div>
        <div className="text-3xl font-bold">{total}</div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Armadura" value={armor} onChange={setArmor} />
        <Field label="Escudo" value={shield} onChange={setShield} />
        <Field label="Outros" value={others} onChange={setOthers} />
        <Field label="Penalidades" value={penalty} onChange={setPenalty} />
      </div>
    </section>
  );
}

function Field({ label, value, onChange }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm opacity-80">{label}</span>
      <input
        type="number"
        className="sheet-input rounded-md px-3 py-2 text-black outline-none focus:outline-none dark:sheet-input-dark dark:text-white"
        value={value}
        onChange={(e)=> onChange(Number(e.target.value||0))}
      />
    </label>
  );
}


