# Calculadora Educacional de Escritório (Ensino Fundamental)

Aplicação web educacional interativa desenhada no formato ergonômico de uma **calculadora clássica de escritório**, combinada com um **painel pedagógico inteligente à direita**. O objetivo é transformar cálculos matemáticos básicos (adição, subtração, multiplicação, divisão e porcentagem) em experiências visuais compreensíveis para estudantes dos anos iniciais e finais do ensino fundamental, com ênfase no entendimento real da porcentagem (fração centesimal e descontos do dia a dia) e mini-desafios de fixação.

---

## Decisões Confirmadas com o Usuário

> [!IMPORTANT]
> As diretrizes pedagógicas e técnicas abaixo foram alinhadas e incorporadas:
> - **Abordagem da Porcentagem**: Demonstração de passos visuais intuitivos (base 100, representação fracionária $x/100$ e cálculo de desconto/acréscimo prático real).
> - **Interatividade do Painel Direito**: Alternância entre explicação pedagógica em tempo real do cálculo atual e aba de **Mini-desafios e perguntas rápidas** para fixação autônoma do estudante.
> - **Integração de Linguagem**: Foco exclusivamente didático e matemático na interface, sem expor código ou comandos de programação na tela, garantindo linguagem acolhedora para crianças e adolescentes.
> - **Identidade Visual**: Paleta rigorosa em **Azul, Branco e Preto**, simulando o chassi e as teclas táteis de uma calculadora de mesa de escritório moderna e acessível.

---

## 1. Problema que o Aplicativo Resolve & Público Principal

### 1.1. O Problema que o Aplicativo Resolve
1. **Dificuldade na transição entre o cálculo mecânico e a compreensão conceitual**: Estudantes do ensino fundamental frequentemente usam calculadoras como caixas-pretas: obtêm o número final, mas não compreendem o que a operação fez matematicamente (ex.: por que multiplicar por $0{,}20$ equivale a $20\%$, ou por que dividir por zero não é possível).
2. **Abstração confusa da Porcentagem**: O símbolo `%` é um dos tópicos mais desafiadores da matemática básica. Alunos costumam confundir "porcentagem como taxa" ($20\%$ de $80$) com "porcentagem como desconto comercial" ($80 - 20\%$). O app desmistifica isso transformando o cálculo em representação visual proporcional de 100 partes.
3. **Falta de contexto prático**: Alunos perguntam "onde uso isso?". O aplicativo contextualiza cada operação com 1 a 2 exemplos concretos do cotidiano (compras, mesada, divisão de lanches, medições).
4. **Erros de entrada e falta de controle**: Calculadoras comuns não exibem a fita de histórico nem a expressão anterior de maneira compreensível. O painel estilo escritório com display duplo dá clareza total.

### 1.2. Público Principal
- **Alunos do Ensino Fundamental I e II (6º ao 9º ano, 10 a 14 anos)**: Estudantes aprendendo frações, decimais, operações com números naturais/racionais e porcentagem básica.
- **Professores de Matemática e Pais/Tutores**: Instrumento de apoio em sala de aula ou tarefas de casa para demonstrar a anatomia de cada conta.
- **Estudantes em fase de reforço escolar**: Jovens que necessitam de reforço visual e gamificação leve (mini-desafios) para consolidar a base aritmética.

---

## 2. Requisitos Funcionais

### RF01. Entrada Numérica e Teclado Tátil (0 a 9)
- Teclado virtual simulando teclas volumétricas de calculadora de escritório (números de 0 a 9, ponto decimal e troca de sinal $\pm$).
- Suporte completo a atalhos de teclado físico (teclas 0-9, `+`, `-`, `*`, `/`, `%`, `Enter`, `Backspace`, `Escape`).
- Tecla `C` (Clear/Limpar tudo) e `CE` (Clear Entry/Limpar entrada atual).

