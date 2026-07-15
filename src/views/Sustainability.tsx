import { Leaf, Sun, Recycle, Droplets, Bus, Zap } from 'lucide-react';
import { stadiums, getStadium } from '../data/stadiums';
import { Card, SectionTitle, StatCard } from '../components/ui';

const featureIcons: Record<string, typeof Sun> = {
  'Solar Panels': Sun,
  'Zero-Waste Stations': Recycle,
  'Water Refill Stations': Droplets,
  'EV Shuttle Fleet': Bus,
};

export default function SustainabilityView({ stadiumId }: { stadiumId: string }) {
  const stadium = getStadium(stadiumId) ?? stadiums[0];

  return (
    <div className="space-y-6 animate-fade-in">
      <SectionTitle icon={<Leaf className="w-5 h-5" />} title="Sustainability" subtitle="Green initiatives across FIFA World Cup 2026 venues" />

      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl border border-success-500/20 bg-gradient-to-br from-success-900/20 via-slate-900 to-slate-900 p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-success-500/10 rounded-full blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <Leaf className="w-5 h-5 text-success-400" />
            <span className="text-success-400 font-semibold text-sm tracking-wide uppercase">Carbon-Neutral Goal</span>
          </div>
          <h2 className="text-2xl font-bold text-white">Tournament-Wide Green Strategy</h2>
          <p className="text-slate-300 mt-2 max-w-xl">FIFA World Cup 2026 is committed to being the most sustainable tournament in history, with initiatives spanning energy, waste, water, and transport across all 16 host cities.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={<Sun className="w-5 h-5" />} label="Renewable Energy" value="40%" sublabel="Solar-powered concourses" accent="success" />
        <StatCard icon={<Recycle className="w-5 h-5" />} label="Waste Diversion" value="85%" sublabel="Compost + recycling" accent="success" />
        <StatCard icon={<Droplets className="w-5 h-5" />} label="Plastic Bottles Saved" value="500K" sublabel="Water refill stations" accent="primary" />
        <StatCard icon={<Bus className="w-5 h-5" />} label="EV Shuttles" value="100%" sublabel="Zero tailpipe emissions" accent="success" />
      </div>

      {/* Features at selected stadium */}
      <Card className="p-5">
        <SectionTitle title={`Initiatives at ${stadium.name}`} subtitle="On-site sustainability features" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stadium.sustainability.map(f => {
            const Icon = featureIcons[f.name] ?? Leaf;
            return (
              <div key={f.id} className="p-4 rounded-xl bg-gradient-to-br from-success-900/20 to-slate-900/30 border border-success-500/15 hover:border-success-500/30 transition-all">
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-xl bg-success-500/15 flex items-center justify-center text-success-400 flex-shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-100">{f.name}</p>
                    <p className="text-sm text-slate-400 mt-1">{f.description}</p>
                    <div className="flex items-center gap-1.5 mt-2">
                      <Zap className="w-3.5 h-3.5 text-success-400" />
                      <span className="text-xs font-semibold text-success-400">{f.impact}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Tips */}
      <Card className="p-5">
        <SectionTitle title="Fan Sustainability Tips" subtitle="How you can help" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { icon: Droplets, title: 'Bring a Reusable Bottle', desc: 'Use free water refill stations instead of single-use plastic.' },
            { icon: Recycle, title: 'Sort Your Waste', desc: 'Use the zero-waste sorting stations at all concessions.' },
            { icon: Bus, title: 'Take Public Transit', desc: 'Use EV shuttles and metro to reduce your carbon footprint.' },
          ].map((tip, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-900/40 border border-slate-700/40">
              <div className="w-9 h-9 rounded-lg bg-success-500/15 flex items-center justify-center text-success-400 mb-3">
                <tip.icon className="w-4 h-4" />
              </div>
              <p className="font-medium text-slate-200 text-sm">{tip.title}</p>
              <p className="text-xs text-slate-400 mt-1">{tip.desc}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
