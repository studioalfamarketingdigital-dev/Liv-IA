/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { TrendingUp, Users, Target, MousePointerClick, ShieldCheck } from "lucide-react";
import { MarketingMetrics } from "../types";

interface FunnelChartProps {
  metrics: MarketingMetrics;
}

export default function LeadFunnelChart({ metrics }: FunnelChartProps) {
  const [selectedStage, setSelectedStage] = useState<'traffic' | 'ctr' | 'leads' | 'conversion' | null>(null);

  // Math calculated dynamically
  const conversionPercent = Number(((metrics.totalLeads * 0.15 * 100) / metrics.totalLeads).toFixed(1)) || 15.0;
  const customersCount = Math.floor(metrics.totalLeads * 0.15);
  const revenueSim = Math.floor(customersCount * metrics.ltv);
  const roi = metrics.spent > 0 ? Number((revenueSim / metrics.spent).toFixed(1)) : 0;

  const funnelStages = [
    {
      id: "traffic" as const,
      label: "Tráfego de Atração (TOFU)",
      icon: Users,
      value: metrics.totalReach.toLocaleString("pt-BR") + " Alcances",
      percent: "100%",
      color: "from-blue-600 to-indigo-500",
      description: "Pessoas impactadas por anúncios e tráfego orgânico no Instagram da Dragon X."
    },
    {
      id: "ctr" as const,
      label: "Engajamento & Cliques (MOFU)",
      icon: MousePointerClick,
      value: `${metrics.ctr}% de Cliques`,
      percent: `${metrics.ctr}% do tráfego`,
      color: "from-amber-500 to-yellow-400",
      description: "Tráfego qualificado focado na quebra de objeções iniciais através de legendas persuasivas."
    },
    {
      id: "leads" as const,
      label: "Captura de Leads (MOFU/BOFU)",
      icon: Target,
      value: metrics.totalLeads.toLocaleString("pt-BR") + " Leads Cadastrados",
      percent: `${((metrics.totalLeads / metrics.totalReach) * 100).toFixed(1)}% do alcance`,
      color: "from-orange-500 to-red-500",
      description: "Contatos de alto potencial capturados via directs, checkout iniciado e links na bio."
    },
    {
      id: "conversion" as const,
      label: "Vendas Convertidas (BOFU)",
      icon: ShieldCheck,
      value: `${customersCount.toLocaleString("pt-BR")} Clientes`,
      percent: `${conversionPercent}% dos leads`,
      color: "from-emerald-500 to-teal-400",
      description: "Clientes pagantes convertidos através de ofertas irresistíveis de alta performance."
    }
  ];

  return (
    <div className="bg-[#11141d] border border-gray-800 rounded-xl p-6 shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h3 className="font-display text-xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="text-yellow-400 w-5 h-5" /> Funil de Conversão Dragon X Growth
          </h3>
          <p className="text-xs text-gray-400">Analise a eficácia das legendas geradas no fluxo de vendas</p>
        </div>
        <div className="flex gap-2">
          <div className="bg-[#181d2a] px-3 py-1 rounded-md border border-gray-800 text-xs text-gray-300">
            Foco: <span className="font-semibold text-yellow-400">ROI Direto (V4 & G4)</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Animated Funnel Graphic Column */}
        <div className="lg:col-span-6 flex flex-col justify-center items-center">
          <div className="w-full max-w-md space-y-2">
            {funnelStages.map((stage, idx) => {
              // Custom scale to model physical funnel representation
              const widths = ["w-full", "w-11/12", "w-9/12", "w-7/12"];
              const opacities = ["bg-opacity-95", "bg-opacity-85", "bg-opacity-75", "bg-opacity-95"];
              const isSelected = selectedStage === stage.id;

              return (
                <div
                  key={stage.id}
                  onClick={() => setSelectedStage(isSelected ? null : stage.id)}
                  className={`cursor-pointer group relative flex flex-col items-center justify-center p-4 transition-all duration-300 mx-auto rounded-lg text-center ${widths[idx]} bg-gradient-to-r ${stage.color} ${
                    isSelected 
                      ? "ring-2 ring-yellow-400 scale-[1.02] shadow-[0_0_15px_rgba(234,179,8,0.25)]" 
                      : "hover:scale-[1.01]"
                  } border border-transparent`}
                >
                  <div className="flex items-center justify-center gap-2 text-white">
                    <stage.icon className="w-4 h-4 text-white" />
                    <span className="font-display font-bold text-xs uppercase tracking-wider">{stage.label}</span>
                  </div>
                  <div className="text-white text-base font-bold mt-1">{stage.value}</div>
                  <div className="absolute right-3 top-3 text-[10px] bg-black/40 text-gray-200 px-1.5 py-0.5 rounded font-mono">
                    {stage.percent}
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-[10px] text-gray-400 mt-4 text-center">
            💡 Dica: Clique nas camadas do funil acima para desmembrar a análise estratégica.
          </p>
        </div>

        {/* Selected Stage Detail Description & Global ROI Panel */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div className="bg-[#181d2a] rounded-lg p-5 border border-gray-800 min-h-[140px]">
            {selectedStage ? (
              <div>
                {(() => {
                  const data = funnelStages.find(s => s.id === selectedStage);
                  if (!data) return null;
                  return (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${data.color}`} />
                        <h4 className="font-bold text-white font-display text-sm uppercase tracking-wider">{data.label}</h4>
                      </div>
                      <p className="text-xs text-gray-300 leading-relaxed">{data.description}</p>
                      <div className="bg-black/30 p-2.5 rounded text-xs mt-2 border border-gray-900 flex justify-between">
                        <span className="text-gray-400">Conversão de Etapa:</span>
                        <span className="text-yellow-400 font-mono font-bold">{data.percent}</span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center h-full py-4">
                <Target className="w-8 h-8 text-yellow-500/50 mb-2" />
                <h4 className="text-xs font-bold text-gray-300 font-display">Diagnosticando G4 & V4 Framework</h4>
                <p className="text-[11px] text-gray-400 max-w-xs mt-1 leading-relaxed">
                  Trabalhamos focados em funis autossustentáveis. Selecione qualquer camada à esquerda para auditar o plano.
                </p>
              </div>
            )}
          </div>

          {/* Quick Metrics KPIs inside of funnel */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#121622] rounded-lg p-4 border border-gray-800/80">
              <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Faturamento Estimado</div>
              <div className="text-lg font-bold text-emerald-400 font-mono mt-1">
                R$ {revenueSim.toLocaleString("pt-BR")}
              </div>
              <div className="text-[9px] text-gray-400 mt-0.5">Com base no LTV médio</div>
            </div>

            <div className="bg-[#121622] rounded-lg p-4 border border-gray-800/80">
              <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Retorno de Anúncio (ROI)</div>
              <div className="text-lg font-bold text-yellow-400 font-mono mt-1">
                {roi}x <span className="text-[10px] text-gray-400">Retorno</span>
              </div>
              <div className="text-[9px] text-gray-400 mt-0.5">Faturamento / Gasto em Anúncios</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
