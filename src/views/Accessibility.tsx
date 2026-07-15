import { useEffect, useState } from 'react';
import { Accessibility, Plus, CheckCircle, Clock, AlertCircle, Eye, Ear, Headphones, Move } from 'lucide-react';
import { supabase, type AccessibilityRequest } from '../lib/supabase';
import { stadiums, getStadium } from '../data/stadiums';
import { Card, Badge, SectionTitle, StatCard } from '../components/ui';

const typeIcons: Record<string, typeof Accessibility> = {
  wheelchair: Accessibility,
  sensory: Headphones,
  visual: Eye,
  hearing: Ear,
  mobility: Move,
  other: Accessibility,
};

export default function AccessibilityView({ stadiumId }: { stadiumId: string }) {
  const [requests, setRequests] = useState<AccessibilityRequest[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ request_type: 'wheelchair' as AccessibilityRequest['request_type'], location: '', details: '' });

  const load = () => {
    supabase.from('accessibility_requests').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      if (data) setRequests(data);
    });
  };

  useEffect(load, []);

  const submit = async () => {
    await supabase.from('accessibility_requests').insert({
      stadium_id: stadiumId,
      request_type: form.request_type,
      location: form.location || null,
      details: form.details || null,
    });
    setForm({ request_type: 'wheelchair', location: '', details: '' });
    setShowForm(false);
    load();
  };

  const updateStatus = async (id: string, status: AccessibilityRequest['status']) => {
    await supabase.from('accessibility_requests').update({ status }).eq('id', id);
    load();
  };

  const stadium = getStadium(stadiumId) ?? stadiums[0];
  const open = requests.filter(r => r.status === 'open').length;
  const inProgress = requests.filter(r => r.status === 'in_progress').length;
  const resolved = requests.filter(r => r.status === 'resolved').length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <SectionTitle icon={<Accessibility className="w-5 h-5" />} title="Accessibility Services" subtitle="Inclusive support for all fans" />
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Request
        </button>
      </div>

      {showForm && (
        <Card className="p-5 animate-slide-up">
          <h3 className="font-semibold text-slate-200 mb-4">New Accessibility Request</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Request Type</label>
              <select value={form.request_type} onChange={e => setForm({ ...form, request_type: e.target.value as AccessibilityRequest['request_type'] })} className="input-field">
                <option value="wheelchair">Wheelchair Assistance</option>
                <option value="sensory">Sensory Support</option>
                <option value="visual">Visual Assistance</option>
                <option value="hearing">Hearing Assistance</option>
                <option value="mobility">Mobility Support</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Location</label>
              <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="e.g. Gate C, Section 220" className="input-field" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Details</label>
              <input value={form.details} onChange={e => setForm({ ...form, details: e.target.value })} placeholder="Additional info" className="input-field" />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={submit} className="btn-primary">Submit Request</button>
            <button onClick={() => setShowForm(false)} className="btn-ghost">Cancel</button>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={<AlertCircle className="w-5 h-5" />} label="Open Requests" value={open} accent="warning" />
        <StatCard icon={<Clock className="w-5 h-5" />} label="In Progress" value={inProgress} accent="primary" />
        <StatCard icon={<CheckCircle className="w-5 h-5" />} label="Resolved" value={resolved} accent="success" />
        <StatCard icon={<Accessibility className="w-5 h-5" />} label="Total" value={requests.length} accent="accent" />
      </div>

      {/* Accessibility features */}
      <Card className="p-5">
        <SectionTitle title="Available Services" subtitle={`Accessibility features at ${stadium.name}`} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {stadium.accessibility.map(f => (
            <div key={f.id} className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/40 border border-slate-700/40">
              <div className="w-9 h-9 rounded-lg bg-primary-500/15 flex items-center justify-center text-primary-400 flex-shrink-0">
                <Accessibility className="w-4 h-4" />
              </div>
              <div>
                <p className="font-medium text-slate-200 text-sm">{f.name}</p>
                <p className="text-xs text-slate-400">{f.description}</p>
                <p className="text-xs text-slate-500 mt-0.5">📍 {f.location}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Requests */}
      <Card className="p-5">
        <SectionTitle title="Assistance Requests" subtitle="Live request tracking" />
        <div className="space-y-2">
          {requests.length === 0 && <p className="text-sm text-slate-500">No requests yet.</p>}
          {requests.map(r => {
            const Icon = typeIcons[r.request_type] ?? Accessibility;
            const s = stadiums.find(st => st.id === r.stadium_id);
            return (
              <div key={r.id} className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/40 border border-slate-700/40">
                <div className="w-9 h-9 rounded-lg bg-slate-800/60 flex items-center justify-center text-primary-400 flex-shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-slate-200 capitalize">{r.request_type} assistance</span>
                    <Badge variant={r.status === 'open' ? 'warning' : r.status === 'in_progress' ? 'info' : 'success'}>{r.status.replace('_', ' ')}</Badge>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{s?.name}{r.location ? ` • ${r.location}` : ''}</p>
                  {r.details && <p className="text-xs text-slate-400 mt-1">{r.details}</p>}
                </div>
                <div className="flex gap-1">
                  {r.status === 'open' && (
                    <button onClick={() => updateStatus(r.id, 'in_progress')} className="px-2.5 py-1 rounded-lg bg-primary-500/15 text-primary-300 text-xs font-medium hover:bg-primary-500/25 transition-all">Start</button>
                  )}
                  {r.status === 'in_progress' && (
                    <button onClick={() => updateStatus(r.id, 'resolved')} className="px-2.5 py-1 rounded-lg bg-success-500/15 text-success-400 text-xs font-medium hover:bg-success-500/25 transition-all">Resolve</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
