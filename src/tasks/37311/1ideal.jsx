import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const weightUnits = [
  { value: "lbs", label: "lbs" },
  { value: "kg", label: "kg" },
];

const heightUnits = [
  { value: "inches", label: "inches" },
  { value: "cms", label: "cms" },
];

const genders = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

const bmiCategories = [
  { min: 0, max: 18.5, category: "Underweight", color: "bg-yellow-200" },
  { min: 18.5, max: 24.9, category: "Normal weight", color: "bg-green-200" },
  { min: 25, max: 29.9, category: "Overweight", color: "bg-orange-200" },
  { min: 30, max: Infinity, category: "Obesity", color: "bg-red-200" },
];

function BMICalculator() {
  const [weight, setWeight] = useState("");
  const [weightUnit, setWeightUnit] = useState("kg");
  const [height, setHeight] = useState("");
  const [heightUnit, setHeightUnit] = useState("cms");
  const [gender, setGender] = useState("male");
  const [bmiResult, setBmiResult] = useState(null);

  const calculateBMI = () => {
    let weightInKg = weightUnit === 'lbs' ? weight * 0.453592 : parseFloat(weight);
    let heightInM = heightUnit === 'inches' ? height * 0.0254 : parseFloat(height) / 100;

    const bmi = weightInKg / (heightInM * heightInM);
    const category = bmiCategories.find((cat) => bmi >= cat.min && bmi < cat.max);

    setBmiResult({ bmi: bmi.toFixed(1), ...category });
  };

  const resetCalculator = () => {
    setWeight("");
    setWeightUnit("kg");
    setHeight("");
    setHeightUnit("cms");
    setGender("male");
    setBmiResult(null);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">BMI Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Weight</label>
              <Input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="w-1/3">
              <label className="block text-sm font-medium text-gray-700">Unit</label>
              <Select value={weightUnit} onValueChange={setWeightUnit}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {weightUnits.map((unit) => (
                    <SelectItem key={unit.value} value={unit.value}>
                      {unit.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Height</label>
              <Input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="w-1/3">
              <label className="block text-sm font-medium text-gray-700">Unit</label>
              <Select value={heightUnit} onValueChange={setHeightUnit}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {heightUnits.map((unit) => (
                    <SelectItem key={unit.value} value={unit.value}>
                      {unit.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Gender</label>
            <div className="mt-1 flex space-x-4">
              {genders.map((g) => (
                <Button
                  key={g.value}
                  variant={gender === g.value ? "default" : "outline"}
                  onClick={() => setGender(g.value)}
                >
                  {g.label}
                </Button>
              ))}
            </div>
          </div>

          {bmiResult ? (
            <div className={`p-4 rounded-md ${bmiResult.color}`}>
              <p className="text-lg font-semibold">
                BMI: {bmiResult.bmi} - {bmiResult.category}
              </p>
              <Button onClick={resetCalculator} className="mt-2">
                Calculate Again
              </Button>
            </div>
          ) : (
            <Button onClick={calculateBMI} className="w-full">
              Calculate BMI
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <BMICalculator />
    </div>
  );
}