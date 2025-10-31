"use client";
import { useEffect } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

const DEFAULT = [
  { name: "Ataque desarmado", tipo: "Luta", dano: "1d6", critico: "2x", tipoDano: "impacto", alcance: "—" },
];

export default function AttacksSection() {
  const [rows, setRows] = useLocalStorage("attacks", DEFAULT);

  const addRow = () => setRows([...rows, { name: "", tipo: "", dano: "", critico: "", tipoDano: "", alcance: "" }]);

  return (
    <section className="parchment rounded-lg p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="ribbon section-title inline-block text-sm uppercase tracking-wide">Ataques</div>
        <button onClick={addRow} className="rounded-md border px-3 py-1 hover:bg-white/10">+ Adicionar</button>
      </div>
      <div className="overflow-x-auto">
        <table className="sheet-table w-full text-sm">
          <thead>
            <tr className="text-left">
              <Th>Nome</Th><Th>Tipo de Ataque</Th><Th>Dano</Th><Th>Crítico</Th><Th>Tipo</Th><Th>Alcance</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => (
              <tr key={idx} className="border-t">
                <Td><Input value={r.name} onChange={(v)=>update(setRows, rows, idx, { ...r, name: v })} /></Td>
                <Td><Input value={r.tipo} onChange={(v)=>update(setRows, rows, idx, { ...r, tipo: v })} /></Td>
                <Td><Input value={r.dano} onChange={(v)=>update(setRows, rows, idx, { ...r, dano: v })} /></Td>
                <Td><Input value={r.critico} onChange={(v)=>update(setRows, rows, idx, { ...r, critico: v })} /></Td>
                <Td><Input value={r.tipoDano} onChange={(v)=>update(setRows, rows, idx, { ...r, tipoDano: v })} /></Td>
                <Td><Input value={r.alcance} onChange={(v)=>update(setRows, rows, idx, { ...r, alcance: v })} /></Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function update(setter, rows, idx, value) {
  const copy = [...rows];
  copy[idx] = value;
  setter(copy);
}

function Th({ children }) {
  return <th className="px-2 py-2 opacity-80">{children}</th>;
}
function Td({ children }) {
  return <td className="px-2 py-2">{children}</td>;
}
function Input({ value, onChange }) {
  return (
    <input
      className="sheet-input w-full rounded-md px-2 py-1 text-black outline-none focus:border-[var(--primary)] dark:sheet-input-dark dark:text-white"
      value={value}
      onChange={(e)=>onChange(e.target.value)}
    />
  );
}


