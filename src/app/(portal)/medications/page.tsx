
'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { getStorageItem, setStorageItem, seedStorage } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import { Pill, MessageSquare, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';

export default function MedicationsPage() {
  const { toast } = useToast();
  const [medications, setMedications] = useState<any[]>([]);

  useEffect(() => {
    seedStorage();
    const storedMedications = getStorageItem<any[]>('medications', []);
    setMedications(storedMedications);
  }, []);

  const handleRequestRefill = (med: any) => {
    // 1. Update medication state locally and in storage
    const updatedMedications = medications.map(m => {
      if (m.id === med.id) {
        return { ...m, refillRequested: true };
      }
      return m;
    });
    setMedications(updatedMedications);
    setStorageItem('medications', updatedMedications);

    // 2. Create a new message in history
    const messages = getStorageItem<any[]>('messages', []);
    const newMessage = {
      id: crypto.randomUUID(),
      sender: 'You',
      subject: `Refill Request: ${med.name}`,
      date: format(new Date(), 'yyyy-MM-dd'),
      read: true,
      body: `I would like to request a refill for ${med.name} (${med.dosage}). My current refills left are ${med.refillsLeft}.`,
      conversation: [
        {
          from: "You",
          text: `Automatic Request: Please refill my ${med.name} (${med.dosage}) prescription.`,
          time: format(new Date(), 'h:mm a')
        }
      ]
    };
    setStorageItem('messages', [newMessage, ...messages]);

    // 3. Create a notification
    const notifications = getStorageItem<any[]>('notifications', []);
    const newNotif = {
      id: crypto.randomUUID(),
      title: 'Refill Requested',
      description: `Your request for ${med.name} (${med.dosage}) has been submitted.`,
      time: format(new Date(), 'h:mm a'),
      type: 'refill',
      read: false
    };
    setStorageItem('notifications', [newNotif, ...notifications]);

    // 4. Show confirmation notification
    toast({
      title: "Refill Request Sent",
      description: `Your request for ${med.name} has been sent to the clinic staff. Check your messages for updates.`,
      action: (
        <div className="flex items-center bg-green-500/10 p-1 rounded">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
        </div>
      ),
    });
  };

  return (
    <Card className="border-primary/10 shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-full">
            <Pill className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="font-headline text-2xl">Medication Refills</CardTitle>
            <CardDescription>
              Manage your current prescriptions and request clinical refills.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-bold">Medication</TableHead>
              <TableHead className="font-bold">Dosage</TableHead>
              <TableHead className="font-bold">Frequency</TableHead>
              <TableHead className="font-bold text-center">Refills Left</TableHead>
              <TableHead className="text-right font-bold">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {medications.length > 0 ? (
              medications.map((med) => (
                <TableRow key={med.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-semibold text-primary">{med.name}</TableCell>
                  <TableCell>{med.dosage}</TableCell>
                  <TableCell>{med.frequency}</TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={
                        med.refillsLeft > 0 ? 'secondary' : 'destructive'
                      }
                      className="min-w-[2rem] justify-center"
                    >
                      {med.refillsLeft}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {med.refillRequested ? (
                      <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                        <CheckCircle2 className="mr-1 h-3 w-3" /> Requested
                      </Badge>
                    ) : (
                      <Button
                        size="sm"
                        disabled={med.refillsLeft === 0}
                        onClick={() => handleRequestRefill(med)}
                        className="gap-2"
                      >
                        <MessageSquare className="h-3 w-3" />
                        Request Refill
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground italic">
                  No medications found in your clinical record.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
