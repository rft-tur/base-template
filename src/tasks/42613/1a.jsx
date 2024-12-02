import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Info } from "lucide-react";

const regions = [
  { name: "US East (N. Virginia)", s3Price: 0.023, r2Price: 0.015 },
  { name: "US West (Oregon)", s3Price: 0.023, r2Price: 0.015 },
  { name: "Europe (Ireland)", s3Price: 0.024, r2Price: 0.015 },
];

const formatNumber = (num) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(2)}K`;
  return num.toFixed(2);
};

const formatBytes = (bytes) => {
  if (bytes >= 1099511627776) return `${(bytes / 1099511627776).toFixed(2)} TB`;
  if (bytes >= 1073741824) return `${(bytes / 1073741824).toFixed(2)} GB`;
  return `${bytes.toFixed(2)} MB`;
};

function CostCalculator() {
  const [region, setRegion] = useState(regions[0]);
  const [storage, setStorage] = useState(10);
  const [storageUnit, setStorageUnit] = useState("GB");
  const [fileSize, setFileSize] = useState(10);
  const [fileSizeUnit, setFileSizeUnit] = useState("MB");
  const [getRequests, setGetRequests] = useState(1000);
  const [showSavings, setShowSavings] = useState(false);
  const [results, setResults] = useState(null);
  const [isReadOnly, setIsReadOnly] = useState(false);

  const calculateCosts = () => {
    const storageBytes = storage * (storageUnit === "TB" ? 1024 : 1) * 1024 * 1024 * 1024;
    const fileSizeBytes = fileSize * (fileSizeUnit === "MB" ? 1024 * 1024 : 1024);
    const fileCount = Math.ceil(storageBytes / fileSizeBytes);
    const totalRequests = fileCount * getRequests;
    const totalBandwidth = totalRequests * fileSizeBytes;

    const s3StorageCost = (storageBytes / 1024 / 1024 / 1024) * region.s3Price;
    const r2StorageCost = Math.max(0, (storageBytes / 1024 / 1024 / 1024 - 10) * region.r2Price);

    const s3BandwidthCost = Math.max(0, (totalBandwidth / 1024 / 1024 / 1024 - 100) * 0.09);
    const r2BandwidthCost = 0;

    const s3RequestsCost = (totalRequests * 0.0000004) + (fileCount * 1.5 * 0.000005);
    const r2RequestsCost = Math.max(0, (totalRequests - 1000000) * 0.0000036) + (fileCount * 1.5 * 0.000036);

    const s3Total = s3StorageCost + s3BandwidthCost + s3RequestsCost;
    const r2Total = r2StorageCost + r2BandwidthCost + r2RequestsCost;

    setResults({
      fileCount,
      totalRequests,
      totalBandwidth,
      s3: { storage: s3StorageCost, bandwidth: s3BandwidthCost, requests: s3RequestsCost, total: s3Total },
      r2: { storage: r2StorageCost, bandwidth: r2BandwidthCost, requests: r2RequestsCost, total: r2Total },
    });
    setIsReadOnly(true);
  };

  const resetForm = () => {
    setRegion(regions[0]);
    setStorage(10);
    setStorageUnit("GB");
    setFileSize(10);
    setFileSizeUnit("MB");
    setGetRequests(1000);
    setShowSavings(false);
    setResults(null);
    setIsReadOnly(false);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="lg:w-2/3 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cost Comparison Calculator</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div>
                  <label>Region</label>
                  <Select
                    value={region.name}
                    onValueChange={(value) => setRegion(regions.find(r => r.name === value))}
                    disabled={isReadOnly}
                  >
                    {regions.map((r) => (
                      <option key={r.name} value={r.name}>{r.name}</option>
                    ))}
                  </Select>
                </div>
                <div className="flex gap-2">
                  <div className="flex-grow">
                    <label>Storage Amount</label>
                    <Input
                      type="number"
                      value={storage}
                      onChange={(e) => setStorage(e.target.value)}
                      disabled={isReadOnly}
                    />
                  </div>
                  <div>
                    <label>Unit</label>
                    <Select
                      value={storageUnit}
                      onValueChange={setStorageUnit}
                      disabled={isReadOnly}
                    >
                      <option value="GB">GB</option>
                      <option value="TB">TB</option>
                    </Select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="flex-grow">
                    <label>Average File Size</label>
                    <Input
                      type="number"
                      value={fileSize}
                      onChange={(e) => setFileSize(e.target.value)}
                      disabled={isReadOnly}
                    />
                  </div>
                  <div>
                    <label>Unit</label>
                    <Select
                      value={fileSizeUnit}
                      onValueChange={setFileSizeUnit}
                      disabled={isReadOnly}
                    >
                      <option value="KB">KB</option>
                      <option value="MB">MB</option>
                    </Select>
                  </div>
                </div>
                <div>
                  <label>GET Requests per File</label>
                  <Input
                    type="number"
                    value={getRequests}
                    onChange={(e) => setGetRequests(e.target.value)}
                    disabled={isReadOnly}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="showSavings"
                    checked={showSavings}
                    onCheckedChange={setShowSavings}
                    disabled={isReadOnly}
                  />
                  <label htmlFor="showSavings">Show savings per month and year</label>
                </div>
                {!isReadOnly ? (
                  <Button onClick={calculateCosts}>Calculate</Button>
                ) : (
                  <Button onClick={resetForm}>Reset</Button>
                )}
              </form>
            </CardContent>
          </Card>

          {results && (
            <Card>
              <CardHeader>
                <CardTitle>Cost Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Topic</TableHead>
                      <TableHead>S3</TableHead>
                      <TableHead>R2</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {["storage", "bandwidth", "requests", "total"].map((topic) => (
                      <TableRow key={topic}>
                        <TableCell className="capitalize">{topic}</TableCell>
                        <TableCell>
                          ${results.s3[topic].toFixed(2)}
                          <InfoModal topic={topic} provider="S3" data={results} />
                        </TableCell>
                        <TableCell>
                          ${results.r2[topic].toFixed(2)}
                          <InfoModal topic={topic} provider="R2" data={results} />
                        </TableCell>
                      </TableRow>
                    ))}
                    {showSavings && (
                      <>
                        <TableRow>
                          <TableCell>Monthly Savings</TableCell>
                          <TableCell colSpan={2}>
                            ${(results.s3.total - results.r2.total).toFixed(2)}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Yearly Savings</TableCell>
                          <TableCell colSpan={2}>
                            ${((results.s3.total - results.r2.total) * 12).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      </>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>

        <Card className="lg:w-1/3">
          <CardHeader>
            <CardTitle>Assumptions and Cost Units</CardTitle>
          </CardHeader>
          <CardContent>
            <h3 className="font-bold mb-2">Assumptions</h3>
            <ul className="list-disc pl-5 mb-4">
              <li>POST/PUT/DELETE is 1.5 per file count</li>
              <li>All calculations are based on monthly usage</li>
            </ul>
            <h3 className="font-bold mb-2">Cost Units</h3>
            <ul className="list-disc pl-5">
              <li>S3 Storage: ${region.s3Price}/GB/month</li>
              <li>R2 Storage: ${region.r2Price}/GB/month (first 10GB free)</li>
              <li>S3 Bandwidth: $0.09/GB (first 100GB free)</li>
              <li>R2 Bandwidth: Free</li>
              <li>S3 Requests: $0.0000004 per GET, $0.000005 per PUT/POST/DELETE</li>
              <li>R2 Requests: $0.0000036 per GET (first 1M free), $0.000036 per PUT/POST/DELETE</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function InfoModal({ topic, provider, data }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="ml-2">
          <Info className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{provider} {topic.charAt(0).toUpperCase() + topic.slice(1)} Calculation</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          {topic === "storage" && (
            <>
              <p>Number of files: {formatNumber(data.fileCount)}</p>
              <p>Total storage: {formatBytes(data.fileCount * data.totalBandwidth / data.totalRequests)}</p>
              <p>Free tier: {provider === "R2" ? "10 GB" : "None"}</p>
              <p>Cost: ${data[provider.toLowerCase()][topic].toFixed(2)}</p>
            </>
          )}
          {topic === "bandwidth" && (
            <>
              <p>Total requests: {formatNumber(data.totalRequests)}</p>
              <p>Total bandwidth: {formatBytes(data.totalBandwidth)}</p>
              <p>Free tier: {provider === "S3" ? "100 GB" : "Unlimited"}</p>
              <p>Cost: ${data[provider.toLowerCase()][topic].toFixed(2)}</p>
            </>
          )}
          {topic === "requests" && (
            <>
              <p>GET requests: {formatNumber(data.totalRequests)}</p>
              <p>PUT/POST/DELETE requests: {formatNumber(data.fileCount * 1.5)}</p>
              <p>Free tier: {provider === "R2" ? "1M GET requests" : "None"}</p>
              <p>Cost: ${data[provider.toLowerCase()][topic].toFixed(2)}</p>
            </>
          )}
          {topic === "total" && (
            <p>Sum of storage, bandwidth, and request costs</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <CostCalculator />
    </div>
  );
}