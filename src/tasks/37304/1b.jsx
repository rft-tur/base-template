import React, { useState, useEffect } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Toast, ToastProvider, useToast } from "@/components/ui/toast";

const EventOption = ({ title, price, features, selected, onChange }) => (
  <div className="mb-4">
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>${price}</CardDescription>
      </CardHeader>
      <CardContent>
        {features.map((feature, idx) => (
          <p key={idx}>{feature}</p>
        ))}
      </CardContent>
      <CardFooter>
        <Checkbox checked={selected} onCheckedChange={onChange} />
      </CardFooter>
    </Card>
  </div>
);

const GuestForm = ({ onAddGuest }) => {
  const [guest, setGuest] = useState({ name: '', email: '', age: '' });
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (guest.name && guest.email && guest.age) {
      onAddGuest(guest);
      setGuest({ name: '', email: '', age: '' });
      toast({
        title: "Guest Added",
        description: "Guest has been added successfully."
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input 
        type="text" 
        placeholder="Name" 
        value={guest.name} 
        onChange={(e) => setGuest({...guest, name: e.target.value})} 
        required 
      />
      <Input 
        type="email" 
        placeholder="Email" 
        value={guest.email} 
        onChange={(e) => setGuest({...guest, email: e.target.value})} 
        required 
      />
      <Input 
        type="number" 
        placeholder="Age" 
        value={guest.age} 
        onChange={(e) => setGuest({...guest, age: e.target.value})} 
        required 
      />
      <Button type="submit">Add Guest</Button>
    </form>
  );
};

export default function App() {
  const [eventOption, setEventOption] = useState(null);
  const [guests, setGuests] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    let cost = 0;
    if (eventOption === 'launch') cost = 150;
    else if (eventOption === 'full') cost = 225;

    guests.forEach(guest => {
      const guestCost = guest.age > 16 ? (eventOption === 'launch' ? 100 : 175) : (eventOption === 'launch' ? 50 : 75);
      cost += guestCost;
    });

    setTotalCost(cost);
  }, [eventOption, guests]);

  const handleSubmit = (e) => {
    e.preventDefault();
    toast({
      title: "Registration Successful",
      description: "Thank you for registering for the SpaceX Launch event!"
    });
  };

  return (
    <ToastProvider>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>SpaceX Jan25 Launch Registration</CardTitle>
          </CardHeader>
          <CardContent>
            <EventOption 
              title="Launch Only" 
              price="150"
              features={["View the launch", "Access to launch site"]}
              selected={eventOption === 'launch'}
              onChange={() => setEventOption('launch')}
            />
            <EventOption 
              title="Full Event with Night Stay" 
              price="225"
              features={["View the launch", "Access to launch site", "One night stay", "Dinner included"]}
              selected={eventOption === 'full'}
              onChange={() => setEventOption('full')}
            />
            <div className="mt-4">
              <Label htmlFor="guests">Bring Friends or Family?</Label>
              <Checkbox id="guests" onCheckedChange={(checked) => {
                if (!checked) setGuests([]);
              }} />
            </div>
            {guests.length > 0 && (
              <div>
                <h3 className="font-bold mt-4">Guests:</h3>
                {guests.map((guest, index) => (
                  <div key={index} className="mb-2">
                    <span>{guest.name} ({guest.age > 16 ? 'Adult' : 'Child'})</span>
                  </div>
                ))}
              </div>
            )}
            {eventOption && <GuestForm onAddGuest={(guest) => setGuests([...guests, guest])} />}
          </CardContent>
          <CardFooter>
            <p>Total Cost: ${totalCost}</p>
            <Button onClick={handleSubmit}>Submit Registration</Button>
          </CardFooter>
        </Card>
      </div>
    </ToastProvider>
  );
}