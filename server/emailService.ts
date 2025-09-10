import formData from "form-data";
import Mailgun from "mailgun.js";
import crypto from "crypto";

export class EmailService {
  private mg: any;
  private domain: string;

  constructor() {
    if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
      throw new Error(
        "MAILGUN_API_KEY and MAILGUN_DOMAIN environment variables are required",
      );
    }

    const mailgun = new Mailgun(formData);
    this.mg = mailgun.client({
      username: "api",
      key: process.env.MAILGUN_API_KEY,
    });
    this.domain = process.env.MAILGUN_DOMAIN;
  }

  async sendTravelShareEmail(
    travelData: any,
    recipientEmail: string,
    publicToken: string,
  ) {
    // Priority order: Production domain > Development domain > localhost
    const baseUrl = process.env.PRODUCTION_DOMAIN
    ? `https://${process.env.PRODUCTION_DOMAIN}`
    : process.env.REPLIT_DEV_DOMAIN
    ? `https://${process.env.REPLIT_DEV_DOMAIN}`
    : `http://localhost:${process.env.PORT || 3000}`;
    

    const itineraryUrl = `${baseUrl}/travel/${travelData.id}/preview?token=${publicToken}`;

    const htmlContent = this.generateEmailTemplate(travelData, itineraryUrl);

    try {
      const result = await this.mg.messages.create(this.domain, {
        from: "PLANNEALO <itinerarios@plannealo.com>",
        to: [recipientEmail],
        subject: "Tu itinerario de viaje con Plannealo",
        html: htmlContent,
        text: this.generatePlainTextEmail(travelData, itineraryUrl),
      });

      return result;
    } catch (error) {
      console.error("Error sending email:", error);
      throw error;
    }
  }

  private generateEmailTemplate(travel: any, itineraryUrl: string): string {
    return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tu Itinerario - ${travel.name}</title>
  <!-- Template Version: ${Date.now()} -->
  <style>
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f8fafc;
      margin: 0;
      padding: 20px;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: white;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
      color: white;
      padding: 32px 24px;
      text-align: center;
    }
    .header h1 {
      margin: 0 0 8px 0;
      font-size: 28px;
      font-weight: 700;
    }
    .header p {
      margin: 0;
      opacity: 0.9;
      font-size: 16px;
    }
    .content {
      padding: 32px 24px;
    }
    .travel-info {
      background-color: #f8fafc;
      border-radius: 8px;
      padding: 20px;
      margin: 24px 0;
      border-left: 4px solid #dc2626;
    }
    .travel-info h3 {
      margin: 0 0 12px 0;
      color: #1f2937;
      font-size: 20px;
    }
    .travel-details {
      display: grid;
      gap: 12px;
    }
    .detail-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid #e5e7eb;
    }
    .detail-item:last-child {
      border-bottom: none;
    }
    .detail-label {
      font-weight: 600;
      color: #6b7280;
      text-transform: uppercase;
      font-size: 12px;
      letter-spacing: 0.5px;
    }
    .detail-value {
      color: #111827;
      font-weight: 500;
    }
    .cta-section {
      text-align: center;
      padding: 32px 0;
    }
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
      color: white;
      text-decoration: none;
      padding: 16px 32px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      box-shadow: 0 4px 12px rgba(220, 38, 38, 0.4);
      transition: transform 0.2s ease;
    }
    .cta-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(220, 38, 38, 0.4);
    }
    .footer {
      background-color: #f8fafc;
      padding: 24px;
      text-align: center;
      color: #6b7280;
      font-size: 14px;
      border-top: 1px solid #e5e7eb;
    }
    .footer-logo {
      font-weight: 700;
      color: #dc2626;
      font-size: 18px;
      margin-bottom: 8px;
    }
    .note {
      background-color: #fef3c7;
      border: 1px solid #f59e0b;
      border-radius: 6px;
      padding: 12px;
      margin: 20px 0;
      font-size: 14px;
      color: #92400e;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>Bienvenido a tu próximo viaje con Plannealo.</h1>
      <p>¡Estamos muy felices de tenerte como parte de nuestra comunidad de viajeros!</p>
    </div>
    
    <div class="content">
      <div class="travel-info">
        <h3>${travel.name}</h3>
        <div class="travel-details">
          <div class="detail-item">
            <span class="detail-label">Cliente</span>
            <span class="detail-value">${travel.clientName}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Fecha de Inicio</span>
            <span class="detail-value">${new Date(
              travel.startDate,
            ).toLocaleDateString("es-ES", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Fecha de Fin</span>
            <span class="detail-value">${new Date(
              travel.endDate,
            ).toLocaleDateString("es-ES", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}</span>
          </div>
          ${
            travel.destination
              ? `
          <div class="detail-item">
            <span class="detail-label">Destino</span>
            <span class="detail-value">${travel.destination}</span>
          </div>`
              : ""
          }
        </div>
      </div>

      <div class="cta-section">
        <p>Ya tienes disponible la información de tu próximo destino y aquí te compartimos tu itinerario:</p>
        <!-- Botón seguro para email con degradado -->
          <table role="presentation" border="0" cellspacing="0" cellpadding="0" align="center">
            <tr>
              <td bgcolor="#DC2626" style="border-radius:6px; text-align:center;">
                <a href="${itineraryUrl}"
                   target="_blank"
                   style="display:inline-block;
                          font-size:16px;
                          font-family:Arial, Helvetica, sans-serif;
                          font-weight:bold;
                          color:#ffffff !important;
                          text-decoration:none !important;
                          padding:12px 24px;
                          border-radius:6px;
                          background: linear-gradient(135deg, rgb(220, 38, 38) 0%, rgb(185, 28, 28) 100%);
                          background-color:#DC2626;">
                  Ver Mi Itinerario
                </a>
              </td>
            </tr>
          </table>
      </div>

      <div style="margin: 32px 0; padding: 24px; background-color: #f8fafc; border-radius: 8px; border-left: 4px solid #dc2626;">
        <h3 style="margin: 0 0 16px 0; color: #1f2937; font-size: 18px;">📌 Opciones para consultar tu itinerario:</h3>
        <ul style="margin: 0; padding-left: 20px; line-height: 1.8;">
          <li>Visualizar desde el botón "Ver Mi itinerario"</li>
          <li>Descargar el documento y almacenarlo en tu dispositivo.</li>
          <li>Añadir tu itinerario a la pantalla de inicio del celular. A continuación te explicamos cómo hacerlo:</li>
        </ul>
        
        <div style="margin-top: 20px;">
          <h4 style="margin: 16px 0 8px 0; color: #1f2937; font-size: 16px;">📱 En Android (Google Chrome)</h4>
          <ol style="margin: 0; padding-left: 20px; line-height: 1.6; color: #4b5563;">
            <li>Abre el enlace en Google Chrome.</li>
            <li>Toca el botón de menú ⋮ (arriba a la derecha).</li>
            <li>Elige "Agregar a la pantalla principal".</li>
            <li>Escribe un nombre (ejemplo: Itinerario de Viaje).</li>
            <li>Confirma en Añadir.</li>
          </ol>
          <p style="margin: 8px 0; color: #059669; font-weight: 500;">✅ Verás un ícono en tu pantalla como si fuera una app.</p>
        </div>
        
        <div style="margin-top: 20px;">
          <h4 style="margin: 16px 0 8px 0; color: #1f2937; font-size: 16px;">🍏 En iPhone (Safari)</h4>
          <ol style="margin: 0; padding-left: 20px; line-height: 1.6; color: #4b5563;">
            <li>Abre el enlace en Safari.</li>
            <li>Toca el botón de Compartir (cuadro con flecha hacia arriba).</li>
            <li>Selecciona "Añadir a pantalla de inicio" o "Agregar a Inicio".</li>
            <li>Cambia el nombre si quieres (ejemplo: Itinerario de Viaje).</li>
            <li>Toca Añadir (arriba a la derecha).</li>
          </ol>
          <p style="margin: 8px 0; color: #059669; font-weight: 500;">✅ Verás el botón en tu pantalla principal que abre el itinerario directo.</p>
        </div>
        
        <p style="margin: 20px 0 0 0; font-weight: 600; color: #dc2626; text-align: center;">¡Prepárate para vivir una gran experiencia con PLANNEALO!</p>
      </div>
    </div>

    <div class="footer">
      <div class="footer-logo">PLANNEALO</div>
      <p>Tu agencia de viajes de confianza</p>
      <p>
        <a href="mailto:itinerarios@plannealo.com" style="color: #dc2626; text-decoration: none;">
          itinerarios@plannealo.com
        </a>
      </p>
    </div>
  </div>
</body>
</html>`;
  }

  private generatePlainTextEmail(travel: any, itineraryUrl: string): string {
    return `
¡Tu itinerario está listo!

PLANNEALO ha preparado todos los detalles de tu viaje.

--- DETALLES DEL VIAJE ---
Nombre: ${travel.name}
Cliente: ${travel.clientName}
Fecha de Inicio: ${new Date(travel.startDate).toLocaleDateString("es-ES")}
Fecha de Fin: ${new Date(travel.endDate).toLocaleDateString("es-ES")}
${travel.destination ? `Destino: ${travel.destination}` : ""}

Para ver tu itinerario completo, visita:
${itineraryUrl}

Este enlace te permitirá acceder a tu itinerario sin necesidad de crear una cuenta.

---
PLANNEALO - Tu agencia de viajes de confianza
itinerarios@plannealo.com
`;
  }

  generatePublicToken(): string {
    return crypto.randomBytes(32).toString("hex");
  }
}
