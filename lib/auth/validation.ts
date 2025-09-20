// Password validation utilities adapted from email_site

export interface PasswordValidation {
  isValid: boolean;
  message: string;
  requirements: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    special: boolean;
  };
}

export function validatePassword(password: string): PasswordValidation {
  const requirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
  };

  const isValid = Object.values(requirements).every(req => req);

  let message = '';
  if (!isValid) {
    const failed = [];
    if (!requirements.length) failed.push('at least 8 characters');
    if (!requirements.uppercase) failed.push('an uppercase letter');
    if (!requirements.lowercase) failed.push('a lowercase letter');
    if (!requirements.number) failed.push('a number');
    if (!requirements.special) failed.push('a special character');

    message = `Password must contain ${failed.join(', ')}`;
  }

  return { isValid, message, requirements };
}

export function validateEmailMatch(email: string, verifyEmail: string): boolean {
  return email === verifyEmail && email.length > 0;
}

export function validatePasswordMatch(password: string, verifyPassword: string): boolean {
  return password === verifyPassword && password.length > 0;
}

// Simulated breach check - in production this would call an API like HaveIBeenPwned
export async function checkPasswordBreach(password: string): Promise<boolean> {
  // Common breached passwords for demo
  const commonBreachedPasswords = [
    'password', '123456', 'password123', 'admin', 'qwerty',
    'letmein', 'welcome', 'monkey', '1234567890'
  ];

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(commonBreachedPasswords.includes(password.toLowerCase()));
    }, 500);
  });
}