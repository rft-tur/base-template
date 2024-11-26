import React, { useState } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from 'date-fns';

// Mock data for destinations and buses
const destinations = ['New York', 'Los Angeles', 'Chicago', 'Houston'];
const buses = [
  { id: 1, company: 'Greyhound', route: 'NYC - LA', time: '08:00 AM', price: 120 },
  // Add more mock bus data here
];

function App() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ from: '', to: '', date: new Date(), selectedBus: null, selectedSeats: [], user: {} });

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const Step1 = () => (
    <div className="flex flex-col space-y-4">
      <Input type="select" placeholder="From" value={formData.from} onChange={e => setFormData({...formData, from: e.target.value})}>
        {destinations.map(dest => <option key={dest}>{dest}</option>)}
      </Input>
      <Input type="select" placeholder="To" value={formData.to} onChange={e => setFormData({...formData, to: e.target.value})}>
        {destinations.map(dest => <option key={dest}>{dest}</option>)}
      </Input>
      <Input type="date" value={formData.date.toISOString().split('T')[0]} onChange={e => setFormData({...formData, date: new Date(e.target.value)})} />
      <Button onClick={handleNext}>Next</Button>
    </div>
  );

  const Step2 = () => (
    <div>
      <Button onClick={handleBack}>Back</Button>
      <div className="mt-4 space-y-4">
        {buses.map(bus => (
          <Card key={bus.id} onClick={() => setFormData({...formData, selectedBus: bus})} className="cursor-pointer">
            <CardHeader>
              <CardTitle>{bus.company}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{bus.route}</p>
              <p>{bus.time}</p>
            </CardContent>
            <CardContent className="text-right font-bold">${bus.price}</CardContent>
          </Card>
        ))}
      </div>
      {formData.selectedBus && <Button onClick={handleNext} className="mt-4">Next</Button>}
    </div>
  );

  const Step3 = () => {
    const [seats, setSeats] = useState(Array(45).fill(false));
    const toggleSeat = (index) => {
      if (!seats[index]) {
        const newSeats = [...seats];
        newSeats[index] = !newSeats[index];
        setSeats(newSeats);
        setFormData({...formData, selectedSeats: formData.selectedSeats.includes(index) ? formData.selectedSeats : [...formData.selectedSeats, index]});
      }
    };

    return (
      <div>
        <Button onClick={handleBack}>Back</Button>
        <div className="mt-4 border-2 p-4 rounded-lg">
          <div className="flex justify-between mb-2"><span>Driver</span><span>Door</span></div>
          {Array.from({ length: 12 }).map((_, row) => (
            <div key={row} className="flex justify-between mb-2 last:mb-0">
              {Array(4).fill().map((_, col) => {
                const seatIndex = row * 4 + col;
                return <button 
                  key={col} 
                  className={`w-10 h-10 border ${seats[seatIndex] ? 'bg-green-500 text-white' : 'bg-white'} ${seatIndex >= 44 ? 'col-span-2' : ''}`} 
                  onClick={() => toggleSeat(seatIndex)}
                  disabled={seats[seatIndex]}
                >
                  {`${String.fromCharCode(65 + row)}${col + 1}`}
                </button>
              })}
            </div>
          ))}
        </div>
        <p className="mt-2">Selected Seats: {formData.selectedSeats.map(seat => ` ${String.fromCharCode(65 + Math.floor(seat / 4))}${seat % 4 + 1}`).join(', ')}</p>
        <Button onClick={handleNext} className="mt-4">Next</Button>
      </div>
    );
  };

  const Step4 = () => (
    <div>
      <Button onClick={handleBack}>Back</Button>
      <div className="mt-4">
        <h2>Summary</h2>
        <p>Date: {format(formData.date, 'PP')}</p>
        <p>Bus: {formData.selectedBus?.company}</p>
        <p>Seats: {formData.selectedSeats.length}</p>
        <p>Total Cost: ${formData.selectedBus?.price * formData.selectedSeats.length}</p>
        <p>Booking Fee: 5%</p>
        <p>VAT: 10%</p>
        <Input placeholder="Name" onChange={e => setFormData({...formData, user: {...formData.user, name: e.target.value}})} />
        <Input placeholder="Phone" type="tel" onChange={e => setFormData({...formData, user: {...formData.user, phone: e.target.value}})} />
        <Input placeholder="Email" type="email" onChange={e => setFormData({...formData, user: {...formData.user, email: e.target.value}})} />
        <Checkbox>Agree to terms</Checkbox>
        <Button onClick={() => setStep(5)}>Confirm Booking</Button>
      </div>
    </div>
  );

  const Step5 = () => (
    <div>
      <h1 className="text-2xl">Thank You, {formData.user.name}!</h1>
      <div className="flex">
        <div className="w-1/2">
          <h2>Billing Details</h2>
          <p>PNR: {Math.random().toString(36).substring(7)}</p>
          {/* Add more user info */}
        </div>
        <div className="w-1/2">
          <h2>Journey Details</h2>
          <p>Date: {format(formData.date, 'PP')}</p>
          <p>Time: {formData.selectedBus?.time}</p>
          <p>Seats: {formData.selectedSeats.map(seat => ` ${String.fromCharCode(65 + Math.floor(seat / 4))}${seat % 4 + 1}`).join(', ')}</p>
          <p>Route: {formData.selectedBus?.route}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      {step === 1 && <Step1 />}
      {step === 2 && <Step2 />}
      {step === 3 && <Step3 />}
      {step === 4 && <Step4 />}
      {step === 5 && <Step5 />}
    </div>
  );
}

export default App;