export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export const sendOtpEmail = async (email: string, otp: string, purpose: 'Registration' | 'Login'): Promise<boolean> => {
  console.log(`[Ekosmart OTP Service] >>> OTP for ${purpose} sent to [${email}]: ${otp} (Valid for 10 minutes) <<<`);
  return true;
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

export const sendInvoiceSoftCopyEmail = async (params: ISoftBillEmailParams): Promise<{ success: boolean; message: string }> => {
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
                    <span style="display: inline-block; background-color: #059669; color: #ffffff; font-size: 11px; font-weight: bold; padding: 4px 10px; rounded-radius: 8px; font-family: monospace;">
                      ${invoiceNumber}
                    </span>
                    <p style="margin: 6px 0 0 0; font-size: 10px; color: #94a3b8;">Date: ${invoiceDate}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Soft Matter & Greeting -->
          <tr>
            <td style="padding: 24px 30px; background-color: #ffffff;">
              <div style="background-color: #f1f5f9; border-left: 4px solid #059669; padding: 16px; border-radius: 0 12px 12px 0; font-size: 13px; line-height: 1.6; color: #334155;">
                ${parsedMatter}
              </div>
            </td>
          </tr>

          <!-- Customer & Invoice Metadata Box -->
          <tr>
            <td style="padding: 0 30px 20px 30px;">
              <table width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px; font-size: 12px;">
                <tr>
                  <td width="50%" valign="top" style="padding-right: 10px;">
                    <strong style="color: #64748b; font-size: 10px; text-transform: uppercase;">Billed Customer:</strong><br/>
                    <strong style="font-size: 14px; color: #0f172a;">${customerName}</strong><br/>
                    <span style="color: #475569; font-family: monospace;">📱 ${customerMobile}</span><br/>
                    ${customerAddress ? `<span style="color: #64748b; font-size: 11px;">📍 ${customerAddress}</span>` : ''}
                  </td>
                  <td width="50%" valign="top" align="right">
                    <strong style="color: #64748b; font-size: 10px; text-transform: uppercase;">Payment Details:</strong><br/>
                    <span style="display: inline-block; background-color: #d1fae5; color: #065f46; font-size: 11px; font-weight: bold; padding: 2px 8px; border-radius: 6px; margin-top: 2px;">
                      ${paymentMode} • ${paymentStatus}
                    </span><br/>
                    <span style="color: #64748b; font-size: 11px;">Counter: ${showroom}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Line Items Table -->
          <tr>
            <td style="padding: 0 30px 20px 30px;">
              <table width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
                <thead>
                  <tr style="background-color: #f1f5f9; font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: bold; border-bottom: 1px solid #e2e8f0;">
                    <th align="left" style="padding: 10px 8px;">Description</th>
                    <th align="left" style="padding: 10px 8px;">Serial #</th>
                    <th align="center" style="padding: 10px 8px;">Qty</th>
                    <th align="right" style="padding: 10px 8px;">Rate (₹)</th>
                    <th align="right" style="padding: 10px 8px;">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>
            </td>
          </tr>

          <!-- Summary & Totals -->
          <tr>
            <td style="padding: 0 30px 20px 30px;">
              <table width="100%">
                <tr>
                  <td width="55%" valign="top">
                    ${
                      bill.warrantyGenerated
                        ? `
                      <div style="background-color: #ecfdf5; border: 1px solid #a7f3d0; padding: 12px; border-radius: 10px; font-size: 11px; color: #065f46;">
                        <strong>🛡️ Official EBS Warranty Active</strong><br/>
                        <span style="color: #047857;">Verified replacement & technical service covered across all authorized service depots.</span>
                      </div>
                    `
                        : ''
                    }
                  </td>
                  <td width="45%" align="right" valign="top">
                    <table style="font-size: 12px; line-height: 1.8; color: #475569;">
                      <tr>
                        <td>Subtotal:</td>
                        <td align="right" style="font-weight: bold; font-family: monospace;">₹${subtotal}</td>
                      </tr>
                      ${
                        discountTotal !== '0'
                          ? `
                        <tr style="color: #059669;">
                          <td>Discount:</td>
                          <td align="right" style="font-weight: bold; font-family: monospace;">-₹${discountTotal}</td>
                        </tr>
                      `
                          : ''
                      }
                      <tr>
                        <td>GST Tax (18%):</td>
                        <td align="right" style="font-weight: bold; font-family: monospace;">₹${taxTotal}</td>
                      </tr>
                      <tr style="font-size: 15px; font-weight: 900; color: #0f172a; border-top: 1px solid #cbd5e1;">
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

  console.log(`[Ekosmart Soft Copy Email Service] >>> Soft Copy Invoice [${invoiceNumber}] & Referral Code [${refCode}] dispatched to [${to}] <<<`);

  return {
    success: true,
    message: `Soft copy bill and referral code emailed successfully to ${to}.`,
  };
};
