import { stadiums, getStadium, matches } from '../data/stadiums';

export type Intent =
  | 'navigation'
  | 'crowd'
  | 'accessibility'
  | 'transport'
  | 'sustainability'
  | 'schedule'
  | 'facilities'
  | 'safety'
  | 'food'
  | 'tickets'
  | 'greeting'
  | 'help'
  | 'unknown';

export type AssistantResponse = {
  content: string;
  intent: Intent;
  suggestions?: string[];
};

export const languages = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt', label: 'Português', flag: '🇵🇹' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
];

const translations: Record<string, Record<string, string>> = {
  en: {
    greeting: "Hello! I'm your FIFA World Cup 2026 assistant. I can help with navigation, crowd updates, accessibility, transport, sustainability, match schedules, and more. What do you need?",
    help: "I can help you with: finding your way around the stadium, real-time crowd conditions, accessibility services, transportation options, sustainability initiatives, match schedules, food and facilities, and safety information. Just ask me a question!",
    noStadium: "Which stadium are you at? I have info on MetLife (New York), SoFi (Los Angeles), and AT&T (Dallas).",
  },
  es: {
    greeting: "¡Hola! Soy tu asistente de la Copa Mundial FIFA 2026. Puedo ayudarte con navegación, multitudes, accesibilidad, transporte, sostenibilidad y más. ¿Qué necesitas?",
    help: "Puedo ayudarte con: orientación en el estadio, condiciones de multitud, servicios de accesibilidad, transporte, sostenibilidad, horarios de partidos e instalaciones. ¡Solo pregunta!",
    noStadium: "¿En qué estadio estás? Tengo información sobre MetLife (Nueva York), SoFi (Los Ángeles) y AT&T (Dallas).",
  },
  fr: {
    greeting: "Bonjour ! Je suis votre assistant pour la Coupe du Monde FIFA 2026. Je peux vous aider avec la navigation, la foule, l'accessibilité, les transports, le développement durable et plus. De quoi avez-vous besoin ?",
    help: "Je peux vous aider avec : l'orientation dans le stade, les conditions de foule, les services d'accessibilité, les transports, le développement durable, les calendriers de matchs et les installations. Demandez-moi !",
    noStadium: "Dans quel stade êtes-vous ? J'ai des informations sur MetLife (New York), SoFi (Los Angeles) et AT&T (Dallas).",
  },
  de: {
    greeting: "Hallo! Ich bin dein Assistent für die FIFA Weltmeisterschaft 2026. Ich helfe bei Navigation, Menschenmengen, Barrierefreiheit, Transport, Nachhaltigkeit und mehr. Was brauchst du?",
    help: "Ich kann helfen bei: Orientierung im Stadion, Menschenmengen, Barrierefreiheit, Transport, Nachhaltigkeit, Spielplänen und Einrichtungen. Frag mich einfach!",
    noStadium: "In welchem Stadion bist du? Ich habe Infos zu MetLife (New York), SoFi (Los Angeles) und AT&T (Dallas).",
  },
  pt: {
    greeting: "Olá! Sou seu assistente da Copa do Mundo FIFA 2026. Posso ajudar com navegação, multidão, acessibilidade, transporte, sustentabilidade e mais. O que você precisa?",
    help: "Posso ajudar com: orientação no estádio, condições de multidão, acessibilidade, transporte, sustentabilidade, calendário de jogos e instalações. É só perguntar!",
    noStadium: "Em qual estádio você está? Tenho informações sobre MetLife (Nova York), SoFi (Los Angeles) e AT&T (Dallas).",
  },
  ar: {
    greeting: "مرحبا! أنا مساعدك لكأس العالم FIFA 2026. يمكنني المساعدة في التنقل والازدحام وإمكانية الوصول والنقل والاستدامة والمزيد. ماذا تحتاج؟",
    help: "يمكنني المساعدة في: التوجيه داخل الملعب، أحوال الازدحام، خدمات إمكانية الوصول، النقل، الاستدامة، جداول المباريات والمرافق. اسألني فقط!",
    noStadium: "في أي ملعب أنت؟ لدي معلومات عن متلايف (نيويورك) وسوفي (لوس أنجلوس) وAT&T (دالاس).",
  },
  ja: {
    greeting: "こんにちは！FIFAワールドカップ2026のアシスタントです。ナビゲーション、混雑状況、アクセシビリティ、交通、サステナビリティなどをお手伝いできます。何が必要ですか？",
    help: "スタジアムの案内、混雑状況、アクセシビリティサービス、交通手段、サステナビリティ、試合日程、施設についてお手伝いできます。質問してください！",
    noStadium: "どのスタジアムにいますか？メットライフ（ニューヨーク）、ソフィ（ロサンゼルス）、AT&T（ダラス）の情報があります。",
  },
  zh: {
    greeting: "你好！我是2026年FIFA世界杯助手。我可以帮助导航、人群管理、无障碍、交通、可持续发展等。你需要什么？",
    help: "我可以帮助：体育场导览、人群状况、无障碍服务、交通、可持续发展、比赛日程和设施。尽管问吧！",
    noStadium: "你在哪个体育场？我有大都会人寿（纽约）、SoFi（洛杉矶）和AT&T（达拉斯）的信息。",
  },
};

