import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Toast, ToastProvider, useToast } from "@/components/ui/toast";

const validTLDs = ['.com', '.net', '.org', '.io', '.co'];

const simulateAPICall = (successRate = 0.5) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(Math.random() < successRate);
    }, 1000);
  });
};

function Step1({ onNext }) {
  const [domain, setDomain] = useState('');
  const [error, setError] = useState('');
  const { toast } = useToast();

  const validateDomain = () => {
    const domainRegex = /^[a-zA-Z0-9-]+\.([a-zA-Z]{2,})$/;
    if (!domainRegex.test(domain)) {
      setError('Invalid domain format or TLD.');
      return false;
    }
    const tld = '.' + domain.split('.').pop();
    if (!validTLDs.includes(tld)) {
      setError(`TLD must be one of ${validTLDs.join(', ')}`);
      return false;
    }
    return true;
  };

  const checkDomain = async () => {
    if (!validateDomain()) return;
    const success = await simulateAPICall();
    if (success) {
      onNext({ dnsProvider: Math.random() > 0.5 ? 'namecheap' : 'cloudflare' });
      toast({ title: "Domain check successful!", description: "Proceeding to MX record setup." });
    } else {
      toast({ variant: "destructive", title: "Error", description: "Domain not registered or API error." });
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Step 1: Enter Your Domain</CardTitle>
      </CardHeader>
      <CardContent>
        <Label htmlFor="domain">Domain</Label>
        <Input 
          id="domain" 
          value={domain} 
          onChange={(e) => setDomain(e.target.value)} 
          placeholder="example.com" 
        />
        {error && <p className="text-destructive">{error}</p>}
        <p className="text-muted-foreground text-sm mt-2">
          Allowed TLDs: {validTLDs.join(', ')}
        </p>
      </CardContent>
      <CardFooter>
        <Button onClick={checkDomain}>Check Domain</Button>
      </CardFooter>
    </Card>
  );
}

function Step2({ dnsProvider, onNext }) {
  const mxRecords = [
    { priority: '10', value: 'mx1.example.com' },
    { priority: '20', value: 'mx2.example.com' },
    { priority: '30', value: 'mx3.example.com' },
  ];
  const { toast } = useToast();

  const checkMXRecords = async () => {
    const success = await simulateAPICall();
    if (success) {
      onNext();
      toast({ title: "MX Records verified!", description: "Proceeding to SPF setup." });
    } else {
      toast({ variant: "destructive", title: "Error", description: "MX Records not set correctly." });
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Step 2: Set MX Records</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{dnsProvider === 'namecheap' ? 'For Namecheap:' : 'For Cloudflare:'}</p>
        <p className="mb-4">Please add these MX records in your DNS settings:</p>
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>Priority</TableCell>
              <TableCell>Value</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mxRecords.map((record) => (
              <TableRow key={record.priority}>
                <TableCell>{record.priority}</TableCell>
                <TableCell>
                  <Button variant="link" onClick={() => navigator.clipboard.writeText(record.value)}>
                    {record.value}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <Button onClick={checkMXRecords}>Check MX Records</Button>
      </CardFooter>
    </Card>
  );
}

// Steps 3, 4, and 5 would be similar, implementing the described functionality.

function Step3({ onNext }) {
  // Implement SPF record setup similar to Step2
}

function Step4({ onNext }) {
  // Implement DKIM record setup
}

function Step5() {
  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Step 5: Confirmation</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Your mail server is now connected to your domain!</p>
      </CardContent>
    </Card>
  );
}

export default function App() {
  const [step, setStep] = useState(1);
  const [wizardData, setWizardData] = useState({});

  const nextStep = (data = {}) => {
    setWizardData(prev => ({ ...prev, ...data }));
    setStep(prevStep => prevStep + 1);
  };

  const steps = [
    <Step1 onNext={nextStep} />,
    <Step2 dnsProvider={wizardData.dnsProvider} onNext={nextStep} />,
    <Step3 onNext={nextStep} />,
    <Step4 onNext={nextStep} />,
    <Step5 />,
  ];

  return (
    <ToastProvider>
      <div className="min-h-screen flex items-center justify-center bg-background">
        {steps[step - 1]}
      </div>
    </ToastProvider>
  );
}