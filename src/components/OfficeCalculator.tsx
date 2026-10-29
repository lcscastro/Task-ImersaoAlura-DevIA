import React, { useEffect, useState, useCallback } from 'react';
import { Operator, CalculatorState, HistoryEntry } from '../types/calculator';
import { formatDisplayNumber, calculateOperation, parseNumber } from '../utils/mathEngine';
import { Volume2, VolumeX, SunMedium } from 'lucide-react';

interface OfficeCalculatorProps {
  onStateChange: (state: CalculatorState) => void;
  onSelectOperationForExplanation: (
    first: number | null,
    op: Operator,
    second: number,
    result: number | null,
    isPercent: boolean
  ) => void;
  presetCalculation?: { operandA: number; operator: Operator; operandB: number } | null;
  onClearPreset?: () => void;
}

export const OfficeCalculator: React.FC<OfficeCalculatorProps> = ({
  onStateChange,
  onSelectOperationForExplanation,
  presetCalculation,
  onClearPreset,
}) => {
  const [currentValue, setCurrentValue] = useState<string>('0');
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [operator, setOperator] = useState<Operator>(null);
  const [expression, setExpression] = useState<string>('');
  const [isResult, setIsResult] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<CalculatorState['history']>([]);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [lastKeyPressed, setLastKeyPressed] = useState<string | null>(null);

  // Sintetizador de som mecânico sutil para as teclas (Web Audio API nativo)
  const playClickSound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(180, audioCtx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.04);
    } catch {
      // Ignora silenciosamente se o navegador bloquear autoplay
    }
  }, [soundEnabled]);

  // Efeito para sincronizar estado global com painel pedagógico
  useEffect(() => {
    const state: CalculatorState = {
      currentValue,
      previousValue,
      operator,
      expression,
      isResult,
      error,
      history,
    };
    onStateChange(state);

    const first = previousValue !== null ? parseNumber(previousValue) : null;
    const second = parseNumber(currentValue);
    const resultNum = isResult ? parseNumber(currentValue) : null;
    const isPercent = operator === '%';

    onSelectOperationForExplanation(first, operator, second, resultNum, isPercent);
  }, [currentValue, previousValue, operator, expression, isResult, error, history, onStateChange, onSelectOperationForExplanation]);

  // Aplicação de cálculo pré-definido (vindo dos mini-desafios)
  useEffect(() => {
    if (presetCalculation) {
      const { operandA, operator: op, operandB } = presetCalculation;
      setPreviousValue(String(operandA));
      setOperator(op);
      setCurrentValue(String(operandB));
      setExpression(`${operandA} ${op === '*' ? '×' : op === '/' ? '÷' : op}`);
      setIsResult(false);
      setError(null);
      if (onClearPreset) onClearPreset();
    }
  }, [presetCalculation, onClearPreset]);

  // Digitação de números (0 a 9)
  const handleDigit = useCallback((digit: string) => {
    playClickSound();
    setLastKeyPressed(digit);
    setError(null);

    setCurrentValue((prev) => {
      if (isResult) {
        setIsResult(false);
        setExpression('');
        return digit;
      }
      if (prev === '0' || prev === '-0') {
        return prev.startsWith('-') ? `-${digit}` : digit;
      }
      // Limite razoável de 12 dígitos como calculadora de escritório
      if (prev.replace(/[^0-9]/g, '').length >= 12) return prev;
      return prev + digit;
    });
  }, [isResult, playClickSound]);

  // Inserção da vírgula decimal
  const handleDecimal = useCallback(() => {
    playClickSound();
    setLastKeyPressed('.');
    setError(null);

    setCurrentValue((prev) => {
      if (isResult) {
        setIsResult(false);
        setExpression('');
        return '0.';
      }
      if (!prev.includes('.')) {
        return prev + '.';
      }
      return prev;
    });
  }, [isResult, playClickSound]);

  // Limpar entrada atual (CE)
  const handleClearEntry = useCallback(() => {
    playClickSound();
    setLastKeyPressed('CE');
    setCurrentValue('0');
    setError(null);
  }, [playClickSound]);

  // Limpar tudo (AC / C)
  const handleAllClear = useCallback(() => {
    playClickSound();
    setLastKeyPressed('AC');
    setCurrentValue('0');
    setPreviousValue(null);
    setOperator(null);
    setExpression('');
    setIsResult(false);
    setError(null);
  }, [playClickSound]);

  // Inversão de sinal (+/-)
  const handleToggleSign = useCallback(() => {
    playClickSound();
    setLastKeyPressed('±');
    setCurrentValue((prev) => {
      if (prev === '0') return prev;
      if (prev.startsWith('-')) return prev.slice(1);
      return `-${prev}`;
    });
  }, [playClickSound]);

  // Operadores (+, -, *, /)
  const handleOperator = useCallback((nextOp: Operator) => {
    playClickSound();
    setLastKeyPressed(nextOp);
    setError(null);

    const currentNum = parseNumber(currentValue);

    if (previousValue === null) {
      setPreviousValue(currentValue);
      setOperator(nextOp);
      const symbol = nextOp === '*' ? '×' : nextOp === '/' ? '÷' : nextOp;
      setExpression(`${formatDisplayNumber(currentValue)} ${symbol}`);
      setCurrentValue('0');
      setIsResult(false);
      return;
    }

    if (operator && !isResult) {
      // Se o usuário apertar operador em cadeia (ex: 5 + 3 + 2)
      const prevNum = parseNumber(previousValue);
      const calc = calculateOperation(prevNum, operator, currentNum);

      if (calc.error) {
        setError(calc.error);
        setCurrentValue('0');
        setPreviousValue(null);
        setOperator(null);
        return;
      }

      setPreviousValue(calc.displayResult);
      setOperator(nextOp);
      const symbol = nextOp === '*' ? '×' : nextOp === '/' ? '÷' : nextOp;
      setExpression(`${formatDisplayNumber(calc.displayResult)} ${symbol}`);
      setCurrentValue('0');
      setIsResult(false);
      return;
    }

    setPreviousValue(currentValue);
    setOperator(nextOp);
    const symbol = nextOp === '*' ? '×' : nextOp === '/' ? '÷' : nextOp;
    setExpression(`${formatDisplayNumber(currentValue)} ${symbol}`);
    setCurrentValue('0');
    setIsResult(false);
  }, [currentValue, previousValue, operator, isResult, playClickSound]);

  // Operação de Porcentagem (%)
  const handlePercentage = useCallback(() => {
    playClickSound();
    setLastKeyPressed('%');
    setError(null);

    const currentNum = parseNumber(currentValue);

    // Se houver um valor anterior e um operador (ex: 200 * 15 % ou 100 - 20 %)
    if (previousValue !== null && operator) {
      const prevNum = parseNumber(previousValue);
      const calc = calculateOperation(prevNum, operator, currentNum, true);

      if (calc.error) {
        setError(calc.error);
        return;
      }

      const opSymbol = operator === '*' ? '×' : operator === '/' ? '÷' : operator;
      const historyItem: HistoryEntry = {
        id: Math.random().toString(36).substring(2, 9),
        expression: `${formatDisplayNumber(prevNum)} ${opSymbol} ${formatDisplayNumber(currentNum)}%`,
        result: formatDisplayNumber(calc.displayResult),
        operator: '%',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      };

      setHistory((prev) => [historyItem, ...prev].slice(0, 15));
      setExpression(`${formatDisplayNumber(prevNum)} ${opSymbol} ${formatDisplayNumber(currentNum)}%`);
      setCurrentValue(calc.displayResult);
      setPreviousValue(null);
      setOperator(null);
      setIsResult(true);
      return;
    }

    // Caso de porcentagem avulsa (ex: 50% = 0.5)
    const resultVal = currentNum / 100;
    const historyItem: HistoryEntry = {
      id: Math.random().toString(36).substring(2, 9),
      expression: `${formatDisplayNumber(currentNum)}%`,
      result: formatDisplayNumber(resultVal),
      operator: '%',
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    setHistory((prev) => [historyItem, ...prev].slice(0, 15));
    setExpression(`${formatDisplayNumber(currentNum)}% =`);
    setCurrentValue(String(resultVal));
    setIsResult(true);
  }, [currentValue, previousValue, operator, playClickSound]);

  // Botão de Igual (=)
  const handleEquals = useCallback(() => {
    playClickSound();
    setLastKeyPressed('=');

    if (previousValue === null || !operator) {
      setIsResult(true);
      return;
    }

    const prevNum = parseNumber(previousValue);
    const currentNum = parseNumber(currentValue);
    const calc = calculateOperation(prevNum, operator, currentNum);

    if (calc.error) {
      setError(calc.error);
      return;
    }

    const opSymbol = operator === '*' ? '×' : operator === '/' ? '÷' : operator;
    const historyItem = {
      id: Math.random().toString(36).substring(2, 9),
      expression: `${formatDisplayNumber(prevNum)} ${opSymbol} ${formatDisplayNumber(currentNum)}`,
      result: formatDisplayNumber(calc.displayResult),
      operator,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    setHistory((prev) => [historyItem, ...prev].slice(0, 15));
    setExpression(`${formatDisplayNumber(prevNum)} ${opSymbol} ${formatDisplayNumber(currentNum)} =`);
    setCurrentValue(calc.displayResult);
    setPreviousValue(null);
    setOperator(null);
    setIsResult(true);
  }, [previousValue, operator, currentValue, playClickSound]);

  // Backspace (apagar último dígito)
  const handleBackspace = useCallback(() => {
    playClickSound();
    setLastKeyPressed('⌫');
    setCurrentValue((prev) => {
      if (isResult || prev.length <= 1 || (prev.length === 2 && prev.startsWith('-'))) {
        return '0';
      }
      return prev.slice(0, -1);
    });
  }, [isResult, playClickSound]);

  // Listener para Teclado Físico
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        handleDigit(e.key);
      } else if (e.key === '.' || e.key === ',') {
        e.preventDefault();
        handleDecimal();
      } else if (e.key === '+') {
        e.preventDefault();
        handleOperator('+');
      } else if (e.key === '-') {
        e.preventDefault();
        handleOperator('-');
      } else if (e.key === '*') {
        e.preventDefault();
        handleOperator('*');
      } else if (e.key === '/') {
        e.preventDefault();
        handleOperator('/');
      } else if (e.key === '%') {
        e.preventDefault();
        handlePercentage();
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleEquals();
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (e.key === 'Escape' || e.key.toLowerCase() === 'c') {
        e.preventDefault();
        handleAllClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDigit, handleDecimal, handleOperator, handlePercentage, handleEquals, handleBackspace, handleAllClear]);

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Corpo da Calculadora de Mesa */}
      <div className="bg-slate-900 p-5 sm:p-6 rounded-3xl shadow-2xl border-4 border-slate-800 relative">
        {/* Marca superior & Célula Solar clássica de escritório */}
        <div className="flex items-center justify-between pb-3 px-1 border-b border-slate-800/80 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-white text-xs font-bold tracking-widest uppercase">
              MATH·PRO <span className="text-blue-400">DESK 100</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Célula Solar estilizada (ícone do design de escritório) */}
            <div className="flex items-center gap-1 bg-amber-950/40 border border-amber-900/60 px-2 py-0.5 rounded-sm">
              <SunMedium className="w-3 h-3 text-amber-500/80" />
              <div className="flex gap-0.5">
                <div className="w-2.5 h-3 bg-amber-800/60 rounded-2xs" />
                <div className="w-2.5 h-3 bg-amber-800/60 rounded-2xs" />
                <div className="w-2.5 h-3 bg-amber-800/60 rounded-2xs" />
              </div>
            </div>

            {/* Alternador de som de clique */}
            <button
              onClick={() => setSoundEnabled((prev) => !prev)}
              className="text-slate-400 hover:text-white p-1 rounded transition-colors"
              title={soundEnabled ? 'Silenciar cliques sonoros' : 'Ativar som mecânico das teclas'}
              aria-label="Controle de som"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-blue-400" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Display LCD Estilo Escritório (Visor Duplo com Alto Contraste) */}
        <div className="bg-slate-950 p-4 sm:p-5 rounded-2xl border-2 border-slate-700/60 shadow-inner mb-5 relative overflow-hidden">
          {/* Reflexo sutil de vidro na parte superior do display */}
          <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

          {/* Linha Superior: Expressão & Indicador de Operador */}
          <div className="flex justify-between items-center text-xs text-blue-400/90 font-lcd mb-1 min-h-[1.25rem]">
            <span className="truncate pr-2">{expression || ' '}</span>
            {operator && (
              <span className="px-1.5 py-0.2 bg-blue-900/40 text-blue-300 font-bold rounded-xs shrink-0">
                {operator === '*' ? '×' : operator === '/' ? '÷' : operator}
              </span>
            )}
          </div>

          {/* Linha Principal: Dígitos Grandes e Nítidos */}
          <div className="text-right">
            {error ? (
              <div className="text-red-400 font-lcd text-lg sm:text-xl font-bold py-1 truncate">
                {error}
              </div>
            ) : (
              <div className="text-white font-lcd text-3xl sm:text-4xl tracking-tight font-bold truncate">
                {formatDisplayNumber(currentValue)}
              </div>
            )}
          </div>
        </div>

        {/* Grade de Teclas: Paleta Azul, Branco e Preto com Relevo Tátil */}
        <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
          {/* LINHA 1: Funções de Limpeza e Porcentagem */}
          <button
            onClick={handleAllClear}
            className="h-13 sm:h-14 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-red-400 font-bold text-sm tracking-wider shadow-md transition-all active:translate-y-0.5 border border-slate-700/80 cursor-pointer"
            title="Limpar tudo (Esc)"
          >
            AC
          </button>

          <button
            onClick={handleClearEntry}
            className="h-13 sm:h-14 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-slate-200 font-bold text-sm tracking-wider shadow-md transition-all active:translate-y-0.5 border border-slate-700/80 cursor-pointer"
            title="Limpar entrada atual"
          >
            CE
          </button>

          <button
            onClick={handleToggleSign}
            className="h-13 sm:h-14 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-slate-200 font-bold text-base shadow-md transition-all active:translate-y-0.5 border border-slate-700/80 cursor-pointer"
            title="Inverter positivo/negativo"
          >
            ±
          </button>

          <button
            onClick={handlePercentage}
            className={`h-13 sm:h-14 rounded-xl font-bold text-lg shadow-md transition-all active:translate-y-0.5 cursor-pointer flex items-center justify-center gap-1 ${
              operator === '%'
                ? 'bg-blue-500 text-white ring-2 ring-blue-300'
                : 'bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white'
            }`}
            title="Calcular Porcentagem (%)"
          >
            %
          </button>

          {/* LINHA 2: 7, 8, 9, Divisão */}
          <button
            onClick={() => handleDigit('7')}
            className="h-13 sm:h-14 rounded-xl bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-900 font-bold text-xl sm:text-2xl shadow-md transition-all active:translate-y-0.5 cursor-pointer font-lcd"
          >
            7
          </button>
          <button
            onClick={() => handleDigit('8')}
            className="h-13 sm:h-14 rounded-xl bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-900 font-bold text-xl sm:text-2xl shadow-md transition-all active:translate-y-0.5 cursor-pointer font-lcd"
          >
            8
          </button>
          <button
            onClick={() => handleDigit('9')}
            className="h-13 sm:h-14 rounded-xl bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-900 font-bold text-xl sm:text-2xl shadow-md transition-all active:translate-y-0.5 cursor-pointer font-lcd"
          >
            9
          </button>
          <button
            onClick={() => handleOperator('/')}
            className={`h-13 sm:h-14 rounded-xl font-bold text-xl shadow-md transition-all active:translate-y-0.5 cursor-pointer ${
              operator === '/'
                ? 'bg-blue-700 text-white ring-2 ring-blue-400'
                : 'bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-blue-400 border border-slate-700/80'
            }`}
            title="Dividir (÷)"
          >
            ÷
          </button>

          {/* LINHA 3: 4, 5, 6, Multiplicação */}
          <button
            onClick={() => handleDigit('4')}
            className="h-13 sm:h-14 rounded-xl bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-900 font-bold text-xl sm:text-2xl shadow-md transition-all active:translate-y-0.5 cursor-pointer font-lcd"
          >
            4
          </button>
          <button
            onClick={() => handleDigit('5')}
            className="h-13 sm:h-14 rounded-xl bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-900 font-bold text-xl sm:text-2xl shadow-md transition-all active:translate-y-0.5 cursor-pointer font-lcd"
          >
            5
          </button>
          <button
            onClick={() => handleDigit('6')}
            className="h-13 sm:h-14 rounded-xl bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-900 font-bold text-xl sm:text-2xl shadow-md transition-all active:translate-y-0.5 cursor-pointer font-lcd"
          >
            6
          </button>
          <button
            onClick={() => handleOperator('*')}
            className={`h-13 sm:h-14 rounded-xl font-bold text-xl shadow-md transition-all active:translate-y-0.5 cursor-pointer ${
              operator === '*'
                ? 'bg-blue-700 text-white ring-2 ring-blue-400'
                : 'bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-blue-400 border border-slate-700/80'
            }`}
            title="Multiplicar (×)"
          >
            ×
          </button>

          {/* LINHA 4: 1, 2, 3, Subtração */}
          <button
            onClick={() => handleDigit('1')}
            className="h-13 sm:h-14 rounded-xl bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-900 font-bold text-xl sm:text-2xl shadow-md transition-all active:translate-y-0.5 cursor-pointer font-lcd"
          >
            1
          </button>
          <button
            onClick={() => handleDigit('2')}
            className="h-13 sm:h-14 rounded-xl bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-900 font-bold text-xl sm:text-2xl shadow-md transition-all active:translate-y-0.5 cursor-pointer font-lcd"
          >
            2
          </button>
          <button
            onClick={() => handleDigit('3')}
            className="h-13 sm:h-14 rounded-xl bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-900 font-bold text-xl sm:text-2xl shadow-md transition-all active:translate-y-0.5 cursor-pointer font-lcd"
          >
            3
          </button>
          <button
            onClick={() => handleOperator('-')}
            className={`h-13 sm:h-14 rounded-xl font-bold text-xl shadow-md transition-all active:translate-y-0.5 cursor-pointer ${
              operator === '-'
                ? 'bg-blue-700 text-white ring-2 ring-blue-400'
                : 'bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-blue-400 border border-slate-700/80'
            }`}
            title="Subtrair (−)"
          >
            −
          </button>

          {/* LINHA 5: 0, Vírgula Decimal, Adição, Igual */}
          <button
            onClick={() => handleDigit('0')}
            className="h-13 sm:h-14 rounded-xl bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-900 font-bold text-xl sm:text-2xl shadow-md transition-all active:translate-y-0.5 cursor-pointer font-lcd"
          >
            0
          </button>
          <button
            onClick={handleDecimal}
            className="h-13 sm:h-14 rounded-xl bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-900 font-bold text-2xl shadow-md transition-all active:translate-y-0.5 cursor-pointer font-lcd"
            title="Vírgula decimal (,)"
          >
            ,
          </button>
          <button
            onClick={() => handleOperator('+')}
            className={`h-13 sm:h-14 rounded-xl font-bold text-xl shadow-md transition-all active:translate-y-0.5 cursor-pointer ${
              operator === '+'
                ? 'bg-blue-700 text-white ring-2 ring-blue-400'
                : 'bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-blue-400 border border-slate-700/80'
            }`}
            title="Somar (+)"
          >
            +
          </button>
          <button
            onClick={handleEquals}
            className="h-13 sm:h-14 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-2xl shadow-lg shadow-blue-900/30 transition-all active:translate-y-0.5 cursor-pointer border border-blue-400/30"
            title="Resultado (=)"
          >
            =
          </button>
        </div>

        {/* Rodapé ergonômico da calculadora: pés de borracha e dica de teclado */}
        <div className="flex items-center justify-between mt-5 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
          <span>Dica: Use o teclado numérico do computador</span>
          {lastKeyPressed && (
            <span className="font-lcd text-blue-400 bg-slate-800 px-1.5 py-0.5 rounded">
              Tecla: {lastKeyPressed}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
