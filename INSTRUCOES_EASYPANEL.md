# 🚀 INSTRUÇÕES PARA DEPLOY NO EASYPANEL

## 📋 PASSO A PASSO EXATO

### 1️⃣ No EasyPanel - Criar Serviço

1. Entre no EasyPanel
2. Clique em **"New Service"** ou **"Novo Serviço"**
3. Escolha **"Git Repository"** ou **"GitHub"**
4. Conecte seu repositório `fixa-rpg` (ou o nome que você deu)

---

### 2️⃣ Configurações do Serviço

#### 📝 Variáveis de Ambiente:
Adicione estas variáveis na seção **"Environment Variables"**:

```
NODE_ENV=production
PORT=3000
HOSTNAME=0.0.0.0
```

#### ⚙️ Configurações de Build:
- **Build Command:** `npm run build`
- **Start Command:** `tsx server.ts`
- **Working Directory:** `/` (raiz)

#### 🔌 Porta:
- Configure a porta como **3000** (ou a porta que o EasyPanel configurar automaticamente)

---

### 3️⃣ Deploy

1. Clique em **"Deploy"** ou **"Save & Deploy"**
2. Aguarde o build completar
3. Verifique os logs para ver:
   ```
   > Ready on http://0.0.0.0:3000
   > Socket.io server running
   ```

---

### 4️⃣ Verificar se Funcionou

1. Abra a URL que o EasyPanel forneceu
2. Abra o **Console do Navegador** (F12 → Console)
3. Você deve ver:
   ```
   🔌 Conectando ao Socket.io: https://seu-dominio.com
   ✅ Conectado ao Socket.io: [algum-id]
   ```

✅ **Se aparecer isso = Socket.io está funcionando!**

❌ **Se aparecer erro:**
- O sistema continua funcionando (usa localStorage como fallback)
- Mas não terá sincronização em tempo real

---

### 5️⃣ Testar Sincronização

1. Abra **2 abas** diferentes do navegador:
   - **Aba 1:** `/` (ficha do personagem)
   - **Aba 2:** `/admin` (painel admin)

2. Na **Aba 1**, edite algo na ficha (ex: nome do personagem)
3. Na **Aba 2**, você deve ver a atualização em tempo real! ✨

---

## 🔧 Troubleshooting

### ❌ Erro: "Cannot find module 'tsx'"
**Solução:** O `tsx` precisa estar instalado. O `package.json` já está configurado, mas se der erro:
- Adicione `tsx` manualmente nas dependências no EasyPanel, OU
- Mude o Start Command para: `npx tsx server.ts`

### ❌ Erro: "Socket.io não conecta"
**Solução:** 
- Verifique se o servidor está rodando (logs do EasyPanel)
- Verifique se a porta está correta
- **Não é crítico** - o sistema funciona sem Socket.io (usa localStorage)

### ❌ Erro: "Port already in use"
**Solução:** 
- O EasyPanel pode estar usando outra porta
- Deixe o EasyPanel configurar a porta automaticamente
- Ou configure a variável `PORT` no EasyPanel

### ❌ Build falha
**Solução:**
- Verifique os logs do EasyPanel
- Certifique-se de que todas as dependências estão no `package.json`
- Verifique se está usando Node.js 20.x (já configurado no `.nixpacks.toml`)

---

## ✅ Checklist Final

Antes de fazer deploy, certifique-se de:

- [ ] Repositório Git conectado ao EasyPanel
- [ ] Variáveis de ambiente configuradas
- [ ] Build Command: `npm run build`
- [ ] Start Command: `tsx server.ts`
- [ ] Porta configurada (3000 ou a que o EasyPanel usar)
- [ ] Node.js 20.x (já configurado no `.nixpacks.toml`)

---

## 📝 Arquivos Importantes

Os seguintes arquivos já estão configurados e prontos:

- ✅ `server.ts` - Servidor Next.js + Socket.io
- ✅ `lib/socketServer.ts` - Lógica do Socket.io
- ✅ `app/hooks/useSocket.ts` - Cliente Socket.io
- ✅ `.nixpacks.toml` - Configuração do Nixpacks
- ✅ `Dockerfile` - Docker (se necessário)
- ✅ `package.json` - Dependências e scripts

**Nada mais precisa ser feito!** Apenas configure no EasyPanel conforme acima. 🚀

---

## 💡 Dica

Se algo não funcionar, o sistema tem **fallback automático** para localStorage. Funciona mesmo sem Socket.io, só não terá sincronização em tempo real.

---

**Pronto! Siga os passos acima e está tudo configurado!** ✅

