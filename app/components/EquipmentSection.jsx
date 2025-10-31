"use client";
import useLocalStorage from "../hooks/useLocalStorage";
import { useSheet } from "../state/SheetContext";
import { calcLoadLimit } from "../utils/calculations";

export default function EquipmentSection() {
  const { attrs } = useSheet();
  const [rows, setRows] = useLocalStorage("equipment", [{ item: "Mochila", qty: 1, weight: 1 }] );

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
          <div className="h-full" style={{ width: pct + "%", backgroundColor: "var(--primary)" }} />
        </div>
      </div>
    </section>
  );
}

function update(setter, rows, idx, value) { const copy = [...rows]; copy[idx] = value; setter(copy); }
function Th({ children }) { return <th className="px-2 py-2 opacity-80">{children}</th>; }
function Td({ children }) { return <td className="px-2 py-2">{children}</td>; }
function Input({ value, onChange }) { return <input className="w-full rounded-md border border-black/10 bg-white/80 px-2 py-1 text-black outline-none focus:border-[var(--primary)] dark:border-white/20 dark:bg-black dark:text-white" value={value} onChange={(e)=>onChange(e.target.value)} />; }
function NumberInput({ value, onChange }) { return <input type="number" className="sheet-input w-28 rounded-md px-2 py-1 text-black outline-none focus:border-[var(--primary)] dark:sheet-input-dark dark:text-white" value={value} onChange={(e)=>onChange(Number(e.target.value||0))} />; }


