export type Stadium = {
  id: string;
  name: string;
  city: string;
  country: string;
  capacity: number;
  image: string;
  zones: Zone[];
  gates: Gate[];
  amenities: Amenity[];
  transport: TransportOption[];
  sustainability: SustainabilityFeature[];
  accessibility: AccessibilityFeature[];
};

export type Zone = {
  id: string;
  name: string;
  level: string;
  type: 'concourse' | 'stand' | 'entrance' | 'food' | 'retail' | 'medical' | 'restroom' | 'family';
  currentDensity: 'low' | 'moderate' | 'high' | 'critical';
  capacity: number;
};

export type Gate = {
  id: string;
  name: string;
  side: 'North' | 'South' | 'East' | 'West';
  open: boolean;
  waitMinutes: number;
  accessible: boolean;
};

export type Amenity = {
  id: string;
  name: string;
  type: 'food' | 'retail' | 'restroom' | 'medical' | 'family' | 'sensory';
  location: string;
  open: boolean;
};

export type TransportOption = {
  id: string;
  type: 'metro' | 'shuttle' | 'rideshare' | 'parking' | 'bus';
  label: string;
  detail: string;
  etaMinutes: number;
  status: 'on-time' | 'delayed' | 'disrupted';
};

export type SustainabilityFeature = {
  id: string;
  name: string;
  description: string;
  impact: string;
};

export type AccessibilityFeature = {
  id: string;
  name: string;
  description: string;
  location: string;
};

const baseZones = (prefix: string): Zone[] => [
  { id: `${prefix}-z1`, name: 'Main Concourse', level: 'Level 1', type: 'concourse', currentDensity: 'high', capacity: 8000 },
  { id: `${prefix}-z2`, name: 'Upper Concourse', level: 'Level 3', type: 'concourse', currentDensity: 'moderate', capacity: 5000 },
  { id: `${prefix}-z3`, name: 'Food Court Plaza', level: 'Level 1', type: 'food', currentDensity: 'critical', capacity: 3000 },
  { id: `${prefix}-z4`, name: 'Retail Boulevard', level: 'Level 2', type: 'retail', currentDensity: 'low', capacity: 2000 },
  { id: `${prefix}-z5`, name: 'Medical Center', level: 'Level 1', type: 'medical', currentDensity: 'low', capacity: 200 },
  { id: `${prefix}-z6`, name: 'Family Zone', level: 'Level 2', type: 'family', currentDensity: 'moderate', capacity: 1500 },
];

const baseGates = (prefix: string): Gate[] => [
  { id: `${prefix}-gA`, name: 'Gate A', side: 'North', open: true, waitMinutes: 12, accessible: true },
  { id: `${prefix}-gB`, name: 'Gate B', side: 'East', open: true, waitMinutes: 8, accessible: true },
  { id: `${prefix}-gC`, name: 'Gate C', side: 'South', open: true, waitMinutes: 15, accessible: true },
  { id: `${prefix}-gD`, name: 'Gate D', side: 'West', open: true, waitMinutes: 25, accessible: false },
  { id: `${prefix}-gE`, name: 'Gate E', side: 'North', open: false, waitMinutes: 0, accessible: true },
];

const baseAmenities = (prefix: string): Amenity[] => [
  { id: `${prefix}-a1`, name: 'Concessions Central', type: 'food', location: 'Level 1, North', open: true },
  { id: `${prefix}-a2`, name: 'FIFA Store', type: 'retail', location: 'Level 2, East', open: true },
  { id: `${prefix}-a3`, name: 'Restrooms L1', type: 'restroom', location: 'Level 1, all sides', open: true },
  { id: `${prefix}-a4`, name: 'First Aid Station', type: 'medical', location: 'Level 1, West', open: true },
  { id: `${prefix}-a5`, name: 'Sensory Room', type: 'sensory', location: 'Level 2, North', open: true },
  { id: `${prefix}-a6`, name: 'Family Restroom', type: 'family', location: 'Level 2, South', open: true },
];

const baseSustainability = (): SustainabilityFeature[] => [
  { id: 's1', name: 'Solar Panels', description: 'Rooftop solar array powering concourse lighting', impact: '40% renewable energy' },
  { id: 's2', name: 'Zero-Waste Stations', description: 'Compost, recycling, and landfill sorting at all concessions', impact: '85% waste diversion' },
  { id: 's3', name: 'Water Refill Stations', description: 'Free filtered water at 24 stations to reduce single-use plastic', impact: '500K bottles saved' },
  { id: 's4', name: 'EV Shuttle Fleet', description: 'Electric shuttle buses for park-and-ride service', impact: 'Zero tailpipe emissions' },
];

const baseAccessibility = (): AccessibilityFeature[] => [
  { id: 'a1', name: 'Elevator Access', description: 'Elevators to all levels at every gate', location: 'All gates' },
  { id: 'a2', name: 'Accessible Seating', description: 'Designated wheelchair-accessible viewing platforms', location: 'Every section' },
  { id: 'a3', name: 'Sensory Room', description: 'Quiet space with dimmed lighting for sensory-sensitive fans', location: 'Level 2, North' },
  { id: 'a4', name: 'Audio Description', description: 'Live audio descriptive commentary for visually impaired fans', location: 'Via app + headset' },
  { id: 'a5', name: 'Sign Language Interpreters', description: 'On-site interpreters at info desks and key announcements', location: 'Info desks' },
];

