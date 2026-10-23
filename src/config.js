// WhatsApp number: country code + number, digits only (e.g. 919876543210 for +91 98765 43210)
export const WHATSAPP_NUMBER = '919518343108'
export const WHATSAPP_DISPLAY = '+91 95183 43108' // how the number is shown on the site

// opens a WhatsApp chat with us, with the message already typed in
export const whatsappLink = (message) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
