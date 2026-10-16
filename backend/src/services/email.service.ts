import nodemailer, { Transporter } from 'nodemailer';

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface SmtpConfigInfo {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  from: string;
  isConfigured: boolean;
}

/**
 * Returns the current cPanel SMTP configuration from environment variables.
 */
export const getSmtpConfig = (): SmtpConfigInfo => {
  const host = process.env.SMTP_HOST || 'mail.ekosmartdrivecomplain.in';
  const port = Number(process.env.SMTP_PORT) || 465;
  const secure = port === 465;
  const user = process.env.SMTP_USER || 'support_otp_email@ekosmartdrivecomplain.in';
  const from = process.env.SMTP_FROM || `"Ekosmart OTP Verification" <${user}>`;
  const isConfigured = Boolean(process.env.SMTP_PASS && process.env.SMTP_PASS.trim());

  return { host, port, secure, user, from, isConfigured };
};

let cachedTransporter: Transporter | null = null;

/**
 * Lazily creates or returns the cached Nodemailer transporter.
 */
export const getTransporter = (): Transporter | null => {
  const config = getSmtpConfig();
  if (!config.isConfigured) {
    return null;
  }

  if (!cachedTransporter) {
    cachedTransporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: config.user,
        pass: process.env.SMTP_PASS!,
      },
      tls: {
        rejectUnauthorized: process.env.SMTP_REJECT_UNAUTHORIZED === 'true',
      },
      pool: true,
      maxConnections: 5,
      maxMessages: 100,
    });
  }

  return cachedTransporter;
};

/**
 * Resets the cached transporter (useful when environment variables are updated at runtime).
 */
export const resetTransporter = () => {
  if (cachedTransporter) {
    try {
      cachedTransporter.close();
    } catch {
      // ignore
    }
    cachedTransporter = null;
  }
};

/**
 * Verifies the cPanel SMTP connection.
 */
export const verifySmtpConnection = async (): Promise<{
  success: boolean;
  message: string;
  config: SmtpConfigInfo;
}> => {
  const config = getSmtpConfig();
  if (!config.isConfigured) {
    return {
      success: false,
      message: 'SMTP_PASS is not configured in server environment. Please set SMTP_PASS in cPanel / .env.',
      config,
    };
  }

  try {
    resetTransporter();
    const transporter = getTransporter();
    if (!transporter) {
      return { success: false, message: 'Could not initialize SMTP transporter.', config };
    }
    await transporter.verify();
    return {
      success: true,
      message: `SMTP connection to ${config.host}:${config.port} via ${config.user} successfully verified!`,
      config,
    };
  } catch (error: any) {
    console.error('[SMTP Verify Error]:', error.message || error);
    return {
      success: false,
      message: `SMTP Connection Failed: ${error.message || 'Unknown error'}. Check outgoing server, port (${config.port}), credentials, and cPanel mail server status.`,
      config,
    };
  }
};

/**
 * Sends a branded Ekosmart OTP verification email via cPanel SMTP.
 */
