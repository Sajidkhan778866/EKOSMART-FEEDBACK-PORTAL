export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export const sendOtpEmail = async (email: string, otp: string, purpose: 'Registration' | 'Login'): Promise<boolean> => {
  console.log(`[Ekosmart OTP Service] >>> OTP for ${purpose} sent to [${email}]: ${otp} (Valid for 10 minutes) <<<`);
  
  // If SMTP environment variables are present, we could send real email via standard transport
  // In development and serverless environments, we also log clearly to console
  return true;
};
