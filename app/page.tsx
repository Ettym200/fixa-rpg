"use client";
import { useRef } from "react";
import { SheetProvider } from "./state/SheetContext";
import { usePlayerSync } from "./hooks/usePlayerSync";
import HeaderSection from "./components/HeaderSection";
import AttributesSection from "./components/AttributesSection";
import HealthManaSection from "./components/HealthManaSection";
import DefenseSection from "./components/DefenseSection";
import AttacksSection from "./components/AttacksSection";
import WeaponAbilitiesSection from "./components/WeaponAbilitiesSection";
import SkillsSection from "./components/SkillsSection";
import ProficienciesSection from "./components/ProficienciesSection";
import EquipmentSection from "./components/EquipmentSection";
import { exportToPdf } from "./utils/pdf";
import { downloadJSON, importSheetFromJSON } from "./utils/jsonExport";
import OtherFieldsSection from "./components/OtherFieldsSection";
import Link from "next/link";

function SheetContent() {
  const sheetRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  usePlayerSync(); // Sincroniza dados com sistema de players
  // Sincroniza dados com sistema de players
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      try {
        const jsonData = reader.result as string;
        const success = importSheetFromJSON(jsonData);
        if (success) {
          alert("Ficha importada com sucesso!");
          window.location.reload();
        } else {
          alert("Erro ao importar ficha. Verifique se o arquivo JSON é válido.");
        }
      } catch (error) {
        alert("Erro ao ler arquivo. Verifique se é um JSON válido.");
      }
    };
    reader.readAsText(file);
    // Sincroniza dados com sistema de players
    // Limpa o input para permitir importar o mesmo arquivo novamente
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  return (
      <div className="min-h-screen bg-background text-foreground">
        <main className="mx-auto max-w-7xl xl:max-w-[2000px] p-4 md:p-6 lg:p-8 xl:p-10">
          <div className="no-print mb-4 flex items-center justify-between">
            <h1 className="font-serif text-3xl md:text-4xl" style={{ fontFamily: "var(--font-title)" }}>
              Tormenta 20 — Ficha do Personagem
            </h1>
            <div className="flex gap-2 flex-wrap">
              <Link
                href="/admin"
                className="rounded-md border border-white/20 px-4 py-2 text-white hover:bg-white/10"
              >
                Admin
              </Link>
              <button
                className="rounded-md border border-white/20 px-4 py-2 text-white hover:bg-white/10"
                onClick={() => {
                  fileInputRef.current?.click();
                }}
              >
                Importar JSON
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleImportJSON}
              />
              <button
                className="rounded-md border border-white/20 px-4 py-2 text-white hover:bg-white/10"
                onClick={downloadJSON}
              >
                Exportar JSON
              </button>
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
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <HealthManaSection />
                <DefenseSection />
              </div>
              <AttacksSection />
              <WeaponAbilitiesSection />
              <ProficienciesSection />
              <EquipmentSection />
              <OtherFieldsSection />
            </div>
            <div className="space-y-4">
              <AttributesSection />
              <SkillsSection />
            </div>
          </div>
        </main>
      </div>
  );
}

export default function Home() {
  return (
    <SheetProvider>
      <SheetContent />
    </SheetProvider>
  );
}

