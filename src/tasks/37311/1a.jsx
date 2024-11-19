import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

function BMICalculator() {
  const [weight, setWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState('kg');
  const [height, setHeight] = useState('');
  const [heightUnit, setHeightUnit] = useState('cm');
  const [gender, setGender] = useState('male');
  const [bmiResult, setBmiResult] = useState(null);

  const calculateBMI = (e) => {
    e.preventDefault();
    let weightInKg = weightUnit === 'lbs' ? weight * 0.453592 : parseFloat(weight);
    let heightInMeters = heightUnit === 'in' ? height * 0.0254 : height * 0.01;

    if (!isNaN(weightInKg) && !isNaN(heightInMeters) && heightInMeters > 0) {
      const bmi = weightInKg / (heightInMeters * heightInMeters);
      let category;
      let bgColor;

      if (bmi < 18.5) {
        category = 'Underweight';
        bgColor = 'bg-yellow-200';
      } else if (bmi < 25) {
        category = 'Normal weight';
        bgColor = 'bg-green-200';
      } else if (bmi < 30) {
        category = 'Overweight';
        bgColor = 'bg-orange-200';
      } else {
        category = 'Obesity';
        bgColor = 'bg-red-200';
      }

      setBmiResult({ value: bmi.toFixed(2), category, bgColor });
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={calculateBMI} className="w-full max-w-sm">
        <div className="grid gap-4 mb-4">
          {/* Weight Input */}
          <div className="flex items-center space-x-2">
            <Input 
              type="number" 
              placeholder="Weight" 
              value={weight} 
              onChange={(e) => setWeight(e.target.value)} 
              required 
            />
            <Select value={weightUnit} onValueChange={setWeightUnit}>
              <SelectItem value="kg">kg</SelectItem>
              <SelectItem value="lbs">lbs</SelectItem>
            </Select>
          </div>

          {/* Height Input */}
          <div className="flex items-center space-x-2">
            <Input 
              type="number" 
              placeholder="Height" 
              value={height} 
              onChange={(e) => setHeight(e.target.value)} 
              required 
            />
            <Select value={heightUnit} onValueChange={setHeightUnit}>
              <SelectItem value="cm">cm</SelectItem>
              <SelectItem value="in">in</SelectItem>
            </Select>
          </div>

          {/* Gender Selection */}
          <RadioGroup value={gender} onValueChange={setGender} className="flex">
            <RadioGroupItem value="male" id="male" className="px-4 py-2">
              <Label htmlFor="male">Male</Label>
            </RadioGroupItem>
            <RadioGroupItem value="female" id="female" className="px-4 py-2">
              <Label htmlFor="female">Female</Label>
            </RadioGroupItem>
          </RadioGroup>

          {/* Submit Button */}
          {!bmiResult ? (
            <Button type="submit">Calculate BMI</Button>
          ) : (
            <div className={`p-4 text-center rounded ${bmiResult.bgColor}`}>
              <p className="text-lg">BMI: {bmiResult.value}</p>
              <p>Category: {bmiResult.category}</p>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

export default function App() {
  return <BMICalculator />;
}