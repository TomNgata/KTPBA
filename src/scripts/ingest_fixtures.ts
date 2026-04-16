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

const teamNameMap: Record<string, string> = {
  'cityhub': 'Citihub',
  'the 4baggerz': '4 Baggerz',
  '4baggerz nation': '4 Baggerz Nation',
  'the incredi-bowls': 'Incredi-Bowls',
  'unbowlivable strikers': 'Unbowlivables Strikers',
};

function normalizeName(name: string): string {
  const lower = name.trim().toLowerCase();
  return teamNameMap[lower] || name.trim();
}

const FIXTURES = [
  // WEEK 2
  { week_number: 2, date: '2026-04-20', day: 'Monday', matchups: [
    { home: 'PlayMasters', away: 'Citihub', lanes: '3-4' },
    { home: 'Unbowlivables Strikers', away: 'Noisy Kings', lanes: '5-6' },
    { home: 'Amigos Estrella', away: 'Eastline Stars', lanes: '7-8' },
    { home: 'PlayMasters Warriors', away: 'Unbowlivables', lanes: '9-10' },
    { home: 'Incredi-Bowls', away: 'PlayMasters Rising', lanes: '11-12' },
  ]},
  { week_number: 2, date: '2026-04-21', day: 'Tuesday', matchups: [
    { home: 'Amigos Segundo', away: '4 Baggerz Nation', lanes: '3-4' },
    { home: '4 Baggerz', away: 'PlayMasters Mavericks', lanes: '5-6' },
    { home: 'T.W.H.Y.M', away: 'Amigos Senoras', lanes: '7-8' },
    { home: 'The Big Five Rangers', away: 'Mahadev Strikers', lanes: '9-10' },
    { home: 'The Big Five', away: 'Ndovu Rev Strikers', lanes: '11-12' },
  ]},
  // WEEK 3
  { week_number: 3, date: '2026-04-27', day: 'Monday', matchups: [
    { home: 'PlayMasters Warriors', away: 'Unbowlivables Strikers', lanes: '3-4' },
    { home: 'PlayMasters', away: 'Eastline Stars', lanes: '5-6' },
    { home: 'Citihub', away: 'Incredi-Bowls', lanes: '7-8' },
    { home: 'Amigos Estrella', away: 'PlayMasters Rising', lanes: '9-10' },
    { home: 'Unbowlivables', away: 'Noisy Kings', lanes: '11-12' },
  ]},
  { week_number: 3, date: '2026-04-28', day: 'Tuesday', matchups: [
    { home: 'The Big Five Rangers', away: '4 Baggerz', lanes: '3-4' },
    { home: 'Amigos Segundo', away: 'Amigos Senoras', lanes: '5-6' },
    { home: '4 Baggerz Nation', away: 'The Big Five', lanes: '7-8' },
    { home: 'T.W.H.Y.M', away: 'Ndovu Rev Strikers', lanes: '9-10' },
    { home: 'Mahadev Strikers', away: 'PlayMasters Mavericks', lanes: '11-12' },
  ]},
  // WEEK 4
  { week_number: 4, date: '2026-05-04', day: 'Monday', matchups: [
    { home: 'Noisy Kings', away: 'Amigos Estrella', lanes: '3-4' },
    { home: 'Incredi-Bowls', away: 'Unbowlivables', lanes: '5-6' },
    { home: 'PlayMasters Rising', away: 'PlayMasters', lanes: '7-8' },
    { home: 'Unbowlivables Strikers', away: 'Citihub', lanes: '9-10' },
    { home: 'Eastline Stars', away: 'PlayMasters Warriors', lanes: '11-12' },
  ]},
  { week_number: 4, date: '2026-05-05', day: 'Tuesday', matchups: [
    { home: 'PlayMasters Mavericks', away: 'T.W.H.Y.M', lanes: '3-4' },
    { home: 'The Big Five', away: 'Mahadev Strikers', lanes: '5-6' },
    { home: 'Ndovu Rev Strikers', away: 'Amigos Segundo', lanes: '7-8' },
    { home: '4 Baggerz', away: '4 Baggerz Nation', lanes: '9-10' },
    { home: 'Amigos Senoras', away: 'The Big Five Rangers', lanes: '11-12' },
  ]},
  // WEEK 5
  { week_number: 5, date: '2026-05-11', day: 'Monday', matchups: [
    { home: 'Incredi-Bowls', away: 'PlayMasters', lanes: '3-4' },
    { home: 'Amigos Estrella', away: 'Unbowlivables Strikers', lanes: '5-6' },
    { home: 'Noisy Kings', away: 'PlayMasters Warriors', lanes: '7-8' },
    { home: 'Unbowlivables', away: 'Eastline Stars', lanes: '9-10' },
    { home: 'PlayMasters Rising', away: 'Citihub', lanes: '11-12' },
  ]},
  { week_number: 5, date: '2026-05-12', day: 'Tuesday', matchups: [
    { home: 'The Big Five', away: 'Amigos Segundo', lanes: '3-4' },
    { home: 'T.W.H.Y.M', away: '4 Baggerz', lanes: '5-6' },
    { home: 'PlayMasters Mavericks', away: 'The Big Five Rangers', lanes: '7-8' },
    { home: 'Mahadev Strikers', away: 'Amigos Senoras', lanes: '9-10' },
    { home: 'Ndovu Rev Strikers', away: '4 Baggerz Nation', lanes: '11-12' },
  ]},
  // WEEK 6
  { week_number: 6, date: '2026-05-18', day: 'Monday', matchups: [
    { home: 'PlayMasters Rising', away: 'PlayMasters Warriors', lanes: '3-4' },
    { home: 'Eastline Stars', away: 'Citihub', lanes: '5-6' },
    { home: 'Unbowlivables', away: 'Unbowlivables Strikers', lanes: '7-8' },
    { home: 'Noisy Kings', away: 'PlayMasters', lanes: '9-10' },
    { home: 'Amigos Estrella', away: 'Incredi-Bowls', lanes: '11-12' },
  ]},
  { week_number: 6, date: '2026-05-19', day: 'Tuesday', matchups: [
    { home: 'Ndovu Rev Strikers', away: 'The Big Five Rangers', lanes: '3-4' },
    { home: 'Amigos Senoras', away: '4 Baggerz Nation', lanes: '5-6' },
    { home: 'Mahadev Strikers', away: '4 Baggerz', lanes: '7-8' },
    { home: 'PlayMasters Mavericks', away: 'Amigos Segundo', lanes: '9-10' },
    { home: 'T.W.H.Y.M', away: 'The Big Five', lanes: '11-12' },
  ]},
  // WEEK 7
  { week_number: 7, date: '2026-05-25', day: 'Monday', matchups: [
    { home: 'Amigos Estrella', away: 'Unbowlivables', lanes: '3-4' },
    { home: 'Noisy Kings', away: 'PlayMasters Rising', lanes: '5-6' },
    { home: 'PlayMasters Warriors', away: 'Citihub', lanes: '7-8' },
    { home: 'Eastline Stars', away: 'Incredi-Bowls', lanes: '9-10' },
    { home: 'PlayMasters', away: 'Unbowlivables Strikers', lanes: '11-12' },
  ]},
  { week_number: 7, date: '2026-05-26', day: 'Tuesday', matchups: [
    { home: 'T.W.H.Y.M', away: 'Mahadev Strikers', lanes: '3-4' },
    { home: 'PlayMasters Mavericks', away: 'Ndovu Rev Strikers', lanes: '5-6' },
    { home: 'The Big Five Rangers', away: '4 Baggerz Nation', lanes: '7-8' },
    { home: 'Amigos Senoras', away: 'The Big Five', lanes: '9-10' },
    { home: 'Amigos Segundo', away: '4 Baggerz', lanes: '11-12' },
  ]},
  // WEEK 8
  { week_number: 8, date: '2026-06-03', day: 'Wednesday', matchups: [
    { home: 'Eastline Stars', away: 'Noisy Kings', lanes: '3-4' },
    { home: 'PlayMasters Warriors', away: 'Incredi-Bowls', lanes: '5-6' },
    { home: 'PlayMasters', away: 'Amigos Estrella', lanes: '7-8' },
    { home: 'PlayMasters Rising', away: 'Unbowlivables Strikers', lanes: '9-10' },
    { home: 'Citihub', away: 'Unbowlivables', lanes: '11-12' },
  ]},
  { week_number: 8, date: '2026-06-02', day: 'Tuesday', matchups: [
    { home: 'Amigos Senoras', away: 'PlayMasters Mavericks', lanes: '3-4' },
    { home: 'The Big Five Rangers', away: 'The Big Five', lanes: '5-6' },
    { home: 'Amigos Segundo', away: 'T.W.H.Y.M', lanes: '7-8' },
    { home: 'Ndovu Rev Strikers', away: '4 Baggerz', lanes: '9-10' },
    { home: '4 Baggerz Nation', away: 'Mahadev Strikers', lanes: '11-12' },
  ]},
  // WEEK 9
  { week_number: 9, date: '2026-06-08', day: 'Monday', matchups: [
    { home: 'Unbowlivables Strikers', away: 'Incredi-Bowls', lanes: '3-4' },
    { home: 'Unbowlivables', away: 'PlayMasters', lanes: '5-6' },
    { home: 'Eastline Stars', away: 'PlayMasters Rising', lanes: '7-8' },
    { home: 'Citihub', away: 'Noisy Kings', lanes: '9-10' },
    { home: 'PlayMasters Warriors', away: 'Amigos Estrella', lanes: '11-12' },
  ]},
  { week_number: 9, date: '2026-06-09', day: 'Tuesday', matchups: [
    { home: '4 Baggerz', away: 'The Big Five', lanes: '3-4' },
    { home: 'Mahadev Strikers', away: 'Amigos Segundo', lanes: '5-6' },
    { home: 'Amigos Senoras', away: 'Ndovu Rev Strikers', lanes: '7-8' },
    { home: '4 Baggerz Nation', away: 'PlayMasters Mavericks', lanes: '9-10' },
    { home: 'The Big Five Rangers', away: 'T.W.H.Y.M', lanes: '11-12' },
  ]},
  // WEEK 10
  { week_number: 10, date: '2026-06-15', day: 'Monday', matchups: [
    { home: 'Unbowlivables', away: 'PlayMasters Rising', lanes: '3-4' },
    { home: 'Citihub', away: 'Amigos Estrella', lanes: '5-6' },
    { home: 'Incredi-Bowls', away: 'Noisy Kings', lanes: '7-8' },
    { home: 'PlayMasters', away: 'PlayMasters Warriors', lanes: '9-10' },
    { home: 'Unbowlivables Strikers', away: 'Eastline Stars', lanes: '11-12' },
  ]},
  { week_number: 10, date: '2026-06-16', day: 'Tuesday', matchups: [
    { home: 'Mahadev Strikers', away: 'Ndovu Rev Strikers', lanes: '3-4' },
    { home: '4 Baggerz Nation', away: 'T.W.H.Y.M', lanes: '5-6' },
    { home: 'The Big Five', away: 'PlayMasters Mavericks', lanes: '7-8' },
    { home: 'Amigos Segundo', away: 'The Big Five Rangers', lanes: '9-10' },
    { home: '4 Baggerz', away: 'Amigos Senoras', lanes: '11-12' },
  ]}
];

