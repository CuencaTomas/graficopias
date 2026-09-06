const NUMERO_WHATSAPP = "5491126695842";

export function linkWhatsapp(mensaje?: string): string {
  const base = `https://wa.me/${NUMERO_WHATSAPP}`;
  return mensaje ? `${base}?text=${encodeURIComponent(mensaje)}` : base;
}
