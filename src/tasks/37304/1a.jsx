import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function App() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [eventType, setEventType] = useState("");
  const [bringFriends, setBringFriends] = useState(false);
  const [friendCount, setFriendCount] = useState(0);
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    calculateTotalCost();
  }, [eventType, bringFriends, friendCount]);

  const calculateTotalCost = () => {
    let cost = 0;
    if (eventType === "day") {
      cost = 75;
    } else if (eventType === "full") {
      cost = 200;
    }

    if (bringFriends && friendCount > 0) {
      cost += (cost * 0.75) * friendCount;
    }

    setTotalCost(cost);
  };

  const handleCheckout = () => {
    alert("done");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-center">
            Register for SpaceX Launch Meetup
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="eventType">I am attending</Label>
              <Select onValueChange={setEventType}>
                <SelectTrigger id="eventType">
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Only day event</SelectItem>
                  <SelectItem value="full">Full event</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="bringFriends"
                checked={bringFriends}
                onCheckedChange={setBringFriends}
              />
              <Label htmlFor="bringFriends">I will bring friends</Label>
            </div>

            {bringFriends && (
              <div>
                <Label htmlFor="friendCount">Number of friends</Label>
                <Input
                  id="friendCount"
                  type="number"
                  min="0"
                  value={friendCount}
                  onChange={(e) => setFriendCount(parseInt(e.target.value) || 0)}
                />
              </div>
            )}

            <div className="text-center font-semibold">
              {totalCost > 0
                ? `Total Cost: $${totalCost.toFixed(2)}`
                : "Please fillup the form to calculate"}
            </div>

            <Button className="w-full" onClick={handleCheckout}>
              Go to checkout
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
