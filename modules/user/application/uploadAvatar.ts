import { supabase } from '@/lib/supabase'

export async function uploadAvatarFile(uri: string, mimeType?: string): Promise<string> {
  const arraybuffer = await fetch(uri).then((res) => res.arrayBuffer())
  const fileExt = uri.split('.').pop()?.toLowerCase() ?? 'jpeg'
  const path = `${Date.now()}.${fileExt}`
  const { data, error } = await supabase.storage.from('avatars').upload(path, arraybuffer, { contentType: mimeType ?? 'image/jpeg' })
  if (error) throw error
  return data.path
}