### RF02. As Cinco Operações Matemáticas Fundamentais
- **Adição ($+$)**: Soma com explicação de agrupamento/adição de parcelas e total.
- **Subtração ($-$)**: Diferença, ideia de "quanto sobra" ou "quanto falta".
- **Multiplicação ($\times$)**: Ideia de parcelas repetidas ou área geométrica.
- **Divisão ($\div$)**: Ideia de repartição em partes iguais; tratamento pedagógico explícito para divisão por zero ("Não é possível dividir por zero").
- **Porcentagem ($\%$)**:
  - Modo 1: Cálculo direto de parte centesimal ($A \times B\% \to \frac{B}{100} \text{ de } A$).
  - Modo 2: Aplicação direta de acréscimo e desconto ($A + B\%$ ou $A - B\%$, cálculo clássico de escritório).

### RF03. Painel Principal (Display de Escritório)
- Visor duplo no estilo LCD/VFD clássico de escritório:
  - **Sub-linha superior**: Mostra a expressão em andamento (ex: `150 × 20%`).
  - **Linha primária com dígitos grandes e nítidos**: Exibe o valor de entrada atual ou o resultado final com formatação de milhar e precisão decimal ajustada.
  - Indicadores de status da operação ativa (`+`, `-`, `×`, `÷`, `%`).
  - Opção de visualizar a "fita de papel" (histórico das últimas operações realizadas na sessão).

### RF04. Painel Lateral Educativo (Lado Direito)
- **Aba 1: "Como Funciona o Cálculo" (Tempo Real)**:
  - Explicação resumida da operação ativa em linguagem amigável para o estudante.
  - Passo a passo visual (ex.: para $25\%$, exibe $\frac{25}{100} = 0{,}25$).
  - Barra visual de proporção (100 blocos/barra percentual mostrando a fração preenchida).
  - 1 a 2 exemplos práticos do cotidiano (ex.: "Um jogo de R$ 100 com 20% de desconto fica R$ 80").
  - Termos matemáticos destacados sem jargões desnecessários: *Parcela, Minuendo, Subtraendo, Fatores, Produto, Dividendo, Divisor, Quociente*.
- **Aba 2: "Mini-Desafios" (Perguntas Rápidas)**:
  - Perguntas práticas geradas dinamicamente com base nas 5 operações (fáceis e intermediárias).
  - O aluno pode resolver direto na calculadora ou selecionar a alternativa correta.
  - Feedback imediato com comemoração e explicação do porquê da resposta.
  - Contador de acertos consecutivos para estímulo positivo.

---

## 3. Design de UI/UX & Paleta Azul, Branco e Preto

### 3.1. Direção Estética
- **Conceito**: *Modern Office Precision*. Combina a sensação tátil confiável de uma calculadora de mesa profissional (como as famosas calculadoras de escritório japonesas) com o frescor de uma interface web educacional contemporânea.
- **Paleta de Cores Rigorosa**:
  - **Azul Primário (`#1D4ED8` / `#2563EB`)**: Teclas de operadores de destaque (`=`, `%`), cabeçalhos informativos, barras de progresso e botões de confirmação.
  - **Azul Noturno / Marinho Profundo (`#0F172A` / `#1E293B`)**: Chassi estrutural do visor LCD e fundo de alto contraste para os dígitos de alta legibilidade.
  - **Branco Puro (`#FFFFFF`)**: Superfície do corpo principal da calculadora, teclas numéricas com relevo suave e fundo dos cartões explicativos.
  - **Preto e Cinza Escuro (`#0F172A` / `#334155`)**: Tipografia de títulos, numerais gravados nas teclas e bordas estruturais finas.
  - **Azul Gelo Suave (`#EFF6FF`)**: Superfície de fundo geral da página para destacar os módulos em primeiro plano.

### 3.2. Ergonomia e Disposição Espacial (Split Layout)
- **Container Desktop (1440px / centralizado)**:
  - **Lado Esquerdo**: Corpo da Calculadora de Escritório com visor angular inclinado, pés de borracha estilizados, teclado numérico ergonômico 4x5 e fita de papel retrátil.
  - **Lado Direito**: Painel de Aprendizado com cabeçalho limpo, seletor de abas ("Explicador" / "Desafios"), área de decomposição matemática da operação e cartões de aplicação prática.

---

## 4. Critérios para Testar a Primeira Versão (Plano de Testes)

