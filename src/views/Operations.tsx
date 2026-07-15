import { useEffect, useState } from 'react';
import { Shield, Plus, AlertTriangle, Activity, CheckCircle, Clock, Zap } from 'lucide-react';
import { supabase, type Incident, type Feedback } from '../lib/supabase';
import { stadiums } from '../data/stadiums';
import { Card, Badge, SectionTitle, StatCard } from '../components/ui';

const severityVariant: Record<string, 'neutral' | 'warning' | 'error'> = {
  low: 'neutral',
  medium: 'warning',
  high: 'error',
  critical: 'error',
};

export default function OperationsView({ stadiumId }: { stadiumId: string }) {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ category: 'medical' as Incident['category'], severity: 'low' as Incident['severity'], description: '' });

  const load = () => {
    supabase.from('incidents').select('*').order('created_at', { ascending: false }).then(({ data }) => { if (data) setIncidents(data); });
    supabase.from('feedback').select('*').order('created_at', { ascending: false }).then(({ data }) => { if (data) setFeedback(data); });
  };

  useEffect(load, []);

  const submit = async () => {
    if (!form.description.trim()) return;
    await supabase.from('incidents').insert({
      stadium_id: stadiumId,
      category: form.category,
      severity: form.severity,
      description: form.description,
    });
    setForm({ category: 'medical', severity: 'low', description: '' });
    setShowForm(false);
    load();
  };

  const updateStatus = async (id: string, status: Incident['status']) => {
    await supabase.from('incidents').update({ status }).eq('id', id);
    load();
  };

  const open = incidents.filter(i => i.status === 'open').length;
  const responding = incidents.filter(i => i.status === 'responding').length;
  const resolved = incidents.filter(i => i.status === 'resolved').length;
  const avgRating = feedback.length > 0 ? (feedback.reduce((s, f) => s + f.rating, 0) / feedback.length).toFixed(1) : '—';

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <SectionTitle icon={<Shield className="w-5 h-5" />} title="Operations Center" subtitle="Incident management and fan feedback" />
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Log Incident
        </button>
      </div>

      {showForm && (
        <Card className="p-5 animate-slide-up">
          <h3 className="font-semibold text-slate-200 mb-4">New Incident</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Category</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value as Incident['category'] })} className="input-field">
                <option value="medical">Medical</option>
                <option value="security">Security</option>
                <option value="facility">Facility</option>
                <option value="transport">Transport</option>
                <option value="crowd">Crowd</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Severity</label>
              <select value={form.severity} onChange={e => setForm({ ...form, severity: e.target.value as Incident['severity'] })} className="input-field">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Description</label>
              <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="What happened?" className="input-field" />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={submit} className="btn-primary">Submit</button>
            <button onClick={() => setShowForm(false)} className="btn-ghost">Cancel</button>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard icon={<AlertTriangle className="w-5 h-5" />} label="Open" value={open} accent="warning" />
        <StatCard icon={<Activity className="w-5 h-5" />} label="Responding" value={responding} accent="primary" />
        <StatCard icon={<CheckCircle className="w-5 h-5" />} label="Resolved" value={resolved} accent="success" />
        <StatCard icon={<Shield className="w-5 h-5" />} label="Total Incidents" value={incidents.length} accent="error" />
        <StatCard icon={<Clock className="w-5 h-5" />} label="Avg Rating" value={`${avgRating}/5`} accent="accent" />
      </div>

      {/* AI ops insight */}
      <Card className="p-5 border-primary-500/20 bg-gradient-to-r from-primary-900/20 to-slate-900/20">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-500/15 flex items-center justify-center text-primary-400 flex-shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-primary-300">AI Operational Intelligence</h3>
            <p className="text-sm text-slate-300 mt-1">
              {open + responding > 0
                ? `${open + responding} active incident(s) require attention. ${incidents.filter(i => i.severity === 'critical' && i.status !== 'resolved').length > 0 ? 'Critical severity detected — immediate response recommended.' : 'Prioritize by severity and allocate resources accordingly.'} Fan satisfaction: ${avgRating}/5.`
                : `All incidents resolved. Fan satisfaction: ${avgRating}/5. Operations running smoothly.`}
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Incidents */}
        <Card className="p-5">
          <SectionTitle title="Incident Log" subtitle="All reported incidents" />
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {incidents.length === 0 && <p className="text-sm text-slate-500">No incidents logged.</p>}
            {incidents.map(inc => {
              const s = stadiums.find(st => st.id === inc.stadium_id);
              return (
                <div key={inc.id} className="p-3 rounded-xl bg-slate-900/40 border border-slate-700/40">
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <Badge variant={severityVariant[inc.severity]}>{inc.severity}</Badge>
                    <Badge>{inc.category}</Badge>
                    <Badge variant={inc.status === 'open' ? 'warning' : inc.status === 'responding' ? 'info' : 'success'}>{inc.status}</Badge>
                  </div>
                  <p className="text-sm text-slate-300">{inc.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-slate-500">{s?.name}</p>
                    {inc.status !== 'resolved' && (
                      <button onClick={() => updateStatus(inc.id, inc.status === 'open' ? 'responding' : 'resolved')} className="px-2.5 py-1 rounded-lg bg-primary-500/15 text-primary-300 text-xs font-medium hover:bg-primary-500/25 transition-all">
                        {inc.status === 'open' ? 'Start Response' : 'Mark Resolved'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Feedback */}
        <Card className="p-5">
          <SectionTitle title="Fan Feedback" subtitle="Satisfaction ratings and comments" />
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {feedback.length === 0 && <p className="text-sm text-slate-500">No feedback yet.</p>}
            {feedback.map(f => {
              const s = stadiums.find(st => st.id === f.stadium_id);
              return (
                <div key={f.id} className="p-3 rounded-xl bg-slate-900/40 border border-slate-700/40">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map(n => (
                        <span key={n} className={n <= f.rating ? 'text-accent-400' : 'text-slate-700'}>★</span>
                      ))}
                    </div>
                    {f.category && <Badge variant="neutral">{f.category}</Badge>}
                  </div>
                  {f.comment && <p className="text-sm text-slate-300 mt-1.5">{f.comment}</p>}
                  <p className="text-xs text-slate-500 mt-1">{s?.name}</p>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
