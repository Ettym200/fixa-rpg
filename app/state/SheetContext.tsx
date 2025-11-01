"use client";
import { createContext, useContext, useMemo, ReactNode } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

interface Attributes {
  FOR: number;
  DES: number;
  CON: number;
  INT: number;
  SAB: number;
  CAR: number;
}

interface SheetContextType {
  name: string;
  setName: (value: string) => void;
  player: string;
  setPlayer: (value: string) => void;
  race: string;
  setRace: (value: string) => void;
  classes: string;
  setClasses: (value: string) => void;
  level: number;
  setLevel: (value: number) => void;
  attrs: Attributes;
  setAttrs: (value: Attributes) => void;
  mods: Attributes;
}

const SheetContext = createContext<SheetContextType | null>(null);

export function SheetProvider({ children }: { children: ReactNode }) {
  const [name, setName] = useLocalStorage<string>("name", "");
  const [player, setPlayer] = useLocalStorage<string>("player", "");
  const [race, setRace] = useLocalStorage<string>("race", "");
  const [classes, setClasses] = useLocalStorage<string>("classes", "");
  const [level, setLevel] = useLocalStorage<number>("level", 1);

  const [attrs, setAttrs] = useLocalStorage<Attributes>("attrs", {
    FOR: 10,
    DES: 10,
    CON: 10,
    INT: 10,
    SAB: 10,
    CAR: 10,
  });

  // Modificadores são agora os valores diretos dos atributos (sem cálculo)
  const mods = useMemo(() => ({
    FOR: Number(attrs.FOR || 0),
    DES: Number(attrs.DES || 0),
    CON: Number(attrs.CON || 0),
    INT: Number(attrs.INT || 0),
    SAB: Number(attrs.SAB || 0),
    CAR: Number(attrs.CAR || 0),
  }), [attrs]);

  const value: SheetContextType = {
    name, setName,
    player, setPlayer,
    race, setRace,
    classes, setClasses,
    level, setLevel,
    attrs, setAttrs,
    mods,
  };

  return <SheetContext.Provider value={value}>{children}</SheetContext.Provider>;
}

export function useSheet(): SheetContextType {
  const ctx = useContext(SheetContext);
  if (!ctx) throw new Error("useSheet deve ser usado dentro de SheetProvider");
  return ctx;
}

