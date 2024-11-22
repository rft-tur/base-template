import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

function App() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [eventType, setEventType] = useState('day');
  const [bringFriends, setBringFriends] = useState(false);
  const [numFriends, setNumFriends] = useState(0);
  const [totalCost, setTotalCost] = useState(null);

  useEffect(() => {
    let baseCost = eventType === 'day' ? 75 : 200;
    let friendCost = bringFriends ? numFriends * (baseCost * 0.75) : 0;
    setTotalCost(baseCost + friendCost || "Please fill out the form to calculate");
  }, [eventType, bringFriends, numFriends]);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('done');
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Register for SpaceX Launch Meetup</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
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
                <Label htmlFor="type">I am attending</Label>
                <Select onValueChange={setEventType}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Only day event</SelectItem>
                    <SelectItem value="full">Full event</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {eventType === 'full' && (
                <div>
                  <div className="flex items-center">
                    <Checkbox id="bringFriends" checked={bringFriends} onCheckedChange={setBringFriends} />
                    <Label htmlFor="bringFriends" className="ml-2">I will bring friends</Label>
                  </div>
                  {bringFriends && (
                    <div className="mt-2">
                      <Label htmlFor="numFriends">Number of friends</Label>
                      <Input type="number" id="numFriends" value={numFriends} onChange={(e) => setNumFriends(Number(e.target.value))} min="0" />
                    </div>
                  )}
                </div>
              )}
              <div>
                <Label>Total Cost</Label>
                <p className="text-xl font-semibold">{typeof totalCost === 'number' ? `$${totalCost.toFixed(2)}` : totalCost}</p>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button type="submit" onClick={handleSubmit}>Go to checkout</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default App;