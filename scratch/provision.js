
async function provision() {
  const projectRef = 'djanuifiotmsgbojtoih';
  const token = 'sbp_9258cb90e034244f8fe7e5a56d3a5933ee541402';
  
  const sql = `
    CREATE TABLE IF NOT EXISTS teams (
      id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
      name text NOT NULL,
      slug text UNIQUE NOT NULL,
      color_hex text,
      is_active boolean DEFAULT true,
      created_at timestamp with time zone DEFAULT now()
    );
  `;

  // Try different endpoints known to be used by various Supabase tools
  const endpoints = [
    `https://api.supabase.com/v1/projects/${projectRef}/query`,
    `https://api.supabase.com/v1/projects/${projectRef}/db/query`,
    `https://api.supabase.com/v1/queries`
  ];

  for (const url of endpoints) {
    console.log(`Trying ${url}...`);
    try {
      const resp = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: sql,
          project_id: projectRef
        })
      });
      console.log(`Status: ${resp.status}`);
      const data = await resp.text();
      console.log(`Response: ${data}`);
      if (resp.ok) break;
    } catch (e) {
      console.error(e);
    }
  }
}

provision();
