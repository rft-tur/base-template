import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Toast } from "@/components/ui/toast";

const EventOption = ({ title, price, features, selected, onChange }) => (
  <div className={`p-4 border rounded-lg ${selected ? "bg-blue-100" : ""}`}>
    <RadioGroupItem value={title} id={title} className="sr-only" />
    <Label htmlFor={title} className="flex items-center justify-between">
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-gray-500">${price}</p>
      </div>
      <ul className="text-sm list-disc pl-5">
        {features.map((feature, index) => (
          <li key={index}>{feature}</li>
        ))}
      </ul>
    </Label>
  </div>
);

const AttendeeForm = ({ onAdd }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({ name, email, age: parseInt(age) });
    setName("");
    setEmail("");
    setAge("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        type="number"
        placeholder="Age"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        required
        min="0"
      />
      <Button type="submit">Add Attendee</Button>
    </form>
  );
};

export default function App() {
  const [eventType, setEventType] = useState("launch");
  const [bringOthers, setBringOthers] = useState(false);
  const [attendees, setAttendees] = useState([]);
  const [showToast, setShowToast] = useState(false);

  const eventOptions = {
    launch: {
      title: "Launch Event Only",
      price: 150,
      features: ["Viewing of launch", "Commemorative item"],
    },
    full: {
      title: "Full Event with Night Stay",
      price: 225,
      features: ["Viewing of launch", "Commemorative item", "Night stay", "Dinner"],
    },
  };

  const calculateCost = () => {
    let total = eventOptions[eventType].price;
    attendees.forEach((attendee) => {
      const isAdult = attendee.age > 16;
      if (eventType === "launch") {
        total += isAdult ? 100 : 50;
      } else {
        total += isAdult ? 175 : 75;
      }
    });
    return total;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>SpaceX Jan25 Launch Event Registration</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Select Event Type</h3>
              <RadioGroup
                value={eventType}
                onValueChange={setEventType}
                className="space-y-2"
              >
                {Object.entries(eventOptions).map(([key, option]) => (
                  <EventOption
                    key={key}
                    {...option}
                    selected={eventType === key}
                    onChange={() => setEventType(key)}
                  />
                ))}
              </RadioGroup>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="bring-others"
                checked={bringOthers}
                onCheckedChange={setBringOthers}
              />
              <Label htmlFor="bring-others">Bring friends or family?</Label>
            </div>

            {bringOthers && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Additional Attendees</h3>
                <AttendeeForm
                  onAdd={(attendee) => setAttendees([...attendees, attendee])}
                />
                {attendees.map((attendee, index) => (
                  <div key={index} className="mt-2 p-2 bg-gray-100 rounded">
                    {attendee.name} ({attendee.age} years old)
                  </div>
                ))}
              </div>
            )}

            <div className="text-xl font-bold">
              Total Cost: ${calculateCost()}
            </div>

            <Button type="submit" className="w-full">
              Submit Registration
            </Button>
          </form>
        </CardContent>
      </Card>

      {showToast && (
        <Toast className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded">
          Registration successful!
        </Toast>
      )}
    </div>
  );
}