'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function loginAction(email: string, password: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) return { error: 'Email ou mot de passe incorrect' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, is_admin')
    .eq('id', data.user.id)
    .single()

  if (profile?.role === 'admin' || profile?.is_admin === true) redirect('/admin')
  else redirect('/dashboard')
}
