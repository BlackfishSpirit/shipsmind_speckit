'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Mail, Shield, CheckCircle, Loader2 } from 'lucide-react';
import { getSensitiveFeatures } from '@/lib/auth';
import { useUserPreferences } from '@/lib/hooks/use-auth';

interface VerificationPromptProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
  trigger?: 'modal' | 'inline';
  featureName?: string;
}

export function VerificationPrompt({
  isOpen = false,
  onClose,
  onSuccess,
  trigger = 'modal',
  featureName,
}: VerificationPromptProps) {
  const { user } = useUser();
  const { markVerificationPrompted } = useUserPreferences();
  const [step, setStep] = useState<'prompt' | 'code' | 'success'>('prompt');
  const [isLoading, setIsLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');

  const primaryEmail = user?.emailAddresses.find(
    (email) => email.id === user.primaryEmailAddressId
  );

  const sensitiveFeatures = getSensitiveFeatures();
  const displayFeature = featureName || 'this feature';

  const handleSendVerification = async () => {
    if (!primaryEmail) {
      setError('No email address found');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Mark that user was prompted for verification
      await markVerificationPrompted();

      // Send verification email using Clerk
      await primaryEmail.prepareVerification({ strategy: 'email_code' });

      setStep('code');
    } catch (err) {
      console.error('Failed to send verification:', err);
      setError('Failed to send verification email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!primaryEmail || !verificationCode.trim()) {
      setError('Please enter the verification code');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await primaryEmail.attemptVerification({ code: verificationCode });
      setStep('success');

      // Call success callback after a short delay
      setTimeout(() => {
        onSuccess?.();
        onClose?.();
      }, 2000);
    } catch (err) {
      console.error('Failed to verify code:', err);
      setError('Invalid verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setVerificationCode('');
    setError('');
    await handleSendVerification();
  };

  const content = (
    <div className="space-y-4">
      {step === 'prompt' && (
        <>
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <h3 className="font-medium text-sm">Email Verification Required</h3>
              <p className="text-sm text-muted-foreground mt-1">
                To access {displayFeature}, please verify your email address for security purposes.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Features requiring verification:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              {sensitiveFeatures.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <AlertTriangle className="h-3 w-3" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
            <Mail className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-blue-800">
              Verification email will be sent to: <strong>{primaryEmail?.emailAddress}</strong>
            </span>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          <Button
            onClick={handleSendVerification}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Mail className="h-4 w-4 mr-2" />
                Send Verification Email
              </>
            )}
          </Button>
        </>
      )}

      {step === 'code' && (
        <>
          <div className="text-center space-y-2">
            <Mail className="h-8 w-8 text-blue-500 mx-auto" />
            <h3 className="font-medium">Check Your Email</h3>
            <p className="text-sm text-muted-foreground">
              We sent a verification code to <strong>{primaryEmail?.emailAddress}</strong>
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="code">Verification Code</Label>
            <Input
              id="code"
              type="text"
              placeholder="Enter 6-digit code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              maxLength={6}
              className="text-center text-lg tracking-widest"
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Button
              onClick={handleVerifyCode}
              disabled={isLoading || !verificationCode.trim()}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify Email'
              )}
            </Button>

            <Button
              variant="ghost"
              onClick={handleResendCode}
              disabled={isLoading}
              className="w-full text-sm"
            >
              Resend Code
            </Button>
          </div>
        </>
      )}

      {step === 'success' && (
        <div className="text-center space-y-4">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
          <div>
            <h3 className="font-medium text-green-900">Email Verified!</h3>
            <p className="text-sm text-muted-foreground">
              You can now access all features including {displayFeature}.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  if (trigger === 'modal') {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Email Verification</DialogTitle>
            <DialogDescription>
              Verify your email to access sensitive features
            </DialogDescription>
          </DialogHeader>
          {content}
          {step === 'prompt' && (
            <DialogFooter>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Email Verification Required</CardTitle>
        <CardDescription>
          Verify your email to access sensitive features
        </CardDescription>
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  );
}