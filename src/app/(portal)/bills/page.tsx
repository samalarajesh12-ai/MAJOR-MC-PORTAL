
'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  FileDown, 
  CreditCard, 
  Landmark, 
  Wallet, 
  ShieldCheck, 
  Plus, 
  Receipt,
  Search,
  CheckCircle2,
  Trash2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { getStorageItem, setStorageItem, seedStorage } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const paymentMethodIcons = {
    'Debit Card': <CreditCard className="h-4 w-4" />,
    'UPI': <Wallet className="h-4 w-4" />,
    'Cash': <Landmark className="h-4 w-4" />,
    'Insurance': <ShieldCheck className="h-4 w-4" />,
    'Split Payment': <Receipt className="h-4 w-4" />
}

export default function BillsPage() {
  const { toast } = useToast();
  const [bills, setBills] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedBillId, setExpandedBillId] = useState<string | null>(null);
  
  // Edit State
  const [editingBill, setEditingBill] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    seedStorage();
    const storedBills = getStorageItem<any[]>('bills', []);
    setBills(storedBills);
  }, []);

  const calculateGST = (amount: number) => amount * 0.025;
  const calculateTotal = (amount: number) => amount + calculateGST(amount);

  const handleUpdateBill = () => {
    if (!editingBill) return;
    
    const updated = bills.map(b => b.id === editingBill.id ? editingBill : b);
    setBills(updated);
    setStorageItem('bills', updated);
    setIsEditDialogOpen(false);
    
    toast({
      title: "Bill Updated",
      description: `Payment details for ${editingBill.service} synchronized.`,
    });
  };

  const filteredBills = bills.filter(b => 
    b.service.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline text-primary flex items-center gap-2">
            <Receipt className="h-8 w-8" />
            Medical Bills
          </h1>
          <p className="text-muted-foreground">View surgical details, taxes, and manage payment methods.</p>
        </div>
        <div className="relative max-w-sm w-full">
           <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
           <Input 
             placeholder="Search clinical services..." 
             className="pl-8" 
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Clinical Billing History</CardTitle>
          <CardDescription>
            All totals include a statutory clinical GST of 2.5%.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[40px]"></TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Subtotal</TableHead>
                <TableHead>Tax (2.5%)</TableHead>
                <TableHead>Grand Total</TableHead>
                <TableHead>Method</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBills.map((bill) => {
                const subtotal = bill.amount;
                const gst = calculateGST(subtotal);
                const total = calculateTotal(subtotal);
                const isExpanded = expandedBillId === bill.id;

                return (
                  <React.Fragment key={bill.id}>
                    <TableRow className="hover:bg-muted/10 transition-colors">
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6" 
                          onClick={() => setExpandedBillId(isExpanded ? null : bill.id)}
                        >
                          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                      </TableCell>
                      <TableCell className="font-bold text-primary">{bill.service}</TableCell>
                      <TableCell>{bill.date}</TableCell>
                      <TableCell>Rs {subtotal.toFixed(2)}</TableCell>
                      <TableCell className="text-muted-foreground">Rs {gst.toFixed(2)}</TableCell>
                      <TableCell className="font-bold">Rs {total.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="gap-1.5 font-normal">
                          {paymentMethodIcons[bill.paymentMethod as keyof typeof paymentMethodIcons]}
                          {bill.paymentMethod}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-primary"
                          onClick={() => { setEditingBill(bill); setIsEditDialogOpen(true); }}
                        >
                          Edit Payment
                        </Button>
                      </TableCell>
                    </TableRow>
                    {isExpanded && (
                      <TableRow className="bg-muted/5">
                        <TableCell colSpan={8} className="p-4 border-l-4 border-primary">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                <Activity className="h-3 w-3" /> Medical Surgicals Used
                              </h4>
                              {bill.surgicals && bill.surgicals.length > 0 ? (
                                <div className="space-y-2">
                                  {bill.surgicals.map((item: any, idx: number) => (
                                    <div key={idx} className="flex justify-between items-center bg-card p-2 rounded border border-primary/5">
                                      <span className="text-sm font-medium">{item.name}</span>
                                      <Badge variant="secondary" className="bg-primary/5 text-primary">Count: {item.count}</Badge>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-xs italic text-muted-foreground">No specific surgical items logged for this visit.</p>
                              )}
                            </div>
                            <div className="bg-card p-4 rounded-lg border space-y-3 shadow-inner">
                               <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Payment Summary</h4>
                               <div className="space-y-1.5">
                                 <div className="flex justify-between text-sm">
                                   <span>Status</span>
                                   <Badge className="bg-green-100 text-green-700">{bill.status}</Badge>
                                 </div>
                                 <div className="flex justify-between text-sm">
                                   <span>Main Method</span>
                                   <span className="font-semibold">{bill.paymentMethod}</span>
                                 </div>
                                 {bill.paymentDetails && (
                                   <p className="text-[10px] text-muted-foreground pt-1 border-t italic">{bill.paymentDetails}</p>
                                 )}
                               </div>
                               <Button size="sm" className="w-full gap-2 mt-2">
                                 <FileDown className="h-4 w-4" /> Download PDF Invoice
                               </Button>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Update Payment Method</DialogTitle>
            <DialogDescription>
              Select clinical payment configuration, including split method support.
            </DialogDescription>
          </DialogHeader>
          {editingBill && (
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label>Service Reference</Label>
                <Input value={editingBill.service} disabled className="bg-muted" />
              </div>
              
              <div className="space-y-2">
                <Label>Primary Payment Method</Label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.keys(paymentMethodIcons).map((method) => (
                    <Button 
                      key={method}
                      variant={editingBill.paymentMethod === method ? 'default' : 'outline'}
                      size="sm"
                      className="justify-start gap-2"
                      onClick={() => setEditingBill({ ...editingBill, paymentMethod: method })}
                    >
                      {paymentMethodIcons[method as keyof typeof paymentMethodIcons]}
                      <span className="text-xs">{method}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {editingBill.paymentMethod === 'Split Payment' && (
                <div className="space-y-3 p-3 bg-primary/5 rounded-md border border-primary/20">
                   <Label className="text-xs font-bold text-primary">Split Details</Label>
                   <Textarea 
                     placeholder="e.g., Rs 1000 paid in Cash, Remaining Rs 1500 via UPI."
                     value={editingBill.paymentDetails || ''}
                     onChange={(e) => setEditingBill({...editingBill, paymentDetails: e.target.value})}
                   />
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button className="w-full" onClick={handleUpdateBill}>Save Billing Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
