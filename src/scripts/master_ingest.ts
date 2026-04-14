
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

const ALL_RESULTS = [
  // MONDAY TEAMS
  { name: 'Citihub', captain: 'Tutte', partners: ['Osminde Abdi', 'Saif'], day: 'Monday', scores: { s: [167, 152, 197], d: [164, 174, 189], t: [148, 188, 135, 146, 140] } },
  { name: '4 Baggerz Nation', captain: 'Nihil Patel', partners: ['Josline Anthony', 'Chirag Patani'], day: 'Monday', scores: { s: [167, 204, 170], d: [153, 187, 155], t: [183, 134, 139, 170, 136] } },
  { name: '4 Baggerz', captain: 'Aman Patel', partners: ['Biral Dedhia', 'Jazir Teja'], day: 'Monday', scores: { s: [167, 168, 159], d: [159, 148, 152], t: [145, 200, 167, 136, 169] } },
  { name: 'Noisy Kings', captain: 'Brian', partners: ['Sadam Shariff', 'Zakariya Habib'], day: 'Monday', scores: { s: [184, 157, 145], d: [165, 177, 120], t: [126, 119, 198, 155, 199] } },
  { name: 'PlayMasters Mavericks', captain: 'Ian Serge', partners: ['Darshi Chandaria', 'Dorothy Williams'], day: 'Monday', scores: { s: [147, 158, 196], d: [159, 153, 149], t: [178, 113, 121, 155, 202] } },
  { name: 'Amigos Estrella', captain: 'Munzel Moses', partners: ['Benjamin Atandi', 'Samuel Atandi'], day: 'Monday', scores: { s: [121, 203, 167], d: [206, 155, 149], t: [190, 148, 92, 110, 152] } },
  { name: 'The Big Five Rangers', captain: 'Dipin Khetani', partners: ['Riten Valani', 'Vinesh Vekariya'], day: 'Monday', scores: { s: [142, 131, 177], d: [119, 113, 117], t: [133, 148, 158, 160, 192] } },
  { name: 'Mahadev Strikers', captain: 'Jagdish Kabariya', partners: ['Kishan Pindoria', 'Prakash Vekaria'], day: 'Monday', scores: { s: [133, 162, 138], d: [145, 134, 152], t: [140, 100, 133, 155, 143] } },
  { name: 'The Big Five', captain: 'Dipesh Halai', partners: ['Tarang Kara', 'Dilkush Vekaria'], day: 'Monday', scores: { s: [172, 118, 135], d: [143, 122, 129], t: [140, 144, 116, 116, 178] } },
  { name: 'Ndovu Rev Strikers', captain: 'Pradyuman Jivani', partners: ['Manav Rabadia', 'Dikshit Raghvani'], day: 'Monday', scores: { s: [124, 137, 135], d: [115, 186, 124], t: [106, 127, 100, 106, 131] } },
  
  // TUESDAY TEAMS
  { name: 'Amigos Segundo', captain: 'Joe Mbithi', partners: ['Bismark Kemboi', 'Dufla'], day: 'Tuesday', scores: { s: [163, 141, 220], d: [151, 200, 174], t: [166, 171, 190, 188, 155] } },
  { name: 'PlayMasters', captain: 'Paras Chandaria', partners: ['Suresh Bhudiya', 'Tilak Vekaria'], day: 'Tuesday', scores: { s: [107, 183, 198], d: [190, 179, 227], t: [170, 180, 127, 172, 178] } },
  { name: 'Unbowlivables Strikers', captain: 'Yash Patel', partners: ['Shivam Dewadi', 'Rohin Gajjar'], day: 'Tuesday', scores: { s: [180, 147, 158], d: [127, 157, 196], t: [183, 161, 150, 151, 159] } },
  { name: 'T.W.H.Y.M', captain: 'Austin Gachoka', partners: ['Alvin Njuguna', 'Brian Koome'], day: 'Tuesday', scores: { s: [132, 183, 171], d: [141, 166, 164], t: [180, 142, 164, 147, 115] } },
  { name: 'Eastline Stars', captain: 'Joseph Woni', partners: ['Wilson Lumasia', 'Said Garane'], day: 'Tuesday', scores: { s: [169, 200, 174], d: [146, 170, 165], t: [157, 155, 110, 106, 108] } },
  { name: 'Amigos Senoras', captain: 'Justine Waithira', partners: ['Dashni Kerai', 'Sonika Patel'], day: 'Tuesday', scores: { s: [130, 164, 141], d: [154, 178, 160], t: [160, 127, 144, 121, 115] } },
  { name: 'PlayMasters Warriors', captain: 'Deepen Gohil', partners: ['Nitin Pindoria', 'Sagar Joshi'], day: 'Tuesday', scores: { s: [144, 127, 177], d: [156, 118, 122], t: [157, 119, 193, 137, 130] } },
  { name: 'Unbowlivables', captain: 'Niral Modasia', partners: ['Miraj Shah', 'Pritesh Modasia'], day: 'Tuesday', scores: { s: [136, 158, 173], d: [115, 129, 140], t: [162, 122, 103, 161, 137] } },
  { name: 'Incredi-Bowls', captain: 'Nathan Musyoki', partners: ['Stanley Ouma', 'Samson Kiarie'], day: 'Tuesday', scores: { s: [162, 149, 126], d: [125, 135, 156], t: [123, 102, 124, 135, 134] } },
  { name: 'PlayMasters Rising', captain: 'Vraj Patel', partners: ['Victor Waruingi', 'Kelvin Andrews'], day: 'Tuesday', scores: { s: [107, 125, 133], d: [118, 124, 157], t: [127, 147, 119, 143, 128] } },
];

