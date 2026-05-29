/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Copy, Check, Calendar, Heart, MessageCircle, Send, Bookmark, Info, Sparkles, TrendingUp } from "lucide-react";
import { GeneratedCopy } from "../types";

interface InstagramMockupProps {
  copy: GeneratedCopy;
  platform: 'Instagram Feed' | 'Instagram Stories' | 'Reels';
  onSchedule: (copy: GeneratedCopy, date: string) => void;
}

export default function InstagramMockup({ copy, platform, onSchedule }: InstagramMockupProps) {
  const [copied, setCopied] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [showFullCaption, setShowFullCaption] = useState(false);

  const handleCopyText = () => {
    const fullText = `${copy.hook}\n\n${copy.body}\n\n${copy.callToAction}\n\n${copy.hashtags}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduleDate) return;
    onSchedule(copy, scheduleDate);
    setShowScheduleForm(false);
    setScheduleDate("");
  };

  return (
    <div className="bg-[#11141d] border border-gray-800 rounded-xl p-5 shadow-md flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-yellow-400 text-black text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider font-display">
              Preview do Post
            </div>
            <span className="text-xs text-gray-400 font-mono">
              Formula: {copy.formula}
            </span>
          </div>
          <button
            onClick={handleCopyText}
            className="flex items-center gap-1.5 text-xs text-yellow-400 hover:text-yellow-300 font-medium bg-yellow-400/5 hover:bg-yellow-400/10 px-3 py-1.5 rounded-lg border border-yellow-400/20 transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-400" />
                <span>Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar Alinhamento</span>
              </>
            )}
          </button>
        </div>

        {/* Instagam Shell UI Wrapper */}
        <div className="bg-[#080a0f] border border-gray-800 rounded-xl overflow-hidden max-w-[380px] mx-auto shadow-2xl">
          {/* Header */}
          <div className="p-3.5 flex items-center justify-between border-b border-gray-900">
            <div className="flex items-center gap-2.5">
              <div className="relative p-[1.5px] rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600">
                <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-[11px] font-display font-black text-yellow-500 tracking-tighter border border-black">
                  DX
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white leading-none">dragonx.agency</span>
                <span className="text-[9px] text-gray-400 mt-0.5">V4 Company & G4 Growth Partner</span>
              </div>
            </div>
            <div className="flex gap-1 text-gray-400 text-xs">•••</div>
          </div>

          {/* Post Image Visual Preview container (Dynamic custom representation based on theme) */}
          <div className="relative aspect-square w-full bg-gradient-to-br from-[#121620] to-[#1e2538] flex flex-col justify-between p-6 overflow-hidden">
            {/* Background design accents */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl" />

            <div className="flex justify-between items-center z-10">
              <div className="text-[9px] font-mono tracking-widest text-yellow-400/80 font-bold uppercase">
                Dragon X Marketing AI
              </div>
              <div className="text-[10px] text-white/50 font-mono">
                {copy.funnelStage} Funnel
              </div>
            </div>

            {/* Simulated Visual Title Card inside of post to feel interactive and professional */}
            <div className="my-auto text-center px-4 z-10 select-none">
              <h4 className="font-display font-medium text-lg leading-snug text-white tracking-tight break-words drop-shadow-md">
                {copy.hook.replace(/[🚨👑🔥🌍💬💎💡⛔⚡📍]/g, '').slice(0, 70)}...
              </h4>
              <p className="text-[10px] text-yellow-400/90 font-display uppercase tracking-widest mt-2">
                Método {copy.formula} • Performance V4
              </p>
            </div>

            <div className="mt-auto border-t border-white/10 pt-3 z-10 flex flex-col gap-1 bg-black/40 p-2.5 rounded backdrop-blur-[2px]">
              <div className="text-[9px] text-gray-400 font-mono uppercase tracking-wider">💡 Ideia do Criativo:</div>
              <div className="text-[9px] text-gray-200 line-clamp-2 leading-relaxed">
                {copy.imageIdea}
              </div>
            </div>
          </div>

          {/* Engagement Buttons Row */}
          <div className="p-3 pb-2 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Heart className="w-5 h-5 text-gray-300 hover:text-red-500 transition-colors cursor-pointer" />
              <MessageCircle className="w-5 h-5 text-gray-300 cursor-pointer" />
              <Send className="w-5 h-5 text-gray-300 cursor-pointer" />
            </div>
            <Bookmark className="w-5 h-5 text-gray-300 cursor-pointer" />
          </div>

          {/* Likes details */}
          <div className="px-3.5 text-[11px] font-bold text-white">
            {copy.projectedLikes.toLocaleString("pt-BR")} curtidas
          </div>

          {/* Post Description with Show More toggle */}
          <div className="px-3.5 pt-1.5 pb-4 text-[11px] leading-relaxed">
            <span className="font-bold text-white mr-1.5 font-display text-xs">dragonx.agency</span>
            <span className="text-gray-300 whitespace-pre-line">
              {showFullCaption ? (
                <>
                  <span className="font-bold text-yellow-400 block mb-1">{copy.hook}</span>
                  {copy.body}
                  <span className="font-bold block mt-2 text-white">{copy.callToAction}</span>
                  <span className="text-blue-400 block mt-1.5 font-mono text-[10px]">{copy.hashtags}</span>
                </>
              ) : (
                <>
                  <span className="font-bold text-yellow-400">{copy.hook.slice(0, 45)}... </span>
                  <button
                    onClick={() => setShowFullCaption(true)}
                    className="text-gray-400 hover:text-white font-semibold ml-0.5 focus:outline-none"
                  >
                    mais
                  </button>
                </>
              )}
            </span>
            {showFullCaption && (
              <button
                onClick={() => setShowFullCaption(false)}
                className="text-gray-400 hover:text-white font-semibold block mt-1 text-[10px]"
              >
                mostrar menos
              </button>
            )}
          </div>
        </div>

        {/* Prediction Metrics Box (V4 & G4 ROI Analytics) */}
        <div className="mt-5 bg-[#171b26] rounded-xl p-4 border border-gray-800">
          <h4 className="text-xs font-bold text-gray-300 font-display mb-3 flex items-center gap-1.5">
            <TrendingUp className="text-emerald-400 w-4 h-4" /> Métricas Estimadas de Alta Performance
          </h4>
          <div className="grid grid-cols-3 gap-2.5">
            <div className="bg-black/30 p-2.5 rounded-lg border border-gray-800 text-center">
              <div className="text-[9px] text-gray-400 uppercase tracking-wider">Conversão</div>
              <div className="text-xs font-bold text-emerald-400 font-mono mt-0.5">
                {copy.projectedConversionRate}%
              </div>
            </div>
            <div className="bg-black/30 p-2.5 rounded-lg border border-gray-800 text-center">
              <div className="text-[9px] text-gray-400 uppercase tracking-wider">Alcance Est.</div>
              <div className="text-xs font-bold text-yellow-400 font-mono mt-0.5">
                +{(copy.projectedLikes * 12).toLocaleString("pt-BR")}
              </div>
            </div>
            <div className="bg-black/30 p-2.5 rounded-lg border border-gray-800 text-center">
              <div className="text-[9px] text-gray-400 uppercase tracking-wider">Compart.</div>
              <div className="text-xs font-bold text-indigo-400 font-mono mt-0.5">
                {copy.projectedShares}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Direct Scheduling UI */}
      <div className="mt-5 pt-4 border-t border-gray-800">
        {!showScheduleForm ? (
          <button
            onClick={() => setShowScheduleForm(true)}
            className="w-full bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-black font-display font-bold text-xs py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-yellow-500/10"
          >
            <Calendar className="w-4 h-4" /> Agendar Postagem Direta
          </button>
        ) : (
          <form onSubmit={handleScheduleSubmit} className="space-y-3">
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1.5 font-mono">
                Selecione Data & Hora da Postagem
              </label>
              <input
                type="datetime-local"
                required
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                className="w-full bg-[#1b202e] border border-gray-700 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-yellow-400 font-mono"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowScheduleForm(false)}
                className="w-1/2 border border-gray-700 hover:bg-gray-800 text-gray-300 text-xs py-2 rounded-lg transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="w-1/2 bg-yellow-400 hover:bg-yellow-300 text-black font-semibold text-xs py-2 rounded-lg transition-colors cursor-pointer"
              >
                Confirmar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
