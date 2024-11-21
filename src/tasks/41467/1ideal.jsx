import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const menData = [
  { name: "18-24", value: 12 },
  { name: "25-34", value: 38 },
  { name: "35-44", value: 44 },
  { name: "45-54", value: 35 },
  { name: "55-64", value: 44 },
  { name: "65+", value: 30 },
];

const womenData = [
  { name: "18-24", value: 2 },
  { name: "25-34", value: 11 },
  { name: "35-44", value: 10 },
  { name: "45-54", value: 5 },
  { name: "55-64", value: 6 },
  { name: "65+", value: 3 },
];

const barData = [
  { name: "18-24", men: 12, women: 2 },
  { name: "25-34", men: 38, women: 11 },
  { name: "35-44", men: 44, women: 10 },
  { name: "45-54", men: 35, women: 5 },
  { name: "55-64", men: 44, women: 6 },
  { name: "65+", men: 30, women: 3 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const PieChartComponent = ({ data, title }) => (
  <Card className="w-full sm:w-1/2 p-4">
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

const BarChartComponent = () => (
  <Card className="w-full p-4 mt-8">
    <CardHeader>
      <CardTitle>Veteran Unemployment by Age Group and Gender</CardTitle>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={barData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="men" fill="#8884d8" name="Men" />
          <Bar dataKey="women" fill="#82ca9d" name="Women" />
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

export default function App() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Veteran Unemployment Visualization</h1>
      <div className="flex flex-wrap justify-center gap-4">
        <PieChartComponent data={menData} title="Men Veterans by Age Group" />
        <PieChartComponent data={womenData} title="Women Veterans by Age Group" />
      </div>
      <BarChartComponent />
    </div>
  );
}