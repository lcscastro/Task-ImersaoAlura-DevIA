import React from 'react';
import { PercentageBreakdown } from '../types/calculator';
import { CheckCircle2, TrendingDown, TrendingUp, Sparkles } from 'lucide-react';

interface PercentageVisualizerProps {
  breakdown: PercentageBreakdown;
  onApplyPreset?: (rate: number) => void;
}

export const PercentageVisualizer: React.FC<PercentageVisualizerProps> = ({
  breakdown,
  onApplyPreset,
}) => {
  const {
    baseValue,
    rateValue,
    fractionText,
    simplifiedFraction,
    decimalText,
    portionResult,
    discountResult,
    increaseResult,
  } = breakdown;

  // Limita o valor visual da grade entre 0 e 100
  const clampedRate = Math.min(Math.max(Math.round(rateValue), 0), 100);

  return (
    <div className="space-y-4">
      {/* Grade de 100 blocos (Centesimal) */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-700">
              Grade Visual de 100 Partes
            </span>
            <p className="text-xs text-slate-500">
              Cada quadradinho representa exatamente 1% (1 parte de 100).
            </p>
          </div>
          <div className="text-right">
            <span className="text-lg font-bold text-slate-900 font-lcd">
              {rateValue}%
            </span>
            <span className="text-xs text-slate-500 block">
              {clampedRate}/100 blocos
            </span>
          </div>
        </div>

        {/* Matriz 10x10 com 100 blocos */}
        <div
          className="grid grid-cols-10 gap-1 p-2 bg-white rounded-lg border border-slate-200 max-w-[280px] mx-auto shadow-inner"
          aria-label={`Grade de 100 blocos com ${clampedRate} preenchidos`}
        >
          {Array.from({ length: 100 }).map((_, idx) => {
            const isFilled = idx < clampedRate;
            return (
              <div
                key={idx}
                className={`aspect-square rounded-xs transition-colors duration-200 ${
                  isFilled
                    ? 'bg-blue-600 shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200'
                }`}
                title={`Bloco ${idx + 1}`}
              />
            );
          })}
        </div>

        {/* Presets comuns de porcentagem para o aluno explorar */}
        {onApplyPreset && (
          <div className="mt-4 pt-3 border-t border-slate-200">
            <span className="text-xs font-medium text-slate-600 block mb-2">
              Explorar porcentagens mais usadas na escola:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[10, 20, 25, 50, 75].map((preset) => (
                <button
                  key={preset}
                  onClick={() => onApplyPreset(preset)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md border transition-all ${
                    rateValue === preset
                      ? 'bg-blue-600 text-white border-blue-700 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-blue-400 hover:text-blue-600'
                  }`}
                >
                  {preset}%
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Cartões de Equivalência (Fração, Decimal e Simplificada) */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-3 bg-white border border-slate-200 rounded-lg text-center">
          <span className="text-xs text-slate-500 block font-medium">Fração Base</span>
          <span className="text-sm font-bold text-slate-900 font-lcd">
            {fractionText}
          </span>
        </div>

        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-center">
          <span className="text-xs text-blue-700 block font-medium">Simplificada</span>
          <span className="text-sm font-bold text-blue-900 font-lcd">
            {simplifiedFraction}
          </span>
        </div>

        <div className="p-3 bg-white border border-slate-200 rounded-lg text-center">
          <span className="text-xs text-slate-500 block font-medium">Decimal</span>
          <span className="text-sm font-bold text-slate-900 font-lcd">
            {decimalText}
          </span>
        </div>
      </div>

      {/* Aplicação Prática no Dia a Dia: Desconto vs Acréscimo */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
            Aplicação Real Sobre R$ {baseValue.toLocaleString('pt-BR')}
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {/* Caso de Desconto */}
          <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg">
            <div className="flex items-center gap-1.5 text-emerald-800 font-semibold mb-1">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>Se for Desconto (−{rateValue}%)</span>
            </div>
            <p className="text-slate-600 mb-2">
              Economiza: <strong className="text-slate-900">R$ {portionResult.toLocaleString('pt-BR')}</strong>
            </p>
            <div className="pt-1.5 border-t border-emerald-200 flex justify-between items-center">
              <span className="text-slate-600">Preço final:</span>
              <span className="font-bold text-emerald-800 text-sm font-lcd">
                R$ {discountResult?.toLocaleString('pt-BR')}
              </span>
            </div>
          </div>

          {/* Caso de Acréscimo / Juros */}
          <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-1.5 text-blue-800 font-semibold mb-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Se for Acréscimo (+{rateValue}%)</span>
            </div>
            <p className="text-slate-600 mb-2">
              Adiciona: <strong className="text-slate-900">R$ {portionResult.toLocaleString('pt-BR')}</strong>
            </p>
            <div className="pt-1.5 border-t border-blue-200 flex justify-between items-center">
              <span className="text-slate-600">Valor total:</span>
              <span className="font-bold text-blue-800 text-sm font-lcd">
                R$ {increaseResult?.toLocaleString('pt-BR')}
              </span>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-500 italic">
          💡 Dica de ouro: calcular 10% é o mesmo que mover a vírgula uma casa para a esquerda!
        </p>
      </div>
    </div>
  );
};
