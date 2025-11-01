"use client";
import { useState, useEffect } from "react";
import { usePlayers, PlayerData } from "../state/PlayersContext";
import { NotificationManager } from "../components/NotificationPopup";
import Link from "next/link";

export default function AdminPage() {
  const { getOnlinePlayers } = usePlayers();
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerData | null>(null);
  const [players, setPlayers] = useState<PlayerData[]>([]);

  useEffect(() => {
    const updatePlayers = () => {
      const online = getOnlinePlayers();
      setPlayers(online.sort((a, b) => (b.lastSeen || 0) - (a.lastSeen || 0)));
    };

    updatePlayers();
    const interval = setInterval(updatePlayers, 2000); // Atualiza a cada 2 segundos
    return () => clearInterval(interval);
  }, [getOnlinePlayers]);

  const isOnline = (player: PlayerData): boolean => {
    if (!player.lastSeen) return false;
    return (Date.now() - player.lastSeen) < 30000; // 30 segundos
  };

  const formatTime = (timestamp?: number): string => {
    if (!timestamp) return "Nunca";
    const date = new Date(timestamp);
    return date.toLocaleTimeString("pt-BR");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NotificationManager />
      <div className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl" style={{ fontFamily: "var(--font-title)" }}>
              Painel Admin - Tormenta 20
            </h1>
            <p className="mt-2 text-sm opacity-80">
              Jogadores online: <span className="font-bold text-green-400">{players.filter(p => isOnline(p)).length}</span>
            </p>
          </div>
          <Link
            href="/"
            className="rounded-md border border-white/20 px-4 py-2 text-white hover:bg-white/10"
          >
            ← Voltar para Ficha
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Lista de Jogadores */}
          <div className="lg:col-span-1">
            <div className="parchment rounded-lg p-4">
              <h2 className="ribbon section-title mb-4 inline-block text-sm uppercase tracking-wide">
                Jogadores ({players.length})
              </h2>
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {players.length === 0 ? (
                  <p className="text-sm opacity-60 text-center py-4">Nenhum jogador conectado</p>
                ) : (
                  players.map((player) => (
                    <div
                      key={player.playerId}
                      onClick={() => {
                        // Se já está selecionado, desseleciona (fecha a ficha)
                        if (selectedPlayer?.playerId === player.playerId) {
                          setSelectedPlayer(null);
                        } else {
                          // Caso contrário, seleciona o jogador
                          setSelectedPlayer(player);
                        }
                      }}
                      className={`cursor-pointer rounded-md border p-3 transition-colors ${
                        selectedPlayer?.playerId === player.playerId
                          ? "border-[var(--primary)] bg-red-500/10"
                          : "border-white/10 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-semibold">{player.characterName || "Sem nome"}</div>
                          <div className="text-xs opacity-70">{player.playerName || "Sem jogador"}</div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span
                            className={`inline-block h-2 w-2 rounded-full ${
                              isOnline(player) ? "bg-green-400" : "bg-gray-500"
                            }`}
                            title={isOnline(player) ? "Online" : "Offline"}
                          />
                          <span className="text-xs opacity-60">{formatTime(player.lastSeen)}</span>
                        </div>
                      </div>
                      {player.race && (
                        <div className="mt-2 text-xs opacity-60">
                          {player.race} {player.classes ? `· ${player.classes}` : ""} · Nv. {player.level || 1}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Detalhes do Jogador Selecionado */}
          <div className="lg:col-span-2">
            {selectedPlayer ? (
              <div className="space-y-4">
                {/* Cabeçalho do Personagem */}
                <div className="parchment rounded-lg p-4">
                  <h2 className="ribbon section-title mb-4 inline-block text-sm uppercase tracking-wide">
                    Ficha Completa
                  </h2>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {selectedPlayer.profileImage && (
                      <div className="md:col-span-1">
                        <img
                          src={selectedPlayer.profileImage}
                          alt="Perfil"
                          className="w-full h-32 object-cover rounded-md border-2 border-white/20"
                        />
                      </div>
                    )}
                    <div className={selectedPlayer.profileImage ? "md:col-span-2" : "md:col-span-3"}>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <div className="text-xs opacity-80">Personagem</div>
                          <div className="font-semibold">{selectedPlayer.characterName || "—"}</div>
                        </div>
                        <div>
                          <div className="text-xs opacity-80">Jogador</div>
                          <div className="font-semibold">{selectedPlayer.playerName || "—"}</div>
                        </div>
                        <div>
                          <div className="text-xs opacity-80">Raça</div>
                          <div>{selectedPlayer.race || "—"}</div>
                        </div>
                        <div>
                          <div className="text-xs opacity-80">Classe</div>
                          <div>{selectedPlayer.classes || "—"}</div>
                        </div>
                        <div>
                          <div className="text-xs opacity-80">Nível</div>
                          <div className="font-semibold">{selectedPlayer.level || 1}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Atributos */}
                {selectedPlayer.attrs && (
                  <div className="parchment rounded-lg p-4">
                    <h3 className="ribbon section-title mb-3 inline-block text-xs uppercase tracking-wide">
                      Atributos
                    </h3>
                    <div className="grid grid-cols-6 gap-2 text-sm">
                      {Object.entries(selectedPlayer.attrs).map(([key, value]) => (
                        <div key={key} className="text-center">
                          <div className="text-xs opacity-80">{key}</div>
                          <div className="font-bold">{value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* PV/PM */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="parchment rounded-lg p-4">
                    <h3 className="ribbon section-title mb-2 inline-block text-xs uppercase tracking-wide">
                      PV
                    </h3>
                    <div className="text-2xl font-bold">
                      {selectedPlayer.pv?.current || 0} / {selectedPlayer.pv?.max || 0}
                    </div>
                  </div>
                  <div className="parchment rounded-lg p-4">
                    <h3 className="ribbon section-title mb-2 inline-block text-xs uppercase tracking-wide">
                      PM
                    </h3>
                    <div className="text-2xl font-bold">
                      {selectedPlayer.pm?.current || 0} / {selectedPlayer.pm?.max || 0}
                    </div>
                  </div>
                </div>

                {/* Redução de Dano */}
                {selectedPlayer.damageReduction !== undefined && selectedPlayer.damageReduction > 0 && (
                  <div className="parchment rounded-lg p-4">
                    <h3 className="ribbon section-title mb-2 inline-block text-xs uppercase tracking-wide">
                      Redução de Dano
                    </h3>
                    <div className="text-2xl font-bold" style={{ color: "#f59e0b" }}>
                      {selectedPlayer.damageReduction}
                    </div>
                  </div>
                )}

                {/* Defesa */}
                {selectedPlayer.defense && (
                  <div className="parchment rounded-lg p-4">
                    <h3 className="ribbon section-title mb-2 inline-block text-xs uppercase tracking-wide">
                      Defesa
                    </h3>
                    <div className="grid grid-cols-4 gap-2 text-sm">
                      <div>
                        <div className="text-xs opacity-80">Armadura</div>
                        <div>{selectedPlayer.defense.armor || 0}</div>
                      </div>
                      <div>
                        <div className="text-xs opacity-80">Escudo</div>
                        <div>{selectedPlayer.defense.shield || 0}</div>
                      </div>
                      <div>
                        <div className="text-xs opacity-80">Outros</div>
                        <div>{selectedPlayer.defense.others || 0}</div>
                      </div>
                      <div>
                        <div className="text-xs opacity-80">Penalidades</div>
                        <div>{selectedPlayer.defense.penalty || 0}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Perícias (resumo) */}
                {selectedPlayer.skills && selectedPlayer.skills.length > 0 && (
                  <div className="parchment rounded-lg p-4">
                    <h3 className="ribbon section-title mb-3 inline-block text-xs uppercase tracking-wide">
                      Perícias (Top 5)
                    </h3>
                    <div className="space-y-1 text-sm">
                      {selectedPlayer.skills
                        .sort((a, b) => {
                          // Ordena por total calculado (aproximado)
                          const totalA = (Math.floor((selectedPlayer.level || 1) / 2) || 0) + 
                                        ((selectedPlayer.attrs?.[a.attr as string] as number) || 0) + 
                                        (Number(a.trained) || 0) + 
                                        (Number(a.others) || 0);
                          const totalB = (Math.floor((selectedPlayer.level || 1) / 2) || 0) + 
                                        ((selectedPlayer.attrs?.[b.attr as string] as number) || 0) + 
                                        (Number(b.trained) || 0) + 
                                        (Number(b.others) || 0);
                          return totalB - totalA;
                        })
                        .slice(0, 5)
                        .map((skill, idx) => {
                          const total = (Math.floor((selectedPlayer.level || 1) / 2) || 0) + 
                                       ((selectedPlayer.attrs?.[skill.attr as string] as number) || 0) + 
                                       (Number(skill.trained) || 0) + 
                                       (Number(skill.others) || 0);
                          return (
                            <div key={idx} className="flex justify-between border-t border-white/10 pt-1">
                              <span>{(skill as any).name}</span>
                              <span className="font-semibold">{total}</span>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}

                {/* Conceito */}
                {selectedPlayer.concept && (
                  <div className="parchment rounded-lg p-4">
                    <h3 className="ribbon section-title mb-3 inline-block text-xs uppercase tracking-wide">
                      Conceito do Personagem
                    </h3>
                    <div className="whitespace-pre-wrap text-sm rounded-md border border-white/10 bg-black/20 p-3">
                      {selectedPlayer.concept || "—"}
                    </div>
                  </div>
                )}

                {/* Habilidades de Armas */}
                {selectedPlayer.weaponAbilities && (
                  <div className="parchment rounded-lg p-4">
                    <h3 className="ribbon section-title mb-3 inline-block text-xs uppercase tracking-wide">
                      Habilidades de Armas
                    </h3>
                    <div className="whitespace-pre-wrap text-sm rounded-md border border-white/10 bg-black/20 p-3">
                      {selectedPlayer.weaponAbilities || "—"}
                    </div>
                  </div>
                )}

                {/* Equipamentos / Mochila */}
                {selectedPlayer.equipment && selectedPlayer.equipment.length > 0 && (
                  <div className="parchment rounded-lg p-4">
                    <h3 className="ribbon section-title mb-3 inline-block text-xs uppercase tracking-wide">
                      Mochila / Equipamentos
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left border-b border-white/10">
                            <th className="px-2 py-2 text-xs opacity-80">Item</th>
                            <th className="px-2 py-2 text-xs opacity-80 text-center">QTD</th>
                            <th className="px-2 py-2 text-xs opacity-80 text-center">Peso</th>
                            <th className="px-2 py-2 text-xs opacity-80 text-center">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedPlayer.equipment.map((eq: any, idx: number) => {
                            const totalWeight = (Number(eq.weight) || 0) * (Number(eq.qty) || 0);
                            return (
                              <tr key={idx} className="border-b border-white/5">
                                <td className="px-2 py-2">{eq.item || "—"}</td>
                                <td className="px-2 py-2 text-center">{eq.qty || 0}</td>
                                <td className="px-2 py-2 text-center">{eq.weight || 0}</td>
                                <td className="px-2 py-2 text-center font-semibold">{totalWeight}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    {selectedPlayer.attrs && (
                      <div className="mt-3 space-y-1 text-xs">
                        {(() => {
                          const totalWeight = selectedPlayer.equipment.reduce(
                            (sum: number, eq: any) => sum + ((Number(eq.weight) || 0) * (Number(eq.qty) || 0)),
                            0
                          );
                          const limit = 10 + 2 * ((selectedPlayer.attrs?.FOR as number) || 0);
                          const pct = Math.min(100, Math.round((totalWeight / limit) * 100));
                          return (
                            <>
                              <div className="flex justify-between opacity-80">
                                <span>Carga Total:</span>
                                <span className="font-semibold">{totalWeight} / {limit}</span>
                              </div>
                              <div className="h-2 w-full overflow-hidden rounded-full border border-white/15">
                                <div
                                  className="h-full transition-all"
                                  style={{
                                    width: `${pct}%`,
                                    backgroundColor: pct > 90 ? "#ef4444" : pct > 70 ? "#f59e0b" : "var(--primary)",
                                  }}
                                />
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                )}

                {/* Última atualização */}
                <div className="text-xs opacity-60 text-center">
                  Última atualização: {formatTime(selectedPlayer.lastUpdate)}
                </div>
              </div>
            ) : (
              <div className="parchment rounded-lg p-8 text-center">
                <p className="opacity-60">Selecione um jogador para ver os detalhes da ficha</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

