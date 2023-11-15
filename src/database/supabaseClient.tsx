import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rgwuhurybooiqejowtyt.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJnd3VodXJ5Ym9vaXFlam93dHl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTg4NDYxODIsImV4cCI6MjAxNDQyMjE4Mn0.UscB77rYU97qKJmCCWEz-thmWg-DsZ2zpe4ts68z20E'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)