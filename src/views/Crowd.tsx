import { useEffect, useState } from 'react';
import { Users, Plus, AlertCircle, TrendingUp, Activity, Zap } from 'lucide-react';
import { supabase, type CrowdReport } from '../lib/supabase';
import { stadiums } from '../data/stadiums';
import { Card, SectionTitle, DensityBadge, StatCard } from '../components/ui';

export default function CrowdView({ stadiumId }: { stadiumId: string }) {
  const [reports, setReports] = useState<CrowdReport[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ zone: '', density: 'moderate' as CrowdReport['density_level'], note: '', role: 'staff' as CrowdReport['reporter_role'] });

  const load = () => {
    supabase.from('crowd_reports').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      if (data) setReports(data);
    });
  };

  useEffect(load, []);

  const submit = async () => {
    if (!form.zone.trim()) return;
    await supabase.from('crowd_reports').insert({
      stadium_id: stadiumId,
      zone: form.zone,
      density_level: form.density,
      note: form.note || null,
      reporter_role: form.role,
    });
    setForm({ zone: '', density: 'moderate', note: '', role: 'staff' });
    setShowForm(false);
    load();
  };

  const critical = reports.filter(r => r.density_level === 'critical').length;
  const high = reports.filter(r => r.density_level === 'high').length;
  const moderate = reports.filter(r => r.density_level === 'moderate').length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <SectionTitle icon={<Users className="w-5 h-5" />} title="Crowd Management" subtitle="Real-time density monitoring and reporting" />
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Report
        </button>
      </div>

      {showForm && (
        <Card className="p-5 animate-slide-up">
          <h3 className="font-semibold text-slate-200 mb-4">New Crowd Report</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Zone / Area</label>
              <input value={form.zone} onChange={e => setForm({ ...form, zone: e.target.value })} placeholder="e.g. Gate D, Concourse L2" className="input-field" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Density Level</label>
              <select value={form.density} onChange={e => setForm({ ...form, density: e.target.value as CrowdReport['density_level'] })} className="input-field">
                <option value="low">Low</option>
                <option value="moderate">Moderate</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Reporter Role</label>
              <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value as CrowdReport['reporter_role'] })} className="input-field">
                <option value="staff">Staff</option>
                <option value="volunteer">Volunteer</option>
                <option value="fan">Fan</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Note (optional)</label>
              <input value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} placeholder="Additional details" className="input-field" />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={submit} className="btn-primary">Submit Report</button>
            <button onClick={() => setShowForm(false)} className="btn-ghost">Cancel</button>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={<AlertCircle className="w-5 h-5" />} label="Critical Zones" value={critical} accent="error" />
        <StatCard icon={<TrendingUp className="w-5 h-5" />} label="High Density" value={high} accent="warning" />
        <StatCard icon={<Activity className="w-5 h-5" />} label="Moderate" value={moderate} accent="primary" />
        <StatCard icon={<Users className="w-5 h-5" />} label="Total Reports" value={reports.length} accent="accent" />
      </div>

      {/* AI recommendation */}
      <Card className="p-5 border-primary-500/20 bg-gradient-to-r from-primary-900/20 to-slate-900/20">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-500/15 flex items-center justify-center text-primary-400 flex-shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-primary-300">AI Crowd Intelligence</h3>
            <p className="text-sm text-slate-300 mt-1">
              {critical > 0 || high > 0
                ? `${critical + high} zone(s) require attention. Recommend deploying additional stewards to high-density areas and opening overflow gates. Consider diverting foot traffic to less congested concourses.`
                : 'Crowd levels are within normal parameters. Continue routine monitoring.'}
            </p>
          </div>
        </div>
      </Card>

      {/* Reports list */}
      <Card className="p-5">
        <SectionTitle title="Crowd Reports" subtitle="Latest observations from staff and volunteers" />
        <div className="space-y-2">
          {reports.length === 0 && <p className="text-sm text-slate-500">No reports yet.</p>}
          {reports.map(r => {
            const s = stadiums.find(st => st.id === r.stadium_id);
            return (
              <div key={r.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/40 border border-slate-700/40 hover:border-slate-600/50 transition-all">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${r.density_level === 'critical' ? 'bg-error-400 animate-pulse' : r.density_level === 'high' ? 'bg-warning-400' : r.density_level === 'moderate' ? 'bg-primary-400' : 'bg-success-400'}`} />
                  <div>
                    <p className="text-sm font-medium text-slate-200">{r.zone}</p>
                    <p className="text-xs text-slate-500">{s?.name} • by {r.reporter_role}</p>
                    {r.note && <p className="text-xs text-slate-400 mt-0.5">{r.note}</p>}
                  </div>
                </div>
                <DensityBadge level={r.density_level} />
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
