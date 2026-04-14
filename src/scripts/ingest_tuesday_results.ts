
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

const TUESDAY_RESULTS = [
  { name: 'Amigos Segundo', s_c: 'Joe Mbithi', d1: 'Bismark Kemboi', d2: 'Dufla', scores: { s: [163, 141, 220], d: [151, 200, 174], t: [166, 171, 190, 188, 155] } },
  { name: 'PlayMasters', s_c: 'Paras Chandaria', d1: 'Suresh Bhudiya', d2: 'Tilak Vekaria', scores: { s: [107, 183, 198], d: [190, 179, 227], t: [170, 180, 127, 172, 178] } },
  { name: 'Unbowlivables Strikers', s_c: 'Yash Patel', d1: 'Shivam Dewadi', d2: 'Rohin Gajjar', scores: { s: [180, 147, 158], d: [127, 157, 196], t: [183, 161, 150, 151, 159] } },
  { name: 'T.W.H.Y.M', s_c: 'Austin Gachoka', d1: 'Alvin Njuguna', d2: 'Brian Koome', scores: { s: [132, 183, 171], d: [141, 166, 164], t: [180, 142, 164, 147, 115] } },
  { name: 'Eastline Stars', s_c: 'Joseph Woni', d1: 'Wilson Lumasia', d2: 'Said Garane', scores: { s: [169, 200, 174], d: [146, 170, 165], t: [157, 155, 110, 106, 108] } },
  { name: 'Amigos Senoras', s_c: 'Justine Waithira', d1: 'Dashni Kerai', d2: 'Sonika Patel', scores: { s: [130, 164, 141], d: [154, 178, 160], t: [160, 127, 144, 121, 115] } },
  { name: 'PlayMasters Warriors', s_c: 'Deepen Gohil', d1: 'Nitin Pindoria', d2: 'Sagar Joshi', scores: { s: [144, 127, 177], d: [156, 118, 122], t: [157, 119, 193, 137, 130] } },
  { name: 'Unbowlivables', s_c: 'Niral Modasia', d1: 'Miraj Shah', d2: 'Pritesh Modasia', scores: { s: [136, 158, 173], d: [115, 129, 140], t: [162, 122, 103, 161, 137] } },
  { name: 'Incredi-Bowls', s_c: 'Nathan Musyoki', d1: 'Stanley Ouma', d2: 'Samson Kiarie', scores: { s: [162, 149, 126], d: [125, 135, 156], t: [123, 102, 124, 135, 134] } },
  { name: 'PlayMasters Rising', s_c: 'Vraj Patel', d1: 'Victor Waruingi', d2: 'Kelvin Andrews', scores: { s: [107, 125, 133], d: [118, 124, 157], t: [127, 147, 119, 143, 128] } },
];

async function ingestTuesday() {
  console.log('--- INGESTING TUESDAY RESULTS ---');

  for (const res of TUESDAY_RESULTS) {
    console.log(`Processing ${res.name}...`);
    
    // 1. Find Team
    const { data: team } = await supabase.from('teams').select('id').eq('name', res.name).single();
    if (!team) {
      console.warn(`Team ${res.name} not found!`);
      continue;
    }

    // 2. Add Players
    await supabase.from('players').insert([
      { team_id: team.id, name: res.s_c, role: 'Singles' },
      { team_id: team.id, name: res.d1, role: 'Doubles' },
      { team_id: team.id, name: res.d2, role: 'Doubles' }
    ]);

    // 3. Find Seeding Matchup
    const { data: mu } = await supabase.from('matchups')
      .select('id')
      .eq('home_team_id', team.id)
      .eq('type', 'seeding')
      .single();

    if (mu) {
      // 4. Update Matchup Status
      await supabase.from('matchups').update({ status: 'done' }).eq('id', mu.id);

      // 5. Create Format Matches & Games
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
        }).select('id').single();

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

  console.log('--- TUESDAY INGESTION COMPLETE ---');
}

ingestTuesday();
