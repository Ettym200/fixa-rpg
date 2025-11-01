"use client";
import { ChangeEvent } from "react";
import { useSheet } from "../state/SheetContext";
import useLocalStorage from "../hooks/useLocalStorage";

interface RibbonFieldProps {
  label: string;
  value: string | number;
  onChange: (value: string | number) => void;
  type?: "text" | "number";
}

function RibbonField({ label, value, onChange, type = "text" }: RibbonFieldProps) {
  return (
    <label className="flex flex-col gap-1">
      <span className="ribbon section-title text-xs">{label}</span>
      <input
        className="sheet-input rounded-md px-3 py-2 outline-none ring-0 focus:border-[var(--primary)] focus:outline-none dark:sheet-input-dark"
        value={value}
        type={type}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

export default function HeaderSection() {
  const { name, setName, player, setPlayer, race, setRace, classes, setClasses, level, setLevel } = useSheet();
  const [profileImage, setProfileImage] = useLocalStorage<string>("profileImage", "");
  const [concept, setConcept] = useLocalStorage<string>("concept", "");

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>, setter: (value: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <section className="parchment rounded-lg p-4">
      <div className="ribbon section-title mb-4 inline-block text-sm uppercase tracking-wide">Cabeçalho</div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
        <div className="md:col-span-1 flex flex-col">
          <label className="flex flex-col gap-2">
            <span className="ribbon section-title text-xs">Perfil</span>
            <div className="relative w-full aspect-square">
              {profileImage ? (
                <div className="relative w-full h-full">
                  <img src={profileImage} alt="Perfil" className="w-full h-full object-cover rounded-md border-2 border-white/20" />
                  <button
                    type="button"
                    onClick={() => setProfileImage("")}
                    className="absolute top-1 right-1 bg-red-600 text-white text-xs w-6 h-6 flex items-center justify-center rounded hover:bg-red-700"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-white/20 rounded-md cursor-pointer hover:border-white/40 transition-colors">
                  <span className="text-xs opacity-60 mb-1">Clique para adicionar</span>
                  <span className="text-2xl opacity-40">📷</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, setProfileImage)}
                  />
                </label>
              )}
            </div>
          </label>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:col-span-4">
          <RibbonField label="Personagem" value={name} onChange={setName} />
          <RibbonField label="Jogador(a)" value={player} onChange={setPlayer} />
          <RibbonField label="Raça" value={race} onChange={setRace} />
          <RibbonField label="Classe(s)" value={classes} onChange={setClasses} />
          <RibbonField label="Conceito" value={concept} onChange={setConcept} />
          <RibbonField label="Nível" type="number" value={level} onChange={(v)=>setLevel(Number(v)||0)} />
        </div>
      </div>
    </section>
  );
}

