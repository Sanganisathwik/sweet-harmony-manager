import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function makeAdmin(email) {
  if (!email) {
    console.error('Please provide an email address.');
    console.log('Usage: node scripts/make-admin.js <email>');
    process.exit(1);
  }

  console.log(`Making ${email} an admin...`);

  // 1. Get the user ID from auth.users (we can't query auth.users directly with js client usually, 
  // but with service key we can use listUsers)
  
  const { data: { users }, error: userError } = await supabase.auth.admin.listUsers();

  if (userError) {
    console.error('Error listing users:', userError.message);
    process.exit(1);
  }

  const user = users.find(u => u.email === email);

  if (!user) {
    console.error(`User with email ${email} not found.`);
    process.exit(1);
  }

  console.log(`Found user: ${user.id}`);

  // 2. Update or insert into user_roles
  const { error: roleError } = await supabase
    .from('user_roles')
    .upsert({ 
      user_id: user.id, 
      role: 'admin' 
    }, { onConflict: 'user_id' });

  if (roleError) {
    console.error('Error updating user role:', roleError.message);
    process.exit(1);
  }

  console.log(`✅ Successfully made ${email} an admin!`);
}

const email = process.argv[2];
makeAdmin(email);
