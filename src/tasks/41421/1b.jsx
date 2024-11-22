import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectItem } from "@/components/ui/select";

const SummaryCard = ({ data }) => {
  const [timeRange, setTimeRange] = useState('today');
  const [valueType, setValueType] = useState('sales');

  const currentData = data[valueType][timeRange];

  return (
    <Card className="w-full sm:max-w-md mx-auto">
      <CardHeader className="flex justify-between items-center">
        <div className="flex space-x-2">
          {['today', 'this week', 'this month'].map(range => (
            <Button 
              key={range} 
              variant={timeRange === range ? 'default' : 'outline'}
              onClick={() => setTimeRange(range)}
              className={timeRange === range ? 'bg-green-500 text-white' : ''}
            >
              {range}
            </Button>
          ))}
        </div>
        <Select value={valueType} onValueChange={setValueType}>
          <SelectItem value="sales">Sales</SelectItem>
          <SelectItem value="shipments">Shipments</SelectItem>
          <SelectItem value="returns">Returns</SelectItem>
        </Select>
      </CardHeader>
      <div className="border-t border-gray-200 my-2"></div>
      <CardContent className="text-center">
        <h2 className="text-lg font-semibold">Total {valueType.charAt(0).toUpperCase() + valueType.slice(1)}</h2>
        <p className="text-xl font-bold mt-2">{currentData.value}</p>
      </CardContent>
      <div className="border-t border-gray-200 my-2"></div>
      <CardFooter className="text-sm">
        <p>{currentData.count} {valueType}</p>
      </CardFooter>
    </Card>
  );
};

export default function App() {
  // Dummy data for demonstration
  const data = {
    sales: {
      today: { value: 5000, count: 10 },
      'this week': { value: 25000, count: 50 },
      'this month': { value: 100000, count: 200 },
    },
    shipments: {
      today: { value: 30, count: 5 },
      'this week': { value: 150, count: 25 },
      'this month': { value: 600, count: 100 },
    },
    returns: {
      today: { value: 5, count: 2 },
      'this week': { value: 20, count: 10 },
      'this month': { value: 80, count: 30 },
    },
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex items-center justify-center">
      <SummaryCard data={data} />
    </div>
  );
}