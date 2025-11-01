"use client";
import { ChangeEvent, ReactNode } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { useSheet } from "../state/SheetContext";
import { calcLoadLimit } from "../utils/calculations";

interface EquipmentItem {
  item: string;
  qty: number;
  weight: number;
}

function update<T>(setter: (rows: T[]) => void, rows: T[], idx: number, value: T) {
  const copy = [...rows];
  copy[idx] = value;
  setter(copy);
}

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

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
}

function NumberInput({ value, onChange }: NumberInputProps) {
  return (
    <input
      type="number"
      className="sheet-input w-28 rounded-md px-2 py-1 outline-none focus:border-[var(--primary)] dark:sheet-input-dark"
      value={value}
      onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(Number(e.target.value || 0))}
    />
  );
}

export default function EquipmentSection() {
  const { attrs } = useSheet();
  const [rows, setRows] = useLocalStorage<EquipmentItem[]>("equipment", [{ item: "Mochila", qty: 1, weight: 1 }]);

  const addRow = () => setRows([...rows, { item: "", qty: 1, weight: 0 }]);
  const totalWeight = rows.reduce((sum, r) => sum + Number(r.weight || 0) * Number(r.qty || 0), 0);
  const limit = calcLoadLimit(attrs.FOR);
  const pct = Math.min(100, Math.round((totalWeight / limit) * 100));

  return (
    <section className="parchment rounded-lg p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="ribbon section-title inline-block text-sm uppercase tracking-wide">Equipamento</div>
        <button onClick={addRow} className="rounded-md border px-3 py-1 hover:bg-white/10">+ Adicionar</button>
      </div>
      <div className="overflow-x-auto">
        <table className="sheet-table w-full text-sm">
          <thead>
            <tr className="text-left">
              <Th>Item</Th><Th>QTD/SLOTS</Th><Th>Peso</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => (
              <tr key={idx} className="border-t">
                <Td><Input value={r.item} onChange={(v)=>update(setRows, rows, idx, { ...r, item: v })} /></Td>
                <Td><NumberInput value={r.qty} onChange={(v)=>update(setRows, rows, idx, { ...r, qty: v })} /></Td>
                <Td><NumberInput value={r.weight} onChange={(v)=>update(setRows, rows, idx, { ...r, weight: v })} /></Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4">
        <div className="mb-1 text-sm opacity-80">Carga: {totalWeight} / {limit}</div>
        <div className="h-3 w-full overflow-hidden rounded-full border border-white/15">
          <div className="h-full" style={{ width: `${pct}%`, backgroundColor: "var(--primary)" }} />
        </div>
      </div>
    </section>
  );
}

