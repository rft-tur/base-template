import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
//commented this line, as entire project fails to load
//import { DatePicker } from "@/components/ui/date-picker";

const destinations = ["New York", "Los Angeles", "Chicago", "Houston"];
const buses = [
  { id: 1, company: "Express Bus", route: "New York - Los Angeles", time: "09:00 AM", price: 100 },
  { id: 2, company: "Luxury Travel", route: "Chicago - Houston", time: "10:30 AM", price: 120 },
];

const BusLayout = ({ onSeatSelect, selectedSeats, bookedSeats }) => {
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];
  return (
    <div className="border-2 border-gray-300 p-4 mb-4">
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
              <Button
                key={seatLabel}
                onClick={() => onSeatSelect(seatLabel)}
                disabled={isBooked}
                className={`w-10 h-10 ${
                  isSelected ? "bg-green-500 text-white" : isBooked ? "bg-gray-200 text-gray-400" : ""
                }`}
              >
                {seatLabel}
              </Button>
            );
          })}
        </div>
      ))}
      <div className="flex justify-between">
        {[1, 2, 3, 4, 5].map((col) => (
          <Button
            key={`L${col}`}
            onClick={() => onSeatSelect(`L${col}`)}
            disabled={bookedSeats.includes(`L${col}`)}
            className={`w-10 h-10 ${
              selectedSeats.includes(`L${col}`)
                ? "bg-green-500 text-white"
                : bookedSeats.includes(`L${col}`)
                ? "bg-gray-200 text-gray-400"
                : ""
            }`}
          >
            {`L${col}`}
          </Button>
        ))}
      </div>
    </div>
  );
};

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
          <Card>
            <CardHeader>
              <CardTitle>Step 1: Select Journey Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={from} onChange={(e) => setFrom(e.target.value)} className="mb-4">
                <option value="">Select From</option>
                {destinations.map((dest) => (
                  <option key={dest} value={dest}>
                    {dest}
                  </option>
                ))}
              </Select>
              <Select value={to} onChange={(e) => setTo(e.target.value)} className="mb-4">
                <option value="">Select To</option>
                {destinations.map((dest) => (
                  <option key={dest} value={dest}>
                    {dest}
                  </option>
                ))}
              </Select>
              <DatePicker selected={date} onChange={(date) => setDate(date)} className="mb-4" />
              <Button onClick={() => setStep(2)}>Next</Button>
            </CardContent>
          </Card>
        );
      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Step 2: Select Bus</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                From: {from}, To: {to}, Date: {date?.toDateString()}
              </div>
              {buses.map((bus) => (
                <Card key={bus.id} className="mb-4 cursor-pointer" onClick={() => {
                  setSelectedBus(bus);
                  setStep(3);
                }}>
                  <CardContent className="flex justify-between items-center">
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
      case 3:
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
        );
      case 4:
        const subtotal = selectedBus.price * selectedSeats.length;
        const bookingFee = subtotal * 0.05;
        const vat = subtotal * 0.1;
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
                <div>Booking Fee (5%): ${bookingFee}</div>
                <div>VAT (10%): ${vat}</div>
                <div>Total: ${total}</div>
              </div>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="mb-2" />
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" className="mb-2" />
              <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="mb-2" />
              <Checkbox checked={agreeTerms} onCheckedChange={setAgreeTerms} label="I agree to the terms" className="mb-4" />
              <Button onClick={() => setStep(3)} className="mr-2">Back</Button>
              <Button onClick={handleSubmit} disabled={!agreeTerms}>Confirm Booking</Button>
            </CardContent>
          </Card>
        );
      case 5:
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