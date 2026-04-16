
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Load .env from root
dotenv.config({ path: path.join(__dirname, '../../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  const { data: weeks, error: wErr } = await supabase.from('weeks').select('week_number, id').order('week_number');
  if (wErr) {
    console.error('Error fetching weeks:', wErr);
    return;
  }

  console.log(`Found ${weeks.length} weeks.`);
  
  for (const w of weeks) {
    const { data: matches, error: mErr } = await supabase
      .from('matchups')
      .select('id, type')
      .eq('week_id', w.id);
    
    if (mErr) {
      console.error(`Error fetching matchups for week ${w.week_number}:`, mErr);
    } else {
      console.log(`Week ${w.week_number}: ${matches.length} matches (Type: ${matches[0]?.type || 'N/A'})`);
    }
  }
}

check();
