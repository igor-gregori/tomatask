# 🍅 tomatask

Pomodoro timer com lista de tarefas.

**Acesse:** https://igor-gregori.github.io/tomatask/

## Funcionalidades

- Timer com três modos: Foco (25 min), Pausa curta (5 min) e Pausa longa (15 min, a cada 4 pomodoros)
- Lista de tarefas: adicione, marque como concluída, exclua e escolha em qual tarefa focar
- Contagem de pomodoros por tarefa
- Aviso sonoro ao fim de cada sessão e tempo restante no título da aba
- Atalho: barra de espaço inicia/pausa
- Dados salvos no navegador (`localStorage`)
- Tema claro/escuro automático

## Desenvolvimento

Requer Node.js 24+.

```bash
npm install
npm run dev      # servidor local em http://localhost:5173/tomatask/
npm run build    # build de produção em dist/
npm run lint
```

## Deploy

Todo push na branch `main` publica o site no GitHub Pages via GitHub Actions
(`.github/workflows/deploy.yml`).
