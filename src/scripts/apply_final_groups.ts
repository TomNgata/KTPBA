
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

const GROUP_ALLOCATIONS = {
  'A': [ // MONDAY
    'PlayMasters',
    'Citihub',
    'Unbowlivables Strikers',
    'Noisy Kings',
    'Amigos Estrella',
    'Eastline Stars',
    'PlayMasters Warriors',
    'Unbowlivables',
    'Incredi-Bowls',
    'PlayMasters Rising'
  ],
  'B': [ // TUESDAY
    'Amigos Segundo',
    '4 Baggerz Nation',
    '4 Baggerz',
    'PlayMasters Mavericks',
    'T.W.H.Y.M',
    'Amigos Senoras',
    'The Big Five Rangers',
    'Mahadev Strikers',
    'The Big Five',
    'Ndovu Rev Strikers'
  ]
};

async function applyAllocations() {
  console.log('--- APPLYING FINAL GROUP ALLOCATIONS ---');

  for (const [group, teamNames] of Object.entries(GROUP_ALLOCATIONS)) {
    console.log(`Setting Group ${group}...`);
    for (const name of teamNames) {
      const { error } = await supabase
        .from('teams')
        .update({ group_name: group })
        .eq('name', name);
      
      if (error) console.error(`Error updating ${name}:`, error);
      else console.log(` - ${name} assigned to Group ${group}`);
    }
  }

  console.log('--- ALLOCATIONS COMPLETE ---');
}

applyAllocations();