const t = (lang: string, key: string): string =>
  translations[lang]?.[key] ?? translations.en[key] ?? key;

const keywords: Record<Intent, string[]> = {
  navigation: ['where', 'find', 'locate', 'direction', 'how do i get', 'way to', 'nearest', 'restroom', 'exit', 'entrance', 'seat', 'section', 'map', 'navegar', 'dónde', 'où', 'wo', 'onde', '导航', '場所'],
  crowd: ['crowd', 'busy', 'congestion', 'queue', 'line', 'wait', 'density', 'bottleneck', 'multitud', 'foule', 'menge', 'multidão', '人群', '混雑'],
  accessibility: ['accessibility', 'wheelchair', 'disabled', 'sensory', 'visual', 'hearing', 'mobility', 'elevator', 'accesibilidad', 'accessibilité', 'barrierefreiheit', 'acessibilidade', '无障碍', 'アクセシビリティ'],
  transport: ['transport', 'train', 'bus', 'shuttle', 'metro', 'parking', 'rideshare', 'uber', 'taxi', 'transporte', 'transport', 'verkehr', '交通', '輸送'],
  sustainability: ['sustainab', 'green', 'recycle', 'solar', 'water refill', 'eco', 'zero-waste', 'sostenibilidad', 'durabilité', 'nachhaltig', 'sustentabilidade', '可持续', 'サステナ'],
  schedule: ['schedule', 'match', 'game', 'when', 'kickoff', 'time', 'fixture', 'horario', 'match', 'spielplan', 'jogos', '日程', '試合'],
  facilities: ['facility', 'facilities', 'amenities', 'store', 'shop', 'first aid', 'medical', 'family', 'instalaciones', 'installations', 'einrichtungen', 'instalações', '设施', '施設'],
  safety: ['safety', 'emergency', 'help', 'danger', 'incident', 'security', 'seguridad', 'sécurité', 'sicherheit', 'segurança', '安全', '安全'],
  food: ['food', 'eat', 'hungry', 'concession', 'drink', 'restaurant', 'comida', 'nourriture', 'essen', 'comida', '食物', '食べる'],
  tickets: ['ticket', 'seating', 'seat upgrade', 'entrada', 'billet', 'ticket', 'ingresso', '门票', 'チケット'],
  greeting: ['hello', 'hi', 'hey', 'hola', 'bonjour', 'hallo', 'olá', 'مرحبا', 'こんにちは', '你好'],
  help: ['help', 'what can you do', 'ayuda', 'aide', 'hilfe', 'ajuda', 'مساعدة', 'ヘルプ', '帮助'],
  unknown: [],
};

