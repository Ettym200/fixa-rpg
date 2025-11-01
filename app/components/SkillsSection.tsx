"use client";
import { useEffect, ChangeEvent, ReactNode } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { useSheet } from "../state/SheetContext";
import { calcSkill } from "../utils/calculations";

interface Skill {
  name: string;
  attr: string;
  linkedTo?: string;
  trained?: number;
  others?: number;
}

const SKILLS: Skill[] = [
  { name: "Atletismo", attr: "FOR" },
  { name: "Prestidigitação", attr: "DES" },
  { name: "Luta/Briga", attr: "FOR" },
  { name: "Pontaria", attr: "DES" },
  { name: "Magia (Cast)", attr: "INT" },
  { name: "Reflexos", attr: "DES" },
  { name: "Mana Sense", attr: "INT" },
  { name: "Fortitude", attr: "CON" },
  { name: "Vontade", attr: "SAB" },
  { name: "Sobrevivência", attr: "SAB" },
  { name: "Persuasão", attr: "CAR" },
  { name: "Diplomacia", attr: "CAR" },
  { name: "História", attr: "INT" },
  { name: "Arcana", attr: "INT" },
  { name: "Intuição", attr: "SAB" },
  { name: "Percepção", attr: "SAB" },
  { name: "Observar", attr: "SAB", linkedTo: "Percepção" },
  { name: "Stealth", attr: "DES" },
  { name: "Loot", attr: "INT" },
  { name: "Medicina", attr: "INT" },
  { name: "Concentração", attr: "SAB" },
];

function Th({ children }: { children: ReactNode }) {
  return <th className="px-2 py-2 opacity-80">{children}</th>;
}

function Td({ children }: { children: ReactNode }) {
  return <td className="px-2 py-2">{children}</td>;
}

function Badge({ children }: { children: ReactNode }) {
  return (
    <span
      className="inline-flex h-7 w-7 items-center justify-center rounded-full border text-[0.9rem]"
      style={{ borderColor: "var(--primary)", color: "var(--primary)" }}
    >
      {children}
    </span>
  );
}

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

function NumberInput({ value, onChange, disabled = false }: NumberInputProps) {
  return (
    <input
      type="number"
      className={`sheet-input h-7 w-16 rounded-md px-2 text-center outline-none focus:border-[var(--primary)] dark:sheet-input-dark ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
      value={value}
      onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(Number(e.target.value || 0))}
      disabled={disabled}
      title={disabled ? "Vinculado a Percepção" : ""}
    />
  );
}

export default function SkillsSection() {
  const { level, mods } = useSheet();
  const [rows, setRows] = useLocalStorage<Skill[]>("skills", SKILLS.map(s => ({ ...s, trained: 0, others: 0 })));
  
  // Garante que apenas as perícias da lista SKILLS sejam exibidas (remove antigas)
  useEffect(() => {
    const skillNames = SKILLS.map(s => s.name);
    const hasOldSkills = rows.some(r => !skillNames.includes(r.name));
    const hasMissingSkills = SKILLS.some(s => !rows.find(r => r.name === s.name));
    
    if (hasOldSkills || hasMissingSkills) {
      // Atualiza para ter apenas as perícias corretas, preservando linkedTo
      const validSkills = SKILLS.map(skill => {
        const found = rows.find(r => r.name === skill.name);
        return found 
          ? { ...skill, trained: found.trained || 0, others: found.others || 0, linkedTo: skill.linkedTo || found.linkedTo }
          : { ...skill, trained: 0, others: 0 };
      });
      setRows(validSkills);
    }
  }, [rows, setRows]);

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
              // Observar usa o mesmo atributo de Percepção
              const linkedSkill = r.linkedTo ? rows.find(s => s.name === r.linkedTo) : null;
              const attrToUse = r.linkedTo ? (linkedSkill?.attr || r.attr) : r.attr;
              const attrMod = mods[attrToUse as keyof typeof mods] ?? 0;
              const trained = Number(r.trained || 0);
              const others = Number(r.others || 0);
              
              // Se é Observar vinculado a Percepção, o total = total de Percepção + treino de Observar + outros de Observar
              let total: number;
              if (r.linkedTo && linkedSkill) {
                const percepTotal = calcSkill(level, attrMod, Number(linkedSkill.trained || 0), Number(linkedSkill.others || 0));
                total = percepTotal + trained + others;
              } else {
                total = calcSkill(level, attrMod, trained, others);
              }
              
              const handleTrainedChange = (v: number) => {
                const numValue = Number(v) || 0;
                const newRows = [...rows];
                newRows[idx] = { ...r, trained: numValue };
                setRows(newRows);
              };
              
              const handleOthersChange = (v: number) => {
                const numValue = Number(v) || 0;
                const newRows = [...rows];
                newRows[idx] = { ...r, others: numValue };
                setRows(newRows);
              };
              
              return (
                <tr key={r.name} className="border-t">
                  <Td>{r.name}</Td>
                  <Td><Badge>{total}</Badge></Td>
                  <Td>{Math.floor(level/2)}</Td>
                  <Td><span className="whitespace-nowrap">{attrToUse} ({attrMod >=0?`+${attrMod}`:attrMod})</span></Td>
                  <Td>
                    <NumberInput value={trained} onChange={handleTrainedChange} disabled={false} />
                  </Td>
                  <Td>
                    <NumberInput value={others} onChange={handleOthersChange} disabled={false} />
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

