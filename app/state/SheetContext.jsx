"use client";
import { createContext, useContext, useMemo, useState, useEffect } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { calcModifier } from "../utils/calculations";

const SheetContext = createContext(null);

export function SheetProvider({ children }) {
  const [name, setName] = useLocalStorage("name", "");
  const [player, setPlayer] = useLocalStorage("player", "");
  const [race, setRace] = useLocalStorage("race", "");
  const [origin, setOrigin] = useLocalStorage("origin", "");
  const [classes, setClasses] = useLocalStorage("classes", "");
  const [level, setLevel] = useLocalStorage("level", 1);
  const [deity, setDeity] = useLocalStorage("deity", "");

  const [attrs, setAttrs] = useLocalStorage("attrs", {
    FOR: 10,
    DES: 10,
    CON: 10,
    INT: 10,
    SAB: 10,
    CAR: 10,
  });

  const mods = useMemo(() => ({
    FOR: calcModifier(Number(attrs.FOR || 0)),
    DES: calcModifier(Number(attrs.DES || 0)),
    CON: calcModifier(Number(attrs.CON || 0)),
    INT: calcModifier(Number(attrs.INT || 0)),
    SAB: calcModifier(Number(attrs.SAB || 0)),
    CAR: calcModifier(Number(attrs.CAR || 0)),
  }), [attrs]);

  const value = {
    name, setName,
    player, setPlayer,
    race, setRace,
    origin, setOrigin,
    classes, setClasses,
    level, setLevel,
    deity, setDeity,
    attrs, setAttrs,
    mods,
  };

  return <SheetContext.Provider value={value}>{children}</SheetContext.Provider>;
}

export function useSheet() {
  const ctx = useContext(SheetContext);
  if (!ctx) throw new Error("useSheet deve ser usado dentro de SheetProvider");
  return ctx;
}


