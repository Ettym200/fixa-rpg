# 🔌 Socket.io - Guia Rápido

## ✅ O que foi implementado:

1. **Servidor Socket.io** (`lib/socketServer.ts`)
   - Gerencia conexões de players
   - Sincroniza dados em tempo real
   - Detecta quando players entram/saem

2. **Cliente Socket.io** (`app/hooks/useSocket.ts`)
   - Conecta automaticamente ao servidor
   - Reconexão automática em caso de queda
   - Funciona no frontend e admin

3. **Sincronização** (`app/hooks/usePlayerSync.ts`)
   - Envia dados da ficha via Socket.io
   - Fallback para localStorage se Socket.io não funcionar
   - Detecta mudanças e notifica

4. **Admin Panel** (`app/state/PlayersContext.tsx`)
   - Recebe atualizações em tempo real
   - Lista de players atualiza automaticamente
   - Fallback para polling se necessário

## 🚀 Como funciona:

### Para Players (Ficha):
1. Abre a ficha → Socket.io conecta automaticamente
2. Edita algo → Dados são enviados via Socket.io
3. Admin vê em tempo real ✨

### Para Admin:
1. Abre `/admin` → Socket.io conecta
2. Recebe lista de players conectados
3. Vê mudanças em tempo real quando players editam

## 🔧 Configuração no EasyPanel:

### Variáveis de Ambiente:
```
NODE_ENV=production
PORT=3000
HOSTNAME=0.0.0.0
```

### Comandos:
- **Build:** `npm run build`
- **Start:** `tsx server.ts`

### Verificar se funcionou:
1. Abra o console do navegador (F12)
2. Procure por: `✅ Conectado ao Socket.io: [id]`
3. Se aparecer, está funcionando! ✅

## 🐛 Troubleshooting:

### "Erro de conexão Socket.io"
- Verifique se o `server.ts` está rodando
- Verifique se a porta está correta
- Verifique se WebSockets estão habilitados no EasyPanel

### "Players não aparecem no admin"
- Verifique o console (F12) para erros
- O sistema faz fallback automático para localStorage
- Funciona mesmo sem Socket.io (mas sem tempo real)

### "Socket.io não conecta"
- O sistema continua funcionando com localStorage
- Não é crítico, mas o tempo real não funcionará

## 📝 Notas:

- **Fallback automático**: Se Socket.io não funcionar, usa localStorage (como antes)
- **Zero configuração**: Funciona automaticamente quando o servidor está rodando
- **Tempo real opcional**: Melhora a experiência, mas não é essencial

## ✅ Pronto para usar!

O Socket.io está integrado e pronto. Apenas faça o deploy no EasyPanel seguindo o guia `EASYPANEL_SETUP.md`!

