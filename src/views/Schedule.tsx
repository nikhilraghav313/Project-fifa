import { Calendar, Clock, MapPin, Trophy } from 'lucide-react';
import { matches, stadiums, getStadium } from '../data/stadiums';
import { Card, Badge, SectionTitle } from '../components/ui';

export default function ScheduleView({ stadiumId, setStadiumId }: { stadiumId: string; setStadiumId: (id: string) => void }) {
  const stages = [...new Set(matches.map(m => m.stage))];

  return (
    <div className="space-y-6 animate-fade-in">
      <SectionTitle icon={<Calendar className="w-5 h-5" />} title="Match Schedule" subtitle="FIFA World Cup 2026 fixtures" />

      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setStadiumId('')} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${stadiumId === '' ? 'bg-primary-600 text-white border-primary-500' : 'bg-slate-800/60 text-slate-400 border-slate-700/50 hover:bg-slate-700/60'}`}>
          All Venues
        </button>
        {stadiums.map(s => (
          <button key={s.id} onClick={() => setStadiumId(s.id)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${stadiumId === s.id ? 'bg-primary-600 text-white border-primary-500' : 'bg-slate-800/60 text-slate-400 border-slate-700/50 hover:bg-slate-700/60'}`}>
            {s.name}
          </button>
        ))}
      </div>

      {stages.map(stage => {
        const stageMatches = matches.filter(m => m.stage === stage && (!stadiumId || m.stadiumId === stadiumId));
        if (stageMatches.length === 0) return null;
        return (
          <div key={stage}>
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="w-4 h-4 text-accent-400" />
              <h3 className="text-sm font-bold text-accent-400 uppercase tracking-wide">{stage}</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stageMatches.map(m => {
                const stadium = getStadium(m.stadiumId);
                return (
                  <Card key={m.id} className="p-5 hover:border-primary-500/30 transition-all group">
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="info">Group {m.group}</Badge>
                      <span className="text-xs text-slate-500">{m.date}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-center flex-1">
                        <div className="text-4xl mb-1">{m.homeFlag}</div>
                        <p className="font-semibold text-slate-100 text-sm">{m.homeTeam}</p>
                      </div>
                      <div className="px-4">
                        <p className="text-xs text-slate-500 uppercase">vs</p>
                        <p className="text-lg font-bold text-slate-400">{m.time}</p>
                      </div>
                      <div className="text-center flex-1">
                        <div className="text-4xl mb-1">{m.awayFlag}</div>
                        <p className="font-semibold text-slate-100 text-sm">{m.awayTeam}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-700/40 text-xs text-slate-400">
                      <MapPin className="w-3.5 h-3.5" />
                      {stadium?.name}, {stadium?.city}
                      <Clock className="w-3.5 h-3.5 ml-auto" />
                      {m.time}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
