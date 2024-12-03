import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

const specialists = [
  {
    id: 1,
    name: "Alice Smith",
    specialty: "Hair Stylist",
    image: "https://placeholder.com/100",
    availability: {
      monday: ["09:00", "10:00", "11:00", "14:00", "15:00"],
      wednesday: ["09:00", "10:00", "11:00", "14:00", "15:00"],
      friday: ["09:00", "10:00", "11:00", "14:00", "15:00"],
    },
    rate: 50,
  },
  {
    id: 2,
    name: "Bob Johnson",
    specialty: "Colorist",
    image: "https://placeholder.com/100",
    availability: {
      tuesday: ["09:00", "10:00", "11:00", "14:00", "15:00"],
      thursday: ["09:00", "10:00", "11:00", "14:00", "15:00"],
      friday: ["09:00", "10:00", "11:00", "14:00", "15:00"],
    },
    rate: 60,
  },
];

const bookedSlots = {
  "2023-06-01": ["09:00", "10:00"],
  "2023-06-02": ["14:00", "15:00"],
};

function formatDate(date) {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatTime(time) {
  return new Date(`2000-01-01T${time}`).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
}

function Step1({ onSelectSpecialist }) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Select Specialist</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {specialists.map((specialist) => (
          <Card key={specialist.id}>
            <CardContent className="flex items-center p-4">
              <img
                src={specialist.image}
                alt={specialist.name}
                className="w-16 h-16 rounded-full mr-4"
              />
              <div>
                <h3 className="font-bold">{specialist.name}</h3>
                <p className="text-sm text-gray-500">{specialist.specialty}</p>
              </div>
              <Button
                className="ml-auto"
                onClick={() => onSelectSpecialist(specialist)}
              >
                Select
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Step2({ specialist, onSelectDate }) {
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    onSelectDate(date);
  };

  return (
    <div>
      <p>Specialist: {specialist.name}</p>
      <h2 className="text-xl font-bold mb-4">Select a Date</h2>
      <Card>
        <CardContent class="p4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={(date) =>
              date <= new Date() ||
              !specialist.availability[
              date.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase()
              ]
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}

function Step3({ specialist, date, onSelectSlots }) {
  const [selectedSlots, setSelectedSlots] = useState([]);

  const handleSlotSelect = (slot) => {
    if (selectedSlots.includes(slot)) {
      setSelectedSlots(selectedSlots.filter((s) => s !== slot));
    } else {
      setSelectedSlots([...selectedSlots, slot]);
    }
  };

  const availableSlots =
    specialist.availability[
    date.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase()
    ];

  return (
    <div>
      <p>Specialist: {specialist.name}</p>
      <p>Date: {formatDate(date)}</p>
      <h2 className="text-xl font-bold mb-4">Select Time Slots</h2>
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-3 gap-2">
            {availableSlots.map((slot) => (
              <Button
                key={slot}
                variant={selectedSlots.includes(slot) ? "default" : "outline"}
                disabled={bookedSlots[date.toISOString().split("T")[0]]?.includes(
                  slot
                )}
                onClick={() => handleSlotSelect(slot)}
              >
                {formatTime(slot)}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
      <Button
        className="mt-4"
        disabled={selectedSlots.length === 0}
        onClick={() => onSelectSlots(selectedSlots)}
      >
        Next
      </Button>
    </div>
  );
}

function Step4({ specialist, date, slots, onProceedToCheckout }) {
  const subtotal = specialist.rate * slots.length;
  const serviceCharge = subtotal * 0.05;
  const vat = subtotal * 0.15;
  const total = subtotal + serviceCharge + vat;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Order Summary</h2>
      <Card>
        <CardContent className="p-4">
          <div className="flex mb-4">
            <img
              src={specialist.image}
              alt={specialist.name}
              className="w-16 h-16 rounded-full mr-4"
            />
            <div>
              <h3 className="font-bold">{specialist.name}</h3>
              <p className="text-sm text-gray-500">{specialist.specialty}</p>
            </div>
          </div>
          <p>Date: {formatDate(date)}</p>
          <p>Time: {slots.map(formatTime).join(", ")}</p>
          <p>Subtotal: ${subtotal.toFixed(2)}</p>
          <p>Service Charge (5%): ${serviceCharge.toFixed(2)}</p>
          <p>VAT (15%): ${vat.toFixed(2)}</p>
          <p className="font-bold">Total: ${total.toFixed(2)}</p>
        </CardContent>
      </Card>
      <Button className="mt-4" onClick={onProceedToCheckout}>
        Go to Checkout
      </Button>
    </div>
  );
}

function Step5({ onBookAppointment }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Checkout</h2>
      <Card>
        <CardContent className="p-4">
          <Input
            className="mb-2"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            className="mb-2"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Input
            className="mb-2"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="flex items-center">
            <Checkbox
              id="terms"
              checked={acceptTerms}
              onCheckedChange={setAcceptTerms}
            />
            <label htmlFor="terms" className="ml-2">
              I accept the terms and conditions
            </label>
          </div>
        </CardContent>
      </Card>
      <Button
        className="mt-4"
        disabled={!name || !phone || !email || !acceptTerms}
        onClick={() => onBookAppointment({ name, phone, email })}
      >
        Book Appointment
      </Button>
    </div>
  );
}

function Step6({ booking, customer }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Thank you, {customer.name}!</h2>
      <p className="text-xl mb-4">
        See you on {formatDate(booking.date)} at{" "}
        {booking.slots.map(formatTime).join(", ")}
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Card className="flex-1">
          <CardContent>
            <h3 className="font-bold mb-2">Booking Details</h3>
            <p>Specialist: {booking.specialist.name}</p>
            <p>Date: {formatDate(booking.date)}</p>
            <p>Time: {booking.slots.map(formatTime).join(", ")}</p>
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardContent>
            <h3 className="font-bold mb-2">Customer Details</h3>
            <p>Name: {customer.name}</p>
            <p>Phone: {customer.phone}</p>
            <p>Email: {customer.email}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function App() {
  const [step, setStep] = useState(1);
  const [booking, setBooking] = useState({});
  const [customer, setCustomer] = useState({});

  const handleSelectSpecialist = (specialist) => {
    setBooking({ ...booking, specialist });
    setStep(2);
  };

  const handleSelectDate = (date) => {
    setBooking({ ...booking, date });
    setStep(3);
  };

  const handleSelectSlots = (slots) => {
    setBooking({ ...booking, slots });
    setStep(4);
  };

  const handleProceedToCheckout = () => {
    setStep(5);
  };

  const handleBookAppointment = (customerDetails) => {
    setCustomer(customerDetails);
    setStep(6);
  };

  return (
    <div className="container mx-auto p-4">
      {step > 1 && step < 6 && (
        <Button
          variant="outline"
          className="mb-4"
          onClick={() => setStep(Math.max(1, step - 1))}
        >
          Back
        </Button>
      )}
      {step === 1 && <Step1 onSelectSpecialist={handleSelectSpecialist} />}
      {step === 2 && (
        <Step2
          specialist={booking.specialist}
          onSelectDate={handleSelectDate}
        />
      )}
      {step === 3 && (
        <Step3
          specialist={booking.specialist}
          date={booking.date}
          onSelectSlots={handleSelectSlots}
        />
      )}
      {step === 4 && (
        <Step4
          specialist={booking.specialist}
          date={booking.date}
          slots={booking.slots}
          onProceedToCheckout={handleProceedToCheckout}
        />
      )}
      {step === 5 && <Step5 onBookAppointment={handleBookAppointment} />}
      {step === 6 && <Step6 booking={booking} customer={customer} />}
    </div>
  );
}