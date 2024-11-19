import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectItem } from "@/components/ui/select";

export default function App() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [eventType, setEventType] = useState('day');
  const [bringFriends, setBringFriends] = useState(false);
  const [numFriends, setNumFriends] = useState(0);
  const [totalCost, setTotalCost] = useState(null);

  const calculateCost = () => {
    let baseCost = eventType === 'day' ? 75 : 200;
    let friendsCost = bringFriends ? numFriends * baseCost * 0.75 : 0;
    return baseCost + friendsCost;
  };

  const handleSubmit = () => {
    alert('done');
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Register for SpaceX Launch Meetup</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
              </div>
            </div>
            <div>
              <Label htmlFor="eventType">I am attending</Label>
              <Select id="eventType" value={eventType} onChange={(value) => { setEventType(value); setTotalCost(null); }}>
                <SelectItem value="day">Only day event</SelectItem>
                <SelectItem value="full">Full event</SelectItem>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="bringFriends" checked={bringFriends} onCheckedChange={setBringFriends} />
              <Label htmlFor="bringFriends">I will bring friends</Label>
            </div>
            {bringFriends && (
              <div>
                <Label htmlFor="numFriends">Number of friends</Label>
                <Input 
                  id="numFriends" 
                  type="number" 
                  value={numFriends} 
                  onChange={(e) => {
                    setNumFriends(Number(e.target.value));
                    setTotalCost(null);
                  }} 
                  required 
                />
              </div>
            )}
            <div>
              <p>{totalCost === null ? "Please fill up the form to calculate" : `Total Cost: $${totalCost}`}</p>
              <Button 
                onClick={() => setTotalCost(calculateCost())} 
                className="mt-2 w-full"
              >
                Calculate Cost
              </Button>
            </div>
            <Button onClick={handleSubmit} className="w-full">Go to Checkout</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}