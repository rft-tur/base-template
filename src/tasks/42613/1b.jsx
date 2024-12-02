import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
//commented to prevent stackblitz crash
//import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/modal";
import { Info } from "lucide-react";

const REGIONS = ['us-east-1', 'eu-west-1'];
const STORAGE_UNITS = ['GB', 'TB'];
const FILE_SIZE_UNITS = ['KB', 'MB'];

const s3Pricing = {
  'us-east-1': { storage: 0.023, bandwidth: 0.09 },
  'eu-west-1': { storage: 0.025, bandwidth: 0.09 }
};

const r2Pricing = {
  storage: 0.015,
  bandwidth: 0
};

const freeTier = {
  s3: { storage: 5, bandwidth: 15 },
  r2: { storage: 100, bandwidth: 1000 }
};

function App() {
  const [formData, setFormData] = useState({
    region: REGIONS[0],
    storageAmount: 10,
    storageUnit: STORAGE_UNITS[0],
    fileSize: 10,
    fileSizeUnit: FILE_SIZE_UNITS[1],
    requestsPerFile: 1000,
    showSavings: false,
  });
  const [results, setResults] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const results = calculateCosts(formData);
    setResults(results);
  };

  const handleReset = () => {
    setResults(null);
    setFormData({
      ...formData,
      storageAmount: 10,
      fileSize: 10,
      requestsPerFile: 1000,
    });
  };

  const calculateCosts = ({ region, storageAmount, storageUnit, fileSize, fileSizeUnit, requestsPerFile }) => {
    const storageBytes = storageAmount * (storageUnit === 'TB' ? 1e12 : 1e9);
    const fileSizeBytes = fileSize * (fileSizeUnit === 'MB' ? 1e6 : 1e3);
    const numberOfFiles = storageBytes / fileSizeBytes;
    const totalRequests = numberOfFiles * requestsPerFile;
    const totalBandwidth = totalRequests * fileSizeBytes;

    const calculateCost = (service, type) => {
      const pricing = service === 's3' ? s3Pricing[region] : r2Pricing;
      let cost = 0;
      let free = freeTier[service][type] || 0;
      
      if (type === 'storage') {
        cost = Math.max(storageBytes - free * 1e9, 0) * pricing.storage;
      } else if (type === 'bandwidth') {
        cost = Math.max(totalBandwidth - free * 1e9, 0) * pricing.bandwidth;
      }
      return cost;
    };

    const s3Costs = {
      storage: calculateCost('s3', 'storage'),
      bandwidth: calculateCost('s3', 'bandwidth'),
      operations: numberOfFiles * 1.5 * 0.000005,
    };

    const r2Costs = {
      storage: calculateCost('r2', 'storage'),
      bandwidth: calculateCost('r2', 'bandwidth'),
      operations: numberOfFiles * 1.5 * 0.00004,
    };

    return {
      s3: s3Costs.storage + s3Costs.bandwidth + s3Costs.operations,
      r2: r2Costs.storage + r2Costs.bandwidth + r2Costs.operations,
    };
  };

  const openModal = (service, type) => {
    const steps = [];
    if (type === 'storage') {
      steps.push(`Number of Files: ${Math.round(results.numberOfFiles / 1000)}K`);
      steps.push(`Free Tier: ${freeTier[service].storage} GB`);
      steps.push(`Cost: $${results[service][type].toFixed(2)}`);
    } else if (type === 'bandwidth') {
      steps.push(`Total Requests: ${Math.round(results.totalRequests / 1e6)}M`);
      steps.push(`Total Bandwidth: ${Math.round(results.totalBandwidth / 1e9)} GB`);
      steps.push(`Free Tier: ${freeTier[service].bandwidth} GB`);
      steps.push(`Cost: $${results[service][type].toFixed(2)}`);
    }
    setModalContent({ service, type, steps });
    setModalOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="sm:w-2/3">
          <Card>
            <CardHeader>
              <CardTitle>Cost Comparison Tool</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Select value={formData.region} onChange={(e) => setFormData({...formData, region: e.target.value})}>
                  {REGIONS.map(region => <SelectItem key={region} value={region}>{region}</SelectItem>)}
                </Select>
                <div className="flex items-center space-x-2">
                  <Input type="number" value={formData.storageAmount} onChange={(e) => setFormData({...formData, storageAmount: e.target.value})} />
                  <Select value={formData.storageUnit} onChange={(e) => setFormData({...formData, storageUnit: e.target.value})}>
                    {STORAGE_UNITS.map(unit => <SelectItem key={unit} value={unit}>{unit}</SelectItem>)}
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Input type="number" value={formData.fileSize} onChange={(e) => setFormData({...formData, fileSize: e.target.value})} />
                  <Select value={formData.fileSizeUnit} onChange={(e) => setFormData({...formData, fileSizeUnit: e.target.value})}>
                    {FILE_SIZE_UNITS.map(unit => <SelectItem key={unit} value={unit}>{unit}</SelectItem>)}
                  </Select>
                </div>
                <Input type="number" value={formData.requestsPerFile} onChange={(e) => setFormData({...formData, requestsPerFile: e.target.value})} />
                <Checkbox checked={formData.showSavings} onCheckedChange={(checked) => setFormData({...formData, showSavings: checked})}>Show savings per month and year</Checkbox>
                {!results ? 
                  <Button type="submit">Calculate</Button> : 
                  <Button onClick={handleReset}>Reset Form</Button>
                }
              </form>
            </CardContent>
          </Card>

          {results && (
            <Card className="mt-4">
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
                    {['storage', 'bandwidth', 'operations'].map(topic => (
                      <TableRow key={topic}>
                        <TableCell>{topic.charAt(0).toUpperCase() + topic.slice(1)}</TableCell>
                        <TableCell>${results.s3[topic].toFixed(2)} <Info onClick={() => openModal('s3', topic)} className="cursor-pointer inline ml-2" /></TableCell>
                        <TableCell>${results.r2[topic].toFixed(2)} <Info onClick={() => openModal('r2', topic)} className="cursor-pointer inline ml-2" /></TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell><strong>Total</strong></TableCell>
                      <TableCell><strong>${results.s3.total.toFixed(2)}</strong></TableCell>
                      <TableCell><strong>${results.r2.total.toFixed(2)}</strong></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>

        <Card className="sm:w-1/3">
          <CardHeader>
            <CardTitle>Assumptions</CardTitle>
          </CardHeader>
          <CardContent>
            <p>POST/PUT/DELETE assumed at 1.5 per file count.</p>
            <h4 className="mt-4 font-bold">Cost Units:</h4>
            <p>S3 Storage: $/GB/Month</p>
            <p>S3 Bandwidth: $/GB</p>
            <p>R2 Storage: $/GB/Month</p>
            <p>R2 Bandwidth: Free</p>
          </CardContent>
        </Card>
      </div>

      <Modal open={modalOpen} onOpenChange={setModalOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>{modalContent.service} {modalContent.type} Calculation</ModalTitle>
          </ModalHeader>
          <ModalBody>
            {modalContent.steps && modalContent.steps.map((step, idx) => <p key={idx}>{step}</p>)}
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => setModalOpen(false)}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default App;