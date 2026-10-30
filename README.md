# 🧮 Calculadora Educacional de Escritório

> Uma aplicação web interativa desenvolvida com foco pedagógico para apoiar estudantes do Ensino Fundamental (6º ao 9º ano) na realização de cálculos matemáticos básicos e no entendimento intuitivo e visual do cálculo de porcentagem, frações centesimais e descontos comerciais.

---

## 📌 Sumário

- [Visão Geral](#-visão-geral)
- [Problema que o Projeto Resolve](#-problema-que-o-projeto-resolve)
- [Público-Alvo](#-público-alvo)
- [Recursos e Funcionalidades](#-recursos-e-funcionalidades)
  - [1. Calculadora de Mesa com Estilo de Escritório](#1-calculadora-de-mesa-com-estilo-de-escritório)
  - [2. Painel Pedagógico em Tempo Real](#2-painel-pedagógico-em-tempo-real)
  - [3. Visualizador de Porcentagem & Base 100](#3-visualizador-de-porcentagem--base-100)
  - [4. Módulo de Mini-Desafios e Gamificação](#4-módulo-de-mini-desafios-e-gamificação)
  - [5. Fita de Papel (Histórico de Operações)](#5-fita-de-papel-histórico-de-operações)
- [Design UI/UX e Identidade Visual](#-design-uiux-e-identidade-visual)
- [Estrutura de Pastas e Arquivos](#-estrutura-de-pastas-e-arquivos)
- [Arquitetura de Dados e Fluxo do Sistema](#-arquitetura-de-dados-e-fluxo-do-sistema)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Como Executar o Projeto Localmente](#-como-executar-o-projeto-localmente)
- [Critérios e Roteiro de Testes](#-critérios-e-roteiro-de-testes)
- [Licença](#-licença)

---

## 🎯 Visão Geral

A **Calculadora Educacional de Escritório** combina a ergonomia táctil clássica das calculadoras de mesa profissionais (com visor LCD duplo, célula solar estilizada e teclado responsivo) com um **assistente didático instantâneo**. Em vez de entregar apenas o resultado numérico como uma "caixa-preta", o sistema decompõe a operação matemática realizada, define os nomes formais de cada termo (ex.: *minuendo*, *subtraendo*, *fatores*, *quociente*) e fornece exemplos contextualizados com situações do cotidiano (compras, troco, economia no cofrinho e partilha).

---

## 💡 Problema que o Projeto Resolve

1. **Abstração da Porcentagem**: Alunos do ensino fundamental frequentemente memorizam regras mecânicas de porcentagem sem compreender que $\%$ significa uma fração com denominador 100 ($x/100$) e sua relação com o número decimal correspondente.
2. **Confusão entre Taxa e Desconto**: Dificuldade prática em diferenciar "calcular $20\%$ de um valor" e "aplicar $20\%$ de desconto comercial sobre um produto".
3. **Falta de Sentido Prático**: Alunos costumam perguntar *"onde vou usar isso?"*. O app conecta cada uma das cinco operações a cenários reais da vida de um jovem estudante.
4. **Tratamento Pedagógico de Casos Especiais**: Em vez de disparar mensagens de erro crípticas na divisão por zero, a calculadora exibe o estado *"Indeterminado"* e ensina por que essa operação é matematicamente impossível.

---

## 👥 Público-Alvo

- **Estudantes do Ensino Fundamental I e II (10 a 14 anos)**: Consolidação da base aritmética, frações, decimais e porcentagem.
- **Professores de Matemática**: Recurso visual dinâmico para demonstrações em lousas digitais ou computadores de sala de aula.
- **Pais e Tutores**: Ferramenta de apoio para lições de casa e reforço escolar.

---

## 🚀 Recursos e Funcionalidades

### 1. Calculadora de Mesa com Estilo de Escritório
- Teclas táteis para numerais de **0 a 9**, ponto decimal (`,`), inversão de sinal ($\pm$) e botões de limpeza total (**AC**) e parcial (**CE**).
- **Visor LCD duplo de alto contraste**:
  - Sub-visor superior: exibe a expressão matemática e o operador ativo.
  - Visor principal: numerais em tamanho ampliado com pontuação de milhar e separador decimal no padrão brasileiro (`pt-BR`).
- **Suporte completo ao teclado físico do computador**:
  - Números `0` a `9`, operadores `+`, `-`, `*`, `/`, `%`, confirmação via `Enter` ou `=`, correção via `Backspace` e limpeza via `Esc`.
- **Efeito sonoro opcional**: sintetizador mecânico de clique de teclas através da Web Audio API nativa.

### 2. Painel Pedagógico em Tempo Real
- Atualização dinâmica a cada tecla pressionada.
- Decomposição das 5 operações:
  - ➕ **Adição**: Ideia de soma e agrupamento de parcelas.
  - ➖ **Subtração**: Cálculo de diferença, troco e conceitos de números inteiros negativos.
  - ✖️ **Multiplicação**: Soma de parcelas iguais repetidas e cálculo de áreas/fileiras.
  - ➗ **Divisão**: Repartição equitativa com aviso especial para divisão por zero.
  - 🏷️ **Porcentagem**: Fração base 100, simplificação irredutível e valor decimal.

### 3. Visualizador de Porcentagem & Base 100
- **Grade 10x10 com 100 blocos interativos**: visualização gráfica imediata do preenchimento da taxa percentual.
- **Botões rápidos de atalho pedagógico**: $10\%$, $20\%$, $25\%$, $50\%$ e $75\%$.
- **Simulador Comercial**: demonstração comparativa do valor do desconto (preço final reduzido) versus acréscimo/juros sobre o valor base.

### 4. Módulo de Mini-Desafios e Gamificação
- Perguntas rápidas contextualizadas divididas por categorias (*Porcentagem*, *Adição/Subtração* e *Multiplicação/Divisão*).
- Feedback imediato com explicação matemática detalhada.
- Botão **"Carregar cálculo na Calculadora de Mesa"**: transfere os operandos do problema diretamente para as teclas da calculadora.
- Contador de sequência de acertos (*Streak* com ícone de troféu e fogo).

### 5. Fita de Papel (Histórico de Operações)
- Simula a fita de bobina das calculadoras de escritório clássicas.
- Registra as últimas operações efetuadas com carimbo de hora e expressão completa.

---

## 🎨 Design UI/UX e Identidade Visual

O design foi concebido com rigor arquitetural e livre de excessos visuais ("anti-AI slop"):

- **Paleta de Cores**:
  - 🔵 **Azul Primário (`#1D4ED8` / `#2563EB`)**: Teclas de operadores de destaque (`=`, `%`), cabeçalhos didáticos, botões de ação e estados ativos.
  - ⚪ **Branco Puro (`#FFFFFF`)**: Superfície das teclas numéricas volumétricas, fundos de cartões pedagógicos e legibilidade.
  - ⚫ **Preto / Azul Noturno (`#0F172A` / `#020617`)**: Chassi estrutural da calculadora, contraste do visor LCD e tipografia principal.
  - 🧊 **Azul Gelo Suave (`#F8FAFC` / `#EFF6FF`)**: Fundo de tela neutro de alta absorção visual.
- **Tipografia**:
  - *Display e Interface*: `Plus Jakarta Sans` (geométrica, moderna e legível).
  - *Dígitos e Visor LCD*: `JetBrains Mono` com números tabulares (`font-feature-settings: "tnum"`).
- **Acessibilidade**:
  - Conformidade com taxas de contraste WCAG AA.
  - Área de toque ampliada nos botões da calculadora para uso em tablets e dispositivos móveis.

---

## 📂 Estrutura de Pastas e Arquivos

```text
├── index.html                   # Entry point HTML com metatags SEO e importação de fontes
├── metadata.json                # Metadados e permissões da aplicação no AI Studio
├── package.json                 # Dependências e scripts do ecossistema Node/Vite
├── tsconfig.json                # Configuração do TypeScript em modo estrito
├── vite.config.ts               # Configuração do bundler Vite com plugins React e Tailwind
│
├── src/
│   ├── main.tsx                 # Ponto de inicialização do React 19 no elemento #root
│   ├── index.css                # Estilos globais Tailwind CSS v4, JetBrains Mono e scrollbars
│   ├── App.tsx                  # Componente raiz, layout em 2 colunas, navegação e modais
│   │
│   ├── types/
│   │   └── calculator.ts        # Interfaces TypeScript para estado, histórico, pedagogia e quiz
│   │
│   ├── utils/
│   │   ├── mathEngine.ts        # Núcleo de cálculo aritmético, arredondamento e frações (MDC)
│   │   ├── pedagogyEngine.ts    # Motor de geração de explicações textuais e exemplos práticos
│   │   └── challengeEngine.ts   # Banco de mini-desafios matemáticos e lógica de perguntas
│   │
│   └── components/
│       ├── OfficeCalculator.tsx    # Calculadora de mesa: chassi, visor duplo, teclas e teclado físico
│       ├── EducationalPanel.tsx    # Painel lateral com abas de explicação, desafios e fita de papel
│       └── PercentageVisualizer.tsx# Visualizador da grade centesimal (100 blocos) e frações
```

---

## ⚙️ Arquitetura de Dados e Fluxo do Sistema

```
                      ┌───────────────────────────────────────┐
                      │        Dispositivo do Usuário         │
                      │  (Teclado Físico ou Clique em Botões) │
                      └──────────────────┬────────────────────┘
                                         │
                                         ▼
                      ┌───────────────────────────────────────┐
                      │          OfficeCalculator.tsx         │
                      │  - Captura dígitos (0-9) e operadores │
                      │  - Sincroniza áudio mecânico de clique│
                      │  - Mantém pilha de expressão e visor  │
                      └──────────────────┬────────────────────┘
                                         │
                   Dispara evento        │  Executa cálculo
                onSelectOperation        │  aritmético
                         │               │
                         ▼               ▼
        ┌─────────────────────────┐   ┌──────────────────────────┐
        │    pedagogyEngine.ts    │   │      mathEngine.ts       │
        │ - Gera passo a passo    │   │ - Cálculo IEEE-754 seguro│
        │ - Decompõe termos       │   │ - Simplificação de fração│
        │ - Contextualiza exemplos│   │ - Formatação brasileira  │
        └────────────┬────────────┘   └──────────────────────────┘
                     │
                     ▼
        ┌─────────────────────────┐
        │  EducationalPanel.tsx   │
        │ ├─ PercentageVisualizer │
        │ ├─ Quiz & Desafios      │
        │ └─ Fita de Papel        │
        └─────────────────────────┘
```

---

## 🛠️ Tecnologias Utilizadas

- **Linguagem & Runtime**: [TypeScript](https://www.typescriptlang.org/) (ES2022)
- **Biblioteca de Interface**: [React 19](https://react.dev/)
- **Ferramenta de Build & Dev Server**: [Vite 8](https://vitejs.dev/)
- **Estilização & Design**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Ícones**: [Lucide React](https://lucide.dev/)
- **Motor de Áudio**: Web Audio API (sintetizador de oscilador nativo)
- **Internacionalização Numérica**: `Intl.NumberFormat` nativo (`pt-BR`)

---

## 💻 Como Executar o Projeto Localmente

### Pré-requisitos
- **Node.js** (versão 18 ou superior)
- Gerenciador de pacotes **npm** ou **yarn**

### Passo a Passo

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/calculadora-educacional.git
   cd calculadora-educacional
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

4. **Acesse a aplicação:**
   Abra o navegador em `http://localhost:3000` (ou na porta indicada no seu terminal).

5. **Verificação de tipos e compilação:**
   ```bash
   npm run lint
   npm run build
   ```

---

## 🧪 Critérios e Roteiro de Testes

| ID | Cenário | Ação de Teste | Resultado Esperado |
|:---:|:---|:---|:---|
| **CT01** | Adição básica | Digitar `12 + 8 =` | Visor exibe `20`. O painel direito explica o conceito de parcelas e soma com exemplo prático. |
| **CT02** | Subtração com saldo negativo | Digitar `15 - 20 =` | Visor exibe `-5`. A explicação aborda números inteiros negativos e saldo. |
| **CT03** | Multiplicação decimal | Digitar `4.5 × 2 =` | Visor exibe `9`. O painel detalha a ideia de repetição de parcelas iguais. |
| **CT04** | Divisão por zero | Digitar `8 ÷ 0 =` | Visor exibe `Indeterminado`. O painel explica didaticamente a impossibilidade matemática. |
| **CT05** | Porcentagem direta | Digitar `200 × 15 %` | Visor exibe `30`. A grade de 100 blocos ilumina 15 blocos e exibe a fração $15/100$ simplificada ($3/20$). |
| **CT06** | Desconto comercial | Digitar `100 - 20 % =` | Visor exibe `80`. O simulador comercial demonstra economia de R$ 20 e preço final de R$ 80. |
| **CT07** | Mini-Desafios integrados | Clicar em "Carregar na Calculadora" | Os números da pergunta são transferidos automaticamente para o display da calculadora de mesa. |
| **CT08** | Teclado Físico | Pressionar teclas numéricas e operadores | Feedback imediato no visor com indicação visual da tecla pressionada. |

---

## 📄 Licença

Este projeto é disponibilizado sob a licença [Apache-2.0](LICENSE).
Sinta-se livre para utilizar, modificar e expandir para fins pedagógicos em escolas, projetos sociais e instituições de ensino.
