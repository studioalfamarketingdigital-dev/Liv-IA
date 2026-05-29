/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory Database
let metrics = {
  totalReach: 145800,
  totalLeads: 8420,
  conversionRate: 5.77,
  cac: 34.50,
  ltv: 450.00,
  ctr: 3.82,
  spent: 15400
};

let integrations = {
  googleConnected: true,
  googleEmail: "studioalfamarketingdigital@gmail.com",
  metaConnected: true,
  facebookPage: "Agência Dragon X Oficial",
  instagramUser: "@dragonx.agency",
  sandboxMode: true
};

let scheduledPosts = [
  {
    id: "post-1",
    caption: `🚀 O SEGREDO DO TRAÇÃO DA V4 COMPANY QUE NINGUÉM TE CONTA!\n\nVocê está cansado de queimar verba de anúncios sem ver retorno real de vendas? Na V4 Company, nós não focamos em curtidas. Focamos em ROI.\n\nAqui estão as 3 fases fundamentais que mudaram a @dragonx.agency:\n📍 Catalyst - Atrair atenção qualificada\n⚡ Traction - Gerar relacionamento e funil otimizado\n🔥 Scale - Multiplicar vendas continuamente\n\nQuer que nossa agência desenhe sua estratégia? Clique no link da bio.\n\n#V4Company #PerformanceMarketing #GrowthHacking #Conversao #FunilDeVendas`,
    platform: "Instagram Feed" as const,
    scheduledDate: "2026-05-30T10:00",
    status: "scheduled" as const,
    imageIdea: "Um print limpo de um dashboard de vendas em ascensão, com tipografia moderna contrastante com texto 'MÉTRICAS QUE IMPORTAM'. Cores preta, dourada e amarela.",
    funnelStage: "MoFu" as const,
    formula: "V4-Company" as const
  },
  {
    id: "post-2",
    caption: `🔥 G4 GROWTH SYSTEM: O ATALHO PARA DOBRAR SEU NEGÓCIO EM 2026.\n\nA maioria dos fundadores falha porque foca em tarefas operacionais au invés do processo de tração.\n\nSe você quer vender 10x mais:\n1️⃣ Desenhe o ICP real do seu cliente\n2️⃣ Otimize a oferta irresistível com gatilho de escassez\n3️⃣ Execute o funil BOFU focado em fechar leads quentes imediatamente\n\nComente \"CRESCER\" que enviamos uma análise gratuita no seu direct.\n\n#G4Growth #StartupMarketing #SalesFunnel #MarketingDePerformance #DragonX`,
    platform: "Instagram Feed" as const,
    scheduledDate: "2026-05-31T14:30",
    status: "scheduled" as const,
    imageIdea: "Flyer brutalista minimalista com tipografia serifada luxuosa e degrade escuro, com as palavras 'MÉTODO G4 DE ATRAÇÃO'.",
    funnelStage: "BoFu" as const,
    formula: "G4-Growth" as const
  },
  {
    id: "post-3",
    caption: `🤔 Sua agência atual te gera Brand Awareness ou faturamento real?\n\nA maioria das marcas morre no silêncio digital porque não tem um funil de conversão ativo.\n\nSe o seu site recebe visitas mas não vende, você tem um vazamento no meio do funil (MOFU). Nós resolvemos isso reposicionando sua oferta principal.\n\nToque nos stories para ver depoimentos de clientes que aumentaram em 140% as vendas nas primeiras 3 semanas!\n\n#AIDA #PassoAPasso #MarketingDeConversao #DragonX #Performance`,
    platform: "Instagram Stories" as const,
    scheduledDate: "2026-05-28T09:00",
    status: "posted" as const,
    imageIdea: "Mockup de celular com gráficos elegantes exibindo 140% de conversão.",
    funnelStage: "ToFu" as const,
    formula: "AIDA" as const,
    postedAt: "2026-05-28T09:02"
  }
];