async function run() {
  console.log('--- STARTING FIXTURES INGESTION (WEEKS 2-10) ---');
  
  // 1. Fetch teams to create a lookup map
  const { data: dbTeams, error: tErr } = await supabase.from('teams').select('id, name');
  if (tErr || !dbTeams) {
    console.error('Failed to fetch teams:', tErr);
    process.exit(1);
  }

  const teamIdMap: Record<string, string> = {};
  for (const t of dbTeams) {
    teamIdMap[t.name.trim().toLowerCase()] = t.id;
  }

  const getTeamId = (name: string) => {
    const norm = normalizeName(name);
    const id = teamIdMap[norm.toLowerCase()];
    if (!id) {
       console.error(`ERROR: Could not find team ID for "${name}" (normalized: "${norm}")`);
    }
    return id;
  };

  // Pre-validate all team names
  let hasErrors = false;
  for (const group of FIXTURES) {
    for (const match of group.matchups) {
      if (!getTeamId(match.home) || !getTeamId(match.away)) {
        hasErrors = true;
      }
    }
  }

  if (hasErrors) {
    console.error('Validation failed due to missing teams. Aborting insertion.');
    process.exit(1);
  }
  
  console.log(`Found ${dbTeams.length} teams. Names validated successfully.`);

  // 2. Clear corrupted week schedules (Week > 1) to ensure spotless insertion
  console.log('Cleaning up existing Round Robin schedules...');
  // Find all week IDs for > 1
  const { data: oldWeeks } = await supabase.from('weeks').select('id').gt('week_number', 1);
  if (oldWeeks && oldWeeks.length > 0) {
    const ids = oldWeeks.map(w => w.id);
    await supabase.from('matchups').delete().in('week_id', ids);
    await supabase.from('weeks').delete().gt('week_number', 1);
  }

  for (let weekNumber = 2; weekNumber <= 10; weekNumber++) {
      console.log(`\nProcessing Week ${weekNumber}...`);
      
      const weekGroups = FIXTURES.filter(f => f.week_number === weekNumber);
      
      for (const group of weekGroups) {
          // Check if week exists
          let { data: week } = await supabase
              .from('weeks')
              .select('id')
              .eq('week_number', weekNumber)
              .eq('play_date', group.date)
              .single();

          if (!week) {
             console.log(`  Creating week block for ${group.date} (${group.day})`);
             const { data: newWeek, error: wErr } = await supabase.from('weeks').insert({
                 week_number: group.week_number,
                 play_date: group.date,
                 day_of_week: group.day,
                 venue: 'Village Bowl',
                 status: 'scheduled'
             }).select().single();
             
             if (wErr) {
                 console.error('  Failed to create week:', wErr);
                 continue;
             }
             week = newWeek;
          }

          // Insert Matchups
          console.log(`  Inserting ${group.matchups.length} matchups...`);
          const inserts = group.matchups.map(m => ({
              week_id: week.id,
              home_team_id: getTeamId(m.home),
              away_team_id: getTeamId(m.away),
              lane_pair: m.lanes,
              type: 'regular',
              status: 'scheduled'
          }));

          const { error: insErr } = await supabase.from('matchups').insert(inserts);
          if (insErr) {
              console.error('  Failed to insert matchups:', insErr);
          } else {
              console.log('  Success.');
          }
      }
  }

  console.log('--- COMPLETED EXTENDED FIXTURES INGESTION ---');
}

run();
