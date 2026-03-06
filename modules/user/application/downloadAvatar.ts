import { supabase } from '@/lib/supabase'

export async function downloadAvatar(path: string): Promise<string> {
  const { data, error } = await supabase.storage.from('avatars').download(path)
  if (error) throw error

  const fr = new FileReader()
  fr.readAsDataURL(data)
  return new Promise((resolve) => {
    fr.onload = () => resolve(fr.result as string)
  })
}