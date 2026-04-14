
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function executeSeeding() {
  console.log('--- EXECUTING SEEDING SPLIT ---');

  // 1. Fetch current rankings based on seeding_pinfall
  const { data: teams, error } = await supabase
    .from('team_standings')
    .select('team_id, name, seeding_pinfall')
    .order('seeding_pinfall', { ascending: false });

  if (error || !teams) {
    console.error('Error fetching rankings:', error);
    return;
  }

  console.log(`Found ${teams.length} teams. Executing Zig-Zag Split...`);

  // 2. Zig-Zag Split: 1->A, 2->B, 3->A, 4->B...
  for (let i = 0; i < teams.length; i++) {
    const groupName = i % 2 === 0 ? 'A' : 'B';
    const team = teams[i];

    console.log(`[Rank ${i + 1}] ${team.name} -> Group ${groupName} (${team.seeding_pinfall} pins)`);

    const { error: updateError } = await supabase
      .from('teams')
      .update({ group_name: groupName })
      .eq('id', team.team_id);

    if (updateError) {
      console.error(`Failed to update ${team.name}:`, updateError);
    }
  }

  console.log('--- SEEDING SPLIT COMPLETE ---');
}

executeSeeding();
