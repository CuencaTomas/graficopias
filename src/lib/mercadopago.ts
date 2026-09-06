import { MercadoPagoConfig, Preference, Payment } from "mercadopago";

export function mercadopagoConfigurado(): boolean {
  return !!process.env.MERCADOPAGO_ACCESS_TOKEN;
}

function config(): MercadoPagoConfig {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!accessToken) throw new Error("MERCADOPAGO_ACCESS_TOKEN no está configurado");
  return new MercadoPagoConfig({ accessToken });
}

export function clientePreference(): Preference {
  return new Preference(config());
}

export function clientePayment(): Payment {
  return new Payment(config());
}
