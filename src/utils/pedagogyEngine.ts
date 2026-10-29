import { Operator, PedagogyData, PercentageBreakdown } from '../types/calculator';
import { simplifyFraction } from './mathEngine';

/**
 * Retorna o conteúdo didático para o estado inicial ou quando o estudante
 * apenas digitou um número e ainda não escolheu um operador.
 */
export function getIdlePedagogy(enteredNumber: number = 0): PedagogyData {
  if (enteredNumber !== 0) {
    return {
      operationType: 'idle',
      title: `Valor Digitado: ${enteredNumber}`,
      symbol: '#',
      summary: `Você inseriu o número ${enteredNumber}. Agora selecione uma das 5 operações no teclado: Adição (+), Subtração (−), Multiplicação (×), Divisão (÷) ou Porcentagem (%).`,
      stepByStep: [
        `1. Primeiro valor registrado na memória: ${enteredNumber}.`,
        '2. Pressione uma tecla de operação (+, -, ×, ÷ ou %).',
        '3. Digite o próximo valor e aperte = para ver a resolução completa e os exemplos!',
      ],
      terms: [
        { name: 'Valor de Entrada', value: String(enteredNumber), role: 'O primeiro número que participará da operação matemática.' },
        { name: 'Sistema Decimal', value: 'Base 10', role: 'Composto pelos algarismos 0, 1, 2, 3, 4, 5, 6, 7, 8 e 9.' },
      ],
      examples: [
        {
          title: 'Próxima Ação Sugerida',
          scenario: `Experimente clicar na tecla % para calcular uma porcentagem de ${enteredNumber}, ou pressione + para somar.`,
          calc: `${enteredNumber} + [próximo número] =`,
          result: 'Aguardando sua escolha',
          practicalInsight: 'Dica: Você também pode usar as teclas do teclado do seu computador!',
        },
      ],
    };
  }

  return {
    operationType: 'idle',
    title: 'Pronto para Calcular!',
    symbol: '🔢',
    summary: 'Digite os números e selecione uma operação matemática para ver o cálculo explicado passo a passo com exemplos do seu dia a dia.',
    stepByStep: [
      '1. Digite o primeiro número no teclado da calculadora de escritório.',
      '2. Pressione a operação desejada (+, -, ×, ÷ ou %).',
      '3. Digite o segundo valor e aperte = para obter a resposta e a explicação.',
    ],
    terms: [
      { name: 'Números', value: '0 a 9', role: 'Dígitos fundamentais do nosso sistema de numeração decimal.' },
      { name: 'Display', value: 'Visor Duplo', role: 'Mostra a expressão em cima e o valor atual em destaque.' },
    ],
    examples: [
      {
        title: 'Dica de Porcentagem',
        scenario: 'Saber porcentagem ajuda você a calcular descontos em lojas e entender notas escolares.',
        calc: '50% de 100 = 50',
        result: '50 (a metade exata de 100!)',
        practicalInsight: 'Porcentagem sempre significa "tantas partes de um grupo de 100".',
      },
    ],
  };
}

/**
 * Motor pedagógico que traduz os cálculos matemáticos em explicações claras,
 * amigáveis e contextuais para alunos do Ensino Fundamental.
 */
