import React, { useState, useCallback } from 'react';
import { OfficeCalculator } from './components/OfficeCalculator';
import { EducationalPanel } from './components/EducationalPanel';
import { CalculatorState, Operator, PedagogyData, MathChallenge } from './types/calculator';
import { generatePedagogyContent } from './utils/pedagogyEngine';
import {
  HelpCircle,
  Percent,
  Plus,
  Minus,
  X,
  Divide,
  Sparkles,
  CheckCircle2,
  BookOpen,
  Keyboard,
} from 'lucide-react';

export default function App() {
  const [calculatorState, setCalculatorState] = useState<CalculatorState>({
    currentValue: '0',
    previousValue: null,
    operator: null,
    expression: '',
    isResult: false,
    error: null,
    history: [],
  });

  const [pedagogyData, setPedagogyData] = useState<PedagogyData>(() =>
    generatePedagogyContent(null, null, 0, null)
  );

  const [presetCalculation, setPresetCalculation] = useState<{
    operandA: number;
    operator: Operator;
    operandB: number;
  } | null>(null);

  const [showGuideModal, setShowGuideModal] = useState<boolean>(false);
  const [showCriteriaModal, setShowCriteriaModal] = useState<boolean>(false);

  // Sincronização entre a calculadora e o painel pedagógico
  const handleSelectOperationForExplanation = useCallback(
    (
      first: number | null,
      op: Operator,
      second: number,
      result: number | null,
      isPercent: boolean
    ) => {
      const data = generatePedagogyContent(first, op, second, result, isPercent);
      setPedagogyData(data);
    },
    []
  );

  // Transferir o cálculo de um mini-desafio para a calculadora
  const handleLoadChallenge = useCallback((challenge: MathChallenge) => {
    setPresetCalculation({
      operandA: challenge.operandA,
      operator: challenge.operator,
      operandB: challenge.operandB,
    });
  }, []);

  // Preset rápido de porcentagem
  const handleApplyPercentagePreset = useCallback((rate: number) => {
    setPresetCalculation({
      operandA: 100,
      operator: '%',
      operandB: rate,
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Top Bar seguindo o Top Bar Contract (Wordmark, Nav Links, 1 Ação Primária) */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zona 1: Wordmark */}
          <a
            href="/"
            className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 flex items-center gap-2"
          >
            <span className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-base shadow-xs">
              %
            </span>
            <span>Calculadora Escolar</span>
          </a>

          {/* Zona 2: Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a
              href="#calculadora"
              className="hover:text-blue-600 transition-colors whitespace-nowrap shrink-0"
            >
              Calculadora de Mesa
            </a>
            <a
              href="#porcentagem"
              className="hover:text-blue-600 transition-colors whitespace-nowrap shrink-0"
            >
              Como Funciona o %
            </a>
            <a
              href="#desafios"
              className="hover:text-blue-600 transition-colors whitespace-nowrap shrink-0"
            >
              Mini-Desafios
            </a>
            <button
              onClick={() => setShowCriteriaModal(true)}
              className="hover:text-blue-600 transition-colors whitespace-nowrap shrink-0 text-left cursor-pointer"
            >
              Critérios de Teste (v1)
            </button>
          </nav>

          {/* Zona 3: 1 Ação Primária */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setShowGuideModal(true)}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Guia do Estudante</span>
            </button>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal (Split View em 2 Colunas) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Banner Superior Discreto com Contexto Pedagógico */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-700">
              <Sparkles className="w-4 h-4" />
              <span>Matemática Básica para o Ensino Fundamental</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Calculadora de Escritório com Aprendizado Ativo
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
              Pratique as 5 operações fundamentais (adição, subtração, multiplicação, divisão e porcentagem) e entenda o que cada conta significa no painel explicativo.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl shrink-0">
            <Keyboard className="w-4 h-4 text-slate-700" />
            <span>Teclado físico habilitado</span>
          </div>
        </div>

        {/* Layout Split: Calculadora (Esquerda) e Painel Pedagógico (Direita) */}
        <div id="calculadora" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Coluna Esquerda: Calculadora de Mesa (5 Colunas no Desktop) */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="w-full sticky top-24">
              <OfficeCalculator
                onStateChange={setCalculatorState}
                onSelectOperationForExplanation={handleSelectOperationForExplanation}
                presetCalculation={presetCalculation}
                onClearPreset={() => setPresetCalculation(null)}
              />

              {/* Dica Rápida de Uso das Teclas */}
              <div className="mt-4 p-3 bg-white border border-slate-200 rounded-xl text-center text-xs text-slate-500 shadow-2xs max-w-md mx-auto">
                <span>Atalhos: </span>
                <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded font-mono text-[11px] text-slate-800">
                  0-9
                </kbd>{' '}
                números ·{' '}
                <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded font-mono text-[11px] text-slate-800">
                  + - * / %
                </kbd>{' '}
                operações ·{' '}
                <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded font-mono text-[11px] text-slate-800">
                  Enter
                </kbd>{' '}
                resultado
              </div>
            </div>
          </div>

          {/* Coluna Direita: Painel Educativo (7 Colunas no Desktop) */}
          <div id="desafios" className="lg:col-span-7">
            <EducationalPanel
              pedagogyData={pedagogyData}
              history={calculatorState.history}
              onApplyPercentagePreset={handleApplyPercentagePreset}
              onLoadChallengeIntoCalculator={handleLoadChallenge}
            />
          </div>
        </div>

        {/* Seção Explicativa das 5 Operações Matemáticas */}
        <section id="porcentagem" className="pt-6 border-t border-slate-200">
          <div className="mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
              Revisão Completa
            </span>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              As 5 Operações Matemáticas Explicadas
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Guia rápido para consulta dos estudantes e revisão dos conceitos fundamentais.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* Card 1: Adição */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2 hover:border-blue-300 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <Plus className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Adição (+)</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Juntar e somar quantidades. Suas partes se chamam <strong>Parcelas</strong> e o resultado é a <strong>Soma</strong>.
              </p>
              <div className="text-[11px] font-lcd text-blue-700 bg-blue-50/60 p-2 rounded-lg">
                Ex: 15 + 25 = 40
              </div>
            </div>

            {/* Card 2: Subtração */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2 hover:border-blue-300 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <Minus className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Subtração (−)</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Retirar uma quantia de outra ou calcular a diferença. Minuendo − Subtraendo = <strong>Resto</strong>.
              </p>
              <div className="text-[11px] font-lcd text-blue-700 bg-blue-50/60 p-2 rounded-lg">
                Ex: 50 - 18 = 32
              </div>
            </div>

            {/* Card 3: Multiplicação */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2 hover:border-blue-300 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <X className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Multiplicação (×)</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Repetir a mesma parcela várias vezes. Fator × Fator = <strong>Produto</strong>.
              </p>
              <div className="text-[11px] font-lcd text-blue-700 bg-blue-50/60 p-2 rounded-lg">
                Ex: 6 × 7 = 42
              </div>
            </div>

            {/* Card 4: Divisão */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2 hover:border-blue-300 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <Divide className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Divisão (÷)</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Repartir em partes iguais. Dividendo ÷ Divisor = <strong>Quociente</strong>. Nunca divida por zero!
              </p>
              <div className="text-[11px] font-lcd text-blue-700 bg-blue-50/60 p-2 rounded-lg">
                Ex: 36 ÷ 4 = 9
              </div>
            </div>

            {/* Card 5: Porcentagem */}
            <div className="bg-white p-4 rounded-2xl border-2 border-blue-500 shadow-sm space-y-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                <Percent className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-blue-900">Porcentagem (%)</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Fração de 100 partes. Essencial para calcular descontos e proporções reais na vida prática.
              </p>
              <div className="text-[11px] font-lcd text-blue-800 bg-blue-50 p-2 rounded-lg">
                Ex: 20% de 80 = 16
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Rodapé Limpo */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            Calculadora Educacional de Escritório · Projetada para Estudantes do Ensino Fundamental
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Cores: Azul, Branco e Preto</span>
            <span aria-hidden="true">·</span>
            <span>Sem anúncios</span>
            <span aria-hidden="true">·</span>
            <span>Acessibilidade WCAG AA</span>
          </div>
        </div>
      </footer>

      {/* Modal: Guia do Estudante */}
      {showGuideModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setShowGuideModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-bold text-slate-900">Guia do Estudante</h3>
              </div>
              <button
                onClick={() => setShowGuideModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <p>
                Bem-vindo à sua <strong>Calculadora Educacional de Escritório</strong>! Aqui você não apenas encontra o resultado de uma conta, mas aprende o significado por trás de cada número:
              </p>

              <div className="p-3 bg-slate-50 rounded-xl space-y-2">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide">
                  Como calcular Porcentagem (%):
                </h4>
                <ul className="list-disc pl-4 space-y-1 text-xs">
                  <li>
                    <strong>Saber quanto é uma porcentagem:</strong> Digite <code>200 × 15 %</code> para saber quanto é 15% de 200 (resultado: 30).
                  </li>
                  <li>
                    <strong>Aplicar Desconto de loja:</strong> Digite <code>100 - 20 % =</code> para ver o preço com desconto (resultado: 80).
                  </li>
                  <li>
                    <strong>Aplicar Acréscimo:</strong> Digite <code>100 + 10 % =</code> para ver o total acrescido (resultado: 110).
                  </li>
                </ul>
              </div>

              <div className="p-3 bg-blue-50/60 rounded-xl space-y-1 text-xs text-blue-900">
                <h4 className="font-bold">Treine nos Mini-Desafios:</h4>
                <p>
                  No painel à direita, clique na aba <strong>Mini-Desafios</strong> para resolver problemas práticos e acumular sequências de acertos!
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowGuideModal(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Entendi, vamos começar!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Critérios de Teste da Versão 1 */}
      {showCriteriaModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setShowCriteriaModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-bold text-slate-900">Critérios de Teste (Versão 1)</h3>
              </div>
              <button
                onClick={() => setShowCriteriaModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <p>
                A tabela abaixo lista os cenários e casos de teste aprovados na primeira versão da aplicação:
              </p>

              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left divide-y divide-slate-200">
                  <thead className="bg-slate-50 text-[11px] font-bold text-slate-700 uppercase">
                    <tr>
                      <th className="p-2.5">Caso</th>
                      <th className="p-2.5">Entrada</th>
                      <th className="p-2.5">Resultado Esperado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                    <tr>
                      <td className="p-2.5 font-sans font-semibold text-slate-900">CT01. Adição</td>
                      <td className="p-2.5 text-blue-700">12 + 8 =</td>
                      <td className="p-2.5 text-slate-800">20 + Explicação de parcelas</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-sans font-semibold text-slate-900">CT02. Subtração</td>
                      <td className="p-2.5 text-blue-700">15 - 20 =</td>
                      <td className="p-2.5 text-slate-800">-5 + Explicação de saldo negativo</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-sans font-semibold text-slate-900">CT03. Multiplicação</td>
                      <td className="p-2.5 text-blue-700">4.5 × 2 =</td>
                      <td className="p-2.5 text-slate-800">9 + Adição repetida</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-sans font-semibold text-slate-900">CT04. Divisão por Zero</td>
                      <td className="p-2.5 text-blue-700">8 ÷ 0 =</td>
                      <td className="p-2.5 text-red-600 font-bold">Indeterminado + Aviso pedagógico</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-sans font-semibold text-slate-900">CT05. Porcentagem Direta</td>
                      <td className="p-2.5 text-blue-700">200 × 15 %</td>
                      <td className="p-2.5 text-emerald-700 font-bold">30 + Grade de 100 blocos e fração 15/100</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-sans font-semibold text-slate-900">CT06. Desconto Comercial</td>
                      <td className="p-2.5 text-blue-700">100 - 20 % =</td>
                      <td className="p-2.5 text-slate-800">80 + Detalhe do valor economizado</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowCriteriaModal(false)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
