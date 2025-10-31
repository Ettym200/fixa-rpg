"use client";
import { useSheet } from "../state/SheetContext";

const ATTRS = ["FOR","DES","CON","INT","SAB","CAR"];

export default function AttributesSection() {
  const { attrs, setAttrs, mods } = useSheet();
  return (
    <section className="parchment rounded-lg p-4">
      <div className="ribbon section-title mb-4 inline-block text-sm uppercase tracking-wide">Atributos</div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-6">
        {ATTRS.map((key) => (
          <div key={key} className="text-center">
            <div className="mb-1 text-xs opacity-80">{key}</div>
            <input
              type="number"
              min={0}
              max={30}
              className="w-full octagon px-2 py-3 text-center text-2xl font-bold"
              value={attrs[key]}
              onChange={(e)=>{
                const v = Math.max(0, Math.min(30, Number(e.target.value || 0)));
                setAttrs({ ...attrs, [key]: v });
              }}
            />
            <div className="mt-2 inline-block rounded-full border px-2 py-0.5 text-sm" style={{ borderColor: "var(--primary)", color: "var(--primary)" }}>
              {mods[key] >= 0 ? `+${mods[key]}` : mods[key]}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}