async function masterIngest() {
  console.log('--- STARTING MASTER INGESTION ---');

  // 1. Clear everything
  console.log('Clearing existing data...');
  await supabase.from('games').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('format_matches').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('matchups').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('weeks').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('players').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('teams').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  // 2. Create Weeks
  console.log('Setting up weeks...');
  const { data: monWeek } = await supabase.from('weeks').insert({ week_number: 1, play_date: '2026-04-13', day_of_week: 'Monday', status: 'completed' }).select().single();
  const { data: tueWeek } = await supabase.from('weeks').insert({ week_number: 1, play_date: '2026-04-14', day_of_week: 'Tuesday', status: 'completed' }).select().single();

  // 3. Process all teams
  const laneCounters: Record<string, number> = { 'Monday': 3, 'Tuesday': 3 };

  for (const res of ALL_RESULTS) {
    console.log(`Ingesting ${res.name} (${res.day})...`);
    
    // Create Team
    const slug = res.name.toLowerCase().replace(/ /g, '-').replace(/\./g, '');
    const { data: team } = await supabase.from('teams').insert({ name: res.name, slug }).select().single();
    if (!team) continue;

    // Create Players
    const players = [
        { team_id: team.id, name: res.captain, role: 'Captain' },
        ...res.partners.map(p => ({ team_id: team.id, name: p, role: 'Member' }))
    ];
    await supabase.from('players').insert(players);

    // Create Seeding Matchup
    const weekId = res.day === 'Monday' ? monWeek?.id : tueWeek?.id;
    const lane = laneCounters[res.day]++;
    
    const { data: mu } = await supabase.from('matchups').insert({
      week_id: weekId,
      home_team_id: team.id,
      lane_pair: lane.toString(),
      type: 'seeding',
      status: 'done'
    }).select().single();

    if (mu) {
      const formats = [
        { key: 's' as const, db: 'singles' },
        { key: 'd' as const, db: 'doubles' },
        { key: 't' as const, db: 'teams' }
      ];

      for (const f of formats) {
        const { data: fm } = await supabase.from('format_matches').insert({
          matchup_id: mu.id,
          format: f.db,
          status: 'completed'
        }).select().single();

        if (fm) {
          const games = res.scores[f.key].map((score, idx) => ({
            format_match_id: fm.id,
            game_number: idx + 1,
            home_score: score,
            winner_team_id: team.id
          }));
          await supabase.from('games').insert(games);
        }
      }
    }
  }

  console.log('--- MASTER INGESTION COMPLETE ---');
}

masterIngest();
