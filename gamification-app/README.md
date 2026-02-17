# EGO - RPG de Gamificação Pessoal 🎮

> **Transforme sua vida em um RPG.** Acompanhe hábitos, complete missões e evolua seu personagem neste aplicativo de gamificação para desktop desenvolvido com Electron e React.

![Project Status](https://img.shields.io/badge/Status-Active-success)
![License](https://img.shields.io/badge/License-MIT-blue)

## 📋 Índice

* [Sobre](#sobre)
* [Funcionalidades](#funcionalidades)
* [Tecnologias](#tecnologias)
* [Pré-requisitos](#pré-requisitos)
* [Instalação](#instalação)
* [Executando Localmente](#executando-localmente)
* [Estrutura do Projeto](#estrutura-do-projeto)
* [Licença](#licença)

## 💡 Sobre

EGO é um aplicativo desktop projetado para gamificar sua vida diária. Ao concluir tarefas do mundo real e manter bons hábitos, você ganha XP e Moedas para evoluir seu avatar virtual. Ele oferece feedback imediato e um sistema visual de progressão para ajudar você a se manter motivado.
⚠️ Projeto foi desenvolvido por meio de low-code com o uso do Antigravity.

## ✨ Funcionalidades

* **Rastreador de Hábitos**: Defina hábitos diários com recompensas e penalidades em XP.
* **Quadro de Missões**: Crie tarefas únicas (Principal, Secundária, Chefe) com recompensas em diferentes níveis.
* **Progressão RPG**: Evolua do nível 1 ao 10+ com uma curva de dificuldade personalizada e escalável.
* **Sistema de Inventário**: Compre e equipe itens (Armas, Armaduras, Auras) usando moedas conquistadas.
* **Persistência de Dados**: Banco de dados local garante que seu progresso seja salvo automaticamente.
* **Integração com a Bandeja do Sistema**: Modo minimizado com acesso rápido às missões pendentes.

## 🛠 Tecnologias

* **Core**: [Electron](https://www.electronjs.org/) (Processo Principal)
* **Frontend**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
* **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
* **Estilização**: [Tailwind CSS](https://tailwindcss.com/)
* **Ícones**: [Lucide React](https://lucide.dev/)

## 📦 Pré-requisitos

* **Node.js** (v18 ou superior)
* **npm** (geralmente já incluído com o Node.js)

## 🚀 Instalação

1. Clone o repositório:

   ```bash
   git clone https://github.com/your-username/ego-gamification.git
   cd ego-gamification
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

## ▶️ Executando Localmente

> **Nota para usuários Windows:** Se o seu ambiente não tiver o `npm` no PATH global, execute este comando no PowerShell *dentro da pasta do projeto* antes de rodar os comandos npm:
>
> ```powershell
> $env:PATH = "$PWD\nodejs;$env:PATH"
> ```

1. **Modo de Desenvolvimento** (Hot Reload):

   ```bash
   npm run dev
   ```

   *Inicia simultaneamente o servidor de desenvolvimento do React e a janela do Electron.*

2. **Build para Produção** (Criar .exe):

   ```bash
   npm run electron:build
   ```

   *O executável será gerado em `dist/win-unpacked/`.*

## 📂 Estrutura do Projeto

```
gamification-app/
├── electron/           # Backend (Processo Principal)
│   ├── main.cjs        # Ponto de entrada da aplicação, gerenciamento de janelas e Tray
│   ├── database.cjs    # Lógica do banco de dados local (JSON)
│   └── preload.cjs     # Context Bridge (Segurança)
├── src/                # Frontend (Processo Renderer)
│   ├── components/     # Componentes de UI em React (Hábitos, Missões, Status)
│   ├── context/        # Gerenciamento de Estado (Lógica do Jogo)
│   ├── data/           # Dados Estáticos (Itens, Configuração da Loja)
│   └── types.ts        # Interfaces TypeScript
├── public/             # Arquivos Estáticos (Ícones, Imagens)
└── dist/               # Build de Produção
```

## 📄 Licença

Este projeto está licenciado sob a [Licença MIT](LICENSE).
