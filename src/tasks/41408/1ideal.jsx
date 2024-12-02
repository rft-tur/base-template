import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const destinations = ["New York", "Los Angeles", "Chicago", "Houston"];
const buses = [
  { id: 1, company: "Express Bus", route: "New York - Los Angeles", time: "09:00 AM", price: 100 },
  { id: 2, company: "Luxury Travel", route: "Chicago - Houston", time: "10:30 AM", price: 120 },
];

const BusLayout = ({ onSeatSelect, selectedSeats, bookedSeats }) => {
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
  return (
    <div className="border-2 border-gray-300 p-4 mb-4 w-full md:w-96">
      <div className="flex justify-between mb-2">
        <span>Door</span>
        <span>Driver</span>
      </div>
      {rows.map((row, rowIndex) => (
        <div key={row} className="flex justify-between mb-2">
          {[1, 2, 3, 4].map((col) => {
            const seatLabel = `${row}${col}`;
            const isBooked = bookedSeats.includes(seatLabel);
            const isSelected = selectedSeats.includes(seatLabel);
            return (
              <>
                {col == 3 && (<div className="w-10 h-10"></div>)}
                <Button
                  key={seatLabel}
                  onClick={() => onSeatSelect(seatLabel)}
                  disabled={isBooked}
                  className={`w-10 h-10 ${isSelected ? "bg-green-500 text-white" : isBooked ? "bg-gray-200 text-gray-400" : ""
                    }`}
                >
                  {seatLabel}
                </Button>
              </>
            );
          })}
        </div>
      ))}
      <div className="flex justify-between">
        {[1, 2, 3, 4, 5].map((col) => (
          <Button
            key={`K${col}`}
            onClick={() => onSeatSelect(`K${col}`)}
            disabled={bookedSeats.includes(`K${col}`)}
            className={`w-10 h-10 ${selectedSeats.includes(`L${col}`)
              ? "bg-green-500 text-white"
              : bookedSeats.includes(`L${col}`)
                ? "bg-gray-200 text-gray-400"
                : ""
              }`}
          >
            {`K${col}`}
          </Button>
        ))}
      </div>
    </div>
  );
};

