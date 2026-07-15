import { type ReactNode } from 'react';

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`glass-card ${className}`}>{children}</div>;
}

export function SectionTitle({ icon, title, subtitle }: { icon?: ReactNode; title: string; subtitle?: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      {icon && <div className="w-10 h-10 rounded-xl bg-primary-500/15 flex items-center justify-center text-primary-400">{icon}</div>}
      <div>
        <h2 className="text-xl font-bold text-slate-100">{title}</h2>
 {subtitle && <p className="text-sm text-slate-400">{subtitle}</p>}
      </div>
    </div>
  );
}

export function Badge({ children, variant = 'neutral' }: { children: ReactNode; variant?: 'neutral' | 'success' | 'warning' | 'error' | 'info' }) {
  const styles = {
    neutral: 'bg-slate-700/50 text-slate-300',
    success: 'bg-success-500/15 text-success-400 border border-success-500/20',
    warning: 'bg-warning-500/15 text-warning-400 border border-warning-500/20',
    error: 'bg-error-500/15 text-error-400 border border-error-500/20',
    info: 'bg-primary-500/15 text-primary-300 border border-primary-500/20',
  };
  return <span className={`badge ${styles[variant]}`}>{children}</span>;
}

export function DensityBadge({ level }: { level: string }) {
  const map: Record<string, { variant: 'success' | 'warning' | 'error' | 'info'; label: string; dot: string }> = {
    low: { variant: 'success', label: 'Low', dot: 'bg-success-400' },
    moderate: { variant: 'info', label: 'Moderate', dot: 'bg-primary-400' },
    high: { variant: 'warning', label: 'High', dot: 'bg-warning-400' },
    critical: { variant: 'error', label: 'Critical', dot: 'bg-error-400' },
  };
  const cfg = map[level] ?? map.low;
  return (
    <Badge variant={cfg.variant}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${level === 'critical' || level === 'high' ? 'animate-pulse' : ''}`} />
      {cfg.label}
    </Badge>
  );
}

export function StatCard({ icon, label, value, sublabel, accent = 'primary' }: { icon: ReactNode; label: string; value: string | number; sublabel?: string; accent?: 'primary' | 'success' | 'warning' | 'error' | 'accent' }) {
  const accents = {
    primary: 'text-primary-400',
    success: 'text-success-400',
    warning: 'text-warning-400',
    error: 'text-error-400',
    accent: 'text-accent-400',
  };
  return (
    <div className="stat-card">
      <div className="flex items-start justify-between">
        <div className={`w-11 h-11 rounded-xl bg-slate-900/50 flex items-center justify-center ${accents[accent]}`}>{icon}</div>
      </div>
      <p className="mt-4 text-3xl font-bold text-slate-100">{value}</p>
      <p className="text-sm text-slate-400 mt-1">{label}</p>
      {sublabel && <p className="text-xs text-slate-500 mt-0.5">{sublabel}</p>}
    </div>
  );
}
