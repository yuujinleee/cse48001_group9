
import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types.ts'

// URL and KEY
const SUPABASE_URL = 'https://sssfwtibjhdthffelfip.supabase.co'
const SUPABASE_ANON_KEY= 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzc2Z3dGliamhkdGhmZmVsZmlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTg1OTIyOTUsImV4cCI6MjAxNDE2ODI5NX0.anAxyqjmgv6qIo-tiFSRvrOrona2OWCTpyNpwbDuu8M'

// Connect to database
const supabase = createClient<Database>(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
)

// Fetch data
const { data } = await supabase
.from('countries')
.select('name')

console.log(data)