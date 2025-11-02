"use client";
import { ChangeEvent, ReactNode } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

interface Attack {
  name: string;
  tipo: string;
  dano: string;
  critico: string;
  tipoDano: string;
  alcance: string;
}

const DEFAULT: Attack[] = [
  { name: "Ataque desarmado", tipo: "Luta", dano: "1d6", critico: "2x", tipoDano: "impacto", alcance: "—" },
];

function Th({ children }: { children: ReactNode }) {
  return <th className="px-2 py-2 opacity-80">{children}</th>;
}

function Td({ children }: { children: ReactNode }) {
  return <td className="px-2 py-2">{children}</td>;
}

interface InputProps {
  value: string;
  onChange: (value: string) => void;
}

function Input({ value, onChange }: InputProps) {
  return (
    <input
      type="text"
      className="sheet-input w-full rounded-md px-2 py-1 outline-none focus:border-[var(--primary)] dark:sheet-input-dark"
      value={value}
      onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
    />
  );
}

function update<T>(setter: (rows: T[]) => void, rows: T[], idx: number, value: T) {
  const copy = [...rows];
  copy[idx] = value;
  setter(copy);
}

export default function AttacksSection() {
  const [rows, setRows] = useLocalStorage<Attack[]>("attacks", DEFAULT);
  const [weaponName, setWeaponName] = useLocalStorage<string>("weaponName", "");
  const [conceptAbility, setConceptAbility] = useLocalStorage<string>("conceptAbility", "");
  const [generalAbilities, setGeneralAbilities] = useLocalStorage<string>("generalAbilities", "");

  const addRow = () => setRows([...rows, { name: "", tipo: "", dano: "", critico: "", tipoDano: "", alcance: "" }]);

  return (
    <section className="parchment rounded-lg p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="ribbon section-title inline-block text-sm uppercase tracking-wide">Ataques</div>
        <button onClick={addRow} className="rounded-md border px-3 py-1 hover:bg-white/10">+ Adicionar</button>
      </div>
      
      {/* Campo Nome da Arma */}
      <div className="mb-4">
        <label className="flex flex-col gap-1">
          <span className="ribbon section-title text-xs">Nome da Arma</span>
          <input
            type="text"
            className="sheet-input rounded-md px-3 py-2 outline-none ring-0 focus:border-[var(--primary)] focus:outline-none dark:sheet-input-dark"
            value={weaponName}
            onChange={(e) => setWeaponName(e.target.value)}
            placeholder="Ex: Espada Longa, Arco Curto..."
          />
        </label>
      </div>

      <div className="overflow-x-auto mb-4">
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

      {/* Campos de Habilidades */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="flex flex-col gap-1">
            <span className="ribbon section-title text-xs">Habilidade de Conceito</span>
            <textarea
              rows={4}
              className="sheet-input w-full rounded-md px-3 py-2 outline-none ring-0 focus:border-[var(--primary)] focus:outline-none dark:sheet-input-dark"
              value={conceptAbility}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setConceptAbility(e.target.value)}
              placeholder="Digite as habilidades de conceito do personagem..."
            />
          </label>
        </div>
        <div>
          <label className="flex flex-col gap-1">
            <span className="ribbon section-title text-xs">Habilidades Gerais</span>
            <textarea
              rows={4}
              className="sheet-input w-full rounded-md px-3 py-2 outline-none ring-0 focus:border-[var(--primary)] focus:outline-none dark:sheet-input-dark"
              value={generalAbilities}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setGeneralAbilities(e.target.value)}
              placeholder="Digite as habilidades gerais do personagem..."
            />
          </label>
        </div>
      </div>
    </section>
  );
}

