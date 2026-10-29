export type Operator = '+' | '-' | '*' | '/' | '%' | null;

export interface HistoryEntry {
  id: string;
  expression: string;
  result: string;
  operator: Operator;
  timestamp: string;
}

export interface CalculatorState {
  currentValue: string;
  previousValue: string | null;
  operator: Operator;
  expression: string;
  isResult: boolean;
  error: string | null;
  history: HistoryEntry[];
}

export interface TermDefinition {
  name: string;
  value: string;
  role: string;
}

export interface PracticalExample {
  title: string;
  scenario: string;
  calc: string;
  result: string;
  practicalInsight: string;
}

export interface PercentageBreakdown {
  baseValue: number;
  rateValue: number;
  fractionText: string;
  simplifiedFraction: string;
  decimalText: string;
  portionResult: number;
  discountResult?: number;
  increaseResult?: number;
}

export interface PedagogyData {
  operationType: 'addition' | 'subtraction' | 'multiplication' | 'division' | 'percentage' | 'idle';
  title: string;
  symbol: string;
  summary: string;
  stepByStep: string[];
  terms: TermDefinition[];
  examples: PracticalExample[];
  percentageBreakdown?: PercentageBreakdown;
}

export interface ChallengeOption {
  id: string;
  label: string;
  value: number;
}

export interface MathChallenge {
  id: string;
  category: 'addition' | 'subtraction' | 'multiplication' | 'division' | 'percentage';
  categoryLabel: string;
  difficulty: 'Iniciante' | 'Intermediário';
  title: string;
  question: string;
  scenario: string;
  operandA: number;
  operator: '+' | '-' | '*' | '/' | '%';
  operandB: number;
  correctAnswer: number;
  options: ChallengeOption[];
  explanation: string;
  unit?: string;
}
