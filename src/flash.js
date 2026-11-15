// A one-time message handed from one screen to the next, e.g. "Your item is
// posted" from the Post form to the item page. The next screen takes it once,
// so going Back later does not show it again.

let message = null

export function setFlash(text) {
  message = text
}

export function takeFlash() {
  const text = message
  message = null
  return text
}
