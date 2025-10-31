"use client";
import { useRef } from "react";
import { SheetProvider } from "./state/SheetContext";
import HeaderSection from "./components/HeaderSection";
import AttributesSection from "./components/AttributesSection";
import HealthManaSection from "./components/HealthManaSection";
import DefenseSection from "./components/DefenseSection";
import AttacksSection from "./components/AttacksSection";
import SkillsSection from "./components/SkillsSection";
import ProficienciesSection from "./components/ProficienciesSection";
import EquipmentSection from "./components/EquipmentSection";
import { exportToPdf } from "./utils/pdf";
import OtherFieldsSection from "./components/OtherFieldsSection";

export default function Home() {
  const sheetRef = useRef(null);
  return (
    <SheetProvider>
      <div className="min-h-screen bg-background text-foreground">
        <main className="mx-auto max-w-7xl xl:max-w-[2000px] p-4 md:p-6 lg:p-8 xl:p-10">
          <div className="no-print mb-4 flex items-center justify-between">
            <h1 className="font-serif text-3xl md:text-4xl" style={{ fontFamily: "var(--font-title)" }}>
              Tormenta 20 — Ficha do Personagem
            </h1>
            <div className="flex gap-2">
              <button
                className="rounded-md border px-4 py-2 text-white transition-colors"
                style={{ backgroundColor: "var(--primary)" }}
                onClick={() => {
                  if (confirm("Deseja limpar todos os dados da ficha?")) {
                    localStorage.clear();
                    location.reload();
                  }
                }}
              >
                Reset
              </button>
              <button
                className="rounded-md border border-white/20 px-4 py-2 text-white hover:bg-white/10"
                onClick={() => exportToPdf(sheetRef)}
              >
                Exportar PDF
              </button>
            </div>
          </div>
          <div ref={sheetRef} className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              <HeaderSection />
              <AttributesSection />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <HealthManaSection />
                <DefenseSection />
              </div>
              <AttacksSection />
              <ProficienciesSection />
              <EquipmentSection />
              <OtherFieldsSection />
            </div>
            <div className="space-y-4">
              <SkillsSection />
            </div>
          </div>
        </main>
      </div>
    </SheetProvider>
  );
}
