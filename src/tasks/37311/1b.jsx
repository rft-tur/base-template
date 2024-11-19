import React, { useState } from "react";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export default function App() {
  const [weight, setWeight] = useState("");
  const [weightUnit, setWeightUnit] = useState("kg");
  const [height, setHeight] = useState("");
  const [heightUnit, setHeightUnit] = useState("cm");
  const [gender, setGender] = useState("male");
  const [bmiResult, setBmiResult] = useState(null);

  const calculateBMI = () => {
    let weightInKg = weightUnit === "kg" ? parseFloat(weight) : parseFloat(weight) * 0.453592;
    let heightInM = heightUnit === "cm" ? parseFloat(height) / 100 : parseFloat(height) * 0.0254;
    
    if (weightInKg > 0 && heightInM > 0) {
      let bmi = weightInKg / (heightInM * heightInM);
      let category = "";
      let color = "";

      if (bmi < 18.5) {
        category = "Underweight";
        color = "bg-yellow-200";
      } else if (bmi >= 18.5 && bmi < 25) {
        category = "Normal weight";
        color = "bg-green-200";
      } else if (bmi >= 25 && bmi < 30) {
        category = "Overweight";
        color = "bg-orange-200";
      } else {
        category = "Obesity";
        color = "bg-red-200";
      }

      setBmiResult({ bmi: bmi.toFixed(1), category, color });
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h1 className="text-2xl font-bold mb-6 text-center">BMI Calculator</h1>
      
      <div className="mb-4 flex items-center">
        <Input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="Weight"
          className="mr-2"
        />
        <Select value={weightUnit} onValueChange={setWeightUnit}>
          <option value="kg">kg</option>
          <option value="lbs">lbs</option>
        </Select>
      </div>

      <div className="mb-4 flex items-center">
        <Input
          type="number"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          placeholder="Height"
          className="mr-2"
        />
        <Select value={heightUnit} onValueChange={setHeightUnit}>
          <option value="cm">cm</option>
          <option value="in">in</option>
        </Select>
      </div>

      <div className="mb-4">
        <RadioGroup value={gender} onValueChange={setGender} className="flex">
          <div className="flex items-center space-x-2 mr-4">
            <RadioGroupItem value="male" id="male" className="hidden" />
            <Label htmlFor="male" className="cursor-pointer">Male</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="female" id="female" className="hidden" />
            <Label htmlFor="female" className="cursor-pointer">Female</Label>
          </div>
        </RadioGroup>
      </div>

      {!bmiResult ? (
        <Button onClick={calculateBMI} className="w-full">
          Calculate BMI
        </Button>
      ) : (
        <div className={`p-4 rounded-lg text-center ${bmiResult.color}`}>
          <p className="font-bold">BMI: {bmiResult.bmi}</p>
          <p>{bmiResult.category}</p>
        </div>
      )}
    </div>
  );
}