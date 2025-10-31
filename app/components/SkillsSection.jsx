"use client";
import useLocalStorage from "../hooks/useLocalStorage";
import { useSheet } from "../state/SheetContext";
import { calcSkill } from "../utils/calculations";

const SKILLS = [
  { name: "Acrobacia", attr: "DES" },
  { name: "Adestramento", attr: "CAR" },
  { name: "Atletismo", attr: "FOR" },
  { name: "Atuação", attr: "CAR" },
  { name: "Cavalgar", attr: "DES" },
  { name: "Conhecimento", attr: "INT" },
  { name: "Cura", attr: "SAB" },
  { name: "Diplomacia", attr: "CAR" },
  { name: "Enganação", attr: "CAR" },
  { name: "Fortitude", attr: "CON" },
  { name: "Furtividade", attr: "DES" },
  { name: "Guerra", attr: "INT" },
  { name: "Iniciativa", attr: "DES" },
  { name: "Intimidação", attr: "CAR" },
  { name: "Intuição", attr: "SAB" },
  { name: "Investigação", attr: "INT" },
  { name: "Ladinagem", attr: "DES" },
  { name: "Misticismo", attr: "INT" },
  { name: "Nobreza", attr: "INT" },
  { name: "Ofício", attr: "INT" },
  { name: "Percepção", attr: "SAB" },
  { name: "Pontaria", attr: "DES" },
  { name: "Reflexos", attr: "DES" },
  { name: "Religião", attr: "SAB" },
  { name: "Sobrevivência", attr: "SAB" },
  { name: "Vontade", attr: "SAB" },
];

export default function SkillsSection() {
  const { level, mods } = useSheet();
  const [rows, setRows] = useLocalStorage("skills", SKILLS.map(s => ({ ...s, trained: 0, others: 0 })));

  return (
    <section className="parchment rounded-lg p-4">
      <div className="ribbon section-title mb-4 inline-block text-sm uppercase tracking-wide">Perícias</div>
      <div className="overflow-x-auto">
        <table className="sheet-table w-full text-sm" style={{ tableLayout: "fixed" }}>
          <colgroup>
            <col style={{ width: "30%" }} />
            <col style={{ width: "12%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "18%" }} />
            <col style={{ width: "15%" }} />
            <col style={{ width: "15%" }} />
          </colgroup>
          <thead>
            <tr className="text-left">
              <Th>Nome</Th><Th>Total</Th><Th>½ Nível</Th><Th>Atributo</Th><Th>Treino</Th><Th>Outros</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => {
              const attrMod = mods[r.attr] ?? 0;
              const total = calcSkill(level, attrMod, Number(r.trained||0), Number(r.others||0));
              return (
                <tr key={r.name} className="border-t">
                  <Td>{r.name}</Td>
                  <Td><Badge>{total}</Badge></Td>
                  <Td>{Math.floor(level/2)}</Td>
                  <Td><span className="whitespace-nowrap">{r.attr} ({attrMod >=0?`+${attrMod}`:attrMod})</span></Td>
                  <Td>
                    <NumberInput value={r.trained} onChange={(v)=>update(setRows, rows, idx, { ...r, trained: v })} />
                  </Td>
                  <Td>
                    <NumberInput value={r.others} onChange={(v)=>update(setRows, rows, idx, { ...r, others: v })} />
                  </Td>
                </tr>
              );
            })}
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

function Th({ children }) { return <th className="px-2 py-2 opacity-80">{children}</th>; }
function Td({ children }) { return <td className="px-2 py-2">{children}</td>; }
function Badge({ children }) { return <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border text-[0.9rem]" style={{ borderColor: "var(--primary)", color: "var(--primary)" }}>{children}</span>; }
function NumberInput({ value, onChange }) {
  return (
    <input
      type="number"
      className="sheet-input h-7 w-16 rounded-md px-2 text-center text-black outline-none focus:border-[var(--primary)] dark:sheet-input-dark dark:text-white"
      value={value}
      onChange={(e)=> onChange(Number(e.target.value||0))}
    />
  );
}


