import { Bus, Train, Car, MapPin, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { stadiums, getStadium, type TransportOption } from '../data/stadiums';
import { Card, Badge, SectionTitle } from '../components/ui';

const transportIcons: Record<string, typeof Bus> = {
  metro: Train,
  shuttle: Bus,
  rideshare: Car,
  parking: MapPin,
  bus: Bus,
};

const statusVariant: Record<string, 'success' | 'warning' | 'error'> = {
  'on-time': 'success',
  'delayed': 'warning',
  'disrupted': 'error',
};

export default function TransportView({ stadiumId, setStadiumId }: { stadiumId: string; setStadiumId: (id: string) => void }) {
  const stadium = getStadium(stadiumId) ?? stadiums[0];

  return (
    <div className="space-y-6 animate-fade-in">
      <SectionTitle icon={<Bus className="w-5 h-5" />} title="Transportation" subtitle="Getting to and from the stadium" />

      <div className="flex flex-wrap gap-2">
        {stadiums.map(s => (
          <button key={s.id} onClick={() => setStadiumId(s.id)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${stadiumId === s.id ? 'bg-primary-600 text-white border-primary-500' : 'bg-slate-800/60 text-slate-400 border-slate-700/50 hover:bg-slate-700/60'}`}>
            {s.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stadium.transport.map((t: TransportOption) => {
          const Icon = transportIcons[t.type] ?? Bus;
          return (
            <Card key={t.id} className="p-5 hover:border-primary-500/30 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-500/15 flex items-center justify-center text-primary-400 flex-shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-slate-100">{t.label}</p>
                    <Badge variant={statusVariant[t.status]}>{t.status.replace('-', ' ')}</Badge>
                  </div>
                  <p className="text-sm text-slate-400 mt-1">{t.detail}</p>
                  <div className="flex items-center gap-1.5 mt-3 text-sm">
                    <Clock className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-300">ETA: <span className="font-semibold text-slate-100">{t.etaMinutes} min</span></span>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* AI transport recommendation */}
      <Card className="p-5 border-primary-500/20 bg-gradient-to-r from-primary-900/20 to-slate-900/20">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-500/15 flex items-center justify-center text-primary-400 flex-shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-primary-300">AI Transport Advisory</h3>
            <p className="text-sm text-slate-300 mt-1">
              {(() => {
                const delayed = stadium.transport.filter(t => t.status === 'delayed');
                const best = stadium.transport.filter(t => t.status === 'on-time').sort((a, b) => a.etaMinutes - b.etaMinutes)[0];
                if (delayed.length > 0 && best) {
                  return `${delayed.map(d => d.label).join(', ')} ${delayed.length > 1 ? 'are' : 'is'} experiencing delays. Recommend ${best.label} (${best.etaMinutes} min ETA) for fastest arrival.`;
                }
                return best ? `All transport options running on schedule. ${best.label} offers the quickest route at ${best.etaMinutes} min ETA.` : 'Check transport status for updates.';
              })()}
            </p>
          </div>
        </div>
      </Card>

      {/* Parking & rideshare tips */}
      <Card className="p-5">
        <SectionTitle title="Travel Tips" subtitle="Plan ahead for match day" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { icon: Train, title: 'Arrive Early', desc: 'Public transit is recommended 90 minutes before kickoff to avoid peak congestion.' },
            { icon: Car, title: 'Rideshare Zone', desc: 'Use designated pickup/dropoff zones. Walk to the assigned lot — no curbside pickup.' },
            { icon: Bus, title: 'Shuttle Service', desc: 'Free EV shuttles run every 10-15 minutes from remote parking lots.' },
            { icon: CheckCircle, title: 'Post-Match', desc: 'Allow extra time for departure. Shuttles continue 90 minutes after final whistle.' },
          ].map((tip, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/40 border border-slate-700/40">
              <div className="w-9 h-9 rounded-lg bg-slate-800/60 flex items-center justify-center text-primary-400 flex-shrink-0">
                <tip.icon className="w-4 h-4" />
              </div>
              <div>
                <p className="font-medium text-slate-200 text-sm">{tip.title}</p>
                <p className="text-xs text-slate-400 mt-0.5">{tip.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