export const sendOtpEmail = async (
  email: string,
  otp: string,
  purpose: 'Registration' | 'Login'
): Promise<{ success: boolean; messageId?: string; error?: string }> => {
  const config = getSmtpConfig();
  const purposeTitle = purpose === 'Registration' ? 'Customer Account Registration' : 'Customer Portal Login Verification';
  const purposeText = purpose === 'Registration' ? 'registering a new Ekosmart customer account' : 'logging into your Ekosmart customer account';
  const subject = `Your Ekosmart Verification Code: ${otp} (Valid for 5 minutes)`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f1f5f9; padding: 30px 15px;">
          <tr>
            <td align="center">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 540px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08); border: 1px solid #e2e8f0;">
                <!-- Header Banner -->
                <tr>
                  <td style="background: linear-gradient(135deg, #0f172a 0%, #064e3b 100%); padding: 32px 30px; text-align: center; color: #ffffff;">
                    <div style="display: inline-block; background-color: #059669; color: #ffffff; font-weight: 900; font-size: 11px; padding: 4px 12px; border-radius: 999px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">
                      Official Ekosmart Portal
                    </div>
                    <h1 style="margin: 0; font-size: 22px; font-weight: 900; letter-spacing: -0.5px; color: #ffffff;">
                      EKOSMART EV BATTERY SOLUTION
                    </h1>
                    <p style="margin: 6px 0 0 0; font-size: 12px; color: #a7f3d0;">
                      Clean Energy & Smart Electric Mobility • Kota Central Plant
                    </p>
                  </td>
                </tr>

                <!-- Content Area -->
                <tr>
                  <td style="padding: 36px 32px;">
                    <h2 style="margin: 0 0 12px 0; font-size: 18px; font-weight: 800; color: #0f172a;">
                      ${purposeTitle}
                    </h2>
                    <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #475569;">
                      Hello, we received a request for ${purposeText} for your Ekosmart customer account associated with <strong style="color: #0f172a;">${email}</strong>. Use the 6-digit verification code below to proceed:
                    </p>

                    <!-- OTP Display Box -->
                    <div style="background: linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%); border: 2px dashed #059669; border-radius: 16px; padding: 24px; text-align: center; margin-bottom: 24px;">
                      <span style="font-size: 11px; font-weight: bold; text-transform: uppercase; color: #047857; letter-spacing: 1px; display: block; margin-bottom: 8px;">
                        Your 6-Digit Verification Code
                      </span>
                      <div style="font-size: 38px; font-weight: 900; font-family: 'Courier New', Courier, monospace; letter-spacing: 10px; color: #064e3b; margin: 4px 0; padding: 8px 12px; display: inline-block;">
                        ${otp}
                      </div>
                      <div style="margin-top: 10px; font-size: 12px; font-weight: 700; color: #b45309; background-color: #fef3c7; display: inline-block; padding: 4px 12px; border-radius: 999px;">
                        ⏱️ Valid for 5 minutes only
                      </div>
                    </div>

                    <!-- Security Guidance -->
                    <div style="background-color: #f8fafc; border-left: 4px solid #059669; padding: 14px 16px; border-radius: 8px; margin-bottom: 24px;">
                      <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #334155;">
                        <strong>Security Warning:</strong> Never share this code with anyone. Ekosmart representatives will never ask for your OTP over phone, WhatsApp, or email.
                      </p>
                    </div>

                    <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #64748b;">
                      If you did not request this verification code, please ignore this email. No changes will be made to your account.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #0f172a; padding: 24px 30px; text-align: center; color: #94a3b8; font-size: 11px; line-height: 1.6;">
                    <p style="margin: 0; color: #e2e8f0; font-weight: bold;">
                      EKOSMART CLEAN ENERGY & GREEN MOBILITY
                    </p>
                    <p style="margin: 4px 0 0 0;">
                      Plot No. 14, Electronic Complex, Road No. 1, IPIA, Kota, Rajasthan - 324005
                    </p>
                    <p style="margin: 4px 0 0 0; color: #34d399;">
                      Central Helpline: +91 8949049003 | Email: support_otp_email@ekosmartdrivecomplain.in
                    </p>
                    <p style="margin: 8px 0 0 0; font-size: 10px; color: #64748b; font-family: monospace;">
                      GSTIN: 08DTUPM4205B1Z0 | Automated System Message
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  const text = `Your Ekosmart ${purpose} verification code is: ${otp}\n\nThis code is valid for 5 minutes only.\nNever share this code with anyone.\n\nEkosmart Clean Energy & Green Mobility - Kota, Rajasthan\nHelpline: +91 8949049003`;

  const transporter = getTransporter();

  if (!transporter) {
    console.warn(`[Ekosmart OTP Service] (Development Mode) SMTP_PASS not configured. OTP for ${purpose} [${email}]: ${otp} (Valid for 5 mins)`);
    return { success: true, messageId: 'dev-mode-fallback' };
  }

  try {
    const info = await transporter.sendMail({
      from: config.from,
      to: email,
      subject,
      text,
      html,
    });

    console.log(`[Ekosmart OTP Service] >>> OTP verification email dispatched to [${email}] (Message ID: ${info.messageId}) <<<`);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error(`[Ekosmart OTP Service] Error dispatching OTP email to [${email}]:`, error.message || error);
    return { success: false, error: error.message || 'SMTP delivery failed' };
  }
};

export interface ISoftBillEmailParams {
  to: string;
  bill: any;
  customer?: any;
  referralCode?: string;
  coinsAwarded?: number;
  customMatter?: string;
  customSubject?: string;
  templateConfig?: any;
}

