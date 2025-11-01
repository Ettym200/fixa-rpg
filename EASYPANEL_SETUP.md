# 📋 Guia de Configuração no EasyPanel

## ✅ Passo a Passo Completo

### 1️⃣ No EasyPanel - Criar Novo Serviço

1. Acesse o EasyPanel
2. Clique em **"New Service"** ou **"Novo Serviço"**
3. Selecione **"Docker"** ou **"Custom"**
4. Escolha o repositório Git (seu repositório `fixa-rpg`)

### 2️⃣ Configurações do Serviço no EasyPanel

#### Variáveis de Ambiente:
```
NODE_ENV=production
PORT=3000
HOSTNAME=0.0.0.0
```

#### Comandos:
- **Build Command:** `npm run build`
- **Start Command:** `tsx server.ts` ou `npm start`
- **Working Directory:** `/` (raiz do projeto)

#### Porta:
- **Port:** `3000` (ou a porta que o EasyPanel configurar)

### 3️⃣ Configurações Adicionais

#### Dockerfile (se o EasyPanel usar Dockerfile próprio):
O arquivo `Dockerfile` já está criado no projeto. O EasyPanel deve usá-lo automaticamente.

#### Arquivo .nixpacks.toml:
O arquivo `.nixpacks.toml` já está configurado e será usado automaticamente pelo Nixpacks.

### 4️⃣ Verificações Importantes

#### ✅ Certifique-se de que:
- O repositório está conectado ao EasyPanel
- As variáveis de ambiente estão configuradas
- A porta está configurada corretamente
- O comando de start está como `tsx server.ts`

### 5️⃣ Após o Deploy

1. Acesse a URL fornecida pelo EasyPanel
2. Abra o console do navegador (F12)
3. Você deve ver: `✅ Conectado ao Socket.io: [socket-id]`
4. Se aparecer `❌ Erro de conexão`, verifique se o Socket.io está rodando

### 6️⃣ Troubleshooting

#### Se o build falhar:
- Verifique se todas as dependências estão no `package.json`
- Verifique os logs do EasyPanel

#### Se Socket.io não conectar:
- Verifique se o servidor está rodando (deve aparecer nos logs)
- Verifique se a porta está correta
- Verifique se o caminho `/api/socket` está acessível

#### Se der erro de porta:
- O EasyPanel pode usar outra porta
- Configure a variável `PORT` no EasyPanel para a porta correta

### 📝 Notas Importantes

1. **WebSockets**: O EasyPanel precisa suportar WebSockets. Se não suportar, o sistema fará fallback para polling via localStorage.

2. **Node.js**: Certifique-se de que o EasyPanel está usando Node.js 20.x (configurado no `.nixpacks.toml`)

3. **Processo**: O `server.ts` roda o Next.js E o Socket.io juntos no mesmo processo

4. **Fallback**: Se o Socket.io não funcionar, o sistema continua funcionando com localStorage (como antes)

## 🚀 Testando Localmente Antes

Para testar localmente antes de fazer deploy:

```bash
npm install
npm run dev
```

Abra `http://localhost:3000` e verifique no console se aparece:
- `✅ Conectado ao Socket.io: [id]`
- `📋 Recebida lista de players via Socket.io`

Se aparecer, está funcionando! ✅