| ID | Área | Caso de Teste | Ação Executada | Resultado Esperado |
|---|---|---|---|---|
| **CT01** | Operações Básicas | Adição simples e acumulada | Pressionar `12 + 8 =` | Visor exibe `20`; painel direito explica o conceito de parcelas e soma com exemplo prático. |
| **CT02** | Operações Básicas | Subtração com valor negativo | Pressionar `15 - 20 =` | Visor exibe `-5`; explicação aborda números inteiros/saldo negativo. |
| **CT03** | Operações Básicas | Multiplicação decimal | Pressionar `4.5 × 2 =` | Visor exibe `9`; painel explica multiplicação como adição repetida. |
| **CT04** | Operações Básicas | Divisão com decimais | Pressionar `10 ÷ 4 =` | Visor exibe `2.5`; explicação divide o conceito em partes iguais. |
| **CT05** | Caso Limite | Divisão por Zero | Pressionar `8 ÷ 0 =` | Visor exibe aviso amigável (`Indeterminado`); painel explica por que não é possível dividir por zero na matemática. |
| **CT06** | Porcentagem | Cálculo de Porcentagem Simples | Digitar `200 × 15 %` | Visor calcula `30`; painel exibe a fração $\frac{15}{100}$ aplicada a $200$ e a barra percentual preenchida até $15\%$. |
| **CT07** | Porcentagem | Desconto Comercial | Digitar `100 - 20 % =` | Visor exibe `80`; painel contextualiza: "Preço original: R$ 100, Desconto: R$ 20, Preço final: R$ 80". |
| **CT08** | Interatividade | Mini-Desafio Educativo | Clicar em "Novo Desafio" na aba direita | Apresenta uma pergunta do tipo: "Se uma pizza tem 8 fatias e você comeu 2, qual a porcentagem?"; ao responder, fornece feedback imediato. |
| **CT09** | Acessibilidade | Teclado Físico | Digitar números e operadores pelo teclado físico do computador | Teclas virtuais mostram feedback visual de pressão e valores são inseridos instantaneamente. |
| **CT10** | Design UI/UX | Contraste e Paleta Azul/Branco/Preto | Inspecionar elementos em telas normais e móveis | Cores estritamente alinhadas, legibilidade WCAG AA e layout sem quebras em diferentes resoluções. |

---

## 5. Arquitetura Técnica do Frontend

```
┌────────────────────────────────────────────────────────────────────────┐
│                        App Container (Layout)                         │
│   ┌──────────────────────────────┐  ┌───────────────────────────────┐ │
│   │   Calculadora de Mesa        │  │   Painel Educativo Direito    │ │
│   │   (Office Chassis)           │  │   (Concept & Challenges)      │ │
│   │ ┌──────────────────────────┐ │  │ ┌───────────────────────────┐ │ │
│   │ │ Dual LCD Display         │ │  │ │ Abas: Explicação | Desafio│ │ │
│   │ │ (Histórico + Dígitos)    │ │  │ ├───────────────────────────┤ │ │
│   │ ├──────────────────────────┤ │  │ │ Decomposição Fracionária  │ │ │
│   │ │ Teclado Tátil Numérico   │ │  │ │ Barra Visual de Porcent.  │ │ │
│   │ │ [0-9, ., C, CE, ±]       │ │  │ │ Exemplos Práticos do Real │ │ │
│   │ ├──────────────────────────┤ │  │ │ Mini-Quiz Interativo      │ │ │
│   │ │ Teclas Operadores (+-×÷%)│ │  │ └───────────────────────────┘ │ │
│   │ └──────────────────────────┘ │  └───────────────────────────────┘ │
│   └──────────────────────────────┘                                    │
└────────────────────────────────────────────────────────────────────────┘
```

- **Estado Centralizado (`useCalculatorState`)**:
  - Armazena buffer de entrada, acumulador anterior, operador selecionado, histórico recente e status de erro.
  - Emite eventos de cálculo que alimentam o motor didático em sincronia instantânea.
- **Motor Pedagógico (`pedagogyEngine.ts`)**:
  - Gera as explicações textuais, etapas da fração, representação decimal e os exemplos da vida real de acordo com a operação e os números digitados.
- **Gerador de Desafios (`challengeEngine.ts`)**:
  - Cria problemas contextualizados por nível de dificuldade para incentivar a prática do estudante.
