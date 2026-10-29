import React, { useState } from 'react';
import { PedagogyData, HistoryEntry, MathChallenge } from '../types/calculator';
import { PercentageVisualizer } from './PercentageVisualizer';
import { MATH_CHALLENGES } from '../utils/challengeEngine';
import {
  BookOpen,
  Award,
  History,
  CheckCircle,
  HelpCircle,
  Lightbulb,
  ArrowRight,
  Calculator,
  RotateCcw,
  Trophy,
  Flame,
} from 'lucide-react';

interface EducationalPanelProps {
  pedagogyData: PedagogyData;
  history: HistoryEntry[];
  onApplyPercentagePreset?: (rate: number) => void;
  onLoadChallengeIntoCalculator: (challenge: MathChallenge) => void;
}

export const EducationalPanel: React.FC<EducationalPanelProps> = ({
  pedagogyData,
  history,
  onApplyPercentagePreset,
  onLoadChallengeIntoCalculator,
}) => {
  const [activeTab, setActiveTab] = useState<'explanation' | 'challenges' | 'history'>('explanation');
  
  // Estados para a aba de desafios
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [streakCount, setStreakCount] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredChallenges = MATH_CHALLENGES.filter((ch) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'percentage') return ch.category === 'percentage';
    if (selectedCategory === 'basic') return ch.category === 'addition' || ch.category === 'subtraction';
    if (selectedCategory === 'advanced') return ch.category === 'multiplication' || ch.category === 'division';
    return true;
  });

  const activeChallenge = filteredChallenges[currentChallengeIndex % filteredChallenges.length] || MATH_CHALLENGES[0];

  const handleSelectOption = (optionId: string) => {
    if (isAnswerSubmitted) return;
    setSelectedOptionId(optionId);
    setIsAnswerSubmitted(true);

    const chosen = activeChallenge.options.find((o) => o.id === optionId);
    if (chosen && chosen.value === activeChallenge.correctAnswer) {
      setStreakCount((prev) => prev + 1);
    } else {
      setStreakCount(0);
    }
  };

  const handleNextChallenge = () => {
    setSelectedOptionId(null);
    setIsAnswerSubmitted(false);
    setCurrentChallengeIndex((prev) => (prev + 1) % filteredChallenges.length);
  };

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden flex flex-col h-full min-h-[600px]">
      {/* Barra de Abas Superiores */}
      <div className="flex border-b border-slate-200 bg-slate-50/80 p-2 gap-2">
        <button
          onClick={() => setActiveTab('explanation')}
          className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer ${
            activeTab === 'explanation'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Como Funciona o Cálculo</span>
        </button>

        <button
          onClick={() => setActiveTab('challenges')}
          className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer ${
            activeTab === 'challenges'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Mini-Desafios</span>
          {streakCount > 0 && (
            <span className="flex items-center gap-0.5 text-xs bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded-full font-bold">
              <Flame className="w-3 h-3 fill-slate-950" />
              {streakCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer ml-auto ${
            activeTab === 'history'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <History className="w-4 h-4" />
          <span className="hidden sm:inline">Fita de Papel</span>
          <span className="sm:hidden">Fita</span>
        </button>
      </div>

      {/* Conteúdo Dinâmico das Abas */}
      <div className="p-5 sm:p-6 overflow-y-auto flex-1">
        {/* ABA 1: EXPLICAÇÃO PEDAGÓGICA */}
        {activeTab === 'explanation' && (
          <div className="space-y-6">
            {/* Cabeçalho da Operação */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg font-lcd">
                    {pedagogyData.symbol}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900">
                    {pedagogyData.title}
                  </h3>
                </div>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  {pedagogyData.summary}
                </p>
              </div>
            </div>

            {/* Se houver decomposição de Porcentagem (100 blocos e frações) */}
            {pedagogyData.percentageBreakdown && (
              <div className="pt-1">
                <PercentageVisualizer
                  breakdown={pedagogyData.percentageBreakdown}
                  onApplyPreset={onApplyPercentagePreset}
                />
              </div>
            )}

            {/* Passo a Passo do Cálculo */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-4 h-4 text-blue-600" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Passo a Passo da Operação
                </h4>
              </div>
              <ul className="space-y-2 text-sm text-slate-700">
                {pedagogyData.stepByStep.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Anatomia e Termos Matemáticos */}
            {pedagogyData.terms.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Nomes dos Termos Matemáticos
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {pedagogyData.terms.map((term, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-white border border-slate-200 rounded-xl hover:border-blue-300 transition-colors"
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-slate-800">{term.name}</span>
                        <span className="font-lcd font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                          {term.value}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">{term.role}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Exemplos de Uso no Cotidiano */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Onde Usamos no Dia a Dia (Exemplos Práticos)
              </h4>
              <div className="space-y-3">
                {pedagogyData.examples.map((ex, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-white border border-slate-200 rounded-xl space-y-2 hover:border-slate-300 transition-colors shadow-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                        {idx + 1}
                      </span>
                      <h5 className="text-sm font-bold text-slate-900">{ex.title}</h5>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {ex.scenario}
                    </p>
                    <div className="bg-slate-50 p-2.5 rounded-lg flex flex-wrap items-center justify-between gap-2 text-xs font-lcd">
                      <span className="text-slate-700">{ex.calc} =</span>
                      <span className="font-bold text-blue-700">{ex.result}</span>
                    </div>
                    <p className="text-xs text-blue-900/80 font-medium bg-blue-50/60 p-2 rounded-md">
                      💡 {ex.practicalInsight}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ABA 2: MINI-DESAFIOS E PERGUNTAS RÁPIDAS */}
        {activeTab === 'challenges' && (
          <div className="space-y-5">
            {/* Filtros e Barra de Progresso */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg text-xs">
                <button
                  onClick={() => { setSelectedCategory('all'); setCurrentChallengeIndex(0); setIsAnswerSubmitted(false); }}
                  className={`px-3 py-1 font-semibold rounded-md transition-colors cursor-pointer ${
                    selectedCategory === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => { setSelectedCategory('percentage'); setCurrentChallengeIndex(0); setIsAnswerSubmitted(false); }}
                  className={`px-3 py-1 font-semibold rounded-md transition-colors cursor-pointer ${
                    selectedCategory === 'percentage' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Porcentagem (%)
                </button>
                <button
                  onClick={() => { setSelectedCategory('basic'); setCurrentChallengeIndex(0); setIsAnswerSubmitted(false); }}
                  className={`px-3 py-1 font-semibold rounded-md transition-colors cursor-pointer ${
                    selectedCategory === 'basic' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Adição/Subtração
                </button>
                <button
                  onClick={() => { setSelectedCategory('advanced'); setCurrentChallengeIndex(0); setIsAnswerSubmitted(false); }}
                  className={`px-3 py-1 font-semibold rounded-md transition-colors cursor-pointer ${
                    selectedCategory === 'advanced' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Multiplicação/Divisão
                </button>
              </div>

              {/* Placar de Sequência */}
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl">
                <Trophy className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-bold text-amber-900">
                  Sequência: {streakCount} {streakCount === 1 ? 'acerto' : 'acertos'}
                </span>
              </div>
            </div>

            {/* Cartão do Desafio Atual */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-blue-700 bg-blue-100/80 px-2.5 py-0.5 rounded-full">
                  {activeChallenge.categoryLabel} · Nível {activeChallenge.difficulty}
                </span>
                <span className="text-slate-400">
                  Desafio {currentChallengeIndex + 1} de {filteredChallenges.length}
                </span>
              </div>

              <div>
                <h4 className="text-base font-bold text-slate-900">
                  {activeChallenge.title}
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {activeChallenge.scenario}
                </p>
              </div>

              <div className="p-3.5 bg-white border border-blue-200 rounded-xl shadow-xs">
                <p className="text-sm font-semibold text-slate-900">
                  ❓ {activeChallenge.question}
                </p>
              </div>

              {/* Botão de Transferir para a Calculadora */}
              <button
                onClick={() => onLoadChallengeIntoCalculator(activeChallenge)}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors cursor-pointer"
                title="Carrega os números do problema diretamente nas teclas da calculadora"
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>Carregar cálculo na Calculadora de Mesa</span>
              </button>

              {/* Opções de Resposta */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {activeChallenge.options.map((opt) => {
                  const isSelected = selectedOptionId === opt.id;
                  const isCorrect = opt.value === activeChallenge.correctAnswer;

                  let buttonStyle = 'bg-white text-slate-800 border-slate-200 hover:border-blue-400 hover:bg-blue-50/50';

                  if (isAnswerSubmitted) {
                    if (isCorrect) {
                      buttonStyle = 'bg-emerald-500 text-white border-emerald-600 shadow-sm';
                    } else if (isSelected && !isCorrect) {
                      buttonStyle = 'bg-red-500 text-white border-red-600 shadow-sm';
                    } else {
                      buttonStyle = 'bg-white text-slate-400 border-slate-200 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={opt.id}
                      disabled={isAnswerSubmitted}
                      onClick={() => handleSelectOption(opt.id)}
                      className={`p-3 rounded-xl border text-sm font-semibold transition-all text-left flex items-center justify-between cursor-pointer ${buttonStyle}`}
                    >
                      <span>{opt.label}</span>
                      {isAnswerSubmitted && isCorrect && (
                        <CheckCircle className="w-4 h-4 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Feedback pós-resposta */}
              {isAnswerSubmitted && (
                <div
                  className={`p-4 rounded-xl border space-y-2 animate-in fade-in duration-200 ${
                    selectedOptionId &&
                    activeChallenge.options.find((o) => o.id === selectedOptionId)?.value ===
                      activeChallenge.correctAnswer
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                      : 'bg-amber-50 border-amber-200 text-amber-950'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-sm">
                    {selectedOptionId &&
                    activeChallenge.options.find((o) => o.id === selectedOptionId)?.value ===
                      activeChallenge.correctAnswer ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        <span>Excelente! Resposta correta! 🎉</span>
                      </>
                    ) : (
                      <>
                        <HelpCircle className="w-4 h-4 text-amber-600" />
                        <span>Quase lá! Veja a explicação:</span>
                      </>
                    )}
                  </div>
                  <p className="text-xs leading-relaxed">
                    {activeChallenge.explanation}
                  </p>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={handleNextChallenge}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Próximo Desafio</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ABA 3: FITA DE HISTÓRICO DE ESCRITÓRIO */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Fita de Papel de Mesa
                </h4>
                <p className="text-xs text-slate-500">
                  Registro impresso das últimas contas realizadas nesta sessão.
                </p>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {history.length} operações
              </span>
            </div>

            {history.length === 0 ? (
              <div className="text-center py-12 text-slate-400 space-y-2">
                <History className="w-8 h-8 mx-auto stroke-1" />
                <p className="text-sm">Nenhuma operação realizada ainda.</p>
                <p className="text-xs">Faça um cálculo na calculadora para vê-lo impresso aqui!</p>
              </div>
            ) : (
              <div className="bg-amber-50/40 border border-amber-200/80 rounded-xl p-4 font-lcd text-xs shadow-inner divide-y divide-amber-200/40">
                {history.map((entry) => (
                  <div key={entry.id} className="py-2.5 flex items-center justify-between gap-4">
                    <div className="text-slate-600">
                      <span className="text-[10px] text-slate-400 block font-sans">
                        {entry.timestamp}
                      </span>
                      <span className="font-medium">{entry.expression}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block font-sans">
                        Total
                      </span>
                      <span className="text-sm font-bold text-slate-900">
                        {entry.result}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
