import { Operator } from '../types/calculator';

/**
 * Utilitários matemáticos com controle de precisão e arredondamento para a Calculadora
 */

export function parseNumber(val: string): number {
  if (!val || val === '-' || val === '.') return 0;
  // Converte vírgula para ponto se houver
  const sanitized = val.replace(',', '.');
  const num = parseFloat(sanitized);
  return isNaN(num) ? 0 : num;
}

export function formatDisplayNumber(val: string | number, maxDecimals: number = 8): string {
  if (typeof val === 'string') {
    if (val === '' || val === '0') return '0';
    if (val === '-') return '-';
    if (val.endsWith('.')) {
      const numPart = val.slice(0, -1);
      return `${formatDisplayNumber(numPart, maxDecimals)},`;
    }
    if (val.includes('.')) {
      const [intPart, decPart] = val.split('.');
      const formattedInt = new Intl.NumberFormat('pt-BR').format(parseNumber(intPart));
      return `${formattedInt},${decPart.slice(0, maxDecimals)}`;
    }
    const num = parseNumber(val);
    return new Intl.NumberFormat('pt-BR').format(num);
  }

  if (isNaN(val) || !isFinite(val)) return 'Erro';

  // Evita problemas de arredondamento de ponto flutuante (ex: 0.1 + 0.2 = 0.30000000000000004)
  const rounded = Number(Math.round(Number(val + 'e' + maxDecimals)) + 'e-' + maxDecimals);
  
  return new Intl.NumberFormat('pt-BR', {
    maximumFractionDigits: maxDecimals,
  }).format(rounded);
}

export interface CalculationResult {
  result: number;
  displayResult: string;
  expressionSummary: string;
  error?: string;
  percentageAmount?: number;
}

export function calculateOperation(
  firstOperand: number,
  operator: Operator,
  secondOperand: number,
  isPercentApplied: boolean = false
): CalculationResult {
  if (!operator) {
    return {
      result: secondOperand,
      displayResult: String(secondOperand),
      expressionSummary: String(secondOperand),
    };
  }

  let res = 0;
  let summary = '';
  let percentValue: number | undefined;

  switch (operator) {
    case '+':
      if (isPercentApplied) {
        // Ex: 100 + 10% = 110 (Acréscimo de 10% sobre 100)
        percentValue = (firstOperand * secondOperand) / 100;
        res = firstOperand + percentValue;
        summary = `${firstOperand} + ${secondOperand}% (+${percentValue})`;
      } else {
        res = firstOperand + secondOperand;
        summary = `${firstOperand} + ${secondOperand}`;
      }
      break;

    case '-':
      if (isPercentApplied) {
        // Ex: 100 - 20% = 80 (Desconto de 20% sobre 100)
        percentValue = (firstOperand * secondOperand) / 100;
        res = firstOperand - percentValue;
        summary = `${firstOperand} - ${secondOperand}% (-${percentValue})`;
      } else {
        res = firstOperand - secondOperand;
        summary = `${firstOperand} - ${secondOperand}`;
      }
      break;

    case '*':
      if (isPercentApplied) {
        // Ex: 200 * 15% = 30 (Quanto é 15% de 200)
        percentValue = (firstOperand * secondOperand) / 100;
        res = percentValue;
        summary = `${secondOperand}% de ${firstOperand}`;
      } else {
        res = firstOperand * secondOperand;
        summary = `${firstOperand} × ${secondOperand}`;
      }
      break;

    case '/':
      if (secondOperand === 0) {
        return {
          result: 0,
          displayResult: 'Indeterminado',
          expressionSummary: `${firstOperand} ÷ 0`,
          error: 'Divisão por zero não é permitida na matemática.',
        };
      }
      if (isPercentApplied) {
        // Ex: 50 / 10%
        percentValue = secondOperand / 100;
        res = firstOperand / percentValue;
        summary = `${firstOperand} ÷ ${secondOperand}%`;
      } else {
        res = firstOperand / secondOperand;
        summary = `${firstOperand} ÷ ${secondOperand}`;
      }
      break;

    case '%':
      // Cálculo direto de porcentagem: x % = x / 100
      res = secondOperand / 100;
      summary = `${secondOperand}% (${secondOperand}/100)`;
      break;
  }

  // Tratamento contra imprecisão do IEEE-754
  const sanitized = Number(res.toFixed(10));
  const finalResult = Number(sanitized.toString());

  return {
    result: finalResult,
    displayResult: String(finalResult),
    expressionSummary: summary,
    percentageAmount: percentValue,
  };
}

/**
 * Calcula o Maior Divisor Comum (MDC) para simplificar frações de porcentagem
 */
export function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a || 1;
}

export function simplifyFraction(numerator: number, denominator: number): string {
  if (denominator === 0) return 'indefinida';
  const divisor = gcd(numerator, denominator);
  const simpNum = numerator / divisor;
  const simpDen = denominator / divisor;

  if (simpDen === 1) return `${simpNum}`;
  return `${simpNum}/${simpDen}`;
}
