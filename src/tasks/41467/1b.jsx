import React, { useState } from 'react';
import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from 'date-fns';
import { Carousel } from "@/components/ui/carousel";

const ROOMS = [
  { id: 1, name: 'Standard Room', price: 100, amenities: ['Wi-Fi', 'TV', 'AC'], images: ['/room1.jpg', '/room2.jpg'] },
  { id: 2, name: 'Deluxe Room', price: 150, amenities: ['Wi-Fi', 'TV', 'AC', 'Balcony'], images: ['/room3.jpg'] },
];

function App() {
  const [step, setStep] = useState(1);
  const [dates, setDates] = useState({ start: null, end: null });
  const [airportService, setAirportService] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '', email: '' });
  const [termsAccepted, setTermsAccepted] = useState(false);

  const today = new Date();
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + 30);

  const handleDateChange = (event) => {
    const { name, value } = event.target;
    setDates(prev => ({ ...prev, [name]: new Date(value) }));
  };

  const totalNights = dates.start && dates.end ? (dates.end - dates.start) / (1000 * 60 * 60 * 24) : 0;
  const totalCost = selectedRoom ? (selectedRoom.price * totalNights) + (airportService ? 120 : 0) : 0;
  const serviceCharge = totalCost * 0.05;
  const sdDuty = totalCost * 0.10;
  const advancePayment = totalCost * 0.20;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-lg">
        <CardContent>
          {step === 1 && (
            <Step1 
              dates={dates} 
              handleDateChange={handleDateChange} 
              setAirportService={setAirportService} 
              setStep={setStep} 
              today={today} 
              maxDate={maxDate}
            />
          )}
          {step === 2 && (
            <Step2 
              rooms={ROOMS} 
              selectedRoom={selectedRoom} 
              setSelectedRoom={setSelectedRoom} 
              setStep={setStep} 
              dates={dates} 
              airportService={airportService}
            />
          )}
          {step === 3 && (
            <Step3 
              selectedRoom={selectedRoom} 
              dates={dates} 
              airportService={airportService}
              totalCost={totalCost}
              serviceCharge={serviceCharge}
              sdDuty={sdDuty}
              setStep={setStep}
            />
          )}
          {step === 4 && (
            <Step4 
              customerInfo={customerInfo} 
              setCustomerInfo={setCustomerInfo} 
              termsAccepted={termsAccepted}
              setTermsAccepted={setTermsAccepted}
              setStep={setStep}
              advancePayment={advancePayment}
            />
          )}
          {step === 5 && (
            <Step5 
              selectedRoom={selectedRoom} 
              dates={dates} 
              airportService={airportService}
              customerInfo={customerInfo}
              totalCost={totalCost}
              advancePayment={advancePayment}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Step1({ dates, handleDateChange, setAirportService, setStep, today, maxDate }) {
  return (
    <>
      <CardTitle>Select Dates</CardTitle>
      <Input type="date" name="start" onChange={handleDateChange} min={format(today, 'yyyy-MM-dd')} max={format(maxDate, 'yyyy-MM-dd')} />
      <Input type="date" name="end" onChange={handleDateChange} min={format(dates.start || today, 'yyyy-MM-dd')} max={format(maxDate, 'yyyy-MM-dd')} />
      <Checkbox checked={airportService} onCheckedChange={setAirportService}>Airport Drop In/Out</Checkbox>
      <Button onClick={() => setStep(2)} disabled={!dates.start || !dates.end}>Next</Button>
    </>
  );
}

function Step2({ rooms, selectedRoom, setSelectedRoom, setStep, dates, airportService }) {
  return (
    <>
      <CardTitle>Choose Your Room</CardTitle>
      <p>Stay from {format(dates.start, 'PP')} to {format(dates.end, 'PP')}{airportService ? ' with Airport Service' : ''}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {rooms.map(room => (
          <RoomCard key={room.id} room={room} selected={selectedRoom === room} setSelectedRoom={setSelectedRoom} available={true} /> // Assume all rooms available for simplicity
        ))}
      </div>
      <Button onClick={() => setStep(3)}>Next</Button>
      <Button variant="secondary" onClick={() => setStep(1)}>Back</Button>
    </>
  );
}

function RoomCard({ room, selected, setSelectedRoom, available }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className={`${!available ? 'opacity-50 border-gray-300' : selected ? 'border-blue-500' : 'border'} cursor-pointer`} onClick={() => available && setSelectedRoom(room)}>
      <CardHeader>
        <CardTitle>{room.name}</CardTitle>
        <CardDescription>${room.price}/night</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="list-disc pl-5">
          {room.amenities.map((amenity, idx) => <li key={idx}>{amenity}</li>)}
        </ul>
        <Carousel images={room.images} onClick={() => setIsOpen(true)} />
        {isOpen && <div onClick={() => setIsOpen(false)}>Close Image</div>}
      </CardContent>
    </Card>
  );
}

function Step3({ selectedRoom, dates, airportService, totalCost, serviceCharge, sdDuty, setStep }) {
  return (
    <>
      <CardTitle>Summary</CardTitle>
      <p>Dates: {format(dates.start, 'PP')} - {format(dates.end, 'PP')}</p>
      <p>Room: {selectedRoom.name}</p>
      <p>Airport Service: {airportService ? 'Yes' : 'No'}</p>
      <p>Room Cost: ${totalCost - (airportService ? 120 : 0)}</p>
      <p>Airport Service: ${airportService ? '120' : '0'}</p>
      <p>Service Charge (5%): ${serviceCharge.toFixed(2)}</p>
      <p>SD Duty (10%): ${sdDuty.toFixed(2)}</p>
      <p><strong>Total Cost: ${(totalCost + serviceCharge + sdDuty).toFixed(2)}</strong></p>
      <Button onClick={() => setStep(4)}>Proceed to Checkout</Button>
      <Button variant="secondary" onClick={() => setStep(2)}>Back</Button>
    </>
  );
}

function Step4({ customerInfo, setCustomerInfo, termsAccepted, setTermsAccepted, setStep, advancePayment }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (termsAccepted) setStep(5);
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardTitle>Checkout</CardTitle>
      <Input placeholder="Name" value={customerInfo.name} onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})} required />
      <Input type="tel" placeholder="Phone" value={customerInfo.phone} onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})} required />
      <Input type="email" placeholder="Email" value={customerInfo.email} onChange={e => setCustomerInfo({...customerInfo, email: e.target.value})} required />
      <Checkbox checked={termsAccepted} onCheckedChange={setTermsAccepted}>I accept the terms and conditions</Checkbox>
      <p>Advance Payment: ${advancePayment.toFixed(2)}</p>
      <Button type="submit">Confirm Reservation</Button>
      <Button variant="secondary" onClick={() => setStep(3)}>Back</Button>
    </form>
  );
}

function Step5({ selectedRoom, dates, airportService, customerInfo, totalCost, advancePayment }) {
  return (
    <>
      <CardTitle>Thank You!</CardTitle>
      <div className="flex flex-col sm:flex-row justify-between">
        <div>
          <h3>Booking Details</h3>
          <p>{selectedRoom.name}</p>
          <p>{format(dates.start, 'PP')} - {format(dates.end, 'PP')}</p>
          {airportService && <p>Airport Service Included</p>}
        </div>
        <div>
          <h3>Billing Details</h3>
          <p>{customerInfo.name}</p>
          <p>{customerInfo.email}</p>
          <p>Advance Paid: ${advancePayment.toFixed(2)}</p>
          <p>Balance on Check-in: ${((totalCost + (totalCost * 0.15)) - advancePayment).toFixed(2)}</p>
        </div>
      </div>
    </>
  );
}

export default App;