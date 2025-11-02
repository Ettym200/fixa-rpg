"use client";
import { useSheet } from "../state/SheetContext";

const ATTRS = ["FOR","DES","CON","INT","SAB","CAR"] as const;
type AttrKey = typeof ATTRS[number];

interface AttributeCircleProps {
  label: string;
  value: number;
  modifier: number;
  onChange: (value: number) => void;
}

function AttributeCircle({ label, value, modifier, onChange }: AttributeCircleProps) {
  return (
    <div className="relative flex flex-col items-center">
      {/* Imagem de fundo do círculo */}
      <div className="relative w-32 h-32 md:w-40 md:h-40">
        {/* Imagem girando */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `url('/CIRCULO1.png')`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            animation: 'spin-slow 20s linear infinite',
          }}
        />
        {/* Conteúdo dentro do círculo (não gira) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10" style={{ paddingTop: '8%', paddingBottom: '12%' }}>
          {/* Input do número (no topo) */}
          <input
            type="number"
            min={0}
            max={30}
            className="text-center text-2xl md:text-3xl font-bold bg-transparent border-none outline-none cursor-pointer"
            style={{ 
              color: "#000000",
              WebkitAppearance: 'none',
              MozAppearance: 'textfield',
              pointerEvents: 'auto',
              textAlign: 'center',
              lineHeight: '1',
              padding: '0',
              margin: '0',
              marginBottom: '6px',
              width: '100%'
            }}
            value={value}
            onChange={(e) => {
              const v = Math.max(0, Math.min(30, Number(e.target.value || 0)));
              onChange(v);
            }}
          />
          {/* Label dentro do círculo (abaixo do número) */}
          <div className="text-xs md:text-sm font-bold uppercase tracking-wider leading-tight" style={{ color: "#FFD700" }}>
            {label}
          </div>
        </div>
      </div>
      
    </div>
  );
}

export default function AttributesSection() {
  const { attrs, setAttrs, mods } = useSheet();

  const updateAttribute = (key: AttrKey, value: number) => {
    setAttrs({ ...attrs, [key]: value });
  };

  // Posições dos atributos em hexágono (6 atributos)
  // Ordem: INT (topo), SAB (top-right), CAR (bottom-right), DES (bottom), CON (bottom-left), FOR (top-left)
  const attributePositions: Array<{ key: AttrKey; label: string }> = [
    { key: "INT", label: "INT" },
    { key: "SAB", label: "SAB" },
    { key: "CAR", label: "CAR" },
    { key: "DES", label: "DES" },
    { key: "CON", label: "CON" },
    { key: "FOR", label: "FOR" },
  ];

  return (
    <section className="parchment rounded-lg p-4 md:p-8">
      <div className="relative mx-auto" style={{ width: "100%", maxWidth: "600px", height: "600px", maxHeight: "90vw", minHeight: "400px" }}>
        {/* Círculo Central com "ATRIBUTOS" */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div 
            className="relative w-48 h-48 md:w-56 md:h-56 flex items-center justify-center"
            style={{
              backgroundImage: `url('/CIRCULO%20ATRIBUTOS.png')`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
            }}
          >
            <div className="text-center">
              <h3 className="text-xl md:text-2xl font-bold uppercase tracking-wider" style={{ color: "#000000" }}>
                ATRIBUTOS
              </h3>
            </div>
          </div>
        </div>

        {/* Círculos dos atributos posicionados ao redor do centro */}
        {attributePositions.map((pos, index) => {
          const angle = (index * 60) - 90; // 60 graus de diferença
          const radian = (angle * Math.PI) / 180;
          const centerX = 50;
          const centerY = 50;
          const radius = 30; // porcentagem do centro para posicionar os círculos (mais próximo)
          const x = centerX + radius * Math.cos(radian);
          const y = centerY + radius * Math.sin(radian);

          return (
            <div
              key={pos.key}
              className="absolute z-20"
              style={{
                top: `${y}%`,
                left: `${x}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <AttributeCircle
                label={pos.label}
                value={attrs[pos.key]}
                modifier={mods[pos.key]}
                onChange={(newValue) => updateAttribute(pos.key, newValue)}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}

