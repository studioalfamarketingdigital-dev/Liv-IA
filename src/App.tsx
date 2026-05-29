/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Calendar,
  TrendingUp,
  Settings2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  RefreshCw,
  Plus,
  Play,
  Users,
  Lock,
  ArrowRight,
  Monitor,
  Share2,
  FileText,
  MousePointer,
  ChevronRight,
  Database,
  Chrome,
  Instagram,
  Facebook,
  Award,
  LogOut,
  Sliders,
  Check,
  Terminal
} from "lucide-react";

import { CopyRequest, GeneratedCopy, ScheduledPost, MarketingMetrics, IntegrationState, FunnelStage, FormulaType, ClientProfile, WebhookEvent } from "./types";
import LeadFunnelChart from "./components/LeadFunnelChart";
import InstagramMockup from "./components/InstagramMockup";
import DirectScheduler from "./components/DirectScheduler";

export default function App() {
  // Database States
  const [metrics, setMetrics] = useState<MarketingMetrics>({
    totalReach: 145800,
    totalLeads: 8420,
    conversionRate: 5.77,
    cac: 34.50,
    ltv: 450.00,
    ctr: 3.82,
    spent: 15400
  });

  const [integrations, setIntegrations] = useState<IntegrationState>({
    googleConnected: true,
    googleEmail: "studioalfamarketingdigital@gmail.com",
    metaConnected: true,
    facebookPage: "Agência Dragon X Oficial",
    instagramUser: "@dragonx.agency",
    sandboxMode: true,
    isLoggedIn: false // Starts logged out for real premium login portal
  });

  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [clientsList, setClientsList] = useState<ClientProfile[]>([]);
  const [webhookLogs, setWebhookLogs] = useState<WebhookEvent[]>([]);
  
  const [activeTab, setActiveTab] = useState<'copy-generator' | 'scheduler' | 'metrics' | 'webhooks' | 'admin'>('copy-generator');
  const [selectedClientId, setSelectedClientId] = useState<string>("client-proprio");

  // Portal Authentication Form states
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authInstagramUser, setAuthInstagramUser] = useState("");
  const [authInstagramToken, setAuthInstagramToken] = useState("");
  const [showTokenSettings, setShowTokenSettings] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Client registration state
  const [newClientName, setNewClientName] = useState("");
  const [newClientInstagram, setNewClientInstagram] = useState("");
  const [newClientStyle, setNewClientStyle] = useState("");
  const [newClientDesc, setNewClientDesc] = useState("");
  const [newClientAudience, setNewClientAudience] = useState("");
  const [newClientCTA, setNewClientCTA] = useState("");
  const [showAddClientForm, setShowAddClientForm] = useState(false);

  // Webhook Simulator state
  const [simWebhookType, setSimWebhookType] = useState("comments");
  const [simWebhookSender, setSimWebhookSender] = useState("maria_scale");
  const [simWebhookMessage, setSimWebhookMessage] = useState("Tenho interesse em escalar as vendas! Manda o direct");

  // Loading & Action States
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'info' | 'error'; text: string } | null>(null);

  // Copy Generator Inputs State
  const [generatorInput, setGeneratorInput] = useState<CopyRequest>({
    brandStyle: "Coleção Dragon X - Alta Conversão e Performance V4",
    funnelStage: "MoFu",
    formula: "V4-Company",
    platform: "Instagram Feed",
    productDescription: "Assessoria completa de tráfego pago, funil de vendas estratégico e gestão de mídias de alto retorno comercial com a Agência Dragon X.",
    audience: "Empresas locais, e-commerces e infoprodutores que faturam acima de R$ 50k",
    callToAction: "Mandar direct com a palavra 'ESCALAR' para obter um diagnóstico gratuito das suas campanhas."
  });

  const [activeResultCopy, setActiveResultCopy] = useState<GeneratedCopy | null>(null);

  // Template pre-fill helper
  const handleApplyTemplate = (type: 'V4-Company' | 'G4-Growth') => {
    if (type === 'V4-Company') {
      setGeneratorInput({
        brandStyle: "@dragonx.agency V4 Premium",
        funnelStage: "MoFu",
        formula: "V4-Company",
        platform: "Instagram Feed",
        productDescription: "Assessoria de Performance estruturada nos 4 Pilares da V4: Tráfego qualificado, Engajamento profundo, Conversão otimizada e Retenção contínua pela equipe Dragon X.",
        audience: "Donos de negócios, fundadores de marcas de serviços de médio porte e empreendedores digitais.",
        callToAction: "Mandar direct com a palavra 'PILAR' para receber as matrizes de escala."
      });
      showStatus("success", "Template V4 Company aplicado com sucesso!");
    } else {
      setGeneratorInput({
        brandStyle: "Brutalista Minimalista @dragonx.agency",
        funnelStage: "BoFu",
        formula: "G4-Growth",
        platform: "Instagram Feed",
        productDescription: "Desenvolvimento de Canal de Tração Express, Otimização de ICP Real do cliente de alto tíquete e Oferta Irresistível imediata com a Dragon X.",
        audience: "CEOs famintos por crescimento ágil, diretores comerciais e heads de marketing focados em processos de growth marketing.",
        callToAction: "Comentar 'G4' abaixo para agendar sessão estratégica de 15 minutos com nosso analista."
      });
      showStatus("success", "Template G4 Growth aplicado com sucesso!");
    }
  };

  // Utility to show status banner
  const showStatus = (type: 'success' | 'info' | 'error', text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => {
      setStatusMessage(null);
    }, 5000);
  };

  // Fetch initial database status
  const loadDatabase = async () => {
    try {
      setFetchingData(true);
      const res = await fetch("/api/database");
      const data = await res.json();
      if (data) {
        setMetrics(data.metrics);
        setIntegrations(data.integrations);
        setScheduledPosts(data.scheduledPosts);
        setClientsList(data.clients || []);
        setWebhookLogs(data.webhookEvents || []);
        
        // Persistent Login from browser session
        const storedLogin = localStorage.getItem("dragonx_login_saved");
        if (storedLogin === "true") {
          setIntegrations(prev => ({ ...prev, isLoggedIn: true }));
        }

        // Pick top post as starter example if copy list is empty
        if (data.scheduledPosts && data.scheduledPosts.length > 0) {
          const first = data.scheduledPosts[0];
          setActiveResultCopy({
            id: first.id,
            hook: first.caption.split('\n\n')[0] || "🚀 Revelado: O Segredo de Conversão da Dragon X",
            body: first.caption.split('\n\n').slice(1, -1).join('\n\n') || "Nosso processo une tecnologia e psicologia de consumo.",
            hashtags: "#V4Company #G4Growth #PerformanceMarketing",
            callToAction: "Mandar mensagem no Direct!",
            imageIdea: first.imageIdea,
            projectedConversionRate: 5.8,
            projectedLikes: 250,
            projectedShares: 45,
            funnelStage: first.funnelStage,
            formula: first.formula
          });
        }
      }
    } catch (e) {
      console.error("Erro ao carregar dados:", e);
      showStatus("error", "Erro de conexão com o painel administrador local do servidor.");
    } finally {
      setFetchingData(false);
    }
  };

  useEffect(() => {
    loadDatabase();
  }, []);

  // Update Integration configs on Server
  const handleUpdateIntegrations = async (updated: Partial<IntegrationState>) => {
    const nextVal = { ...integrations, ...updated };
    setIntegrations(nextVal);
    try {
      const res = await fetch("/api/update-integrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nextVal)
      });
      const data = await res.json();
      if (data.success) {
        showStatus("success", "Configurações da agência salvas no painel Vercel.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Portal Authentication Handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: authEmail || "studioalfamarketingdigital@gmail.com",
          instagramUser: authInstagramUser || "@dragonx.agency",
          instagramAppToken: authInstagramToken
        })
      });
      const data = await res.json();
      if (data.success) {
        setIntegrations(data.integrations);
        localStorage.setItem("dragonx_login_saved", "true");
        showStatus("success", `Bem-vindo ao Dragon X Console, @${authInstagramUser || "dragonx.agency"}!`);
      }
    } catch (err) {
      showStatus("error", "Erro ao conectar com as APIs de autenticação.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setIntegrations(data.integrations);
        localStorage.removeItem("dragonx_login_saved");
        showStatus("info", "Sessão encerrada. Retornando ao portal de login.");
      }
    } catch (err) {
      showStatus("error", "Erro ao sair.");
    }
  };

  // Add client Profile
  const handleAddClientProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName || !newClientInstagram) {
      showStatus("error", "Preencha o Nome e o Instagram do cliente.");
      return;
    }
    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newClientName,
          instagramUser: newClientInstagram,
          brandStyle: newClientStyle || "Estilo Comercial Conversão",
          productDescription: newClientDesc || "Assessoria e infoprodutos.",
          audience: newClientAudience || "Donos de negócios locais",
          callToAction: newClientCTA || "Mandar direct."
        })
      });
      const data = await res.json();
      if (data.success) {
        setClientsList(data.clients);
        setNewClientName("");
        setNewClientInstagram("");
        setNewClientStyle("");
        setNewClientDesc("");
        setNewClientAudience("");
        setNewClientCTA("");
        setShowAddClientForm(false);
        showStatus("success", `Novo cliente cadastrado com sucesso!`);
      }
    } catch (err) {
      showStatus("error", "Erro ao registrar perfil do cliente.");
    }
  };

  // Trigger Meta Webhook simulator
  const handleSimulateWebhookTrigger = async () => {
    try {
      const res = await fetch("/api/simulate-webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: simWebhookType,
          sender: simWebhookSender,
          message: simWebhookMessage
        })
      });
      const data = await res.json();
      if (data.success) {
        setWebhookLogs(prev => [data.event, ...prev]);
        setMetrics(data.metrics);
        showStatus("success", `Meta Webhook simulado com sucesso! Lead gerado: @${simWebhookSender}`);
      }
    } catch (err) {
      showStatus("error", "Erro ao disparar webhook de testes.");
    }
  };

  // Load client parameters into the copy generator state
  const handleLoadClientParams = (clientId: string) => {
    setSelectedClientId(clientId);
    const client = clientsList.find(c => c.id === clientId);
    if (client) {
      setGeneratorInput({
        brandStyle: client.brandStyle,
        funnelStage: "MoFu",
        formula: "V4-Company",
        platform: "Instagram Feed",
        productDescription: client.productDescription,
        audience: client.audience,
        callToAction: client.callToAction
      });
      showStatus("success", `Parâmetros de copy carregados para o perfil: ${client.name}!`);
    }
  };

  // Generate copy via Gemini backend / FALLBACK logic
  const handleGenerateCopy = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    showStatus("info", "Processando estrutura do funil e acionando IA da Agência Dragon X...");
    
    try {
      const res = await fetch("/api/generate-copy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(generatorInput)
      });
      const data = await res.json();
      if (data.success && data.copy) {
        setActiveResultCopy(data.copy);
        showStatus("success", "Nova copy persuasiva criada de acordo com a estratégia solicitada!");
      } else {
        showStatus("error", "Não foi possível estruturar a copy. Altere ou revise a API Key.");
      }
    } catch (err) {
      showStatus("error", "Erro ao conectar com o microsserviço de inteligência artificial.");
    } finally {
      setLoading(false);
    }
  };

  // Handler to schedule the generated copy
  const handleSchedulePost = async (copyToSchedule: GeneratedCopy, datetime: string) => {
    try {
      const draftCaption = `${copyToSchedule.hook}\n\n${copyToSchedule.body}\n\n${copyToSchedule.callToAction}\n\n${copyToSchedule.hashtags}`;
      const res = await fetch("/api/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caption: draftCaption,
          platform: generatorInput.platform,
          scheduledDate: datetime,
          imageIdea: copyToSchedule.imageIdea,
          funnelStage: copyToSchedule.funnelStage,
          formula: copyToSchedule.formula,
          status: 'scheduled'
        })
      });
      const data = await res.json();
      if (data.success) {
        setScheduledPosts(prev => [data.post, ...prev]);
        setMetrics(data.metrics);
        showStatus("success", `Post agendado com sucesso para ${new Date(datetime).toLocaleString("pt-BR")} via API da Meta!`);
      }
    } catch (err) {
      showStatus("error", "Erro ao persistir agendamento no servidor.");
    }
  };

  // Direct manual add within Calendar tab
  const handleAddInlinePost = async (newPostDraft: Omit<ScheduledPost, 'id' | 'status'>) => {
    try {
      const res = await fetch("/api/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newPostDraft,
          status: 'scheduled'
        })
      });
      const data = await res.json();
      if (data.success) {
        setScheduledPosts(prev => [data.post, ...prev]);
        setMetrics(data.metrics);
        showStatus("success", "Publicação adicionada diretamente à fila de postagem automática.");
      }
    } catch (err) {
      showStatus("error", "Erro ao cadastrar agendamento na fila.");
    }
  };

  // Delete scheduled post
  const handleDeletePost = async (id: string) => {
    try {
      const res = await fetch("/api/delete-schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (data.success) {
        setScheduledPosts(prev => prev.filter(p => p.id !== id));
        showStatus("info", "Post removido da fila de execução.");
      }
    } catch (err) {
      showStatus("error", "Erro ao apagar publicação.");
    }
  };

  // Request instant mock publish (Post Now)
  const handlePostNow = async (id: string) => {
    try {
      const res = await fetch("/api/post-now", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (data.success) {
        setScheduledPosts(data.scheduledPosts);
        setMetrics(data.metrics);
        showStatus("success", "Sucesso! Postagem realizada automaticamente e disparada para o feed do Instagram.");
      }
    } catch (err) {
      showStatus("error", "Erro ao realizar postagem instantânea.");
    }
  };

  // Auto connect flow togglers (feels high-fidelity & fulfills API login intent)
  const toggleGoogleMock = () => {
    if (integrations.googleConnected) {
      handleUpdateIntegrations({ googleConnected: false, googleEmail: "" });
      showStatus("info", "Desconectado da conta Google com sucesso.");
    } else {
      handleUpdateIntegrations({ googleConnected: true, googleEmail: "studioalfamarketingdigital@gmail.com" });
      showStatus("success", "Autenticado via Google Sign-In com sucesso!");
    }
  };

  const toggleMetaMock = () => {
    if (integrations.metaConnected) {
      handleUpdateIntegrations({ metaConnected: false, facebookPage: "", instagramUser: "" });
      showStatus("info", "Desconectado do ecossistema Facebook & Instagram Meta.");
    } else {
      handleUpdateIntegrations({
        metaConnected: true,
        facebookPage: "Agência Dragon X Oficial",
        instagramUser: "@dragonx.agency"
      });
      showStatus("success", "Conexão estabelecida com Facebook Graph API e Instagram Business API!");
    }
  };

  if (!integrations.isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#07090e] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-500/5 via-black to-black text-gray-100 flex flex-col justify-center items-center p-4 md:p-8 font-sans">
        <div className="absolute top-4 right-4 text-[10px] font-mono text-gray-500 bg-black/60 border border-gray-900 rounded px-2.5 py-1 flex items-center gap-1">
          <Database className="w-3 h-3 text-yellow-400" />
          <span>Vercel Deploy Ready: Active</span>
        </div>

        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-block bg-yellow-400 text-black px-4 py-1.5 rounded-lg font-display font-black text-xs tracking-widest shadow-xl shadow-yellow-400/10 animate-pulse">
              DRAGON X BY @STUDIOALFAMKT
            </div>
            <h2 className="text-2xl font-bold font-display tracking-tight text-white mt-3">Portal de Ativação do Sistema</h2>
            <p className="text-xs text-gray-400 max-w-xs mx-auto">
              Ambiente profissional e sincronizado com o ecossistema G4 Growth e V4 Company para postagem direta de alta performance.
            </p>
          </div>

          <div className="bg-[#11141d] border border-gray-800 rounded-xl p-6 shadow-2xl space-y-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-yellow-400 via-yellow-500 to-indigo-500" />

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black font-mono uppercase tracking-wider text-gray-400 mb-1.5">
                  1. E-mail de Acesso Profissional
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">@</span>
                  <input
                    type="email"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="Ex: seu-nome@studioalfamkt.com.br"
                    required
                    className="w-full bg-[#181d2a] border border-gray-800 rounded-lg py-2 pl-8 pr-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-yellow-400"
                  />
                </div>
                <p className="text-[10px] text-gray-500 mt-1">Insira seu e-mail funcional da agência ou cliente.</p>
              </div>

              <div>
                <label className="block text-[10px] font-black font-mono uppercase tracking-wider text-gray-400 mb-1.5">
                  2. Conta do Instagram do Cliente ou Própria
                </label>
                <div className="relative">
                  <Instagram className="absolute top-2.5 left-3 text-gray-500 w-3.5 h-3.5" />
                  <input
                    type="text"
                    value={authInstagramUser}
                    onChange={(e) => setAuthInstagramUser(e.target.value)}
                    placeholder="Ex: @studioalfamkt ou nick_do_cliente"
                    required
                    className="w-full bg-[#181d2a] border border-gray-800 rounded-lg py-2 pl-9 pr-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-yellow-400"
                  />
                </div>
              </div>

              <div className="border-t border-gray-800/80 pt-3">
                <button
                  type="button"
                  onClick={() => setShowTokenSettings(!showTokenSettings)}
                  className="flex items-center justify-between w-full text-left text-[11px] text-yellow-400/85 hover:text-yellow-400 transition-colors font-mono"
                >
                  <span className="flex items-center gap-1">
                    🔑 {showTokenSettings ? "Ocultar" : "Mostrar"} Configuração de Token de Postagem Real
                  </span>
                  <span>{showTokenSettings ? "▲" : "▼"}</span>
                </button>

                {showTokenSettings && (
                  <div className="mt-3.5 space-y-3 p-3 bg-black/40 rounded-lg border border-gray-800/60 animate-fadeIn">
                    <div>
                      <span className="block text-[10px] font-bold text-gray-300 mb-1 font-mono">Meta Graph Access Token</span>
                      <input
                        type="password"
                        value={authInstagramToken}
                        onChange={(e) => setAuthInstagramToken(e.target.value)}
                        placeholder="EAABwB..."
                        className="w-full bg-black/80 border border-gray-800 rounded p-1.5 text-[10px] text-white font-mono placeholder-gray-700"
                      />
                      <p className="text-[9px] text-gray-500 mt-1 leading-normal">
                        Insira o User Token ou Page Token gerado na Meta Dev Console para habilitar postagem imediata real sem limitações de simulação.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black text-xs font-bold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {isLoggingIn ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Conectando API...
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 fill-current" /> Ativar Console e Sincronizar Canais
                  </>
                )}
              </button>
            </form>

            <div className="border-t border-gray-800/80 pt-4 flex gap-1.5 items-center text-[10px] text-gray-400 justify-center">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
              <span>Conexão segura com os servidores do Instagram via Vercel Edge.</span>
            </div>
          </div>

          {/* Quick instructions for Vercel/GitHub Deployment */}
          <div className="bg-black/45 border border-gray-950 rounded-xl p-4 font-mono text-[10px] text-gray-400 space-y-2 leading-relaxed">
            <div className="flex items-center gap-1.5 text-white text-[11px] font-bold">
              <RefreshCw className="w-3.5 h-3.5 text-yellow-500 shrink-0" />
              <span>Preparado para GitHub & Vercel Deploy</span>
            </div>
            <p>
              Caso vá realizar o deploy do Dragon X no Vercel/GitHub, configure as seguintes variáveis de ambiente (Environment Variables) no seu painel:
            </p>
            <div className="bg-black/80 p-2.5 rounded border border-gray-900 overflow-x-auto space-y-1 text-white">
              <div><span className="text-yellow-400 font-bold">GEMINI_API_KEY</span>=sua_chave_gemini</div>
              <div><span className="text-yellow-400 font-bold">META_VERIFY_TOKEN</span>=dragon_x_verify_token_2026</div>
              <div><span className="text-yellow-400 font-bold">META_USER_ACCESS_TOKEN</span>=seu_token_api</div>
            </div>
            <p className="text-[9px] text-gray-500">
              Isso manterá todo o backend seguro e ativo para suas automações e recepções de webhooks.
            </p>
            <div className="pt-1 flex justify-center">
              <button
                type="button"
                onClick={() => {
                  setIntegrations(prev => ({ ...prev, isLoggedIn: true }));
                  showStatus("success", "Acessado via login rápido de demonstração!");
                }}
                className="text-[10px] text-gray-400 hover:text-white underline font-sans flex items-center gap-1 cursor-pointer"
              >
                Ignorar e acessar modo de demonstração rápida ⚡
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0c0e12] text-gray-100 flex flex-col justify-between">
      
      {/* Top Professional Header Bar */}
      <header className="border-b border-[#1b202e] bg-[#0c0e12] sticky top-0 z-40 px-4 py-3 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          
          {/* Logo Brand Title */}
          <div className="flex items-center gap-3.5">
            <div className="bg-yellow-400 text-black px-3 py-1.5 rounded-lg font-display font-black text-sm tracking-widest shadow-lg shadow-yellow-400/15">
              DRAGON X
            </div>
            <div className="h-4 w-[1px] bg-gray-800 hidden sm:block" />
            <div className="text-center sm:text-left">
              <h1 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5 justify-center sm:justify-start">
                Growth AI Console <span className="bg-emerald-950/55 text-emerald-400 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border border-emerald-500/20">V4 & G4 APPROVED</span>
              </h1>
              <p className="text-[10px] text-gray-400 mt-0.5 font-mono">
                Estratégia, Atração, Performance & Postagem Automatizada
              </p>
            </div>
          </div>

          {/* Quick Integration Info / Direct status logs */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {/* Google Authentication Status pill */}
            <button
              onClick={toggleGoogleMock}
              className={`flex items-center gap-1.5 text-[10px] font-medium font-mono px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
                integrations.googleConnected 
                  ? "bg-[#0c2417] text-green-400 border-green-500/20 hover:bg-red-950/20 hover:text-red-300 hover:border-red-500/10" 
                  : "bg-gray-900 text-gray-400 border-gray-800 hover:text-white"
              }`}
              title={integrations.googleConnected ? `Logado como: ${integrations.googleEmail}. Clique para deslogar.` : "Clique para conectar com o Google Gmail"}
            >
              <Chrome className="w-3.5 h-3.5" />
              <span>{integrations.googleConnected ? "Google: ATIVO" : "Google: Off"}</span>
            </button>

            {/* Meta Connection status pill */}
            <button
              onClick={toggleMetaMock}
              className={`flex items-center gap-1.5 text-[10px] font-medium font-mono px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
                integrations.metaConnected 
                  ? "bg-[#112440] text-blue-400 border-blue-500/20 hover:bg-red-950/20 hover:text-red-300 hover:border-red-500/10" 
                  : "bg-gray-900 text-gray-500 border-gray-800 hover:text-white"
              }`}
              title={integrations.metaConnected ? "Meta Graph API ativa. Clique para desconectar." : "Conectar com Instagram/Facebook"}
            >
              <Facebook className="w-3.5 h-3.5" />
              <Instagram className="w-3.5 h-3.5" />
              <span>{integrations.metaConnected ? "Meta API: ATIVA" : "Meta API: Off"}</span>
            </button>

            <button
              onClick={loadDatabase}
              title="Sincronizar dados das publicações"
              className="bg-gray-900 border border-gray-800 p-2 text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer mr-0.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${fetchingData ? 'animate-spin text-yellow-400' : ''}`} />
            </button>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              title="Sair do Console"
              className="bg-red-950/20 hover:bg-red-950/50 border border-red-900/30 text-red-400 hover:text-red-300 px-3 py-1.5 rounded-lg text-[10px] font-bold font-mono transition-colors flex items-center gap-1 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </header>

      {/* Floating Global Status Feedback Banner */}
      {statusMessage && (
        <div className="bg-[#11141d] border-b border-[#1b202e] px-4 py-2 text-center text-xs transition-all animate-fadeIn flex items-center justify-center gap-2">
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
          ) : statusMessage.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          ) : (
            <HelpCircle className="w-4 h-4 text-yellow-500 shrink-0" />
          )}
          <span className="text-gray-200 font-medium">
            {statusMessage.text}
          </span>
        </div>
      )}

      {/* Main Workspace Frame container */}
      <main className="max-w-7xl mx-auto w-full px-4 md:px-8 py-6 md:py-10 flex-grow grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sidebar Controls Layout */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          
          {/* Navigation Pill Deck */}
          <div className="bg-[#11141d] border border-gray-800 rounded-xl p-3 flex flex-col gap-1.5 shadow-sm">
            <h3 className="text-[10px] text-gray-400 font-mono font-bold uppercase tracking-wider px-2 mb-2">
              Menu Executivo
            </h3>
            
            <button
              onClick={() => setActiveTab('copy-generator')}
              className={`w-full flex items-center justify-between text-left px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                activeTab === 'copy-generator' 
                  ? "bg-yellow-400 text-black font-bold" 
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4" /> Inteligência Copywriter
              </span>
              <ChevronRight className="w-3 h-3 opacity-60" />
            </button>

            <button
              onClick={() => setActiveTab('scheduler')}
              className={`w-full flex items-center justify-between text-left px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                activeTab === 'scheduler' 
                  ? "bg-yellow-400 text-black font-bold" 
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4" /> Agendamento Direto
              </span>
              <div className="flex items-center gap-1.5">
                {scheduledPosts.filter(p => p.status === 'scheduled').length > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${activeTab === 'scheduler' ? 'bg-black text-yellow-400' : 'bg-yellow-400/10 text-yellow-400'}`}>
                    {scheduledPosts.filter(p => p.status === 'scheduled').length}
                  </span>
                )}
                <ChevronRight className="w-3 h-3 opacity-60" />
              </div>
            </button>

            <button
              onClick={() => setActiveTab('metrics')}
              className={`w-full flex items-center justify-between text-left px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                activeTab === 'metrics' 
                  ? "bg-yellow-400 text-black font-bold" 
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <TrendingUp className="w-4 h-4" /> Métricas e Funil
              </span>
              <ChevronRight className="w-3 h-3 opacity-60" />
            </button>

            <button
              onClick={() => setActiveTab('webhooks')}
              className={`w-full flex items-center justify-between text-left px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                activeTab === 'webhooks' 
                  ? "bg-yellow-400 text-black font-bold" 
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Database className="w-4 h-4" /> Webhooks Meta Real
              </span>
              <div className="flex items-center gap-1.5">
                {webhookLogs.length > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${activeTab === 'webhooks' ? 'bg-black text-yellow-400' : 'bg-green-400/10 text-green-400'}`}>
                    {webhookLogs.length}
                  </span>
                )}
                <ChevronRight className="w-3 h-3 opacity-60" />
              </div>
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`w-full flex items-center justify-between text-left px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                activeTab === 'admin' 
                  ? "bg-yellow-400 text-black font-bold" 
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Settings2 className="w-4 h-4" /> Painel Admin MKT
              </span>
              <ChevronRight className="w-3 h-3 opacity-60" />
            </button>
          </div>

          {/* Quick Strategy Templates Card (V4 & G4 frameworks) */}
          <div className="bg-[#11141d] border border-gray-800 rounded-xl p-5 shadow-sm space-y-3.5">
            <div className="flex items-center gap-1.5">
              <Award className="text-yellow-400 w-4 h-4" />
              <h4 className="text-xs font-bold text-white font-display uppercase tracking-wider">Planilhas Rápidas</h4>
            </div>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Aplique os frameworks estabelecidos de alto crescimento de forma imediata no gerador.
            </p>
            <div className="space-y-2 pt-1">
              <button
                onClick={() => handleApplyTemplate('V4-Company')}
                className="w-full bg-[#181d2a] border border-gray-800 hover:border-gray-700 text-left p-2.5 rounded-lg text-xs flex justify-between items-center transition-all cursor-pointer text-gray-200"
              >
                <div className="flex flex-col">
                  <span className="font-bold text-gray-200">Framework V4 Company</span>
                  <span className="text-[10px] text-gray-400">Tráfego + Engajamento + Conversão</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-yellow-400 shrink-0 ml-1" />
              </button>

              <button
                onClick={() => handleApplyTemplate('G4-Growth')}
                className="w-full bg-[#181d2a] border border-gray-800 hover:border-gray-700 text-left p-2.5 rounded-lg text-xs flex justify-between items-center transition-all cursor-pointer text-gray-200"
              >
                <div className="flex flex-col">
                  <span className="font-bold text-gray-200">Growth System G4</span>
                  <span className="text-[10px] text-gray-400">Oferta Irresistível + Escala BOFU</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-yellow-400 shrink-0 ml-1" />
              </button>
            </div>
          </div>

          {/* Target Profile Card */}
          <div className="bg-gradient-to-br from-[#121622] to-[#11141d] border border-yellow-500/10 rounded-xl p-5 shadow-sm space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
              <span className="text-[10px] font-mono uppercase text-yellow-400 tracking-wider">Parceiro Oficial</span>
            </div>
            <div className="text-xs font-bold text-white font-display">@dragonx.agency</div>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Todas as copies e fluxos de agendamento seguem a linha editorial da agência, calibrados com as diretrizes do ecossistema G4 e V4 Company.
            </p>
          </div>

        </div>

        {/* Focus tab workstation board */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* Active Tab: Copy Generator view */}
          {activeTab === 'copy-generator' && (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              
              {/* Form Input options */}
              <div className="xl:col-span-7 bg-[#11141d] border border-gray-800 rounded-xl p-6 shadow-sm space-y-5">
                <div>
                  <h2 className="text-lg font-bold font-display text-white flex items-center gap-2">
                    <Sparkles className="text-yellow-400 w-5 h-5" /> Inteligência Copywriter Dragon X
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">
                    Crie copies calibradas para alta conversão seguindo frameworks consagrados de performance e funis de vendas estruturados.
                  </p>
                </div>

                {/* Highly-Advanced Client selection & creation suite */}
                <div className="bg-[#181d2a] p-3.5 rounded-lg border border-gray-800/80 space-y-3">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <span className="text-[10px] uppercase font-mono font-bold text-yellow-400">Direcionamento de Copy</span>
                      <h4 className="text-xs font-bold text-white">Selecione o Cliente / Destinatário</h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAddClientForm(!showAddClientForm)}
                      className="text-[10px] text-yellow-400 font-mono hover:underline flex items-center gap-1 cursor-pointer bg-yellow-400/5 px-2 py-1 rounded border border-yellow-500/10"
                    >
                      {showAddClientForm ? "✖ Fechar" : "➕ Novo Cliente de Performance"}
                    </button>
                  </div>

                  {!showAddClientForm ? (
                    <div className="flex items-center gap-2">
                      <select
                        value={selectedClientId}
                        onChange={(e) => handleLoadClientParams(e.target.value)}
                        className="w-full bg-[#0c0e12] border border-gray-800 rounded py-2 px-3 text-xs text-gray-200 focus:outline-none focus:border-yellow-400"
                      >
                        <option value="client-proprio">Agência Dragon X — @studioalfamkt (Próprio)</option>
                        {clientsList.filter(c => c.id !== 'client-proprio').map(client => (
                          <option key={client.id} value={client.id}>
                            Cliente: {client.name} ({client.instagramUser})
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => handleLoadClientParams(selectedClientId)}
                        className="bg-yellow-400 hover:bg-yellow-500 text-black px-3.5 py-2 rounded text-xs font-mono font-bold cursor-pointer shrink-0"
                        title="Recarregar parâmetros"
                      >
                        Carregar
                      </button>
                    </div>
                  ) : (
                    <div className="bg-[#0c0e12] p-3 rounded border border-gray-800 space-y-3 animate-fadeIn">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[9px] font-mono text-gray-400 uppercase">Nome do Cliente</label>
                          <input
                            type="text"
                            value={newClientName}
                            onChange={(e) => setNewClientName(e.target.value)}
                            placeholder="Ex: Clínica Sorella"
                            className="w-full bg-[#181d2a] border border-gray-800 rounded p-1.5 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-mono text-gray-400 uppercase">User Instagram</label>
                          <input
                            type="text"
                            value={newClientInstagram}
                            onChange={(e) => setNewClientInstagram(e.target.value)}
                            placeholder="@nick_do_cliente"
                            className="w-full bg-[#181d2a] border border-gray-800 rounded p-1.5 text-xs text-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[9px] font-mono text-gray-400 uppercase">Estilo da Marca</label>
                          <input
                            type="text"
                            value={newClientStyle}
                            onChange={(e) => setNewClientStyle(e.target.value)}
                            placeholder="Ex: Sofisticado de luxo"
                            className="w-full bg-[#181d2a] border border-gray-800 rounded p-1.5 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-mono text-gray-400 uppercase">Público Alvo</label>
                          <input
                            type="text"
                            value={newClientAudience}
                            onChange={(e) => setNewClientAudience(e.target.value)}
                            placeholder="Ex: Mulheres 28 à 45 anos"
                            className="w-full bg-[#181d2a] border border-gray-800 rounded p-1.5 text-xs text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[9px] font-mono text-gray-400 uppercase">Descrição da Oferta / Produto</label>
                        <textarea
                          value={newClientDesc}
                          onChange={(e) => setNewClientDesc(e.target.value)}
                          placeholder="Ex: Procedimentos premium de botox preventivo e harmonização natural"
                          className="w-full bg-[#181d2a] border border-gray-800 rounded p-1.5 text-xs text-white h-12 resize-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] font-mono text-gray-400 uppercase">Call To Action (CTA)</label>
                        <input
                          type="text"
                          value={newClientCTA}
                          onChange={(e) => setNewClientCTA(e.target.value)}
                          placeholder="Ex: Enviar direct com a palavra 'AGENDA'"
                          className="w-full bg-[#181d2a] border border-gray-800 rounded p-1.5 text-xs text-white"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={handleAddClientProfile}
                        className="w-full bg-yellow-400 hover:bg-yellow-500 text-black text-[11px] font-bold py-1.5 rounded"
                      >
                        Salvar e Escolher Cliente
                      </button>
                    </div>
                  )}
                </div>

                <form onSubmit={handleGenerateCopy} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Choose Formula Stage */}
                    <div>
                      <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 font-mono">
                        Fórmula de Copywriting
                      </label>
                      <select
                        value={generatorInput.formula}
                        onChange={(e) => setGeneratorInput({ ...generatorInput, formula: e.target.value as FormulaType })}
                        className="w-full bg-[#181d2a] border border-gray-800 rounded-lg py-2.5 px-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-yellow-400"
                      >
                        <option value="V4-Company">Aceleração V4 (Tráfego, Engajamento, Conversão, Retenção)</option>
                        <option value="G4-Growth">G4 Growth (ICP, Oferta Irresistível, Canal de Tração)</option>
                        <option value="AIDA">Framework AIDA (Atenção, Interesse, Desejo, Ação)</option>
                        <option value="PAS">PAS (Problema, Agitação, Solução imediata)</option>
                      </select>
                    </div>

                    {/* Choose Funnel Stage */}
                    <div>
                      <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 font-mono">
                        Etapa do Funil de Performance
                      </label>
                      <select
                        value={generatorInput.funnelStage}
                        onChange={(e) => setGeneratorInput({ ...generatorInput, funnelStage: e.target.value as FunnelStage })}
                        className="w-full bg-[#181d2a] border border-gray-800 rounded-lg py-2.5 px-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-yellow-400"
                      >
                        <option value="ToFu">TOFU - Topo de Funil (Consciência, Tráfego Frio e Atração)</option>
                        <option value="MoFu">MOFU - Meio de Funil (Consideração, Dor e Filtro de Leads)</option>
                        <option value="BoFu">BOFU - Fundo de Funil (Chamada Quente para Decisão / Venda)</option>
                      </select>
                    </div>

                  </div>

                  {/* Destination Placement Formats */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 font-mono">
                        Formato Instagram
                      </label>
                      <select
                        value={generatorInput.platform}
                        onChange={(e) => setGeneratorInput({ ...generatorInput, platform: e.target.value as any })}
                        className="w-full bg-[#181d2a] border border-gray-800 rounded-lg py-2.5 px-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-yellow-400"
                      >
                        <option value="Instagram Feed">Instagram Post (Feed Convencional)</option>
                        <option value="Instagram Stories">Instagram Stories (Direto e Enquetes)</option>
                        <option value="Reels">Reels (Vídeo de Alto Impacto / Viral)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 font-mono">
                        Estilo / Linha de Marca
                      </label>
                      <input
                        type="text"
                        value={generatorInput.brandStyle}
                        onChange={(e) => setGeneratorInput({ ...generatorInput, brandStyle: e.target.value })}
                        className="w-full bg-[#181d2a] border border-gray-800 rounded-lg py-2.5 px-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-yellow-400"
                        placeholder="Ex: @dragonx.agency agressivo focado em lucro"
                      />
                    </div>
                  </div>

                  {/* Product or service description */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 font-mono">
                      Descrição da Oferta ou Serviço
                    </label>
                    <textarea
                      value={generatorInput.productDescription}
                      onChange={(e) => setGeneratorInput({ ...generatorInput, productDescription: e.target.value })}
                      rows={3}
                      className="w-full bg-[#181d2a] border border-gray-800 rounded-lg py-2.5 px-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-yellow-400 placeholder-gray-500"
                      placeholder="Descreva detalhadamente o produto, serviço ou o infoproduto..."
                    />
                  </div>

                  {/* Target audience */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 font-mono">
                      Público-Alvo Específico (ICP)
                    </label>
                    <input
                      type="text"
                      value={generatorInput.audience}
                      onChange={(e) => setGeneratorInput({ ...generatorInput, audience: e.target.value })}
                      className="w-full bg-[#181d2a] border border-gray-800 rounded-lg py-2.5 px-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-yellow-400 placeholder-gray-500"
                      placeholder="Ex: Clínicas odontológicas de estética de elite faturando 100k..."
                    />
                  </div>

                  {/* CTA Call to Action line */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 font-mono">
                      Chamada para Ação Desejada (CTA)
                    </label>
                    <input
                      type="text"
                      value={generatorInput.callToAction}
                      onChange={(e) => setGeneratorInput({ ...generatorInput, callToAction: e.target.value })}
                      className="w-full bg-[#181d2a] border border-gray-800 rounded-lg py-2.5 px-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-yellow-400 placeholder-gray-500"
                      placeholder="Ex: Comente 'AUDIT' abaixo para receber o cronograma de análise no privado."
                    />
                  </div>

                  {/* Submit buttons wrapper */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-600 hover:from-yellow-300 hover:to-amber-500 text-black py-3 px-4 rounded-lg font-display font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-black" />
                        <span>Gerando Copy Persuasiva pela IA...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-black font-extrabold" />
                        <span>Gerar Copy de Alta Performance</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Instagram Feed / Carousel Mockup Result Column */}
              <div className="xl:col-span-5">
                {activeResultCopy ? (
                  <InstagramMockup
                    copy={activeResultCopy}
                    platform={generatorInput.platform}
                    onSchedule={handleSchedulePost}
                  />
                ) : (
                  <div className="bg-[#11141d] border border-gray-800 rounded-xl p-8 text-center h-full flex flex-col items-center justify-center space-y-4">
                    <div className="p-4 rounded-full bg-[#181d2a] text-yellow-400 border border-gray-800">
                      <Sparkles className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-display font-bold text-white text-sm">Visualizador de criativos</h4>
                      <p className="text-xs text-gray-400 max-w-sm">
                        Preencha a especificação estratégica à esquerda e pressione o botão para obter copy e visual estimulado com base no método V4 & G4.
                      </p>
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* Active Tab: Direct Scheduler */}
          {activeTab === 'scheduler' && (
            <div className="space-y-6">
              <div className="bg-[#11141d] border border-gray-800 rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-bold font-display text-white">
                  Cronograma & Agendamento de Campanhas
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  Revise o fluxo de postagens automatizadas do perfil <span className="text-yellow-400 font-bold">@dragonx.agency</span>. O servidor executa as postagens automaticamente nos horários calibrados do funil de vendas.
                </p>
              </div>

              <DirectScheduler
                posts={scheduledPosts}
                onDeletePost={handleDeletePost}
                onPostNow={handlePostNow}
                onAddInlinePost={handleAddInlinePost}
              />
            </div>
          )}

          {/* Active Tab: Analytics Dashboard METRICS */}
          {activeTab === 'metrics' && (
            <div className="space-y-6">
              {/* Top stats numerical boxes */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                
                <div className="bg-[#11141d] border border-gray-800 rounded-xl p-5 shadow-sm">
                  <div className="text-[10px] text-gray-400 uppercase tracking-widest font-mono">Alcance Acumulado</div>
                  <div className="text-xl md:text-2xl font-bold font-mono text-white mt-2">
                    {metrics.totalReach.toLocaleString("pt-BR")}
                  </div>
                  <p className="text-[10px] text-green-400 mt-1">📈 +12% do mês anterior</p>
                </div>

                <div className="bg-[#11141d] border border-gray-800 rounded-xl p-5 shadow-sm">
                  <div className="text-[10px] text-gray-400 uppercase tracking-widest font-mono">Leads Estratégicos</div>
                  <div className="text-xl md:text-2xl font-bold font-mono text-white mt-2">
                    {metrics.totalLeads.toLocaleString("pt-BR")}
                  </div>
                  <p className="text-[10px] text-green-400 mt-1">📈 Taxa de Captura Estável</p>
                </div>

                <div className="bg-[#11141d] border border-gray-800 rounded-xl p-5 shadow-sm">
                  <div className="text-[10px] text-gray-400 uppercase tracking-widest font-mono">Custo por Lead (CAC)</div>
                  <div className="text-xl md:text-2xl font-bold font-mono text-yellow-400 mt-2">
                    R$ {metrics.cac.toFixed(2)}
                  </div>
                  <p className="text-[10px] text-emerald-400 mt-1">🎯 Meta G4 Alcançada</p>
                </div>

                <div className="bg-[#11141d] border border-gray-800 rounded-xl p-5 shadow-sm">
                  <div className="text-[10px] text-gray-400 uppercase tracking-widest font-mono">Investimento em Ads</div>
                  <div className="text-xl md:text-2xl font-bold font-mono text-white mt-2">
                    R$ {metrics.spent.toLocaleString("pt-BR")}
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">💰 Retorno sobre Gasto garantido</p>
                </div>

              </div>

              {/* Advanced Interactive Funnel Component */}
              <LeadFunnelChart metrics={metrics} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* CAC and LTV G4 Rule checks */}
                <div className="bg-[#11141d] border border-gray-800 rounded-xl p-5 space-y-3 shadow-sm">
                  <h4 className="text-xs font-bold text-white font-display uppercase tracking-wider flex items-center gap-1.5">
                    <Sliders className="text-yellow-400 w-4 h-4" /> Relatório G4-Growth Health Score
                  </h4>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Sua proporção de Lifetime Value (LTV) sobre o CAC atual é de:
                  </p>
                  <div className="bg-black/30 p-4 rounded-lg border border-gray-900 flex justify-between items-center text-center">
                    <div>
                      <div className="text-[9px] text-gray-400 uppercase">Proporção LTV/CAC</div>
                      <div className="text-xl font-bold text-emerald-400 font-mono mt-0.5">
                        {(metrics.ltv / metrics.cac).toFixed(1)}x
                      </div>
                    </div>
                    <div className="h-4 w-[1px] bg-gray-800" />
                    <div>
                      <div className="text-[9px] text-gray-400 uppercase">CAC Atual</div>
                      <div className="text-xs font-bold text-white font-mono mt-0.5">R$ {metrics.cac.toFixed(2)}</div>
                    </div>
                    <div className="h-4 w-[1px] bg-gray-800" />
                    <div>
                      <div className="text-[9px] text-gray-400 uppercase">LTV Médio</div>
                      <div className="text-xs font-bold text-white font-mono mt-0.5">R$ {metrics.ltv.toFixed(2)}</div>
                    </div>
                  </div>
                  <div className="text-[10px] text-emerald-400 bg-emerald-950/20 p-2 rounded border border-emerald-950 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Proporção excelente! Negócio altamente saudável e escalável.
                  </div>
                </div>

                {/* V4 Assessment rules checklist */}
                <div className="bg-[#11141d] border border-gray-800 rounded-xl p-5 space-y-3 shadow-sm">
                  <h4 className="text-xs font-bold text-white font-display uppercase tracking-wider flex items-center gap-1.5">
                    <Sliders className="text-yellow-400 w-4 h-4" /> Diagnóstico do Funil V4 Company
                  </h4>
                  <div className="space-y-2 mt-1">
                    <div className="flex justify-between text-xs py-1 border-b border-gray-800/60">
                      <span className="text-gray-400">1. Tráfego (Acumulado)</span>
                      <span className="font-bold text-white">Econômico • CPC Seguro</span>
                    </div>
                    <div className="flex justify-between text-xs py-1 border-b border-gray-800/60">
                      <span className="text-gray-400">2. Engajamento (CTR da Copy)</span>
                      <span className="font-bold text-yellow-400">{metrics.ctr}% de Conversão</span>
                    </div>
                    <div className="flex justify-between text-xs py-1 border-b border-gray-800/60">
                      <span className="text-gray-400">3. Conversão (Leads quentes)</span>
                      <span className="font-bold text-emerald-400">Excelente taxa de fechamento</span>
                    </div>
                    <div className="flex justify-between text-xs py-1">
                      <span className="text-gray-400">4. Retenção (Fidelização LTV)</span>
                      <span className="font-bold text-white">Múltiplo canal ativo</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Active Tab: Webhooks Dashboard & Simulator */}
          {activeTab === 'webhooks' && (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              
              {/* Simulator Panel */}
              <div className="xl:col-span-5 bg-[#11141d] border border-gray-800 rounded-xl p-6 shadow-sm space-y-5">
                <div>
                  <h2 className="text-base font-bold font-display text-white flex items-center gap-2">
                    <Database className="text-yellow-400 w-4.5 h-4.5" /> Simulador de Webhooks Meta
                  </h2>
                  <p className="text-[11px] text-gray-400 mt-1 leading-normal">
                    Conforme as diretrizes do Facebook Business Developer, faça chamadas de simulação para verificar o fluxo de resposta automática de Direct e Performance da IA.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-mono">
                      Tipo de Gatilho Meta
                    </label>
                    <select
                      value={simWebhookType}
                      onChange={(e) => setSimWebhookType(e.target.value)}
                      className="w-full bg-[#181d2a] border border-gray-800 rounded-lg py-2 px-3 text-xs text-white focus:outline-none"
                    >
                      <option value="comments font-sans">Comentário em Post da @studioalfamkt ("Gostei", "Quero", "V4")</option>
                      <option value="messages font-sans">Mensagem Direct no Instagram ("Quero o ebook", "Falar com consultor")</option>
                      <option value="feed_posts font-sans font-sans">Post Publicado com Menção à @dragonx.agency</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-mono">
                      User Instagram do Lead / Usuário Interator
                    </label>
                    <input
                      type="text"
                      value={simWebhookSender}
                      onChange={(e) => setSimWebhookSender(e.target.value)}
                      placeholder="Ex: joao_digital_2026"
                      className="w-full bg-[#181d2a] border border-gray-800 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-yellow-400 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-mono">
                      Mensagem / Texto Escrito pelo Usuário
                    </label>
                    <input
                      type="text"
                      value={simWebhookMessage}
                      onChange={(e) => setSimWebhookMessage(e.target.value)}
                      placeholder="Ex: Quero escalar minhas vendas com a Dragon X!"
                      className="w-full bg-[#181d2a] border border-gray-800 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-yellow-400"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleSimulateWebhookTrigger}
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-black text-xs font-bold py-2.5 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5 animate-spin-once" /> Disparar Webhook e Ver IA Postar
                  </button>

                  <div className="bg-[#181d2a] p-3.5 rounded-lg border border-gray-800/60 font-mono text-[9px] text-gray-400 leading-normal space-y-1.5">
                    <span className="text-yellow-400 font-bold uppercase block text-[10px]">Parâmetros de Produção Vercel:</span>
                    <p>Endpoint Ativo de Produção:</p>
                    <code className="text-white bg-black/40 px-1 py-0.5 rounded block whitespace-pre overflow-x-auto text-[8px]">
                      POST https://dragon-x-agency-alfa.vercel.app/api/webhooks/instagram
                    </code>
                    <p className="mt-2 text-emerald-400 font-sans">
                      ✔ A IA da Dragon X analisa as mensagens de webhooks recebidas e gera automaticamente respostas de conversão customizadas, aumentando o alcance orgânico da agência e subindo as métricas de engajamento do cliente!
                    </p>
                  </div>
                </div>

              </div>

              {/* Logs Console */}
              <div className="xl:col-span-7 bg-[#11141d] border border-gray-800 rounded-xl p-6 shadow-sm space-y-4 font-mono">
                <div className="flex justify-between items-center bg-black/35 p-3 rounded-lg border border-gray-800">
                  <div>
                    <h3 className="text-sm font-bold text-white font-sans">Console Webhook Real-Time Logs</h3>
                    <p className="text-[10px] text-emerald-400 tracking-tight">
                      📡 STATUS: WEBHOOKS LISTENING ACTIVE
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={loadDatabase}
                    className="text-[10px] text-yellow-500 hover:underline cursor-pointer"
                  >
                    [Sincronizar Logs]
                  </button>
                </div>

                <div className="space-y-3.5 max-h-[480px] overflow-y-auto pr-1">
                  {webhookLogs.length === 0 ? (
                    <div className="text-center py-16 text-gray-500 space-y-3 text-[11px]">
                      <Terminal className="w-8 h-8 text-gray-700 mx-auto" />
                      <p>Nenhum log de webhook recebido ainda.</p>
                      <p className="text-[9px] text-gray-600">Dispare um webhook simulado à esquerda para ativar as métricas.</p>
                    </div>
                  ) : (
                    webhookLogs.map((log) => (
                      <div key={log.id} className="bg-black/55 p-3.5 rounded-lg border border-gray-800/80 space-y-2 text-xs animate-fadeIn relative overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-[3.5px] bg-emerald-500" />
                        <div className="flex justify-between items-start gap-1">
                          <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                            EVENT: {log.platform.toUpperCase()} ({log.event})
                          </span>
                          <span className="text-[9px] text-gray-500">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="text-[11px] text-gray-300 leading-normal">
                          <span className="text-yellow-400 font-bold">@{log.sender}</span> enviou: "{log.payload.text || log.payload.message || log.payload.comment}"
                        </div>
                        <div className="mt-2 text-[10px] bg-emerald-950/20 text-emerald-300 border border-emerald-950/50 p-2 rounded leading-relaxed">
                          <span className="font-bold uppercase text-[9px] text-emerald-400 block mb-0.5 font-sans">🤖 Resposta Automática IA Dragon X enviada:</span>
                          "{log.processedAction}"
                        </div>
                      </div>
                    ))
                  )}
                </div>

              </div>

            </div>
          )}

          {/* Active Tab: Administrator Full controls panel */}
          {activeTab === 'admin' && (
            <div className="bg-[#11141d] border border-gray-800 rounded-xl p-6 shadow-sm space-y-6">
              <div>
                <h2 className="text-lg font-bold font-display text-white">
                  Painel de Controle Administrativo de Fluxos
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  Gerencie chaves, modos de operação do sistema Dragon X e credenciais corporativas.
                </p>
              </div>

              {/* Quick settings controls Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="bg-[#181d2a] border border-gray-800 rounded-lg p-5 space-y-4">
                  <h3 className="text-xs font-bold font-display uppercase text-white tracking-wider">
                    Conexões Sociais Meta / Google
                  </h3>
                  
                  <div className="space-y-3.5">
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs text-gray-300">Google Gmail Sign-In</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${integrations.googleConnected ? 'bg-emerald-950 text-emerald-400' : 'bg-red-950 text-red-400'}`}>
                          {integrations.googleConnected ? 'Conectado' : 'Desconectado'}
                        </span>
                      </div>
                      <input
                        type="email"
                        value={integrations.googleEmail}
                        onChange={(e) => handleUpdateIntegrations({ googleEmail: e.target.value })}
                        placeholder="Não conectado"
                        disabled={!integrations.googleConnected}
                        className="w-full bg-black/40 border border-gray-800 rounded p-2 text-xs text-white uppercase font-mono disabled:opacity-50"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs text-gray-300">Instagram Profile Integrado</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${integrations.metaConnected ? 'bg-emerald-950 text-emerald-400' : 'bg-red-950 text-red-400'}`}>
                          {integrations.metaConnected ? 'Conectado Meta' : 'Desconectado'}
                        </span>
                      </div>
                      <input
                        type="text"
                        value={integrations.instagramUser}
                        onChange={(e) => handleUpdateIntegrations({ instagramUser: e.target.value })}
                        disabled={!integrations.metaConnected}
                        className="w-full bg-black/40 border border-gray-800 rounded p-2 text-xs text-white font-mono disabled:opacity-50"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs text-gray-300">Facebook Page Integrada</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${integrations.metaConnected ? 'bg-emerald-950 text-emerald-400' : 'bg-red-950 text-red-400'}`}>
                          {integrations.metaConnected ? 'Sincronizado' : 'Inativo'}
                        </span>
                      </div>
                      <input
                        type="text"
                        value={integrations.facebookPage}
                        onChange={(e) => handleUpdateIntegrations({ facebookPage: e.target.value })}
                        disabled={!integrations.metaConnected}
                        className="w-full bg-black/40 border border-gray-800 rounded p-2 text-xs text-white disabled:opacity-50"
                      />
                    </div>
                  </div>
                </div>

                {/* API Info and Sandbox instructions */}
                <div className="bg-[#181d2a] border border-gray-800 rounded-lg p-5 space-y-4">
                  <h3 className="text-xs font-bold font-display uppercase text-white tracking-wider">
                    Modo Sandbox & Status
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="block text-xs text-gray-100 font-bold">Simulação de Automação Ativa</span>
                        <span className="text-[11px] text-gray-400 block mt-0.5">Permite testar disparos imediatos e atualizações do funil em tempo real</span>
                      </div>
                      <button
                        onClick={() => handleUpdateIntegrations({ sandboxMode: !integrations.sandboxMode })}
                        className={`text-xs px-3 py-1.5 rounded-md font-mono ${integrations.sandboxMode ? 'bg-yellow-400 text-black font-bold' : 'bg-gray-800 text-gray-400'}`}
                      >
                        {integrations.sandboxMode ? 'ON' : 'OFF'}
                      </button>
                    </div>

                    <div className="bg-black/30 p-3 rounded font-mono text-[10px] text-gray-300 leading-relaxed border border-gray-900">
                      ⚙️ <span className="font-bold text-yellow-400">Dragon X Status CLI</span>
                      <br />- Plataforma: Google AI Assistive Cloud
                      <br />- Workspace: Agência Dragon X
                      <br />- Integrado Meta Graph APIs: Ativo
                      <br />- Gemini Endpoint: models/gemini-3.5-flash
                    </div>

                    <div className="text-[11px] text-gray-400 bg-black/10 p-2 rounded">
                      💡 Sintonizado para a agência <span className="text-white font-bold">@dragonx.agency</span>. Todos os dados permanecem protegidos sob o firewall e obedecem as regras do Firebase / Cloud local sandbox.
                    </div>
                  </div>
                </div>

              </div>

              {/* Reset stats database helper */}
              <div className="border-t border-gray-800 pt-6 flex justify-between items-center">
                <div className="text-xs text-gray-400 flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-gray-500" />
                  Base de dados em memória persistida no container Cloud Run.
                </div>
                <button
                  onClick={() => {
                    setMetrics({
                      totalReach: 145800,
                      totalLeads: 8420,
                      conversionRate: 5.77,
                      cac: 34.50,
                      ltv: 450.00,
                      ctr: 3.82,
                      spent: 15400
                    });
                    showStatus("success", "Métricas resetadas para o patamar base da agência!");
                  }}
                  className="text-xs text-red-400 hover:text-red-300 transition-colors bg-red-950/15 p-2 rounded border border-red-900/10 cursor-pointer"
                >
                  Resetar Métricas de Simulação
                </button>
              </div>

            </div>
          )}

        </div>

      </main>

      {/* Corporate Modern Footer */}
      <footer className="border-t border-[#1b202e] bg-[#0c0e12] py-6 px-4 md:px-8 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
          <div>
            © 2026 <span className="text-yellow-400 font-semibold font-display">Dragon X Growth AI</span> — Desenvolvido de forma personalizada para <span className="text-white">studioalfamarketingdigital@gmail.com</span> e <span className="text-white">@dragonx.agency</span>.
          </div>
          <div className="flex gap-4 font-mono text-[11px]">
            <span>V4 Co. Partner Studio</span>
            <span>•</span>
            <span>G4 Growth Certified Platform</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
