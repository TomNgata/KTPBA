
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const MONDAY_TEAMS = [
  { name: 'Citihub', captain: 'Tutte', partners: ['Osminde Abdi', 'Saif'], scores: { s: [167, 152, 197], d: [164, 174, 189], t: [148, 188, 135, 146, 140] } },
  { name: '4 Baggerz Nation', captain: 'Nihil Patel', partners: ['Josline Anthony', 'Chirag Patani'], scores: { s: [167, 204, 170], d: [153, 187, 155], t: [183, 134, 139, 170, 136] } },
  { name: '4 Baggerz', captain: 'Aman Patel', partners: ['Biral Dedhia', 'Jazir Teja'], scores: { s: [167, 168, 159], d: [159, 148, 152], t: [145, 200, 167, 136, 169] } },
  { name: 'Noisy Kings', captain: 'Brian', partners: ['Sadam Shariff', 'Zakariya Habib'], scores: { s: [184, 157, 145], d: [165, 177, 120], t: [126, 119, 198, 155, 199] } },
  { name: 'PlayMasters Mavericks', captain: 'Ian Serge', partners: ['Darshi Chandaria', 'Dorothy Williams'], scores: { s: [147, 158, 196], d: [159, 153, 149], t: [178, 113, 121, 155, 202] } },
  { name: 'Amigos Estrella', captain: 'Munzel Moses', partners: ['Benjamin Atandi', 'Samuel Atandi'], scores: { s: [121, 203, 167], d: [206, 155, 149], t: [190, 148, 92, 110, 152] } },
  { name: 'The Big Five Rangers', captain: 'Dipin Khetani', partners: ['Riten Valani', 'Vinesh Vekariya'], scores: { s: [142, 131, 177], d: [119, 113, 117], t: [133, 148, 158, 160, 192] } },
  { name: 'Mahadev Strikers', captain: 'Jagdish Kabariya', partners: ['Kishan Pindoria', 'Prakash Vekaria'], scores: { s: [133, 162, 138], d: [145, 134, 152], t: [140, 100, 133, 155, 143] } },
  { name: 'The Big Five', captain: 'Dipesh Halai', partners: ['Tarang Kara', 'Dilkush Vekaria'], scores: { s: [172, 118, 135], d: [143, 122, 129], t: [140, 144, 116, 116, 178] } },
  { name: 'Ndovu Rev Strikers', captain: 'Pradyuman Jivani', partners: ['Manav Rabadia', 'Dikshit Raghvani'], scores: { s: [124, 137, 135], d: [115, 186, 124], t: [106, 127, 100, 106, 131] } }
];

const TUESDAY_TEAMS = [
  'Amigos Segundo', 'T.W.H.Y.M', 'Incredi-Bowls', 'Unbowlivables', 'PlayMasters Rising', 
  'PlayMasters Warriors', 'Eastline Stars', 'Unbowlivables Strikers', 'PlayMasters', 'Amigos Senoras'
];

async function ingest() {
  console.log('--- KTPBA DATA INGESTION START ---');

  // 1. Clear existing data
  console.log('Cleaning up existing data...');
  await supabase.from('games').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('format_matches').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('matchups').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('weeks').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('players').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('teams').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  // 2. Setup Weeks
  console.log('Setting up Week 1...');
  const { data: monWeek } = await supabase.from('weeks').insert({ week_number: 1, play_date: '2026-04-13', day_of_week: 'Monday', venue: 'Village Bowl', status: 'completed' }).select().single();
  const { data: tueWeek } = await supabase.from('weeks').insert({ week_number: 1, play_date: '2026-04-14', day_of_week: 'Tuesday', venue: 'Village Bowl', status: 'live' }).select().single();

  // 3. Ingest Monday Teams and Results
  console.log('Ingesting Monday Seeding Results...');
  for (let i = 0; i < MONDAY_TEAMS.length; i++) {
    const tData = MONDAY_TEAMS[i];
    const slug = tData.name.toLowerCase().replace(/ /g, '-').replace(/\./g, '');
    
    // Create Team
    const { data: team } = await supabase.from('teams').insert({ name: tData.name, slug }).select().single();
    if (!team) continue;

    // Create Players
    const players = [
        { team_id: team.id, name: tData.captain, role: 'Captain' },
        ...tData.partners.map(p => ({ team_id: team.id, name: p, role: 'Member' }))
    ];
    await supabase.from('players').insert(players);

    // Create Single-Team Matchup (Seeding)
    const lane = i + 3; // Shift by 2 (LN1 -> Lane 3)
    const { data: mu } = await supabase.from('matchups').insert({
      week_id: monWeek?.id,
      home_team_id: team.id,
      lane_pair: lane.toString(),
      type: 'seeding',
      status: 'done'
    }).select().single();

    if (!mu) continue;

    // Create Format Matches & Games
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
        const games = tData.scores[f.key].map((score, idx) => ({
          format_match_id: fm.id,
          game_number: idx + 1,
          home_score: score,
          // In seeding round, winner_team_id can be the team itself for pinfall tracking,
          // but match_points logic in view checks mu.type = 'regular'
          winner_team_id: team.id 
        }));
        await supabase.from('games').insert(games);
      }
    }
  }

  // 4. Ingest Tuesday Teams (Initialization)
  console.log('Initializing Tuesday Session...');
  for (let i = 0; i < TUESDAY_TEAMS.length; i++) {
    const name = TUESDAY_TEAMS[i];
    const slug = name.toLowerCase().replace(/ /g, '-').replace(/\./g, '');
    
    // Create Team
    const { data: team } = await supabase.from('teams').insert({ name, slug }).select().single();
    if (!team) continue;

    // Create Single-Team Matchup (Seeding)
    const lane = i + 3;
    await supabase.from('matchups').insert({
      week_id: tueWeek?.id,
      home_team_id: team.id,
      lane_pair: lane.toString(),
      type: 'seeding',
      status: 'scheduled'
    });
  }

  console.log('--- KTPBA DATA INGESTION COMPLETE ---');
}

ingest().catch(err => {
  console.error('Ingestion failed:', err);
  process.exit(1);
});
