import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

const EventTypeSelect = ({ value, onChange }) => (
  <Select value={value} onValueChange={onChange}>
    <SelectTrigger className="w-full">
      <SelectValue placeholder="Select event type" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="day">Only day event</SelectItem>
      <SelectItem value="full">Full event</SelectItem>
    </SelectContent>
  </Select>
);

const FriendsSection = ({ showFriends, bringFriends, onBringFriendsChange, friendsCount, onFriendsCountChange }) => {
  if (!showFriends) return null;
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Checkbox id="bringFriends" checked={bringFriends} onCheckedChange={onBringFriendsChange} />
        <Label htmlFor="bringFriends">I will bring friends</Label>
      </div>
      {bringFriends && (
        <div>
          <Label htmlFor="friendsCount">Number of friends</Label>
          <Input
            id="friendsCount"
            type="number"
            value={friendsCount}
            onChange={(e) => onFriendsCountChange(parseInt(e.target.value) || 0)}
          />
        </div>
      )}
    </div>
  );
};

const TotalCost = ({ eventType, friendsCount }) => {
  const calculateCost = () => {
    const baseCost = eventType === "day" ? 75 : 200;
    const friendsCost = friendsCount * (baseCost * 0.75);
    return baseCost + friendsCost;
  };

  if (!eventType) {
    return <p>Please fill out the form to calculate</p>;
  }

  return <p>Total cost: ${calculateCost().toFixed(2)}</p>;
};

export default function App() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [eventType, setEventType] = useState("");
  const [bringFriends, setBringFriends] = useState(false);
  const [friendsCount, setFriendsCount] = useState(0);

  const handleCheckout = () => {
    alert("done");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-center">
            Register for SpaceX Launch Meetup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <EventTypeSelect value={eventType} onChange={setEventType} />
          </div>
          <FriendsSection
            showFriends={eventType === "full"}
            bringFriends={bringFriends}
            onBringFriendsChange={setBringFriends}
            friendsCount={friendsCount}
            onFriendsCountChange={setFriendsCount}
          />
          <TotalCost eventType={eventType} friendsCount={bringFriends ? friendsCount : 0} />
          <Button className="w-full" onClick={handleCheckout}>
            Go to checkout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}