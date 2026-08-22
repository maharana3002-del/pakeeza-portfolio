// ============================================================
// EmailJS configuration
// ============================================================

export const EMAILJS_CONFIG = {
  serviceId: 'service_y678vca',
  templateId: 'template_j1w3bpc',
  publicKey: 'MztImyBR-_CYrehFD',
}

export const isEmailConfigured = () =>
  EMAILJS_CONFIG.serviceId !== 'YOUR_SERVICE_ID' &&
  EMAILJS_CONFIG.templateId !== 'YOUR_TEMPLATE_ID' &&
  EMAILJS_CONFIG.publicKey !== 'YOUR_PUBLIC_KEY'