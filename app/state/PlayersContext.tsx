"use client";
import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";

// Chave para armazenar todos os jogadores
const PLAYERS_STORAGE_KEY = "t20_players";
const PRESENCE_TIMEOUT = 30000; // 30 segundos sem atividade = offline

export interface PlayerData {
  playerId?: string;
  characterName?: string;
  playerName?: string;
  race?: string;
  classes?: string;
  level?: number;
  attrs?: Record<string, number>;
  pv?: { current: number; max: number };
  pm?: { current: number; max: number };
  damageReduction?: number;
  defense?: {
    armor: number;
    shield: number;
    others: number;
    penalty: number;
  };
  attacks?: any[];
  skills?: any[];
  equipment?: any[];
  xp?: number;
  size?: string;
  speed?: number;
  profileImage?: string;
  weaponImage?: string;
  weaponName?: string;
  weaponAbilities?: string;
  concept?: string;
  lastUpdate?: number;
  lastSeen?: number;
}

interface PlayersContextType {
  players: Record<string, PlayerData>;
  updatePlayer: (playerId: string, playerData: PlayerData) => void;
  updatePresence: (playerId: string) => void;
  getOnlinePlayers: () => PlayerData[];
}

const PlayersContext = createContext<PlayersContextType | null>(null);

export function PlayersProvider({ children }: { children: ReactNode }) {
  const [players, setPlayers] = useState<Record<string, PlayerData>>({});

  // Carrega jogadores do localStorage
  useEffect(() => {
    const loadPlayers = () => {
      try {
        const stored = localStorage.getItem(PLAYERS_STORAGE_KEY);
        if (stored) {
          const parsed: Record<string, PlayerData> = JSON.parse(stored);
          // Remove jogadores offline (sem atividade há mais de 30s)
          const now = Date.now();
          const filtered: Record<string, PlayerData> = {};
          Object.keys(parsed).forEach(playerId => {
            if (parsed[playerId].lastSeen && (now - parsed[playerId].lastSeen!) < PRESENCE_TIMEOUT) {
              filtered[playerId] = parsed[playerId];
            }
          });
          setPlayers(filtered);
        }
      } catch (err) {
        console.error("Erro ao carregar jogadores:", err);
      }
    };
    
    loadPlayers();
    // Atualiza a cada 5 segundos
    const interval = setInterval(loadPlayers, 5000);
    return () => clearInterval(interval);
  }, []);

  // Registra ou atualiza um jogador
  const updatePlayer = useCallback((playerId: string, playerData: PlayerData) => {
    const now = Date.now();
    const updatedData: PlayerData = {
      ...playerData,
      lastSeen: now,
      playerId,
    };

    setPlayers(prev => {
      const updated = { ...prev, [playerId]: updatedData };
      try {
        localStorage.setItem(PLAYERS_STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.error("Erro ao salvar jogador:", err);
      }
      return updated;
    });
  }, []);

  // Atualiza apenas a presença (para manter online)
  const updatePresence = useCallback((playerId: string) => {
    setPlayers(prev => {
      if (!prev[playerId]) return prev;
      const updated = { ...prev };
      updated[playerId] = { ...updated[playerId], lastSeen: Date.now() };
      try {
        localStorage.setItem(PLAYERS_STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.error("Erro ao atualizar presença:", err);
      }
      return updated;
    });
  }, []);

  // Obtém lista de jogadores online
  const getOnlinePlayers = useCallback(() => {
    const now = Date.now();
    return Object.values(players).filter(
      p => p.lastSeen && (now - p.lastSeen) < PRESENCE_TIMEOUT
    );
  }, [players]);

  const value: PlayersContextType = {
    players,
    updatePlayer,
    updatePresence,
    getOnlinePlayers,
  };

  return <PlayersContext.Provider value={value}>{children}</PlayersContext.Provider>;
}

export function usePlayers(): PlayersContextType {
  const ctx = useContext(PlayersContext);
  if (!ctx) throw new Error("usePlayers deve ser usado dentro de PlayersProvider");
  return ctx;
}

