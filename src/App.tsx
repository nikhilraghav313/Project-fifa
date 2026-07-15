import { useState } from 'react';
import { LayoutDashboard, Sparkles, Navigation, Users, Calendar, Accessibility, Leaf, Bus, Shield, Trophy, Menu, X } from 'lucide-react';
import Dashboard from './views/Dashboard';
import AssistantView from './views/Assistant';
import NavigationView from './views/Navigation';
import CrowdView from './views/Crowd';
import ScheduleView from './views/Schedule';
import AccessibilityView from './views/Accessibility';
import SustainabilityView from './views/Sustainability';
import TransportView from './views/Transport';
import OperationsView from './views/Operations';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'assistant', label: 'AI Assistant', icon: Sparkles },
  { id: 'navigation', label: 'Navigation', icon: Navigation },
  { id: 'crowd', label: 'Crowd Management', icon: Users },
  { id: 'schedule', label: 'Match Schedule', icon: Calendar },
  { id: 'accessibility', label: 'Accessibility', icon: Accessibility },
  { id: 'sustainability', label: 'Sustainability', icon: Leaf },
  { id: 'transport', label: 'Transportation', icon: Bus },
  { id: 'operations', label: 'Operations', icon: Shield },
];

export default function App() {
  const [active, setActive] = useState('dashboard');
  const [stadiumId, setStadiumId] = useState('metlife');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderView = () => {
    switch (active) {
      case 'dashboard': return <Dashboard onNavigate={setActive} />;
      case 'assistant': return <AssistantView stadiumId={stadiumId} />;
      case 'navigation': return <NavigationView stadiumId={stadiumId} setStadiumId={setStadiumId} />;
      case 'crowd': return <CrowdView stadiumId={stadiumId} />;
      case 'schedule': return <ScheduleView stadiumId={stadiumId} setStadiumId={setStadiumId} />;
      case 'accessibility': return <AccessibilityView stadiumId={stadiumId} />;
      case 'sustainability': return <SustainabilityView stadiumId={stadiumId} />;
      case 'transport': return <TransportView stadiumId={stadiumId} setStadiumId={setStadiumId} />;
      case 'operations': return <OperationsView stadiumId={stadiumId} />;
      default: return <Dashboard onNavigate={setActive} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-slate-900/80 backdrop-blur-xl border-r border-slate-800/50 z-50 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Logo */}
        <div className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-600/20">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-slate-100 text-sm leading-tight">World Cup</p>
              <p className="text-xs text-slate-500 leading-tight">Ops Center 2026</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => { setActive(item.id); setSidebarOpen(false); }}
                className={`nav-item w-full ${active === item.id ? 'nav-item-active' : ''}`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800/50">
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary-900/30 to-slate-900/30 border border-primary-500/20">
            <p className="text-xs font-semibold text-primary-300">GenAI Powered</p>
            <p className="text-xs text-slate-400 mt-1">Real-time decision support across all venues</p>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile header */}
        <header className="lg:hidden sticky top-0 z-30 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/50 px-4 py-3 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="text-slate-400 hover:text-slate-200">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-primary-400" />
            <span className="font-bold text-slate-100 text-sm">Ops Center 2026</span>
          </div>
          <div className="w-5" />
        </header>

        {/* Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden">
          {renderView()}
        </main>
      </div>
    </div>
  );
}
