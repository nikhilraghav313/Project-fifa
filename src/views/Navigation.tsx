import { useState } from 'react';
import { Navigation, MapPin, Clock, DoorOpen, Coffee, Store, Heart, Baby, Headphones, Building2 } from 'lucide-react';
import { stadiums, getStadium } from '../data/stadiums';
import { Card, Badge, SectionTitle, DensityBadge } from '../components/ui';

const amenityIcons: Record<string, typeof Coffee> = {
  food: Coffee,
  retail: Store,
  restroom: Building2,
  medical: Heart,
  family: Baby,
  sensory: Headphones,
};

export default function NavigationView({ stadiumId, setStadiumId }: { stadiumId: string; setStadiumId: (id: string) => void }) {
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const stadium = getStadium(stadiumId) ?? stadiums[0];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stadium selector */}
      <div className="flex flex-wrap gap-2">
        {stadiums.map(s => (
          <button
            key={s.id}
            onClick={() => setStadiumId(s.id)}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all border ${stadiumId === s.id ? 'bg-primary-600 text-white border-primary-500' : 'bg-slate-800/60 text-slate-400 border-slate-700/50 hover:bg-slate-700/60'}`}
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-700/50 h-48">
        <img src={stadium.image} alt={stadium.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
        <div className="absolute bottom-4 left-6">
          <h1 className="text-2xl font-bold text-white">{stadium.name}</h1>
          <p className="text-slate-300 text-sm">{stadium.city}, {stadium.country} • Capacity: {(stadium.capacity / 1000).toFixed(1)}K</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gates */}
        <Card className="p-5">
          <SectionTitle icon={<DoorOpen className="w-5 h-5" />} title="Entry Gates" subtitle="Live wait times" />
          <div className="space-y-2.5">
            {stadium.gates.map(g => (
              <div key={g.id} className={`p-3 rounded-xl border transition-all ${g.open ? 'bg-slate-900/40 border-slate-700/40' : 'bg-slate-900/20 border-slate-800/40 opacity-60'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-200">{g.name}</span>
                    <Badge variant="neutral">{g.side}</Badge>
                    {g.accessible && <Badge variant="info">Accessible</Badge>}
                  </div>
                  {g.open ? (
                    <div className="flex items-center gap-1.5 text-sm">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span className={g.waitMinutes > 20 ? 'text-error-400 font-semibold' : g.waitMinutes > 10 ? 'text-warning-400' : 'text-success-400'}>
                        {g.waitMinutes} min
                      </span>
                    </div>
                  ) : (
                    <Badge variant="neutral">Closed</Badge>
                  )}
                </div>
                {g.open && (
                  <div className="mt-2 h-1.5 rounded-full bg-slate-700/50 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${g.waitMinutes > 20 ? 'bg-error-500' : g.waitMinutes > 10 ? 'bg-warning-500' : 'bg-success-500'}`}
                      style={{ width: `${Math.min(g.waitMinutes * 3, 100)}%` }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Zones */}
        <Card className="p-5">
          <SectionTitle icon={<Navigation className="w-5 h-5" />} title="Stadium Zones" subtitle="Live crowd density" />
          <div className="space-y-2">
            {stadium.zones.map(z => (
              <button
                key={z.id}
                onClick={() => setSelectedZone(selectedZone === z.id ? null : z.id)}
                className={`w-full p-3 rounded-xl border transition-all text-left ${selectedZone === z.id ? 'bg-primary-500/10 border-primary-500/30' : 'bg-slate-900/40 border-slate-700/40 hover:border-slate-600/50'}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-200 text-sm">{z.name}</p>
                    <p className="text-xs text-slate-500">{z.level} • Cap: {z.capacity.toLocaleString()}</p>
                  </div>
                  <DensityBadge level={z.currentDensity} />
                </div>
                {selectedZone === z.id && (
                  <div className="mt-2 pt-2 border-t border-slate-700/40 text-xs text-slate-400 animate-fade-in">
                    <p>Current density: {z.currentDensity}. {z.currentDensity === 'critical' || z.currentDensity === 'high' ? 'Consider using alternative zones to reduce congestion.' : 'Operating within normal parameters.'}</p>
                  </div>
                )}
              </button>
            ))}
          </div>
        </Card>

        {/* Amenities */}
        <Card className="p-5">
          <SectionTitle icon={<MapPin className="w-5 h-5" />} title="Amenities" subtitle="On-site facilities" />
          <div className="space-y-2">
            {stadium.amenities.map(a => {
              const Icon = amenityIcons[a.type] ?? MapPin;
              return (
                <div key={a.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/40 border border-slate-700/40">
                  <div className="w-9 h-9 rounded-lg bg-slate-800/60 flex items-center justify-center text-primary-400">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-200 text-sm">{a.name}</p>
                    <p className="text-xs text-slate-500">{a.location}</p>
                  </div>
                  <Badge variant={a.open ? 'success' : 'neutral'}>{a.open ? 'Open' : 'Closed'}</Badge>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* AI Route suggestion */}
      <Card className="p-5">
        <SectionTitle icon={<Navigation className="w-5 h-5" />} title="AI-Optimized Routes" subtitle="GenAI recommendations based on real-time conditions" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <RouteCard
            title="Fastest Entry"
            route={stadium.gates.filter(g => g.open).sort((a, b) => a.waitMinutes - b.waitMinutes)[0]?.name ?? '—'}
            detail="Lowest current wait time"
            color="success"
          />
          <RouteCard
            title="Least Crowded Zone"
            route={stadium.zones.sort((a, b) => densityRank(a.currentDensity) - densityRank(b.currentDensity))[0]?.name ?? '—'}
            detail="Best for relaxed movement"
            color="info"
          />
          <RouteCard
            title="Accessible Route"
            route={stadium.gates.filter(g => g.accessible && g.open).sort((a, b) => a.waitMinutes - b.waitMinutes)[0]?.name ?? '—'}
            detail="Wheelchair-friendly entry"
            color="warning"
          />
        </div>
      </Card>
    </div>
  );
}

function densityRank(d: string): number {
  return { low: 0, moderate: 1, high: 2, critical: 3 }[d] ?? 0;
}

function RouteCard({ title, route, detail, color }: { title: string; route: string; detail: string; color: 'success' | 'info' | 'warning' }) {
  const colors = {
    success: 'from-success-900/30 to-slate-900/30 border-success-500/20 text-success-400',
    info: 'from-primary-900/30 to-slate-900/30 border-primary-500/20 text-primary-400',
    warning: 'from-warning-900/30 to-slate-900/30 border-warning-500/20 text-warning-400',
  };
  return (
    <div className={`p-4 rounded-xl bg-gradient-to-br border ${colors[color]}`}>
      <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">{title}</p>
      <p className="text-xl font-bold text-slate-100 mt-1">{route}</p>
      <p className="text-xs text-slate-400 mt-1">{detail}</p>
    </div>
  );
}
