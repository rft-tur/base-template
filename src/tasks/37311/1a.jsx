import React, { useState } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";

const BMICalculator = () => {
  const [weight, setWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState('kg');
  const [height, setHeight] = useState('');
  const [heightUnit, setHeightUnit] = useState('cm');
  const [gender, setGender] = useState(null);
  const [bmi, setBMI] = useState(null);
  const [category, setCategory] = useState('');

  const calculateBMI = () => {
    let weightInKg = weightUnit === 'lbs' ? weight * 0.453592 : parseFloat(weight);
    let heightInM = heightUnit === 'in' ? height * 0.0254 : parseFloat(height) / 100;

    if (weightInKg && heightInM) {
      const bmiValue = weightInKg / (heightInM * heightInM);
      setBMI(bmiValue.toFixed(2));

      if (bmiValue < 18.5) setCategory('Underweight');
      else if (bmiValue < 25) setCategory('Normal weight');
      else if (bmiValue < 30) setCategory('Overweight');
      else setCategory('Obesity');
    }
  };

  const getCategoryColor = () => {
    switch(category) {
      case 'Underweight': return 'bg-yellow-200';
      case 'Normal weight': return 'bg-green-200';
      case 'Overweight': return 'bg-orange-200';
      case 'Obesity': return 'bg-red-200';
      default: return 'bg-gray-200';
    }
  };

  return (
    <Card className="max-w-sm mx-auto mt-10 p-4 sm:max-w-lg">
      <CardHeader>
        <CardTitle>BMI Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <Input 
            type="number" 
            placeholder="Weight" 
            value={weight} 
            onChange={(e) => setWeight(e.target.value)} 
          />
          <Select value={weightUnit} onValueChange={setWeightUnit}>
            <SelectItem value="kg">kg</SelectItem>
            <SelectItem value="lbs">lbs</SelectItem>
          </Select>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Input 
            type="number" 
            placeholder="Height" 
            value={height} 
            onChange={(e) => setHeight(e.target.value)} 
          />
          <Select value={heightUnit} onValueChange={setHeightUnit}>
            <SelectItem value="cm">cm</SelectItem>
            <SelectItem value="in">in</SelectItem>
          </Select>
        </div>
        <div className="flex gap-4">
          <Button variant={gender === 'male' ? 'default' : 'outline'} onClick={() => setGender('male')}>Male</Button>
          <Button variant={gender === 'female' ? 'default' : 'outline'} onClick={() => setGender('female')}>Female</Button>
        </div>
        {!bmi ? (
          <Button onClick={calculateBMI}>Calculate BMI</Button>
        ) : (
          <div className={`p-4 rounded text-center ${getCategoryColor()}`}>
            <h3 className="text-xl font-bold">BMI: {bmi}</h3>
            <p>{category}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default function App() {
  return <BMICalculator />;
}