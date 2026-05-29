/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type FunnelStage = 'ToFu' | 'MoFu' | 'BoFu';

export type FormulaType = 'AIDA' | 'PAS' | 'V4-Company' | 'G4-Growth';

export interface CopyRequest {
  brandStyle: string;
  funnelStage: FunnelStage;
  formula: FormulaType;
  platform: 'Instagram Feed' | 'Instagram Stories' | 'Reels';
  productDescription: string;
  audience: string;
  callToAction: string;
}

export interface GeneratedCopy {
  id: string;
  hook: string;
  body: string;
  hashtags: string;
  callToAction: string;
  imageIdea: string;
  projectedConversionRate: number; // e.g. 4.2%
  projectedLikes: number;
  projectedShares: number;
  funnelStage: FunnelStage;
  formula: FormulaType;
}

export interface ScheduledPost {
  id: string;
  caption: string;
  platform: 'Instagram Feed' | 'Instagram Stories' | 'Reels';
  scheduledDate: string; // e.g. 2026-06-01T15:00
  status: 'draft' | 'scheduled' | 'posted' | 'failed';
  imageIdea: string;
  funnelStage: FunnelStage;
  formula: FormulaType;
  postedAt?: string;
}

export interface MarketingMetrics {
  totalReach: number;
  totalLeads: number;
  conversionRate: number; // Average
  cac: number; // Cost of Acquisition in R$
  ltv: number; // Lifetime Value in R$
  ctr: number; // Click Through Rate
  spent: number; // Budget Spent in R$
}

export interface IntegrationState {
  googleConnected: boolean;
  googleEmail: string;
  metaConnected: boolean;
  facebookPage: string;
  instagramUser: string;
  sandboxMode: boolean; // Enables simulated state but maintains real API generation
}
