import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const timeRanges = ["Today", "This Week", "This Month"];
const valueTypes = ["Sales", "Shipments", "Returns"];

const mockData = {
  Sales: {
    Today: { total: 5000, count: 50 },
    "This Week": { total: 35000, count: 350 },
    "This Month": { total: 150000, count: 1500 },
  },
  Shipments: {
    Today: { total: 100, count: 45 },
    "This Week": { total: 700, count: 315 },
    "This Month": { total: 3000, count: 1350 },
  },
  Returns: {
    Today: { total: 10, count: 5 },
    "This Week": { total: 70, count: 35 },
    "This Month": { total: 300, count: 150 },
  },
};

const SummaryCard = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState("Today");
  const [selectedValueType, setSelectedValueType] = useState("Sales");

  const handleTimeRangeChange = (range) => {
    setSelectedTimeRange(range);
  };

  const handleValueTypeChange = (type) => {
    setSelectedValueType(type);
  };

  const data = mockData[selectedValueType][selectedTimeRange];

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div className="flex space-x-2">
          {timeRanges.map((range) => (
            <Button
              key={range}
              variant={selectedTimeRange === range ? "default" : "outline"}
              className={`text-xs sm:text-sm ${
                selectedTimeRange === range ? "bg-green-500 hover:bg-green-600" : ""
              }`}
              onClick={() => handleTimeRangeChange(range)}
            >
              {range}
            </Button>
          ))}
        </div>
        <Select value={selectedValueType} onValueChange={handleValueTypeChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            {valueTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-t border-gray-200 pt-4">
          <h2 className="text-lg font-semibold">Total {selectedValueType}</h2>
          <p className="text-xl font-bold">
            {selectedValueType === "Sales" ? "$" : ""}
            {data.total.toLocaleString()}
          </p>
        </div>
        <div className="border-t border-gray-200 pt-4">
          <p className="text-sm text-gray-600">
            {data.count} {selectedValueType.toLowerCase()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <SummaryCard />
    </div>
  );
}