const RouteSelectionCard = ({ from, setFrom, to, setTo, date, setDate, setStep }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 1: Select Journey Details</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Select value={from} onValueChange={setFrom}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select From" />
          </SelectTrigger>
          <SelectContent>
            {destinations.map((dest) => (
              <SelectItem key={dest} value={dest}>
                {dest}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={to} onValueChange={setTo}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select To" />
          </SelectTrigger>
          <SelectContent>
            {destinations.map((dest) => (
              <SelectItem key={dest} value={dest}>
                {dest}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input type="date" value={date ? date.toISOString().slice(0, 10) : undefined} onChange={(e) => setDate(new Date(e.target.value))} />
        <Button onClick={() => setStep(2)}>Next</Button>
      </CardContent>
    </Card>
  );
}
const BusSelectionCard = ({ from, to, date, setSelectedBus, setStep }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 2: Select Bus</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          From: {from}, To: {to}, Date: {date.toDateString()}
        </div>
        {buses.map((bus) => (
          <Card key={bus.id} className="mb-4 cursor-pointer" onClick={() => {
            setSelectedBus(bus);
            setStep(3);
          }}>
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <div>{bus.company}</div>
                <div>{bus.route}</div>
                <div>{bus.time}</div>
              </div>
              <div>${bus.price}</div>
            </CardContent>
          </Card>
        ))}
        <Button onClick={() => setStep(1)}>Back</Button>
      </CardContent>
    </Card>
  );
}

const SeatSelectionCard = ({ selectedBus, selectedSeats, handleSeatSelect, bookedSeats, setStep }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 3: Select Seats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          Bus: {selectedBus.company}, Route: {selectedBus.route}, Time: {selectedBus.time}
        </div>
        <BusLayout
          onSeatSelect={handleSeatSelect}
          selectedSeats={selectedSeats}
          bookedSeats={bookedSeats}
        />
        <div className="mb-4">Selected Seats: {selectedSeats.join(", ")}</div>
        <Button onClick={() => setStep(2)} className="mr-2">Back</Button>
        <Button onClick={() => setStep(4)}>Next</Button>
      </CardContent>
    </Card>
  )
}

const CheckoutCard = ({ selectedBus, date, selectedSeats, name, setName, phone, setPhone, email, setEmail, agreeTerms, setAgreeTerms, handleSubmit, setStep }) => {
  const subtotal = selectedBus.price * selectedSeats.length;
  const bookingFee = subtotal * 0.05;
  const vat = (subtotal + bookingFee) * 0.1;
  const total = subtotal + bookingFee + vat;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 4: Checkout</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          Date: {date?.toDateString()}, Bus: {selectedBus.company}, Seats: {selectedSeats.join(", ")}
        </div>
        <div className="mb-4">
          <div>Subtotal: ${subtotal}</div>
          <div>Booking Fee (5%): ${bookingFee.toFixed(2)}</div>
          <div>VAT (10%): ${vat.toFixed(2)}</div>
          <div>Total: ${total.toFixed(2)}</div>
        </div>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="mb-2" />
        <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" className="mb-2" />
        <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="mb-2" />
        <div>
          <Checkbox checked={agreeTerms} onCheckedChange={setAgreeTerms} id="terms" className="mb-4 me-2" />
          <label htmlFor="terms">
            I agree to the terms
          </label>
        </div>
        <Button onClick={() => setStep(3)} className="mr-2">Back</Button>
        <Button onClick={handleSubmit} disabled={!agreeTerms}>Confirm Booking</Button>
      </CardContent>
    </Card>
  );
}

const ThankYouCard = ({ name, phone, email, pnr, date, selectedBus, selectedSeats }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Thank you, {name}!</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col sm:flex-row">
        <div className="w-full sm:w-1/2 mb-4 sm:mb-0">
          <h3 className="font-bold mb-2">Order Details</h3>
          <div>Name: {name}</div>
          <div>Phone: {phone}</div>
          <div>Email: {email}</div>
          <div>PNR: {pnr}</div>
        </div>
        <div className="w-full sm:w-1/2">
          <h3 className="font-bold mb-2">Journey Details</h3>
          <div>Date: {date?.toDateString()}</div>
          <div>Time: {selectedBus.time}</div>
          <div>Seats: {selectedSeats.join(", ")}</div>
          <div>Route: {selectedBus.route}</div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function App() {
  const [step, setStep] = useState(1);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState(null);
  const [selectedBus, setSelectedBus] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [pnr, setPnr] = useState("");

  const bookedSeats = ["A1", "B2", "C3", "D4"];

  const handleSeatSelect = (seat) => {
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  };

  const generatePNR = () => {
    return Math.random().toString(36).substr(2, 8).toUpperCase();
  };

  const handleSubmit = () => {
    const generatedPNR = generatePNR();
    setPnr(generatedPNR);
    setStep(5);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <RouteSelectionCard
            to={to}
            setTo={setTo}
            from={from}
            setFrom={setFrom}
            date={date}
            setDate={setDate}
            setStep={setStep} />
        );
      case 2:
        return (
          <BusSelectionCard
            to={to}
            from={from}
            date={date}
            setSelectedBus={setSelectedBus}
            setStep={setStep} />
        );
      case 3:
        return (
          <SeatSelectionCard
            selectedBus={selectedBus}
            selectedSeats={selectedSeats}
            handleSeatSelect={handleSeatSelect}
            bookedSeats={bookedSeats}
            setStep={setStep} />
        );
      case 4:
        return (
          <CheckoutCard
            selectedBus={selectedBus}
            date={date}
            selectedSeats={selectedSeats}
            name={name}
            setName={setName}
            phone={phone}
            setPhone={setPhone}
            email={email}
            setEmail={setEmail}
            agreeTerms={agreeTerms}
            setAgreeTerms={setAgreeTerms}
            handleSubmit={handleSubmit}
            setStep={setStep}
          />
        )
      case 5:
        return (
          <ThankYouCard
            name={name}
            phone={phone}
            email={email}
            pnr={pnr}
            date={date}
            selectedBus={selectedBus}
            selectedSeats={selectedSeats} />
        )
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Bus Ticket Booking</h1>
      {renderStep()}
    </div>
  );
}