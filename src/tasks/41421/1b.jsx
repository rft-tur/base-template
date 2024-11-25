import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

const specialists = [
  { id: 1, name: "Alice", specialty: "Colorist", photo: "alice.jpg", rate: 50, availability: { "Monday": ["9:00", "10:00"], "Tuesday": [] } },
  // Add more specialists here
];

function SpecialistCard({ specialist, onClick }) {
  return (
    <Card onClick={() => onClick(specialist)} className="cursor-pointer m-2">
      <CardHeader>
        <img src={specialist.photo} alt={specialist.name} className="w-16 h-16 rounded-full" />
        <CardTitle>{specialist.name}</CardTitle>
        <p className="text-sm text-muted-foreground">{specialist.specialty}</p>
      </CardHeader>
    </Card>
  );
}

function Calendar({ availability, onSelectDate }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const days = Object.keys(availability);

  return (
    <div className="grid grid-cols-7 gap-2">
      {days.map(day => (
        <Button 
          key={day} 
          disabled={availability[day].length === 0} 
          onClick={() => {
            setSelectedDate(day);
            onSelectDate(day);
          }}
        >
          {day}
        </Button>
      ))}
    </div>
  );
}

function TimeSlotSelector({ times, onSelectTime }) {
  const [selectedTimes, setSelectedTimes] = useState([]);

  return (
    <div className="flex flex-wrap">
      {times.map(time => (
        <Button 
          key={time} 
          variant={selectedTimes.includes(time) ? 'default' : 'outline'}
          onClick={() => {
            setSelectedTimes(prev => 
              prev.includes(time) ? prev.filter(t => t !== time) : [...prev, time]
            );
            onSelectTime(time);
          }}
          className="m-1"
        >
          {time}
        </Button>
      ))}
    </div>
  );
}

function App() {
  const [step, setStep] = useState(1);
  const [selectedSpecialist, setSelectedSpecialist] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '', email: '' });

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const totalCost = selectedTimes.length * (selectedSpecialist ? selectedSpecialist.rate : 0);
  const serviceCharge = totalCost * 0.05;
  const vat = (totalCost + serviceCharge) * 0.15;
  const grandTotal = (totalCost + serviceCharge + vat).toFixed(2);

  return (
    <div className="container mx-auto p-4">
      {step > 1 && <div className="mb-4">Selected: {selectedSpecialist.name}, {selectedDate}, {selectedTimes.join(', ')}</div>}
      {step === 1 && (
        <>
          <h2 className="text-lg font-bold mb-4">Choose Your Specialist</h2>
          <div className="flex flex-wrap">
            {specialists.map(s => <SpecialistCard key={s.id} specialist={s} onClick={setSelectedSpecialist} />)}
          </div>
          <Button onClick={nextStep} disabled={!selectedSpecialist}>Next</Button>
        </>
      )}
      {step === 2 && (
        <>
          <Calendar availability={selectedSpecialist.availability} onSelectDate={setSelectedDate} />
          <Button onClick={nextStep} disabled={!selectedDate}>Next</Button>
          <Button onClick={prevStep}>Back</Button>
        </>
      )}
      {step === 3 && (
        <>
          <TimeSlotSelector times={selectedSpecialist.availability[selectedDate]} onSelectTime={setSelectedTimes} />
          <Button onClick={nextStep}>Next</Button>
          <Button onClick={prevStep}>Back</Button>
        </>
      )}
      {step === 4 && (
        <>
          <div>Summary: {selectedSpecialist.name}, {selectedDate}, {selectedTimes.join(', ')}, Total: ${grandTotal}</div>
          <Button onClick={nextStep}>Go to Checkout</Button>
          <Button onClick={prevStep}>Back</Button>
        </>
      )}
      {step === 5 && (
        <>
          <input value={customerInfo.name} onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})} placeholder="Name" />
          <input value={customerInfo.phone} onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})} placeholder="Phone" />
          <input value={customerInfo.email} onChange={e => setCustomerInfo({...customerInfo, email: e.target.value})} placeholder="Email" />
          <Checkbox onCheckedChange={checked => setCustomerInfo({...customerInfo, terms: checked})}>Accept Terms</Checkbox>
          <Button onClick={nextStep} disabled={!customerInfo.terms}>Book Appointment</Button>
          <Button onClick={prevStep}>Back</Button>
        </>
      )}
      {step === 6 && (
        <>
          <h1>Thank you, {customerInfo.name}</h1>
          <p>See you on {new Date(selectedDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long' })} at {selectedTimes[0]} </p>
          <div className="flex justify-between">
            <div>Booking Details</div>
            <div>Billing Details</div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;