export const stadiums: Stadium[] = [
  {
    id: 'metlife',
    name: 'MetLife Stadium',
    city: 'New York / New Jersey',
    country: 'USA',
    capacity: 82500,
    image: 'https://images.pexels.com/photos/259621/pexels-photo-259621.jpeg?auto=compress&cs=tinysrgb&w=1200',
    zones: baseZones('metlife'),
    gates: baseGates('metlife'),
    amenities: baseAmenities('metlife'),
    transport: [
      { id: 't1', type: 'metro', label: 'NJ Transit Rail', detail: 'Secaucus Junction → Meadowlands', etaMinutes: 18, status: 'on-time' },
      { id: 't2', type: 'shuttle', label: 'Park & Ride Shuttle', detail: 'From Lot P7, every 10 min', etaMinutes: 12, status: 'delayed' },
      { id: 't3', type: 'rideshare', label: 'Rideshare Pickup', detail: 'Designated zone at Lot F', etaMinutes: 20, status: 'on-time' },
      { id: 't4', type: 'parking', label: 'General Parking', detail: 'Lots A–G open', etaMinutes: 5, status: 'on-time' },
    ],
    sustainability: baseSustainability(),
    accessibility: baseAccessibility(),
  },
  {
    id: 'sofi',
    name: 'SoFi Stadium',
    city: 'Los Angeles',
    country: 'USA',
    capacity: 70240,
    image: 'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=1200',
    zones: baseZones('sofi'),
    gates: baseGates('sofi'),
    amenities: baseAmenities('sofi'),
    transport: [
      { id: 't1', type: 'metro', label: 'Metro C Line', detail: 'Hawthorne/Lennox Station', etaMinutes: 15, status: 'on-time' },
      { id: 't2', type: 'shuttle', label: 'Stadium Shuttle', detail: 'From Downtown LA, every 15 min', etaMinutes: 25, status: 'delayed' },
      { id: 't3', type: 'rideshare', label: 'Rideshare Pickup', detail: 'Zone R at Pincay Drive', etaMinutes: 15, status: 'on-time' },
      { id: 't4', type: 'parking', label: 'On-Site Parking', detail: 'Lots 1–6, $60', etaMinutes: 8, status: 'on-time' },
    ],
    sustainability: baseSustainability(),
    accessibility: baseAccessibility(),
  },
  {
    id: 'at-t',
    name: 'AT&T Stadium',
    city: 'Dallas',
    country: 'USA',
    capacity: 80000,
    image: 'https://images.pexels.com/photos/209206/pexels-photo-209206.jpeg?auto=compress&cs=tinysrgb&w=1200',
    zones: baseZones('at-t'),
    gates: baseGates('at-t'),
    amenities: baseAmenities('at-t'),
    transport: [
      { id: 't1', type: 'bus', label: 'DART Bus Route 501', detail: 'From downtown Dallas', etaMinutes: 30, status: 'on-time' },
      { id: 't2', type: 'shuttle', label: 'Express Shuttle', detail: 'From CentrePort, every 12 min', etaMinutes: 18, status: 'on-time' },
      { id: 't3', type: 'rideshare', label: 'Rideshare Pickup', detail: 'Riders Zone at Lot 10', etaMinutes: 22, status: 'disrupted' },
      { id: 't4', type: 'parking', label: 'Stadium Parking', detail: 'Lots 1–12, $50', etaMinutes: 10, status: 'on-time' },
    ],
    sustainability: baseSustainability(),
    accessibility: baseAccessibility(),
  },
];

export type Match = {
  id: string;
  stage: string;
  homeTeam: string;
  awayTeam: string;
  homeFlag: string;
  awayFlag: string;
  stadiumId: string;
  date: string;
  time: string;
  group: string;
};

export const matches: Match[] = [
  { id: 'm1', stage: 'Group Stage', homeTeam: 'Mexico', awayTeam: 'Canada', homeFlag: '🇲🇽', awayFlag: '🇨🇦', stadiumId: 'metlife', date: 'Jun 11, 2026', time: '20:00', group: 'A' },
  { id: 'm2', stage: 'Group Stage', homeTeam: 'USA', awayTeam: 'Brazil', homeFlag: '🇺🇸', awayFlag: '🇧🇷', stadiumId: 'sofi', date: 'Jun 12, 2026', time: '21:00', group: 'B' },
  { id: 'm3', stage: 'Group Stage', homeTeam: 'Argentina', awayTeam: 'Germany', homeFlag: '🇦🇷', awayFlag: '🇩🇪', stadiumId: 'at-t', date: 'Jun 13, 2026', time: '19:30', group: 'C' },
  { id: 'm4', stage: 'Group Stage', homeTeam: 'Spain', awayTeam: 'France', homeFlag: '🇪🇸', awayFlag: '🇫🇷', stadiumId: 'metlife', date: 'Jun 15, 2026', time: '18:00', group: 'D' },
  { id: 'm5', stage: 'Group Stage', homeTeam: 'England', awayTeam: 'Japan', homeFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', awayFlag: '🇯🇵', stadiumId: 'sofi', date: 'Jun 16, 2026', time: '20:30', group: 'E' },
  { id: 'm6', stage: 'Group Stage', homeTeam: 'Portugal', awayTeam: 'Netherlands', homeFlag: '🇵🇹', awayFlag: '🇳🇱', stadiumId: 'at-t', date: 'Jun 17, 2026', time: '21:00', group: 'F' },
  { id: 'm7', stage: 'Round of 16', homeTeam: 'Winner A', awayTeam: 'Runner-up B', homeFlag: '⚽', awayFlag: '⚽', stadiumId: 'metlife', date: 'Jun 28, 2026', time: '19:00', group: 'R16' },
  { id: 'm8', stage: 'Quarter-Final', homeTeam: 'TBD', awayTeam: 'TBD', homeFlag: '⚽', awayFlag: '⚽', stadiumId: 'sofi', date: 'Jul 4, 2026', time: '20:00', group: 'QF' },
];

export const getStadium = (id: string): Stadium | undefined =>
  stadiums.find((s) => s.id === id);
