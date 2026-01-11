
'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Camera, UserCheck } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export default function FaceLoginPage() {
  const router = useRouter();
  const params = useParams();
  const { role } = params;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error('Camera not supported on this browser.');
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Not Supported',
          description: 'Your browser does not support camera access.',
        });
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use this app.',
        });
      }
    };

    getCameraPermission();
    
    return () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    }
  }, [toast]);

  const handleLogin = () => {
    setIsAuthenticating(true);

    // Mock authentication
    setTimeout(() => {
      setIsAuthenticating(false);
      toast({
        title: 'Login Successful',
        description: `Welcome, ${role === 'patient' ? 'Jane Doe' : 'Dr. Smith'}.`,
      });
      router.push('/dashboard');
    }, 2000);
  };

  const roleName = role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Camera className="h-6 w-6" /> {roleName} Face Recognition
          </CardTitle>
          <CardDescription>Position your face in the frame to log in.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center">
            <div className="relative mb-4 h-64 w-full overflow-hidden rounded-md border bg-muted">
                <video ref={videoRef} className="h-full w-full object-cover" autoPlay muted playsInline />
                <div className="absolute inset-0 border-[4px] border-dashed border-primary/50 rounded-md"></div>
            </div>

          {hasCameraPermission === false && (
            <Alert variant="destructive">
              <AlertTitle>Camera Access Required</AlertTitle>
              <AlertDescription>
                Please allow camera access to use this feature.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex-col gap-4">
          <Button onClick={handleLogin} disabled={isAuthenticating || hasCameraPermission !== true} className="w-full">
            {isAuthenticating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <UserCheck className="mr-2 h-4 w-4" />
            )}
            {isAuthenticating ? 'Authenticating...' : 'Log In'}
          </Button>
          <Button variant="link" onClick={() => router.back()}>
            Back to Login Options
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
