export function uploadImagesPet(image_url: string): string[] {
  try {
    const images = JSON.parse(image_url || "[]");
    return Array.isArray(images) ? images : [images];
  } catch {
    return image_url ? [image_url] : [];
  }
}