export function generatePedagogyContent(
  firstOperand: number | null,
  operator: Operator,
  secondOperand: number,
  calculatedResult: number | null,
  isPercentMode: boolean = false
): PedagogyData {
  // Se não houver operador ativo, retorna estado didático neutro (sem recursão!)
  if (!operator) {
    const val = firstOperand !== null ? firstOperand : secondOperand;
    return getIdlePedagogy(val);
  }

  // Se houver porcentagem ativa ou operação com porcentagem
  if (operator === '%' || isPercentMode) {
    const base = firstOperand !== null ? firstOperand : 100;
    const rate = secondOperand;
    const portion = (base * rate) / 100;
    const simplified = simplifyFraction(rate, 100);
    const decimal = rate / 100;

    const breakdown: PercentageBreakdown = {
      baseValue: base,
      rateValue: rate,
      fractionText: `${rate}/100`,
      simplifiedFraction: simplified,
      decimalText: decimal.toLocaleString('pt-BR', { maximumFractionDigits: 4 }),
      portionResult: portion,
      discountResult: base - portion,
      increaseResult: base + portion,
    };

    return {
      operationType: 'percentage',
      title: `Porcentagem (${rate}%)`,
      symbol: '%',
      summary: `Porcentagem significa literalmente "por cento", ou seja, quantas partes retiramos de um total dividido em 100 partes iguais.`,
      stepByStep: [
        `1. O símbolo % indica uma fração com denominador 100: ${rate}% = ${rate}/100.`,
        `2. Na forma decimal, dividimos ${rate} por 100: obtemos ${breakdown.decimalText}.`,
        `3. Fração irredutível simplificada: ${rate}/100 equivale a ${simplified}.`,
        `4. Aplicando ao valor base de ${base}: ${base} × ${breakdown.decimalText} = ${portion.toLocaleString('pt-BR')}.`,
      ],
      terms: [
        { name: 'Valor Principal (Base)', value: String(base), role: 'O número total que representa 100% da quantidade.' },
        { name: 'Taxa Percentual', value: `${rate}%`, role: 'A quantidade de partes de 100 que estamos considerando.' },
        { name: 'Porcentagem (Valor Obtido)', value: portion.toLocaleString('pt-BR'), role: 'O resultado em quantidade real correspondente à taxa.' },
      ],
      examples: [
        {
          title: 'Desconto em Loja de Roupas',
          scenario: `Uma camiseta custa R$ ${base}. Na promoção especial de verão, ela tem ${rate}% de desconto.`,
          calc: `R$ ${base} - R$ ${portion.toLocaleString('pt-BR')}`,
          result: `R$ ${(base - portion).toLocaleString('pt-BR')}`,
          practicalInsight: `Você economiza R$ ${portion.toLocaleString('pt-BR')} e paga apenas o valor com desconto!`,
        },
        {
          title: 'Bateria do Celular ou Tablet',
          scenario: `A bateria tem capacidade total de ${base} minutos de jogo e está com ${rate}% de carga restante.`,
          calc: `${base} × ${rate}%`,
          result: `${portion.toLocaleString('pt-BR')} minutos restantes`,
          practicalInsight: `Se a barra de 100% tiver ${rate}% preenchida, ainda resta esse tempo antes de recarregar.`,
        },
      ],
      percentageBreakdown: breakdown,
    };
  }

  // Operações tradicionais: Adição, Subtração, Multiplicação, Divisão
  const valA = firstOperand ?? 0;
  const valB = secondOperand;
  const res = calculatedResult !== null ? calculatedResult : valA;

  switch (operator) {
    case '+':
      return {
        operationType: 'addition',
        title: 'Adição (Soma)',
        symbol: '+',
        summary: 'A adição reúne, junta ou acrescenta duas ou mais quantidades para formar um novo total.',
        stepByStep: [
          `1. Identificamos a primeira parcela: ${valA}.`,
          `2. Acrescentamos a segunda parcela: ${valB}.`,
          `3. Juntando as quantidades: ${valA} + ${valB} = ${res}.`,
        ],
        terms: [
          { name: '1ª Parcela', value: String(valA), role: 'Primeira quantidade que será agrupada.' },
          { name: '2ª Parcela', value: String(valB), role: 'Segunda quantidade a ser somada.' },
          { name: 'Total ou Soma', value: String(res), role: 'O resultado final obtido após juntar tudo.' },
        ],
        examples: [
          {
            title: 'Álbum de Figurinhas',
            scenario: `Você já tinha ${valA} figurinhas coladas e ganhou mais ${valB} figurinhas de presente em um pacote.`,
            calc: `${valA} + ${valB}`,
            result: `${res} figurinhas no total`,
            practicalInsight: 'A ordem das parcelas não altera a soma (propriedade comutativa: 5 + 3 é igual a 3 + 5).',
          },
          {
            title: 'Economias do Cofrinho',
            scenario: `Você guardou R$ ${valA} na semana passada e adicionou R$ ${valB} hoje.`,
            calc: `R$ ${valA} + R$ ${valB}`,
            result: `R$ ${res} guardados`,
            practicalInsight: 'A soma mostra o crescimento acumulado das suas economias.',
          },
        ],
      };

    case '-':
      return {
        operationType: 'subtraction',
        title: 'Subtração (Diferença)',
        symbol: '−',
        summary: 'A subtração calcula a diferença entre dois valores, ou quanto resta depois de retirar uma quantidade de outra.',
        stepByStep: [
          `1. Começamos com o valor inicial (Minuendo): ${valA}.`,
          `2. Subtraímos a quantidade que será retirada (Subtraendo): ${valB}.`,
          `3. Calculamos o que restou (Diferença): ${valA} - ${valB} = ${res}.`,
        ],
        terms: [
          { name: 'Minuendo', value: String(valA), role: 'O número de onde se retira uma quantidade.' },
          { name: 'Subtraendo', value: String(valB), role: 'A quantidade que é subtraída.' },
          { name: 'Resto ou Diferença', value: String(res), role: 'O valor que sobra após a operação.' },
        ],
        examples: [
          {
            title: 'Troco na Cantina da Escola',
            scenario: `Você pagou um lanche com uma nota de R$ ${valA} e o lanche custou R$ ${valB}.`,
            calc: `R$ ${valA} - R$ ${valB}`,
            result: `R$ ${res} de troco`,
            practicalInsight: 'O troco é a diferença exata entre o que você entregou e o preço do item.',
          },
          {
            title: 'Páginas de Leitura',
            scenario: `O livro tem ${valA} páginas e você já leu ${valB} páginas.`,
            calc: `${valA} - ${valB}`,
            result: `${res} páginas restantes`,
            practicalInsight: 'A subtração ajuda a medir metas e quanto falta para concluir.',
          },
        ],
      };

    case '*':
      return {
        operationType: 'multiplication',
        title: 'Multiplicação (Produto)',
        symbol: '×',
        summary: 'A multiplicação é uma forma rápida de somar parcelas iguais repetidas vezes, ou calcular áreas.',
        stepByStep: [
          `1. Pegamos a quantidade base: ${valA}.`,
          `2. Repetimos essa quantidade ${valB} vezes consecutivas.`,
          `3. Realizamos o produto: ${valA} × ${valB} = ${res}.`,
        ],
        terms: [
          { name: '1º Fator (Multiplicando)', value: String(valA), role: 'A quantidade de cada grupo.' },
          { name: '2º Fator (Multiplicador)', value: String(valB), role: 'O número de grupos ou vezes que repetimos.' },
          { name: 'Produto', value: String(res), role: 'O resultado final da multiplicação.' },
        ],
        examples: [
          {
            title: 'Caixas de Lápis de Cor',
            scenario: `Você tem ${valB} caixas de lápis, e dentro de cada caixa há ${valA} lápis de cor novinhos.`,
            calc: `${valA} lápis × ${valB} caixas`,
            result: `${res} lápis no total`,
            practicalInsight: `Em vez de somar ${valA} várias vezes, multiplicamos para economizar tempo!`,
          },
          {
            title: 'Fileiras no Cinema ou Teatro',
            scenario: `A sala de projeção possui ${valB} fileiras com ${valA} poltronas em cada fileira.`,
            calc: `${valA} poltronas × ${valB} fileiras`,
            result: `${res} lugares no total`,
            practicalInsight: 'A ordem dos fatores não altera o produto: 4 × 6 é exatamente igual a 6 × 4.',
          },
        ],
      };

    case '/':
      if (valB === 0) {
        return {
          operationType: 'division',
          title: 'Divisão por Zero (Indeterminado)',
          symbol: '÷',
          summary: 'Atenção: Na matemática, não é possível dividir nenhum número por zero!',
          stepByStep: [
            `1. Dividir significa repartir uma quantidade em grupos existentes.`,
            `2. Se não há nenhum grupo ou pessoa (0 partes), a divisão não pode acontecer.`,
            `3. Por isso, as calculadoras e os matemáticos consideram essa conta como "Indeterminada" ou Erro.`,
          ],
          terms: [
            { name: 'Dividendo', value: String(valA), role: 'O total que gostaríamos de repartir.' },
            { name: 'Divisor', value: '0', role: 'Incorreto: o divisor precisa ser diferente de zero.' },
          ],
          examples: [
            {
              title: 'Exemplo das Maçãs',
              scenario: `Imagine que você tem ${valA} maçãs e quer repartir entre zero amigos (ninguém).`,
              calc: `${valA} ÷ 0`,
              result: 'Impossível de realizar',
              practicalInsight: 'Para haver divisão, sempre deve existir ao menos 1 pessoa ou caixa para receber.',
            },
          ],
        };
      }

      return {
        operationType: 'division',
        title: 'Divisão (Quociente)',
        symbol: '÷',
        summary: 'A divisão reparte uma quantidade em partes rigorosamente iguais, ou descobre quantas vezes um valor cabe em outro.',
        stepByStep: [
          `1. O valor total a ser distribuído (Dividendo) é ${valA}.`,
          `2. O número de partes iguais que vamos formar (Divisor) é ${valB}.`,
          `3. Cada parte recebe exatamente (Quociente): ${valA} ÷ ${valB} = ${res}.`,
        ],
        terms: [
          { name: 'Dividendo', value: String(valA), role: 'A quantidade total que será distribuída.' },
          { name: 'Divisor', value: String(valB), role: 'Em quantas partes iguais estamos dividindo.' },
          { name: 'Quociente', value: String(res), role: 'Quanto cada parte recebeu.' },
        ],
        examples: [
          {
            title: 'Divisão de Bombons Entre Amigos',
            scenario: `Você comprou um saco com ${valA} bombons e vai dividir igualmente com ${valB} amigos.`,
            calc: `${valA} ÷ ${valB}`,
            result: `${res} bombons para cada um`,
            practicalInsight: 'A divisão é a operação inversa da multiplicação: se 10 ÷ 2 = 5, então 5 × 2 = 10!',
          },
          {
            title: 'Equipes na Aula de Educação Física',
            scenario: `A professora tem ${valA} alunos na turma e quer montar grupos de ${valB} integrantes.`,
            calc: `${valA} ÷ ${valB}`,
            result: `${res} grupos formados`,
            practicalInsight: 'Distribuição equitativa garante que todos os grupos tenham a mesma quantidade.',
          },
        ],
      };

    default:
      return getIdlePedagogy(secondOperand);
  }
}
