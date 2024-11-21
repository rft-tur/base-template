import React from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

const dataMen = [
  { name: '18-24', value: 12 },
  { name: '25-34', value: 38 },
  { name: '35-44', value: 44 },
  { name: '45-54', value: 35 },
  { name: '55-64', value: 44 },
  { name: '65+', value: 30 },
];

const dataWomen = [
  { name: '18-24', value: 2 },
  { name: '25-34', value: 11 },
  { name: '35-44', value: 10 },
  { name: '45-54', value: 5 },
  { name: '55-64', value: 6 },
  { name: '65+', value: 3 },
];

const barData = [
  { age: '18-24', men: 12, women: 2 },
  { age: '25-34', men: 38, women: 11 },
  { age: '35-44', men: 44, women: 10 },
  { age: '45-54', men: 35, women: 5 },
  { age: '55-64', men: 44, women: 6 },
  { age: '65+', men: 30, women: 3 },
];

function UnemploymentCharts() {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <Card className="w-full sm:w-1/2">
        <CardHeader>
          <CardTitle>Men Veterans Unemployment by Age</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={dataMen} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {dataMen.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="w-full sm:w-1/2">
        <CardHeader>
          <CardTitle>Women Veterans Unemployment by Age</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={dataWomen} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {dataWomen.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Veteran Unemployment: Men vs Women</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="age" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="men" fill="#8884d8" name="Men" />
              <Bar dataKey="women" fill="#82ca9d" name="Women" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

export default function App() {
  return (
    <div className="p-4">
      <UnemploymentCharts />
    </div>
  );
}