function classifyIntent(message: string): Intent {
  const lower = message.toLowerCase();
  let best: Intent = 'unknown';
  let bestScore = 0;
  for (const intent of Object.keys(keywords) as Intent[]) {
    for (const kw of keywords[intent]) {
      if (lower.includes(kw)) {
        const score = kw.length;
        if (score > bestScore) {
          bestScore = score;
          best = intent;
        }
      }
    }
  }
  return best;
}

function detectStadium(message: string): string | undefined {
  const lower = message.toLowerCase();
  if (lower.includes('metlife') || lower.includes('new york') || lower.includes('new jersey') || lower.includes('nj transit')) return 'metlife';
  if (lower.includes('sofi') || lower.includes('los angeles') || lower.includes('la ')) return 'sofi';
  if (lower.includes('at&t') || lower.includes('dallas') || lower.includes('texas')) return 'at-t';
  return undefined;
}

export function generateResponse(message: string, lang: string, contextStadiumId?: string): AssistantResponse {
  const intent = classifyIntent(message);
  const stadiumId = detectStadium(message) ?? contextStadiumId;
  const stadium = stadiumId ? getStadium(stadiumId) : undefined;

  if (intent === 'greeting') {
    return { content: t(lang, 'greeting'), intent, suggestions: ['Where is the nearest restroom?', 'How crowded is the stadium?', 'What time is the next match?', 'Accessibility services available?'] };
  }

  if (intent === 'help') {
    return { content: t(lang, 'help'), intent, suggestions: ['Find my seat', 'Transportation options', 'Sustainability features', 'Report a crowd issue'] };
  }

  if (!stadium && (intent === 'navigation' || intent === 'crowd' || intent === 'accessibility' || intent === 'transport' || intent === 'facilities' || intent === 'food')) {
    return { content: t(lang, 'noStadium'), intent: 'unknown', suggestions: ['MetLife Stadium', 'SoFi Stadium', 'AT&T Stadium'] };
  }

  switch (intent) {
    case 'navigation': {
      const gates = stadium!.gates;
      const best = [...gates].filter(g => g.open).sort((a, b) => a.waitMinutes - b.waitMinutes)[0];
      const restrooms = stadium!.amenities.find(a => a.type === 'restroom');
      const content = `Here's navigation info for ${stadium!.name}:\n\n• Fastest entry: ${best.name} (${best.side} side) — ${best.waitMinutes} min wait\n• Restrooms: ${restrooms?.location ?? 'Level 1, all sides'}\n• Gates open: ${gates.filter(g => g.open).map(g => g.name).join(', ')}\n• ${gates.find(g => !g.open) ? `Closed: ${gates.filter(g => !g.open).map(g => g.name).join(', ')}` : 'All gates open'}`;
      return { content, intent, suggestions: ['Where is the food court?', 'How do I get to my seat?', 'Nearest first aid?'] };
    }
    case 'crowd': {
      const zones = stadium!.zones;
      const critical = zones.filter(z => z.currentDensity === 'critical' || z.currentDensity === 'high');
      const content = `Live crowd conditions at ${stadium!.name}:\n\n${zones.map(z => `• ${z.name} (${z.level}): ${z.currentDensity.toUpperCase()}`).join('\n')}\n\n${critical.length > 0 ? `⚠️ High-density zones: ${critical.map(z => z.name).join(', ')}. Consider alternative routes.` : 'Crowd levels are manageable across all zones.'}`;
      return { content, intent, suggestions: ['Which gate has the shortest wait?', 'Report a crowd issue', 'Alternative routes?'] };
    }
    case 'accessibility': {
      const features = stadium!.accessibility;
      const content = `Accessibility services at ${stadium!.name}:\n\n${features.map(f => `• ${f.name}: ${f.description} — ${f.location}`).join('\n')}\n\nYou can also submit an accessibility request through the Accessibility tab and staff will be dispatched to assist you.`;
      return { content, intent, suggestions: ['Request wheelchair assistance', 'Where is the sensory room?', 'Audio description service?'] };
    }
    case 'transport': {
      const options = stadium!.transport;
      const content = `Transportation options for ${stadium!.name}:\n\n${options.map(o => `• ${o.label}: ${o.detail} — ETA ${o.etaMinutes} min (${o.status})`).join('\n')}`;
      return { content, intent, suggestions: ['Where is rideshare pickup?', 'Next shuttle departure?', 'Parking availability?'] };
    }
    case 'sustainability': {
      const features = stadium ? stadium.sustainability : stadiums[0].sustainability;
      const content = `Sustainability initiatives at ${stadium?.name ?? 'our stadiums'}:\n\n${features.map(f => `• ${f.name}: ${f.description} — Impact: ${f.impact}`).join('\n')}\n\nLook for water refill stations and zero-waste sorting bins throughout the concourse!`;
      return { content, intent, suggestions: ['Where are water refill stations?', 'How to recycle here?', 'EV shuttle schedule?'] };
    }
    case 'schedule': {
      const stadiumMatches = stadium ? matches.filter(m => m.stadiumId === stadium.id) : matches.slice(0, 4);
      const content = `Upcoming matches${stadium ? ` at ${stadium.name}` : ''}:\n\n${stadiumMatches.map(m => `• ${m.date} ${m.time} — ${m.homeFlag} ${m.homeTeam} vs ${m.awayTeam} ${m.awayFlag} (${m.stage})`).join('\n')}`;
      return { content, intent, suggestions: ['When is the next USA match?', 'Round of 16 schedule?', 'Final match date?'] };
    }
    case 'facilities': {
      const amenities = stadium!.amenities;
      const content = `Facilities at ${stadium!.name}:\n\n${amenities.map(a => `• ${a.name} (${a.type}): ${a.location} — ${a.open ? 'Open' : 'Closed'}`).join('\n')}`;
      return { content, intent, suggestions: ['Where is the FIFA Store?', 'Is first aid open?', 'Family zone location?'] };
    }
    case 'food': {
      const food = stadium!.amenities.filter(a => a.type === 'food');
      const content = `Food & drink at ${stadium!.name}:\n\n${food.map(f => `• ${f.name}: ${f.location} — ${f.open ? 'Open now' : 'Closed'}`).join('\n')}\n\nNote: Food Court Plaza is currently at critical density. Consider the Upper Concourse for shorter lines.`;
      return { content, intent, suggestions: ['Vegetarian options?', 'Where to buy water?', 'Nearest food court?'] };
    }
    case 'safety': {
      const content = `Safety information:\n\n• In an emergency, dial 911 or alert any staff member in a high-visibility vest\n• First Aid stations are on Level 1 at every stadium\n• Follow exit signs — do not use elevators during evacuation\n• Report suspicious activity to security at any gate\n• For non-emergencies, submit an incident through the Operations tab`;
      return { content, intent, suggestions: ['Where is first aid?', 'Report an incident', 'Evacuation routes?'] };
    }
    case 'tickets': {
      const content = `Ticket information:\n\n• Your digital ticket is in the FIFA Tickets app\n• Seat upgrades may be available at the box office (Level 1, North)\n• Have your QR code ready at the gate\n• Accessible seating: contact the nearest info desk`;
      return { content, intent, suggestions: ['How to upgrade my seat?', 'Where is the box office?', 'Accessible seating?'] };
    }
    default:
      return {
        content: "I'm not sure I understood that. I can help with navigation, crowd conditions, accessibility, transport, sustainability, match schedules, facilities, food, safety, and tickets. Try asking about one of those topics!",
        intent: 'unknown',
        suggestions: ['Where is the nearest restroom?', 'How crowded is it?', 'Next match time?', 'Transport options?'],
      };
  }
}