// Lazy initialization logic for GoogleGenAI SDK to prevent app crashing when key is missing or invalid.
let aiClient: GoogleGenAI | null = null;
function getAi(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("WARN: GEMINI_API_KEY env variable is missing. Will fall back to local templates if key is not defined.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key || "MOCK_KEY",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return aiClient;
}

// REST APIs
app.get("/api/database", (req, res) => {
  res.json({
    metrics,
    integrations,
    scheduledPosts
  });
});

app.post("/api/update-integrations", (req, res) => {
  const { googleConnected, googleEmail, metaConnected, facebookPage, instagramUser, sandboxMode } = req.body;
  if (typeof googleConnected === "boolean") integrations.googleConnected = googleConnected;
  if (googleEmail !== undefined) integrations.googleEmail = googleEmail;
  if (typeof metaConnected === "boolean") integrations.metaConnected = metaConnected;
  if (facebookPage !== undefined) integrations.facebookPage = facebookPage;
  if (instagramUser !== undefined) integrations.instagramUser = instagramUser;
  if (typeof sandboxMode === "boolean") integrations.sandboxMode = sandboxMode;
  res.json({ success: true, integrations });
});

app.post("/api/schedule", (req, res) => {
  const { caption, platform, scheduledDate, imageIdea, funnelStage, formula, status } = req.body;
  
  const newPost = {
    id: "post-" + Date.now(),
    caption: caption || "Novo post sem legenda",
    platform: platform || "Instagram Feed",
    scheduledDate: scheduledDate || new Date().toISOString().substring(0, 16),
    status: status || "scheduled",
    imageIdea: imageIdea || "Imagem abstrata de marketing.",
    funnelStage: funnelStage || "ToFu",
    formula: formula || "AIDA"
  };

  scheduledPosts.unshift(newPost);
  
  // Real-time metrics simulation update: adding posts expands estimated traffic activity!
  metrics.spent += 150;
  metrics.totalReach += Math.floor(Math.random() * 4000) + 1500;
  metrics.totalLeads += Math.floor(Math.random() * 210) + 80;
  metrics.ctr = Number((metrics.totalLeads * 100 / metrics.totalReach).toFixed(2));
  metrics.conversionRate = Number(((metrics.totalLeads * 0.15) * 100 / metrics.totalLeads).toFixed(2)) || 5.77;

  res.json({ success: true, post: newPost, metrics });
});

app.post("/api/delete-schedule", (req, res) => {
  const { id } = req.body;
  scheduledPosts = scheduledPosts.filter(p => p.id !== id);
  res.json({ success: true, scheduledPosts });
});

app.post("/api/post-now", (req, res) => {
  const { id } = req.body;
  const idx = scheduledPosts.findIndex(p => p.id === id);
  if (idx !== -1) {
    scheduledPosts[idx].status = "posted";
    scheduledPosts[idx].postedAt = new Date().toISOString();
    
    // Simulate interactive metrics boost
    metrics.totalReach += Math.floor(Math.random() * 8000) + 5000;
    metrics.totalLeads += Math.floor(Math.random() * 450) + 200;
    metrics.ctr = Number((metrics.totalLeads * 100 / metrics.totalReach).toFixed(2));
  }
  res.json({ success: true, scheduledPosts, metrics });
});

app.post("/api/generate-copy", async (req, res) => {
  const { brandStyle, funnelStage, formula, platform, productDescription, audience, callToAction } = req.body;

  const keyExists = !!process.env.GEMINI_API_KEY;

  if (!keyExists) {
    // Elegant fallback of rich copies using predefined frameworks in Portuguese
    // to guarantee an instant premium out-of-the-box system if key is missing or loaded in sandbox.
    const fallbackFormulaResponses = {
      "AIDA": {
        hook: `🚨 PARE TUDO SE VOCÊ ATUA EM MARKETING DE PERFORMANCE!`,
        body: `Você sabia que a maior parte do orçamento de anúncios é perdida nos primeiros 3 segundos?\n\n- Interesse: Clientes que clicam, mas encontram uma página lenta ou sem oferta clara.\n- Desejo: Sem um valor claro, eles abandonam o checkout.\n- Ação: Nós estruturamos e consertamos esse processo de ponta a ponta.`,
        hashtags: `#MarketingDigital #InstagramMkt #AIDA #Crescimento #Performance`,
        callToAction: `Toque no botão e garanta uma auditoria de vendas sem compromisso!`,
        imageIdea: "Uma placa de trânsito brilhante neon amarela dizendo 'PARE SE VOCÊ VENDE' estilo V4/G4.",
        projectedConversionRate: 4.85,
        projectedLikes: 240,
        projectedShares: 54
      },
      "PAS": {
        hook: `💔 O pesadelo silencioso de gastar R$10.000 em anúncios e ter zero leads.`,
        body: `Você abre o gerenciador e vê gráficos vazios. A agência diz que está gerando \"awareness\". Mas as contas não fecham no fim do mês.\n\nAgitação: Essa dúvida se seu negócio vai sobreviver prejudica o seu sono e consome seu caixa diariamente.\n\nSolução: A equipe da @studioalfamkt foca em funis cirúrgicos e ROI auditado semanalmente.`,
        hashtags: `#Copywriting #SocialMediaCopy #GestaoDeTrafego #ROI #Vendas`,
        callToAction: `Comente 'AUDITAR' para fazermos um raio-X das suas campanhas.`,
        imageIdea: "Um executivo olhando preocupado para tela dividida com gráfico verde subindo de um lado.",
        projectedConversionRate: 5.12,
        projectedLikes: 310,
        projectedShares: 78
      },
      "V4-Company": {
        hook: `⚡ SEU PROCESSO DE MARKETING SÓ TEM 4 PILARES: VOCÊ ESTÁ FAZENDO TODOS?`,
        body: `Inspirado no consagrado método de growth marketing do país:\n\n1. Tráfego: Levar as pessoas corretas ao seu funil.\n2. Engajamento: Comunicar valor de forma irresistível.\n3. Conversão: Eliminar todos os atritos de compra.\n4. Retenção: Fazer o cliente atual comprar novamente.\n\nA @studioalfamkt implementa exatamente essa rotina para seu negócio.`,
        hashtags: `#V4Company #MetodoV4 #GrowthHacking #VendasTodoDia #FunilBOFU`,
        callToAction: `Clique no link do perfil para conhecer nosso processo escalável.`,
        imageIdea: "Card diagramado minimalista em preto e amarelo neon destacando 'TRÁFEGO, ENGAJAMENTO, CONVERSÃO, RETENÇÃO'.",
        projectedConversionRate: 6.20,
        projectedLikes: 412,
        projectedShares: 122
      },
      "G4-Growth": {
        hook: `🎯 O SISTEMA DE VENDAS COMPREGADO PELAS MAIORES EMPRESAS DO CONTINENTE!`,
        body: `Não reinvente a roda. Faça o básico de maneira implacável:\n\n- Execução Diária: Foco nas métricas norteadoras (CAC, LTV, Conversion Rate).\n- Otimização de Legendas: Copy direto com gatilhos de dor reais.\n- Escala previsível: Testes rápidos de criativos.\n\nFoque no canhão empresarial eficiente para superar a concorrência agora.`,
        hashtags: `#G4Growth #G4Educacao #GestaoDeVendas #Estrategia #CopyPersuasiva`,
        callToAction: `Mande um direct agora para solicitar o plano de tração do seu nicho.`,
        imageIdea: "Design brutalista moderno e moderno em fundo preto com letras em destaque 'G4 GROWTH MASTERCLASS'.",
        projectedConversionRate: 6.95,
        projectedLikes: 532,
        projectedShares: 185
      }
    };

    const choice = fallbackFormulaResponses[formula as keyof typeof fallbackFormulaResponses] || fallbackFormulaResponses["AIDA"];
    // Simulating call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return res.json({
      success: true,
      copy: {
        ...choice,
        id: "gen-" + Date.now(),
        funnelStage,
        formula
      }
    });
  }

  // Real Gemini Call using 3.5-flash
  try {
    const ai = getAi();
    
    const prompt = `Você é um Copywriter especialista de nível mundial na agência @dragonx.agency, com profunda expertise no método V4 Company (processo focado em ROI, Tráfego, Engajamento, Conversão e Retenção) e no método G4 Educação/Growth (alta performance empresarial, funil cirúrgico e táticas de conversão cruas).
    
    Crie uma legenda super persuasiva e de altíssima conversão para o Instagram com as seguintes especificações:
    - Plataforma: ${platform}
    - Estágio de Funil de Vendas: ${funnelStage} (${funnelStage === 'ToFu' ? 'Topo de Funil - Atração, Conteúdo Educacional e Viral' : funnelStage === 'MoFu' ? 'Meio de Funil - Quebra de Objeções, Consideração e Conexão de Dor' : 'Funil de Vendas Quentes - Gancho Direto para Vendas e Contato'})
    - Fórmula de Marketing/Copywriting: ${formula}
    - Audiência-alvo: ${audience}
    - Descrição do Produto/Oferta: ${productDescription}
    - Call to Action (Chamada para Ação): ${callToAction}
    - Linha Editorial Inspiracional: Estilo Dragon X, moderno, alta energia, pragmático e direcionado a negócios reais.
    
    Responda EXCLUSIVAMENTE em português do Brasil e formule o resultado exatamente dentro das chaves especificadas no JSON schema.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "Você é o especialista de copy da agência Dragon X. Retorne estritamente um código JSON válido e estruturado.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            hook: { type: Type.STRING, description: "A high-conversion initial hook headline that stops the user thumb scroll." },
            body: { type: Type.STRING, description: "The persuasive body copywriting, with spacing, paragraph structure, and bullet points." },
            hashtags: { type: Type.STRING, description: "Hashtags of target performance for Instagram and growth marketing." },
            callToAction: { type: Type.STRING, description: "Direct impactful action call tailored to the requested goal." },
            imageIdea: { type: Type.STRING, description: "Detailed visual description prompt for an Instagram graphic or designer mockup." },
            projectedConversionRate: { type: Type.NUMBER, description: "Estimated marketing performance conversion rate between 3.0 and 9.5." },
            projectedLikes: { type: Type.INTEGER, description: "Calculated prediction likes count for social media." },
            projectedShares: { type: Type.INTEGER, description: "Calculated prediction shares count for social media." }
          },
          required: ["hook", "body", "hashtags", "callToAction", "imageIdea", "projectedConversionRate", "projectedLikes", "projectedShares"]
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    res.json({
      success: true,
      copy: {
        id: "gen-" + Date.now(),
        ...data,
        funnelStage,
        formula
      }
    });

  } catch (error: any) {
    console.error("Gemini copy generation failed:", error);
    res.status(500).json({ error: error.message || "Failed to generate copy from Gemini API." });
  }
});

// Setup dev server or static static assets build for production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AlfaMkt Growth Server successfully listening on http://localhost:${PORT}`);
  });
}

startServer();
