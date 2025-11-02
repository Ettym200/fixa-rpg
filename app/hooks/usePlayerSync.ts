"use client";
import { useEffect, useRef, useCallback } from "react";
import { usePlayers } from "../state/PlayersContext";
import { useSocket } from "./useSocket";
import { saveNotification, detectChanges, detectArrayChanges, type Change } from "../utils/changeDetection";

// Hook para sincronizar ficha do jogador com o sistema de players
export function usePlayerSync(): string | null {
  const { updatePlayer, updatePresence } = usePlayers();
  const { socket, isConnected } = useSocket();
  const playerIdRef = useRef<string | null>(null);
  const previousDataRef = useRef<Record<string, any> | null>(null);

  // Gera ou recupera ID do jogador
  useEffect(() => {
    let id = localStorage.getItem("player_id");
    if (!id) {
      id = `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("player_id", id);
    }
    playerIdRef.current = id;
  }, []);

  // Função auxiliar para detectar e notificar mudanças
  const detectAndNotifyChanges = (sheetData: Record<string, any>) => {
    if (!playerIdRef.current || !previousDataRef.current) return;

    const allChanges: Change[] = [];
    
    // Cabeçalho
    const headerChanges = detectChanges(
      {
        name: previousDataRef.current.name || "",
        player: previousDataRef.current.player || "",
        race: previousDataRef.current.race || "",
        classes: previousDataRef.current.classes || "",
        level: previousDataRef.current.level || 1,
      },
      {
        name: sheetData.name || "",
        player: sheetData.player || "",
        race: sheetData.race || "",
        classes: sheetData.classes || "",
        level: sheetData.level || 1,
      },
      "Cabeçalho",
      {
        name: "Nome do Personagem",
        player: "Nome do Jogador",
        race: "Raça",
        classes: "Classe(s)",
        level: "Nível",
      }
    );
    allChanges.push(...headerChanges);
    
    // Atributos
    const attrChanges = detectChanges(
      previousDataRef.current.attrs || {},
      sheetData.attrs || {},
      "Atributos"
    );
    allChanges.push(...attrChanges);
    
    // PV/PM
    const hpChanges = detectChanges(
      {
        pv: previousDataRef.current.pv || 10,
        pvMax: previousDataRef.current.pvMax || 10,
        pm: previousDataRef.current.pm || 10,
        pmMax: previousDataRef.current.pmMax || 10,
        damageReduction: previousDataRef.current.damageReduction || 0,
      },
      {
        pv: sheetData.pv || 10,
        pvMax: sheetData.pvMax || 10,
        pm: sheetData.pm || 10,
        pmMax: sheetData.pmMax || 10,
        damageReduction: sheetData.damageReduction || 0,
      },
      "PV/PM",
      {
        pv: "PV Atuais",
        pvMax: "PV Máximo",
        pm: "PM Atuais",
        pmMax: "PM Máximo",
        damageReduction: "Redução de Dano",
      }
    );
    allChanges.push(...hpChanges);
    
    // Defesa
    const defenseChanges = detectChanges(
      previousDataRef.current.defense || {},
      sheetData.defense || {},
      "Defesa"
    );
    allChanges.push(...defenseChanges);
    
    // Ataques
    const attackChanges = detectArrayChanges(
      previousDataRef.current.attacks || [],
      sheetData.attacks || [],
      "Ataques",
      "name"
    );
    allChanges.push(...attackChanges);
    
    // Perícias
    const skillChanges = detectArrayChanges(
      previousDataRef.current.skills || [],
      sheetData.skills || [],
      "Perícias",
      "name"
    );
    allChanges.push(...skillChanges);
    
    // Equipamentos
    const equipmentChanges = detectArrayChanges(
      previousDataRef.current.equipment || [],
      sheetData.equipment || [],
      "Equipamentos",
      "item"
    );
    allChanges.push(...equipmentChanges);
    
    // Outros campos
    const otherChanges = detectChanges(
      {
        xp: previousDataRef.current.xp || 0,
        size: previousDataRef.current.size || "Médio",
        speed: previousDataRef.current.speed || 9,
      },
      {
        xp: sheetData.xp || 0,
        size: sheetData.size || "Médio",
        speed: sheetData.speed || 9,
      },
      "Outros",
      {
        xp: "Pontos de Experiência",
        size: "Tamanho",
        speed: "Deslocamento",
      }
    );
    allChanges.push(...otherChanges);
    
      // Imagens e Nome da Arma
      const imageChanges = detectChanges(
        {
          profileImage: previousDataRef.current.profileImage || "",
          weaponName: previousDataRef.current.weaponName || "",
        },
        {
          profileImage: sheetData.profileImage || "",
          weaponName: sheetData.weaponName || "",
        },
        "Imagens",
        {
          profileImage: "Imagem de Perfil",
          weaponName: "Nome da Arma",
        }
      );
      allChanges.push(...imageChanges);
      
      // Habilidades de Armas
      const weaponAbilitiesChanges = detectChanges(
        {
          weaponAbilities: previousDataRef.current.weaponAbilities || "",
        },
        {
          weaponAbilities: sheetData.weaponAbilities || "",
        },
        "Habilidades de Armas",
        {
          weaponAbilities: "Habilidades de Armas",
        }
      );
      allChanges.push(...weaponAbilitiesChanges);
      
      // Habilidades Adicionais
      const abilitiesChanges = detectChanges(
        {
          conceptAbility: previousDataRef.current.conceptAbility || "",
          generalAbilities: previousDataRef.current.generalAbilities || "",
        },
        {
          conceptAbility: sheetData.conceptAbility || "",
          generalAbilities: sheetData.generalAbilities || "",
        },
        "Habilidades",
        {
          conceptAbility: "Habilidade de Conceito",
          generalAbilities: "Habilidades Gerais",
        }
      );
      allChanges.push(...abilitiesChanges);
      
      // Conceito
      const conceptChanges = detectChanges(
        {
          concept: previousDataRef.current.concept || "",
        },
        {
          concept: sheetData.concept || "",
        },
        "Conceito",
        {
          concept: "Conceito do Personagem",
        }
      );
      allChanges.push(...conceptChanges);
    
    // Cria notificação se houver mudanças
    if (allChanges.length > 0) {
      console.log("🔔 Mudanças detectadas:", allChanges);
      const notification = {
        id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        playerId: playerIdRef.current,
        playerName: sheetData.player || "Sem jogador",
        characterName: sheetData.name || "Sem nome",
        timestamp: Date.now(),
        changes: allChanges,
      };
      console.log("📝 Salvando notificação:", notification);
      
      // Salva no localStorage (fallback)
      saveNotification(notification);
      
      // Envia via Socket.io se estiver conectado (tempo real)
      if (socket && isConnected) {
        socket.emit("notification:new", notification);
        console.log("📡 Notificação enviada via Socket.io");
      }
    }
  };

  // Atualiza presença periodicamente (a cada 10 segundos)
  useEffect(() => {
    if (!playerIdRef.current) return;
    
    const interval = setInterval(() => {
      if (playerIdRef.current) {
        updatePresence(playerIdRef.current);
      }
    }, 10000);
    
    return () => clearInterval(interval);
  }, [updatePresence]);

  // Função auxiliar para obter todos os dados da ficha
  const getAllSheetData = (): Record<string, any> => {
    const data: Record<string, any> = {};
      // Campos do cabeçalho
      data.name = localStorage.getItem("name") || "";
      data.player = localStorage.getItem("player") || "";
      data.race = localStorage.getItem("race") || "";
      data.classes = localStorage.getItem("classes") || "";
      data.level = Number(localStorage.getItem("level") || 1);
    
    // Atributos
    const attrsStr = localStorage.getItem("attrs");
    data.attrs = attrsStr ? JSON.parse(attrsStr) : {};
    
      // PV/PM
      data.pvMax = Number(localStorage.getItem("pvMax") || 10);
      data.pv = Number(localStorage.getItem("pv") || 10);
      data.pmMax = Number(localStorage.getItem("pmMax") || 10);
      data.pm = Number(localStorage.getItem("pm") || 10);
      data.damageReduction = Number(localStorage.getItem("damageReduction") || 0);
    
    // Defesa
    data.defense = {
      armor: Number(localStorage.getItem("def_armor") || 0),
      shield: Number(localStorage.getItem("def_shield") || 0),
      others: Number(localStorage.getItem("def_others") || 0),
      penalty: Number(localStorage.getItem("def_penalty") || 0),
    };
    
    // Ataques
    const attacksStr = localStorage.getItem("attacks");
    data.attacks = attacksStr ? JSON.parse(attacksStr) : [];
    
    // Perícias
    const skillsStr = localStorage.getItem("skills");
    data.skills = skillsStr ? JSON.parse(skillsStr) : [];
    
    // Equipamentos
    const equipmentStr = localStorage.getItem("equipment");
    data.equipment = equipmentStr ? JSON.parse(equipmentStr) : [];
    
    // Outros
    data.xp = Number(localStorage.getItem("xp") || 0);
    data.size = localStorage.getItem("size") || "Médio";
    data.speed = Number(localStorage.getItem("speed") || 9);
    
      // Imagens
      data.profileImage = localStorage.getItem("profileImage") || "";
      data.weaponName = localStorage.getItem("weaponName") || "";
      
      // Habilidades de Armas
      data.weaponAbilities = localStorage.getItem("weaponAbilities") || "";
      
      // Habilidades adicionais
      data.conceptAbility = localStorage.getItem("conceptAbility") || "";
      data.generalAbilities = localStorage.getItem("generalAbilities") || "";
      
      // Conceito
      data.concept = localStorage.getItem("concept") || "";
      
      return data;
  };

  // Função para sincronizar e detectar mudanças
  const syncAndDetectChanges = useCallback(() => {
    if (!playerIdRef.current) return;
    
    const sheetData = getAllSheetData();
    
    // Detecta mudanças se tiver dados anteriores
    if (previousDataRef.current && playerIdRef.current) {
      detectAndNotifyChanges(sheetData);
    }
    
    // Salva dados atuais como anteriores para próxima comparação
    previousDataRef.current = { ...sheetData };
    
    const playerData = {
      playerId: playerIdRef.current,
      characterName: sheetData.name || "Sem nome",
      playerName: sheetData.player || "Sem jogador",
      race: sheetData.race,
      classes: sheetData.classes,
      level: sheetData.level,
      attrs: sheetData.attrs,
      pv: { current: sheetData.pv, max: sheetData.pvMax },
      pm: { current: sheetData.pm, max: sheetData.pmMax },
      damageReduction: sheetData.damageReduction,
      defense: sheetData.defense,
      attacks: sheetData.attacks,
      skills: sheetData.skills,
      equipment: sheetData.equipment,
      xp: sheetData.xp,
      size: sheetData.size,
      speed: sheetData.speed,
      profileImage: sheetData.profileImage,
      weaponName: sheetData.weaponName,
      weaponAbilities: sheetData.weaponAbilities,
      conceptAbility: sheetData.conceptAbility,
      generalAbilities: sheetData.generalAbilities,
      concept: sheetData.concept,
      lastUpdate: Date.now(),
    };
    
    // Atualiza via contexto (fallback para localStorage)
    updatePlayer(playerIdRef.current, playerData);
    
    // Envia via Socket.io se estiver conectado
    if (socket && isConnected) {
      socket.emit("player:sync", playerData);
    }
  }, [updatePlayer, socket, isConnected]);

  // Inicializa com dados atuais (sem detectar mudanças na primeira vez)
  useEffect(() => {
    if (!playerIdRef.current) return;
    const sheetData = getAllSheetData();
    previousDataRef.current = { ...sheetData };
    // Primeira sincronização sem detectar mudanças
    updatePlayer(playerIdRef.current, {
      characterName: sheetData.name || "Sem nome",
      playerName: sheetData.player || "Sem jogador",
      race: sheetData.race,
      classes: sheetData.classes,
      level: sheetData.level,
      attrs: sheetData.attrs,
          pv: { current: sheetData.pv, max: sheetData.pvMax },
          pm: { current: sheetData.pm, max: sheetData.pmMax },
          damageReduction: sheetData.damageReduction,
      defense: sheetData.defense,
      attacks: sheetData.attacks,
      skills: sheetData.skills,
      equipment: sheetData.equipment,
      xp: sheetData.xp,
      size: sheetData.size,
      speed: sheetData.speed,
          profileImage: sheetData.profileImage,
          weaponName: sheetData.weaponName,
          weaponAbilities: sheetData.weaponAbilities,
          conceptAbility: sheetData.conceptAbility,
          generalAbilities: sheetData.generalAbilities,
          concept: sheetData.concept,
          lastUpdate: Date.now(),
    });
  }, [updatePlayer]);

  // Monitora mudanças no localStorage
  useEffect(() => {
    // Escuta mudanças no localStorage (de outras abas)
    const handleStorageChange = () => {
      syncAndDetectChanges();
    };
    
    window.addEventListener("storage", handleStorageChange);
    
    // Polling a cada 1.5 segundos para detectar mudanças na mesma aba
    const interval = setInterval(() => {
      syncAndDetectChanges();
    }, 1500);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [syncAndDetectChanges]);

  return playerIdRef.current;
}

