"use client";
import { useEffect, useState } from "react";
import {
  getNotifications,
  removeNotification,
  clearAllNotifications,
  saveNotification,
  type ChangeNotification,
  type Change,
} from "../utils/changeDetection";

// Importação condicional do useSocket
import { useSocket } from "../hooks/useSocket";

interface NotificationPopupProps {
  onClose: (id: string) => void;
  notification: ChangeNotification;
}

function NotificationPopup({ notification, onClose }: NotificationPopupProps) {
  const formatTime = (timestamp: number): string => {
    return new Date(timestamp).toLocaleTimeString("pt-BR");
  };

  const getActionIcon = (action: Change["action"]): string => {
    switch (action) {
      case "added":
        return "➕";
      case "removed":
        return "➖";
      case "modified":
        return "✏️";
      default:
        return "📝";
    }
  };

  const getActionLabel = (action: Change["action"]): string => {
    switch (action) {
      case "added":
        return "Adicionado";
      case "removed":
        return "Removido";
      case "modified":
        return "Modificado";
      default:
        return "Alterado";
    }
  };

  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return "—";
    if (typeof value === "object") {
      if (Array.isArray(value)) {
        return `${value.length} item(ns)`;
      }
      return JSON.stringify(value).substring(0, 50);
    }
    return String(value);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 w-full max-w-md animate-in slide-in-from-bottom-5">
      <div className="parchment rounded-lg border-2 border-[var(--primary)] p-4 shadow-2xl">
        <div className="mb-3 flex items-start justify-between">
          <div className="flex-1">
            <div className="font-semibold text-lg">{notification.characterName}</div>
            <div className="text-sm opacity-70">{notification.playerName}</div>
            <div className="text-xs opacity-60">{formatTime(notification.timestamp)}</div>
          </div>
          <button
            onClick={() => onClose(notification.id)}
            className="ml-2 rounded-full bg-red-600 px-2 py-1 text-white hover:bg-red-700"
          >
            ✕
          </button>
        </div>

        <div className="max-h-64 space-y-2 overflow-y-auto">
          <div className="text-xs font-semibold uppercase opacity-80">
            Mudanças ({notification.changes.length})
          </div>
          {notification.changes.map((change, idx) => (
            <div
              key={idx}
              className="rounded-md border border-white/10 bg-black/20 p-2 text-sm"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{getActionIcon(change.action)}</span>
                <span className="font-semibold">{change.section}</span>
                <span className="text-xs opacity-60">— {getActionLabel(change.action)}</span>
              </div>
              <div className="mt-1 ml-7 text-xs">
                <div className="font-medium">{change.field}</div>
                {change.action === "modified" && (
                  <div className="mt-1 space-y-0.5 text-xs opacity-80">
                    <div>
                      <span className="text-red-400">Antes:</span> {formatValue(change.oldValue)}
                    </div>
                    <div>
                      <span className="text-green-400">Agora:</span> {formatValue(change.newValue)}
                    </div>
                  </div>
                )}
                {change.action === "added" && (
                  <div className="mt-1 text-xs opacity-80">
                    <span className="text-green-400">Novo:</span> {formatValue(change.newValue)}
                  </div>
                )}
                {change.action === "removed" && (
                  <div className="mt-1 text-xs opacity-80">
                    <span className="text-red-400">Removido:</span> {formatValue(change.oldValue)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function NotificationManager() {
  const [notifications, setNotifications] = useState<ChangeNotification[]>([]);
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    const loadNotifications = () => {
      const notifs = getNotifications();
      console.log("📬 Carregando notificações:", notifs.length);
      if (notifs.length > 0) {
        console.log("📋 Notificações encontradas:", notifs);
      }
      setNotifications(notifs);
    };

    const addNotification = (notification: ChangeNotification) => {
      // Adiciona no localStorage
      saveNotification(notification);
      // Atualiza o estado
      setNotifications(prev => [...prev, notification]);
      console.log("✅ Notificação adicionada:", notification.id);
    };

    loadNotifications();

    // Atualiza a cada 1 segundo (polling do localStorage como fallback)
    const interval = setInterval(loadNotifications, 1000);

    // Escuta eventos customizados de outras abas (localStorage)
    const handleCustomEvent = () => {
      loadNotifications();
    };
    window.addEventListener("t20-notification", handleCustomEvent as EventListener);

    // Escuta mudanças no localStorage (entre abas)
    window.addEventListener("storage", handleCustomEvent);

    // Escuta notificações via Socket.io (tempo real entre clientes)
    if (socket && isConnected) {
      socket.on("notification:received", (notification: ChangeNotification) => {
        console.log("📡 Notificação recebida via Socket.io:", notification.id);
        addNotification(notification);
      });
    }

    return () => {
      clearInterval(interval);
      window.removeEventListener("t20-notification", handleCustomEvent as EventListener);
      window.removeEventListener("storage", handleCustomEvent);
      if (socket) {
        socket.off("notification:received");
      }
    };
  }, [socket, isConnected]);

  const handleClose = (id: string) => {
    removeNotification(id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleClearAll = () => {
    if (confirm(`Deseja limpar todas as ${notifications.length} notificações?`)) {
      clearAllNotifications();
      setNotifications([]);
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-0 right-0 z-50 flex flex-col gap-2 p-4">
      {/* Botão para limpar todas */}
      <div className="mb-2 flex justify-end">
        <button
          onClick={handleClearAll}
          className="rounded-md border border-red-500/50 bg-red-500/20 px-3 py-1.5 text-xs text-red-300 hover:bg-red-500/30 transition-colors"
          title={`Limpar todas as ${notifications.length} notificações`}
        >
          ✕ Limpar Todas ({notifications.length})
        </button>
      </div>

      {notifications.slice(0, 3).map((notif) => (
        <NotificationPopup key={notif.id} notification={notif} onClose={handleClose} />
      ))}
      {notifications.length > 3 && (
        <div className="parchment rounded-lg border border-white/20 p-2 text-center text-xs opacity-70">
          +{notifications.length - 3} notificações anteriores
        </div>
      )}
    </div>
  );
}

