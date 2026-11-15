// Turns a photo the user picked into a smaller JPEG (data URL), so it can be
// stored in the browser together with the listing. Phone photos are often
// 3–5 MB; this brings them down to roughly 100–200 KB.

const MAX_SIDE = 1200
const QUALITY = 0.8

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error(`Could not read ${file.name}`))
    }
    img.src = url
  })
}

/** @returns {Promise<string>} a "data:image/jpeg;base64,..." URL */
export async function fileToPhoto(file) {
  const img = await loadImage(file)
  const ratio = Math.min(1, MAX_SIDE / Math.max(img.naturalWidth, img.naturalHeight))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(img.naturalWidth * ratio)
  canvas.height = Math.round(img.naturalHeight * ratio)
  canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
  return canvas.toDataURL('image/jpeg', QUALITY)
}
