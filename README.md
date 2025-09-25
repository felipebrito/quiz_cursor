# 🎮 Quiz Show Interativo

Um sistema de entretenimento digital que simula um programa de TV de perguntas e respostas, desenvolvido com Next.js, TypeScript e Socket.IO.

## 📋 Visão Geral

O Quiz Show Interativo é uma solução completa para eventos, feiras e estabelecimentos que desejam oferecer entretenimento interativo aos visitantes. O sistema permite que até 3 participantes simultâneos compitam em tempo real, com cadastro automatizado via totem, gerenciamento administrativo simplificado e exibição pública dos resultados.

### 🎯 Objetivos
- Proporcionar experiência imersiva estilo TV Quiz
- Simplificar triagem de participantes pela recepcionista
- Automatizar a condução da partida
- Garantir sincronização justa de tempo e respostas
- Criar ambiente visual impactante (tema Brutalist Dark)

## 🚀 Tecnologias

- **Frontend**: Next.js 14+ com TypeScript
- **UI**: shadcn/ui com tema dark brutalist
- **Animações**: Framer Motion
- **Realtime**: Socket.IO
- **Database**: Prisma ORM + SQLite/PostgreSQL
- **Styling**: Tailwind CSS
- **Webcam**: WebRTC para captura de selfies

## 🏗️ Arquitetura do Sistema

### Componentes Principais
1. **Totem de Cadastro** - Interface touch-friendly para registro de participantes
2. **Dashboard Administrativo** - Gerenciamento de fila e início de partidas
3. **Sistema de Jogo** - Lógica automatizada de perguntas e respostas
4. **Display Público** - Exibição em tempo real para espectadores

### Fluxo do Sistema
1. **Idle Mode** - Exibe ranking e próximos jogadores
2. **Cadastro** - Webcam + formulário (Nome, Cidade, Estado)
3. **Gerenciamento** - Recepcionista seleciona 3 jogadores
4. **Partida** - 8 rodadas automáticas com sincronização
5. **Resultado** - Animações e ranking atualizado

## 📊 Status do Projeto

### Tarefas Planejadas: 15
- ✅ **Configuração inicial** - PRD e estrutura de tarefas
- 🔄 **Desenvolvimento** - Em andamento
- ⏳ **Testes** - Pendente
- ⏳ **Deploy** - Pendente

### Próximas Tarefas
1. **Initialize Next.js Project** - Configuração base
2. **Configure Prisma ORM** - Banco de dados
3. **Integrate shadcn/ui** - Componentes UI
4. **Develop Totem UI** - Interface de cadastro
5. **Implement Webcam Capture** - Captura de selfies

## 🛠️ Instalação e Desenvolvimento

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Git

### Configuração Inicial
```bash
# Clone o repositório
git clone https://github.com/felipebrito/quiz_cursor.git
cd quiz_cursor

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env

# Execute o banco de dados
npx prisma migrate dev

# Inicie o servidor de desenvolvimento
npm run dev
```

### Scripts Disponíveis
```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build para produção
npm run start        # Servidor de produção
npm run lint         # Linter
npm run type-check   # Verificação de tipos
```

## 📁 Estrutura do Projeto

```
quiz_cursor/
├── .taskmaster/          # Configurações do Taskmaster
│   ├── tasks/           # Tarefas do projeto
│   ├── reports/         # Relatórios de complexidade
│   └── templates/       # Templates de PRD
├── scripts/             # Scripts e documentação
│   └── PRD.txt         # Product Requirements Document
├── src/
│   ├── app/            # App Router (Next.js 14+)
│   ├── components/     # Componentes React
│   ├── lib/            # Utilitários e configurações
│   └── types/          # Definições TypeScript
├── prisma/             # Schema e migrações do banco
└── public/             # Assets estáticos
```

## 🎮 Funcionalidades

### Totem de Cadastro
- ✅ Captura de selfie via webcam
- ✅ Formulário de cadastro simplificado
- ✅ Interface touch-friendly
- ✅ Validação de dados

### Dashboard Administrativo
- ✅ Visualização da fila de participantes
- ✅ Edição e exclusão de participantes
- ✅ Seleção de 3 jogadores por partida
- ✅ Início de partidas com um clique

### Sistema de Jogo
- ✅ 8 rodadas automáticas
- ✅ Sincronização em tempo real
- ✅ Processamento de respostas
- ✅ Sistema de pontuação
- ✅ Animações e efeitos sonoros

### Display Público
- ✅ Exibição em tempo real
- ✅ Modo idle com ranking
- ✅ Animações de celebração
- ✅ Tema visual impactante

## 🔧 Configuração do Taskmaster

Este projeto utiliza o [Taskmaster](https://github.com/task-master-ai/task-master-ai) para gerenciamento de tarefas e desenvolvimento guiado por IA.

### Comandos Úteis
```bash
# Ver todas as tarefas
npx task-master-ai list

# Ver próxima tarefa
npx task-master-ai next

# Marcar tarefa como concluída
npx task-master-ai set-status --id=1 --status=done

# Expandir tarefa complexa
npx task-master-ai expand --id=10 --research

# Atualizar tarefa com novo contexto
npx task-master-ai update-task --id=1 --prompt="Nova informação"
```

## 📈 Roadmap de Desenvolvimento

### Fase 1 - MVP (Fundação)
- [x] Configuração do projeto Next.js
- [x] Estrutura de banco de dados
- [x] Interface básica do totem
- [x] Dashboard administrativo
- [x] Sistema de perguntas e respostas

### Fase 2 - Core Game
- [ ] Socket.IO para sincronização
- [ ] Lógica de jogo com 8 rodadas
- [ ] Interface de jogo para 3 jogadores
- [ ] Sistema de pontuação e ranking
- [ ] Animações básicas

### Fase 3 - Polish & Experience
- [ ] Tema visual dark brutalist
- [ ] Efeitos sonoros
- [ ] Animações de celebração
- [ ] Otimizações de performance
- [ ] Testes de usabilidade

### Fase 4 - Extensões Futuras
- [ ] APIs externas de perguntas
- [ ] Estatísticas detalhadas
- [ ] Suporte a mais jogadores
- [ ] Customização de temas
- [ ] Sistema de torneios

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Equipe

- **Felipe Brito** - Desenvolvimento e Design
- **Aparato Design** - Identidade Visual

## 📞 Contato

- **GitHub**: [@felipebrito](https://github.com/felipebrito)
- **Email**: [seu-email@exemplo.com]

---

**Desenvolvido com ❤️ usando Next.js, TypeScript e Taskmaster AI**