export const sendInvoiceSoftCopyEmail = async (
  params: ISoftBillEmailParams
): Promise<{ success: boolean; message: string }> => {
  const { to, bill, customer, referralCode, coinsAwarded, customMatter, customSubject, templateConfig } = params;

  if (!to || !to.includes('@')) {
    return { success: false, message: 'Valid recipient email address is required.' };
  }

  const customerName = bill.customerName || customer?.name || 'Valued Customer';
  const customerMobile = bill.customerMobile || customer?.mobile || '';
  const customerAddress = bill.customerAddress || customer?.address || '';
  const refCode = referralCode || customer?.referralCode || bill.referralCodeUsed || 'EKO' + Math.random().toString(36).substring(2, 7).toUpperCase();
  const invoiceNumber = bill.invoiceNumber || 'EBS-INV';
  const invoiceDate = bill.createdAt ? new Date(bill.createdAt).toLocaleDateString('en-IN') : new Date().toLocaleDateString('en-IN');
  const grandTotal = bill.grandTotal !== undefined ? bill.grandTotal.toLocaleString('en-IN') : '0';
  const subtotal = bill.subtotal !== undefined ? bill.subtotal.toLocaleString('en-IN') : '0';
  const taxTotal = bill.taxTotal !== undefined ? bill.taxTotal.toLocaleString('en-IN') : '0';
  const discountTotal = bill.discountTotal ? bill.discountTotal.toLocaleString('en-IN') : '0';
  const paymentMode = bill.paymentMode || 'UPI';
  const paymentStatus = bill.paymentStatus || 'Paid';
  const showroom = bill.showroom || 'Ekosmart Showroom Counter';
  const rewardCoins = coinsAwarded !== undefined ? Number(coinsAwarded) : (bill.rewardCoinsAwarded || templateConfig?.softBillEmailConfig?.rewardCoins || 500);
  const welcomeCoins = templateConfig?.softBillEmailConfig?.welcomeCoins || 500;
  const referrerCoins = templateConfig?.softBillEmailConfig?.referrerCoins || 100;

  const subject = customSubject || templateConfig?.softBillEmailConfig?.emailSubject?.replace('{{invoiceNumber}}', invoiceNumber) || `Official EKOSMART Showroom GST Tax Invoice & Soft Copy - ${invoiceNumber}`;
  
  const rawMatter = customMatter || templateConfig?.softBillEmailConfig?.emailMatter || 
    `Dear {{customerName}},\n\nThank you for choosing EKOSMART Clean Energy & Green Mobility. Please find attached below your official Soft Copy GST Tax Invoice, Warranty Certificate registration, and exclusive Customer Referral Code.\n\nYour Unique Referral Code is: {{referralCode}}\nShare this code with your friends & family so they receive {{welcomeCoins}} Coins, and you earn {{referrerCoins}} Coins on their qualifying purchase!`;

  const parsedMatter = rawMatter
    .replace(/\{\{customerName\}\}/g, customerName)
    .replace(/\{\{invoiceNumber\}\}/g, invoiceNumber)
    .replace(/\{\{referralCode\}\}/g, refCode)
    .replace(/\{\{grandTotal\}\}/g, `₹${grandTotal}`)
    .replace(/\{\{showroom\}\}/g, showroom)
    .replace(/\{\{coins\}\}/g, String(rewardCoins))
    .replace(/\{\{rewardCoins\}\}/g, String(rewardCoins))
    .replace(/\{\{welcomeCoins\}\}/g, String(welcomeCoins))
    .replace(/\{\{referrerCoins\}\}/g, String(referrerCoins))
    .replace(/\n/g, '<br/>');

  const itemsHtml = (bill.items || [])
    .map(
      (it: any, idx: number) => `
        <tr style="border-bottom: 1px solid #e2e8f0; font-size: 13px;">
          <td style="padding: 10px 8px; font-weight: bold; color: #1e293b;">${idx + 1}. ${it.productName || 'Battery Unit'}</td>
          <td style="padding: 10px 8px; font-family: monospace; color: #047857; font-weight: bold;">${it.batterySerial || it.productSerial || 'N/A'}</td>
          <td style="padding: 10px 8px; text-align: center; color: #475569;">${it.quantity || 1}</td>
          <td style="padding: 10px 8px; text-align: right; color: #475569;">₹${(it.unitPrice || 0).toLocaleString('en-IN')}</td>
          <td style="padding: 10px 8px; text-align: right; font-weight: bold; color: #0f172a;">₹${(it.totalAmount || 0).toLocaleString('en-IN')}</td>
        </tr>
      `
    )
    .join('');

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>${subject}</title>
      </head>
      <body style="font-family: Arial, Helvetica, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #1e293b;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 650px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%); padding: 24px 30px; text-align: left; color: #ffffff;">
              <table width="100%">
                <tr>
                  <td>
                    <h1 style="margin: 0; font-size: 20px; font-weight: 900; letter-spacing: -0.5px; color: #10b981;">EKOSMART EV BATTERY SOLUTION</h1>
                    <p style="margin: 4px 0 0 0; font-size: 11px; color: #cbd5e1;">Clean Energy & Smart Electric Mobility • Kota Central Plant</p>
                    <p style="margin: 2px 0 0 0; font-size: 10px; color: #94a3b8; font-family: monospace;">GSTIN: 08DTUPM4205B1Z0 | CIN: U31909RJ2023PTC085432</p>
                  </td>
                  <td align="right" valign="top">
                    <span style="display: inline-block; background-color: #059669; color: #ffffff; font-size: 11px; font-weight: bold; padding: 4px 10px; border-radius: 8px; font-family: monospace;">
                      ${invoiceNumber}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Message Body -->
          <tr>
            <td style="padding: 24px 30px 16px 30px;">
              <div style="font-size: 13px; line-height: 1.6; color: #334155; margin-bottom: 20px;">
                ${parsedMatter}
              </div>
            </td>
          </tr>

          <!-- Bill Summary Card -->
          <tr>
            <td style="padding: 0 30px 20px 30px;">
              <table width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-bottom: 16px;">
                <tr>
                  <td width="50%" valign="top">
                    <p style="margin: 0 0 4px 0; font-size: 11px; font-weight: bold; color: #64748b; text-transform: uppercase;">Customer Details</p>
                    <p style="margin: 0; font-size: 13px; font-weight: bold; color: #0f172a;">${customerName}</p>
                    <p style="margin: 2px 0; font-size: 12px; color: #475569;">${customerMobile}</p>
                    ${customerAddress ? `<p style="margin: 2px 0; font-size: 11px; color: #64748b;">${customerAddress}</p>` : ''}
                  </td>
                  <td width="50%" valign="top" align="right">
                    <p style="margin: 0 0 4px 0; font-size: 11px; font-weight: bold; color: #64748b; text-transform: uppercase;">Invoice Details</p>
                    <p style="margin: 0; font-size: 12px; color: #0f172a;">Date: <strong>${invoiceDate}</strong></p>
                    <p style="margin: 2px 0; font-size: 12px; color: #0f172a;">Counter: <strong>${showroom}</strong></p>
                    <p style="margin: 2px 0; font-size: 12px; color: #0f172a;">Status: <span style="color: #059669; font-weight: bold;">${paymentStatus}</span> (${paymentMode})</p>
                  </td>
                </tr>
              </table>

              <!-- Product Line Items -->
              <table width="100%" cellspacing="0" cellpadding="0" style="border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; margin-bottom: 16px;">
                <tr style="background-color: #f1f5f9; text-align: left; font-size: 11px; text-transform: uppercase; color: #475569;">
                  <th style="padding: 10px 8px;">Product</th>
                  <th style="padding: 10px 8px;">Serial No.</th>
                  <th style="padding: 10px 8px; text-align: center;">Qty</th>
                  <th style="padding: 10px 8px; text-align: right;">Rate</th>
                  <th style="padding: 10px 8px; text-align: right;">Amount</th>
                </tr>
                ${itemsHtml}
              </table>

              <!-- Financial Totals -->
              <table width="100%">
                <tr>
                  <td width="60%"></td>
                  <td width="40%">
                    <table width="100%" style="font-size: 12px; color: #334155;">
                      <tr>
                        <td style="padding: 2px 0;">Subtotal:</td>
                        <td align="right" style="padding: 2px 0; font-family: monospace;">₹${subtotal}</td>
                      </tr>
                      ${discountTotal !== '0' ? `
                        <tr>
                          <td style="padding: 2px 0; color: #dc2626;">Discount:</td>
                          <td align="right" style="padding: 2px 0; color: #dc2626; font-family: monospace;">-₹${discountTotal}</td>
                        </tr>
                      ` : ''}
                      <tr>
                        <td style="padding: 2px 0;">GST / Tax:</td>
                        <td align="right" style="padding: 2px 0; font-family: monospace;">₹${taxTotal}</td>
                      </tr>
                      <tr style="border-top: 1.5px solid #0f172a; font-size: 14px; font-weight: bold; color: #0f172a;">
                        <td style="padding-top: 4px;">Grand Total:</td>
                        <td align="right" style="padding-top: 4px; color: #059669; font-family: monospace;">₹${grandTotal}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Exclusive Referral Code & Customer Wallet Box -->
          <tr>
            <td style="padding: 0 30px 24px 30px;">
              <div style="background: linear-gradient(135deg, #fef3c7 0%, #ffedd5 100%); border: 1.5px dashed #f59e0b; border-radius: 14px; padding: 18px; text-align: center;">
                <span style="font-size: 11px; font-weight: bold; text-transform: uppercase; color: #92400e; letter-spacing: 0.5px;">🎁 Your Unique Referral Reward Code</span>
                <div style="font-size: 24px; font-weight: 900; font-family: monospace; letter-spacing: 4px; color: #78350f; margin: 8px 0; padding: 6px; background-color: #ffffff; border-radius: 8px; display: inline-block; border: 1px solid #fde68a;">
                  ${refCode}
                </div>
                <p style="margin: 4px 0 0 0; font-size: 12px; color: #92400e; line-height: 1.4;">
                  Share this code with friends & colleagues. When they register, they get <strong>${welcomeCoins} Welcome Coins</strong> and you get <strong>${referrerCoins} Referral Coins</strong> on their purchase!
                </p>
                ${
                  rewardCoins > 0
                    ? `
                  <div style="margin-top: 10px; font-size: 11px; font-weight: bold; color: #b45309; background-color: #fef9c3; padding: 4px 10px; border-radius: 6px; display: inline-block;">
                    🪙 +${rewardCoins} Coins Credited to Your EKOSMART Digital Wallet
                  </div>
                `
                    : ''
                }
              </div>
            </td>
          </tr>

          <!-- Footer Contact & Legal -->
          <tr>
            <td style="background-color: #0f172a; padding: 20px 30px; text-align: center; color: #94a3b8; font-size: 11px; line-height: 1.6;">
              <p style="margin: 0; color: #e2e8f0; font-weight: bold;">EKOSMART EV BATTERY SOLUTION • Kota, Rajasthan</p>
              <p style="margin: 2px 0 0 0;">Plot No. 14, Electronic Complex, Road No. 1, IPIA, Kota - 324005</p>
              <p style="margin: 4px 0 0 0; color: #10b981;">Helpline: +91 8949049003 / +91 9549730483 | Email: support@ekosmartdrive.in</p>
              <p style="margin: 8px 0 0 0; font-size: 10px; color: #64748b;">This is an authorized computer-generated soft copy tax invoice.</p>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  const config = getSmtpConfig();
  const transporter = getTransporter();

  if (transporter) {
    try {
      await transporter.sendMail({
        from: config.from,
        to,
        subject,
        html,
      });
      console.log(`[Ekosmart Soft Copy Email Service] >>> Soft copy invoice ${invoiceNumber} dispatched to ${to} via cPanel SMTP <<<`);
      return {
        success: true,
        message: `Soft copy bill and referral code emailed successfully to ${to}.`,
      };
    } catch (err: any) {
      console.error(`[Ekosmart Soft Copy Email Service] Error sending invoice to ${to}:`, err.message || err);
      return {
        success: false,
        message: `Invoice generated, but email delivery encountered an error: ${err.message || 'SMTP delivery failed'}`,
      };
    }
  }

  console.log(`[Ekosmart Soft Copy Email Service] >>> Soft Copy Invoice [${invoiceNumber}] & Referral Code [${refCode}] simulated for [${to}] (SMTP not configured) <<<`);
  return {
    success: true,
    message: `Soft copy bill and referral code recorded for ${to}.`,
  };
};
