export interface ChangeNotification {
  id: string;
  playerId: string;
  playerName: string;
  characterName: string;
  timestamp: number;
  changes: Change[];
}

export interface Change {
  field: string;
  section: string;
  action: "modified" | "added" | "removed";
  oldValue: any;
  newValue: any;
}

const NOTIFICATIONS_KEY = "t20_change_notifications";

// Salva uma notificação
export function saveNotification(notification: ChangeNotification): void {
  try {
    const existing = getNotifications();
    existing.push(notification);
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(existing));
    console.log("✅ Notificação salva no localStorage:", notification.id);
    // Dispara evento customizado para outras abas
    window.dispatchEvent(new CustomEvent("t20-notification", { detail: notification }));
    console.log("📡 Evento t20-notification disparado");
  } catch (err) {
    console.error("❌ Erro ao salvar notificação:", err);
  }
}

// Lê todas as notificações
export function getNotifications(): ChangeNotification[] {
  try {
    const stored = localStorage.getItem(NOTIFICATIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// Remove notificações lidas
export function removeNotification(id: string): void {
  try {
    const existing = getNotifications();
    const filtered = existing.filter(n => n.id !== id);
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(filtered));
  } catch (err) {
    console.error("Erro ao remover notificação:", err);
  }
}

// Limpa todas as notificações
export function clearAllNotifications(): void {
  try {
    localStorage.removeItem(NOTIFICATIONS_KEY);
  } catch (err) {
    console.error("Erro ao limpar notificações:", err);
  }
}

// Compara dois objetos e retorna as diferenças
export function detectChanges(
  oldData: Record<string, any>,
  newData: Record<string, any>,
  section: string,
  fieldMappings: Record<string, string> = {}
): Change[] {
  const changes: Change[] = [];

  // Compara campos simples
  for (const key in newData) {
    const displayName = fieldMappings[key] || key;
    const oldVal = oldData[key];
    const newVal = newData[key];

    if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
      changes.push({
        field: displayName,
        section,
        action: "modified",
        oldValue: oldVal,
        newValue: newVal,
      });
    }
  }

  // Verifica campos removidos
  for (const key in oldData) {
    if (!(key in newData)) {
      const displayName = fieldMappings[key] || key;
      changes.push({
        field: displayName,
        section,
        action: "removed",
        oldValue: oldData[key],
        newValue: null,
      });
    }
  }

  return changes;
}

// Detecta mudanças em arrays (ataques, perícias, equipamentos)
export function detectArrayChanges(
  oldArray: any[],
  newArray: any[],
  section: string,
  identifier: string = "name"
): Change[] {
  const changes: Change[] = [];

  // Items adicionados ou modificados
  newArray.forEach((newItem, idx) => {
    const oldItem = oldArray[idx];
    
    if (!oldItem) {
      // Item adicionado
      changes.push({
        field: `${section} - Item ${idx + 1}`,
        section,
        action: "added",
        oldValue: null,
        newValue: newItem[identifier] || JSON.stringify(newItem),
      });
    } else if (JSON.stringify(oldItem) !== JSON.stringify(newItem)) {
      // Item modificado
      const itemName = newItem[identifier] || `Item ${idx + 1}`;
      changes.push({
        field: `${section} - ${itemName}`,
        section,
        action: "modified",
        oldValue: oldItem,
        newValue: newItem,
      });
    }
  });

  // Items removidos
  if (newArray.length < oldArray.length) {
    for (let i = newArray.length; i < oldArray.length; i++) {
      const removedItem = oldArray[i];
      const itemName = removedItem[identifier] || `Item ${i + 1}`;
      changes.push({
        field: `${section} - ${itemName}`,
        section,
        action: "removed",
        oldValue: removedItem,
        newValue: null,
      });
    }
  }

  return changes;
}

