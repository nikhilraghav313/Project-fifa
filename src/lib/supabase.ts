import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type ChatMessage = {
  id: string;
  session_id: string;
  role: 'user' | 'assistant';
  content: string;
  language: string;
  intent: string | null;
  created_at: string;
};

export type CrowdReport = {
  id: string;
  stadium_id: string;
  zone: string;
  density_level: 'low' | 'moderate' | 'high' | 'critical';
  note: string | null;
  reporter_role: 'staff' | 'volunteer' | 'fan';
  created_at: string;
};

export type AccessibilityRequest = {
  id: string;
  stadium_id: string;
  request_type: 'wheelchair' | 'sensory' | 'visual' | 'hearing' | 'mobility' | 'other';
  location: string | null;
  details: string | null;
  status: 'open' | 'in_progress' | 'resolved';
  created_at: string;
};

export type Incident = {
  id: string;
  stadium_id: string;
  category: 'medical' | 'security' | 'facility' | 'transport' | 'crowd' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  status: 'open' | 'responding' | 'resolved';
  created_at: string;
};

export type Feedback = {
  id: string;
  stadium_id: string;
  rating: number;
  category: string | null;
  comment: string | null;
  created_at: string;
};

export function getSessionId(): string {
  let id = sessionStorage.getItem('wc2026_session');
  if (!id) {
    id = `s_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    sessionStorage.setItem('wc2026_session', id);
  }
  return id;
}
