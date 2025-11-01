"use client";
import { ReactNode } from "react";
import { PlayersProvider } from "../state/PlayersContext";

export function Providers({ children }: { children: ReactNode }) {
  return <PlayersProvider>{children}</PlayersProvider>;
}

