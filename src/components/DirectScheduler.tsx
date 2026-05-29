/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { ScheduledPost, FunnelStage, FormulaType } from "../types";
import { CalendarIcon, Clock, CheckCircle, Trash2, Send, Clock3, Eye, FileText } from "lucide-react";

interface DirectSchedulerProps {
  posts: ScheduledPost[];
  onDeletePost: (id: string) => void;
  onPostNow: (id: string) => void;
  onAddInlinePost: (post: Omit<ScheduledPost, 'id' | 'status'>) => void;
}

export default function DirectScheduler({ posts, onDeletePost, onPostNow, onAddInlinePost }: DirectSchedulerProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'scheduled' | 'posted'>('all');
  
  // States for Quick Manual Draft Insertion
  const [quickCaption, setQuickCaption] = useState("");
  const [quickPlatform, setQuickPlatform] = useState<'Instagram Feed' | 'Instagram Stories' | 'Reels'>("Instagram Feed");
  const [quickDate, setQuickDate] = useState("");
  const [quickStage, setQuickStage] = useState<FunnelStage>("ToFu");
  const [quickFormula, setQuickFormula] = useState<FormulaType>("AIDA");

  const filteredPosts = posts.filter(post => {
    if (activeTab === 'all') return true;
    if (activeTab === 'scheduled') return post.status === 'scheduled';
    if (activeTab === 'posted') return post.status === 'posted';
    return true;
  });

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickCaption || !quickDate) return;

    onAddInlinePost({
      caption: quickCaption,
      platform: quickPlatform,
      scheduledDate: quickDate,
      imageIdea: "Vetor limpo personalizado desenhado pela agência.",
      funnelStage: quickStage,
      formula: quickFormula
    });

    setQuickCaption("");
    setQuickDate("");
  };

  return (
    <div className="space-y-6">
      {/* 2-Column Grid: Quick Draft insertion & Listing */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Quick Custom Draft Form */}
        <div className="lg:col-span-5 bg-[#11141d] border border-gray-800 rounded-xl p-5 shadow-sm h-fit">
          <h3 className="font-display font-bold text-base text-white mb-4 flex items-center gap-2">
            <CalendarIcon className="text-yellow-400 w-4 h-4" /> Agendamento Rápido de Campanha
          </h3>
          <form onSubmit={handleQuickSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 font-mono">Legenda da Publicação</label>
              <textarea
                value={quickCaption}
                onChange={(e) => setQuickCaption(e.target.value)}
                placeholder="Insira a copy comercial do post da Agência Dragon X..."
                rows={4}
                required
                className="w-full bg-[#181d2a] border border-gray-800 rounded-lg py-2 px-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-yellow-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 font-mono">Formato</label>
                <select
                  value={quickPlatform}
                  onChange={(e) => setQuickPlatform(e.target.value as any)}
                  className="w-full bg-[#181d2a] border border-gray-800 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-yellow-400"
                >
                  <option value="Instagram Feed">Feed</option>
                  <option value="Instagram Stories">Stories</option>
                  <option value="Reels">Reels</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 font-mono">Campanha / Funil</label>
                <select
                  value={quickStage}
                  onChange={(e) => setQuickStage(e.target.value as any)}
                  className="w-full bg-[#181d2a] border border-gray-800 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-yellow-400"
                >
                  <option value="ToFu">TOFU (Atração)</option>
                  <option value="MoFu">MOFU (Problema)</option>
                  <option value="BoFu">BOFU (Conversão)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 font-mono">Fórmula Copy</label>
                <select
                  value={quickFormula}
                  onChange={(e) => setQuickFormula(e.target.value as any)}
                  className="w-full bg-[#181d2a] border border-gray-800 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-yellow-400"
                >
                  <option value="AIDA">AIDA</option>
                  <option value="PAS">PAS</option>
                  <option value="V4-Company">V4 Company</option>
                  <option value="G4-Growth">G4 Growth</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 font-mono">Data do Agendamento</label>
                <input
                  type="datetime-local"
                  required
                  value={quickDate}
                  onChange={(e) => setQuickDate(e.target.value)}
                  className="w-full bg-[#181d2a] border border-gray-800 rounded-lg py-2 px-3 text-xs text-white font-mono focus:outline-none focus:ring-1 focus:ring-yellow-400"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-yellow-400 hover:bg-yellow-300 text-black text-xs font-display font-bold py-2.5 rounded-lg transition-all cursor-pointer text-center"
            >
              Agendar Publicação Directa
            </button>
          </form>
        </div>

        {/* Timeline Schedules List */}
        <div className="lg:col-span-7 bg-[#11141d] border border-gray-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-gray-800 pb-3">
            <h3 className="font-display font-bold text-base text-white">Fila de Publicação & Logs</h3>
            
            <div className="flex bg-[#181d2a] p-1 rounded-lg border border-gray-800 text-xs">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 rounded-md transition-all cursor-pointer font-medium ${activeTab === 'all' ? "bg-yellow-400 text-black font-bold" : "text-gray-400 hover:text-white"}`}
              >
                Todos
              </button>
              <button
                onClick={() => setActiveTab('scheduled')}
                className={`px-3 py-1.5 rounded-md transition-all cursor-pointer font-medium ${activeTab === 'scheduled' ? "bg-yellow-400 text-black font-bold" : "text-gray-400 hover:text-white"}`}
              >
                Agendados
              </button>
              <button
                onClick={() => setActiveTab('posted')}
                className={`px-3 py-1.5 rounded-md transition-all cursor-pointer font-medium ${activeTab === 'posted' ? "bg-yellow-400 text-black font-bold" : "text-gray-400 hover:text-white"}`}
              >
                Postados
              </button>
            </div>
          </div>

          {/* Timeline Stack list */}
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {filteredPosts.length === 0 ? (
              <div className="text-center py-12 text-gray-400 text-xs flex flex-col items-center">
                <Clock className="w-8 h-8 text-yellow-400/20 mb-2" />
                Nenhum post encontrado nesta categoria.
              </div>
            ) : (
              filteredPosts.map((post) => {
                const isScheduled = post.status === 'scheduled';
                const formattedDate = new Date(post.scheduledDate).toLocaleDateString("pt-BR", {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit'
                });

                return (
                  <div
                    key={post.id}
                    className={`p-4 rounded-lg border transition-all ${
                      post.status === 'posted'
                        ? "bg-[#0f1b16] border-emerald-950/50"
                        : "bg-[#181d2a] border-gray-800"
                    }`}
                  >
                    <div className="flex justify-between items-start gap-4">
                      {/* Meta identifiers & badges */}
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-bold uppercase bg-yellow-400/10 text-yellow-500 px-2 py-0.5 rounded border border-yellow-500/10">
                            {post.platform}
                          </span>
                          <span className="text-[9px] font-mono text-gray-400 bg-black/40 px-1.5 py-0.5 rounded">
                            Stage: {post.funnelStage}
                          </span>
                          <span className="text-[9px] font-mono text-gray-400 bg-black/40 px-1.5 py-0.5 rounded">
                            Fórmula: {post.formula}
                          </span>
                        </div>

                        <p className="text-xs text-gray-300 leading-relaxed line-clamp-3 whitespace-pre-wrap mt-2">
                          {post.caption}
                        </p>

                        <div className="flex items-center gap-4 text-[10px] text-gray-400 font-mono mt-3">
                          <span className="flex items-center gap-1">
                            <Clock3 className="w-3.5 h-3.5 text-yellow-500" />
                            {formattedDate}
                          </span>
                          {post.status === 'posted' ? (
                            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                              <CheckCircle className="w-3.5 h-3.5" /> Postado Automaticamente
                            </span>
                          ) : (
                            <span className="text-yellow-400 font-semibold">Agendado</span>
                          )}
                        </div>
                      </div>

                      {/* Action buttons stack */}
                      <div className="flex flex-col gap-2">
                        {isScheduled && (
                          <button
                            onClick={() => onPostNow(post.id)}
                            title="Publicar Post Imediatamente"
                            className="bg-emerald-500 hover:bg-emerald-400 text-black text-[10px] font-bold py-1.5 px-3 rounded flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Send className="w-3 h-3" /> Postar Já
                          </button>
                        )}
                        <button
                          onClick={() => onDeletePost(post.id)}
                          className="hover:bg-red-500/10 text-gray-500 hover:text-red-400 p-2 rounded cursor-pointer transition-colors"
                          title="Remover Post da Fila"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Creative prompt representation */}
                    <div className="bg-black/30 p-2.5 rounded text-[10px] text-gray-400 mt-3 border border-gray-900 leading-relaxed font-mono">
                      🎨 Prompt de Imagem: {post.imageIdea || "Sem descrição visual"}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
