
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShieldAlert, Stethoscope } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { setStorageItem } from '@/lib/storage';

export default function AdminLoginPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (email === 'admin.clinic' && password === '123456') {
      setStorageItem('currentUser', { id: 'admin', role: 'admin', firstName: 'Admin' });
      toast({
        title: 'Login Successful',
        description: 'Redirecting to management dashboard...',
      });
      router.push('/admin/dashboard');
    } else {
      toast({
        variant: 'destructive',
        title: 'Authentication Failed',
        description: 'Invalid admin identifier or security key.',
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
       <Link href="/" className="mb-8 flex items-center gap-2">
            <Stethoscope className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight text-foreground font-headline">
                MARUTHI CLINIC
            </h1>
        </Link>
      <Card className="w-full max-w-sm shadow-xl border-primary/20">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 bg-primary/10 p-3 rounded-full w-fit">
            <ShieldAlert className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl font-headline">Admin Portal</CardTitle>
          <CardDescription>
            Confidential access for management only.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Admin Identifier</Label>
              <Input
                id="email"
                name="email"
                type="text"
                placeholder="admin.clinic"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Security Key</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            <Button type="submit" className="w-full h-11">
              Authenticate
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
