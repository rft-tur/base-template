import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
//commented for invalid import crashing stacblitz
//import { useToast } from "@/components/ui/use-toast";

const allowedTLDs = ["com", "net", "org", "io"];
const dnsProviders = ["namecheap", "cloudflare"];

const Step1 = ({ onNext }) => {
  const [domain, setDomain] = useState("");
  const { toast } = useToast();

  const validateDomain = () => {
    const parts = domain.split(".");
    if (parts.length !== 2 || !allowedTLDs.includes(parts[1])) {
      toast({ title: "Error", description: "Invalid domain or TLD" });
      return false;
    }
    return true;
  };

  const checkDomain = () => {
    if (!validateDomain()) return;
    // API call to check domain
    console.log("API call: Check if domain is registered");
    if (Math.random() > 0.5) {
      const provider = dnsProviders[Math.floor(Math.random() * dnsProviders.length)];
      onNext(domain, provider);
    } else {
      toast({ title: "Error", description: "Domain is not registered" });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Step 1: Enter Domain</CardTitle>
      </CardHeader>
      <CardContent>
        <Label htmlFor="domain">Domain</Label>
        <Input id="domain" value={domain} onChange={(e) => setDomain(e.target.value)} />
        <p className="text-sm text-gray-500 mt-1">Allowed TLDs: {allowedTLDs.join(", ")}</p>
        <Button className="mt-4" onClick={checkDomain}>Check Domain</Button>
      </CardContent>
    </Card>
  );
};

const Step2 = ({ domain, dnsProvider, onNext }) => {
  const { toast } = useToast();
  const mxRecords = [
    { priority: "10", value: "mx1.example.com" },
    { priority: "20", value: "mx2.example.com" },
    { priority: "30", value: "mx3.example.com" },
  ];

  const checkMXRecords = () => {
    // API call to check MX records
    console.log("API call: Check MX records");
    if (Math.random() > 0.5) {
      onNext();
    } else {
      toast({ title: "Error", description: "MX records not set correctly" });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Step 2: Set MX Records</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Instructions for {dnsProvider} DNS manager:</p>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Priority</TableHead>
              <TableHead>Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mxRecords.map((record, index) => (
              <TableRow key={index}>
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
        <Button className="mt-4" onClick={checkMXRecords}>Check MX Records</Button>
      </CardContent>
    </Card>
  );
};

const Step3 = ({ onNext }) => {
  const { toast } = useToast();
  const spfRecord = { type: "TXT", host: "@", value: "v=spf1 include:_spf.example.com ~all" };

  const checkSPFRecord = () => {
    // API call to check SPF record
    console.log("API call: Check SPF record");
    if (Math.random() > 0.5) {
      onNext();
    } else {
      toast({ title: "Error", description: "SPF record not set correctly" });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Step 3: Set SPF Record</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>{spfRecord.type}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Host</TableCell>
              <TableCell>{spfRecord.host}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Value</TableCell>
              <TableCell>
                <Button variant="link" onClick={() => navigator.clipboard.writeText(spfRecord.value)}>
                  {spfRecord.value}
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Button className="mt-4" onClick={checkSPFRecord}>Check SPF Record</Button>
      </CardContent>
    </Card>
  );
};

const Step4 = ({ onNext }) => {
  const { toast } = useToast();
  const dkimRecord = {
    type: "TXT",
    host: "dkim._domainkey",
    value: "v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA1Kd87/UeJjenpabgbFwh+eBCsSTrqmwIYYvywlbhbqoo2DymndFkbjOVIPIldNs/m40KF+yzMn1skyoxcTUGCQs8g3FgD2Ap3ZB5DekAo5wMmk4wimDO+U8QzI3SD07y2+07wlNWwIt8svnxgdxGkVbbhzY8i+RQ9DpSVpPbF7ykQxtKXkv/ahW3KjViiAH+ghvvIhkx4xYSIc9oSwVmAl5OctMEeWUwg8Istjqz8BZeTWbf41fbNhte7Y+YqZOwq1Sd0DbvYAD9NOZK9vlfuac0598HY+vtSBczUiKERHv1yRbcaQtZFh5wtiRrN04BLUTD21MycBX5jYchHjPY/wIDAQAB"
  };

  const checkDKIMRecord = () => {
    // API call to check DKIM record
    console.log("API call: Check DKIM record");
    if (Math.random() > 0.5) {
      onNext();
    } else {
      toast({ title: "Error", description: "DKIM record not set correctly" });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Step 4: Set DKIM Record</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>{dkimRecord.type}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Host</TableCell>
              <TableCell>{dkimRecord.host}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Label htmlFor="dkim-value">Value</Label>
        <Textarea id="dkim-value" value={dkimRecord.value} readOnly className="mt-2" />
        <Button className="mt-4" onClick={() => navigator.clipboard.writeText(dkimRecord.value)}>
          Copy DKIM Value
        </Button>
        <Button className="mt-4 ml-2" onClick={checkDKIMRecord}>Check DKIM Record</Button>
      </CardContent>
    </Card>
  );
};

const Step5 = () => (
  <Card className="w-full max-w-md mx-auto">
    <CardHeader>
      <CardTitle>Step 5: Confirmation</CardTitle>
    </CardHeader>
    <CardContent>
      <p>Congratulations! Your mail is now connected.</p>
    </CardContent>
  </Card>
);

export default function App() {
  const [step, setStep] = useState(1);
  const [domain, setDomain] = useState("");
  const [dnsProvider, setDnsProvider] = useState("");

  const nextStep = (newDomain, newDnsProvider) => {
    if (newDomain) setDomain(newDomain);
    if (newDnsProvider) setDnsProvider(newDnsProvider);
    setStep(step + 1);
  };

  return (
    <div className="container mx-auto p-4">
      {step === 1 && <Step1 onNext={nextStep} />}
      {step === 2 && <Step2 domain={domain} dnsProvider={dnsProvider} onNext={nextStep} />}
      {step === 3 && <Step3 onNext={nextStep} />}
      {step === 4 && <Step4 onNext={nextStep} />}
      {step === 5 && <Step5 />}
    </div>
  );
}