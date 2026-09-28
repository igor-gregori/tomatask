# 🍅 tomatask

Pomodoro timer com lista de tarefas.

**Acesse:** https://igor-gregori.github.io/tomatask/

## Funcionalidades

- Timer com três modos: Foco, Pausa curta e Pausa longa
- Durações configuráveis e pausa longa a cada N focos
- Lista de tarefas: adicione, conclua, exclua e escolha em qual tarefa focar
- Contagem de pomodoros por tarefa
- Tema claro/escuro, seguindo o sistema por padrão
- Sons de interface sintetizados com Web Audio (podem ser desligados)
- Tempo restante no título da aba e atalho de barra de espaço para iniciar/pausar
- Layout lado a lado no desktop e empilhado no celular
- Dados salvos no navegador (`localStorage`)

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
