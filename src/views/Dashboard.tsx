import { useEffect, useState } from 'react';
import { Activity, AlertTriangle, Users, Accessibility, Star, TrendingUp, Clock, MapPin, Zap } from 'lucide-react';
import { supabase, type Incident, type CrowdReport, type AccessibilityRequest, type Feedback } from '../lib/supabase';
import { stadiums, matches } from '../data/stadiums';
import { StatCard, Card, Badge, SectionTitle, DensityBadge } from '../components/ui';

export default function Dashboard({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [crowd, setCrowd] = useState<CrowdReport[]>([]);
  const [access, setAccess] = useState<AccessibilityRequest[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);

  useEffect(() => {
    Promise.all([
      supabase.from('incidents').select('*').order('created_at', { ascending: false }),
      supabase.from('crowd_reports').select('*').order('created_at', { ascending: false }),
      supabase.from('accessibility_requests').select('*').order('created_at', { ascending: false }),
      supabase.from('feedback').select('*').order('created_at', { ascending: false }),
    ]).then(([inc, cr, ac, fb]) => {
      if (inc.data) setIncidents(inc.data);
      if (cr.data) setCrowd(cr.data);
      if (ac.data) setAccess(ac.data);
      if (fb.data) setFeedback(fb.data);
    });
  }, []);

  const openIncidents = incidents.filter(i => i.status !== 'resolved');
  const criticalZones = crowd.filter(c => c.density_level === 'critical' || c.density_level === 'high');
  const openAccess = access.filter(a => a.status !== 'resolved');
  const avgRating = feedback.length > 0 ? (feedback.reduce((s, f) => s + f.rating, 0) / feedback.length).toFixed(1) : '—';
  const nextMatch = matches[0];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-700/50">
        <div className="absolute inset-0">
          <img src={stadiums[0].image} alt="Stadium" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent" />
        </div>
        <div className="relative p-8 md:p-10">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-accent-400" />
            <span className="text-accent-400 font-semibold text-sm tracking-wide uppercase">Live Operations</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white">FIFA World Cup 2026</h1>
          <p className="text-slate-300 mt-2 max-w-xl">GenAI-powered stadium operations platform — real-time crowd intelligence, navigation, accessibility, and decision support across all venues.</p>
          <div className="flex flex-wrap gap-3 mt-5">
            <button onClick={() => onNavigate('assistant')} className="btn-primary">Ask AI Assistant</button>
            <button onClick={() => onNavigate('crowd')} className="btn-ghost">View Crowd Map</button>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={<AlertTriangle className="w-5 h-5" />} label="Active Incidents" value={openIncidents.length} sublabel={`${incidents.length} total logged`} accent="warning" />
        <StatCard icon={<Users className="w-5 h-5" />} label="High-Density Zones" value={criticalZones.length} sublabel={`${crowd.length} zones monitored`} accent="error" />
        <StatCard icon={<Accessibility className="w-5 h-5" />} label="Open Accessibility Requests" value={openAccess.length} sublabel={`${access.length} total requests`} accent="primary" />
        <StatCard icon={<Star className="w-5 h-5" />} label="Avg Fan Satisfaction" value={`${avgRating}/5`} sublabel={`${feedback.length} ratings`} accent="success" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active incidents */}
        <Card className="p-5">
          <SectionTitle icon={<AlertTriangle className="w-5 h-5" />} title="Active Incidents" subtitle="Real-time operational alerts" />
          <div className="space-y-3">
            {openIncidents.length === 0 && <p className="text-sm text-slate-500">No active incidents.</p>}
            {openIncidents.slice(0, 5).map(inc => {
              const stadium = stadiums.find(s => s.id === inc.stadium_id);
              const sevVariant = inc.severity === 'critical' ? 'error' : inc.severity === 'high' ? 'error' : inc.severity === 'medium' ? 'warning' : 'neutral';
              return (
                <div key={inc.id} className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/40 border border-slate-700/40 hover:border-slate-600/50 transition-all">
                  <div className={`w-2 h-2 rounded-full mt-1.5 ${inc.severity === 'critical' ? 'bg-error-400 animate-pulse' : inc.severity === 'high' ? 'bg-error-500' : inc.severity === 'medium' ? 'bg-warning-400' : 'bg-slate-500'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant={sevVariant}>{inc.severity}</Badge>
                      <Badge>{inc.category}</Badge>
                      <Badge variant={inc.status === 'responding' ? 'info' : 'warning'}>{inc.status}</Badge>
                    </div>
                    <p className="text-sm text-slate-300 mt-1.5">{inc.description}</p>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1"><MapPin className="w-3 h-3" />{stadium?.name ?? inc.stadium_id}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Next match + crowd */}
        <div className="space-y-6">
          <Card className="p-5">
            <SectionTitle icon={<Clock className="w-5 h-5" />} title="Next Match" subtitle="Upcoming fixture" />
            <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-primary-900/30 to-slate-900/30 border border-primary-500/20">
              <div className="text-center">
                <div className="text-3xl">{nextMatch.homeFlag}</div>
                <p className="text-sm font-semibold text-slate-200 mt-1">{nextMatch.homeTeam}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-500 uppercase tracking-wide">{nextMatch.stage}</p>
                <p className="text-lg font-bold text-slate-100">VS</p>
                <p className="text-xs text-slate-400">{nextMatch.date}</p>
              </div>
              <div className="text-center">
                <div className="text-3xl">{nextMatch.awayFlag}</div>
                <p className="text-sm font-semibold text-slate-200 mt-1">{nextMatch.awayTeam}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3 text-sm text-slate-400">
              <MapPin className="w-4 h-4" />
              {stadiums.find(s => s.id === nextMatch.stadiumId)?.name} — {nextMatch.time}
            </div>
          </Card>

          <Card className="p-5">
            <SectionTitle icon={<TrendingUp className="w-5 h-5" />} title="Crowd Hotspots" subtitle="Zones requiring attention" />
            <div className="space-y-2">
              {criticalZones.length === 0 && <p className="text-sm text-slate-500">All zones operating normally.</p>}
              {criticalZones.slice(0, 4).map(c => {
                const stadium = stadiums.find(s => s.id === c.stadium_id);
                return (
                  <div key={c.id} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/40">
                    <div>
                      <p className="text-sm font-medium text-slate-200">{c.zone}</p>
                      <p className="text-xs text-slate-500">{stadium?.name}</p>
                    </div>
                    <DensityBadge level={c.density_level} />
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>

      {/* Stadium overview */}
      <Card className="p-5">
        <SectionTitle icon={<Activity className="w-5 h-5" />} title="Venue Overview" subtitle="All stadiums at a glance" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stadiums.map(s => {
            const stadiumCrowd = crowd.filter(c => c.stadium_id === s.id);
            const criticalCount = stadiumCrowd.filter(c => c.density_level === 'critical' || c.density_level === 'high').length;
            const stadiumIncidents = incidents.filter(i => i.stadium_id === s.id && i.status !== 'resolved').length;
            return (
              <div key={s.id} className="rounded-xl overflow-hidden border border-slate-700/40 hover:border-primary-500/30 transition-all cursor-pointer group" onClick={() => onNavigate('navigation')}>
                <div className="relative h-32 overflow-hidden">
                  <img src={s.image} alt={s.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                  <div className="absolute bottom-2 left-3">
                    <p className="text-white font-bold text-sm">{s.name}</p>
                    <p className="text-slate-300 text-xs">{s.city}</p>
                  </div>
                </div>
                <div className="p-3 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Capacity</span>
                    <span className="text-slate-200 font-semibold">{(s.capacity / 1000).toFixed(0)}K</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Hotspots</span>
                    <span className={criticalCount > 0 ? 'text-error-400 font-semibold' : 'text-success-400 font-semibold'}>{criticalCount}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Incidents</span>
                    <span className={stadiumIncidents > 0 ? 'text-warning-400 font-semibold' : 'text-success-400 font-semibold'}>{stadiumIncidents}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
