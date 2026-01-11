import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Stethoscope, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
       <div className="mb-10 text-center">
        <h1 className="text-5xl font-bold font-headline text-primary">
          MARUTHI CLINIC
        </h1>
        <p className="text-muted-foreground">Your trusted partner in health.</p>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <User className="h-8 w-8 text-primary" />
            </div>
            <CardTitle>Patient Portal</CardTitle>
            <CardDescription>Access your health records, appointments, and more.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/login/face/patient" className='w-full'>
              <Button className="w-full">
                Patient Login
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Stethoscope className="h-8 w-8 text-primary" />
            </div>
            <CardTitle>Doctor Portal</CardTitle>
            <CardDescription>Manage patients, appointments, and records.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/login/face/doctor" className='w-full'>
              <Button className="w-full">
                Doctor Login
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
             <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <ShieldCheck className="h-8 w-8 text-primary" />
            </div>
            <CardTitle>Admin Portal</CardTitle>
            <CardDescription>Oversee clinic operations and access all data.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard" className='w-full'>
                 <Button className="w-full">Admin Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
