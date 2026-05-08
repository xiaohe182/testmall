import http from './http'

export interface ImgResult { url: string }

export async function genImg(prompt: string, size = '1024x1024'): Promise<ImgResult> {
  const { data } = await http.post('/images/generations', {
    model: 'cogview-3-plus',
    prompt,
    size
  })
  return data.data?.[0] ?? data
}
