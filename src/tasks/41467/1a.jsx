import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
//import { DatePicker } from "@/components/ui/date-picker";
import { Carousel } from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const rooms = [
  {
    name: "Standard Room",
    rate: 100,
    amenities: ["Free Wi-Fi", "TV", "Air Conditioning"],
    photos: ["standard1.jpg", "standard2.jpg", "standard3.jpg"],
  },
  {
    name: "Deluxe Room",
    rate: 150,
    amenities: ["Free Wi-Fi", "TV", "Air Conditioning", "Mini Bar"],
    photos: ["deluxe1.jpg", "deluxe2.jpg", "deluxe3.jpg"],
  },
  {
    name: "Suite",
    rate: 250,
    amenities: ["Free Wi-Fi", "TV", "Air Conditioning", "Mini Bar", "Jacuzzi"],
    photos: ["suite1.jpg", "suite2.jpg", "suite3.jpg"],
  },
];

export default function App() {
  const [step, setStep] = useState(1);
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [airportTransfer, setAirportTransfer] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [userDetails, setUserDetails] = useState({
    name: "",
    phone: "",
    email: "",
    acceptTerms: false,
  });

  const calculateTotalCost = () => {
    if (!selectedRoom || !dateRange.start || !dateRange.end) return 0;
    const nights = Math.ceil(
      (dateRange.end - dateRange.start) / (1000 * 60 * 60 * 24)
    );
    let total = selectedRoom.rate * nights;
    if (airportTransfer) total += 120;
    total += total * 0.05; // Service charge
    total += total * 0.1; // SD Duty
    return total;
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <CardContent>
            <DatePicker
              onChange={(range) => setDateRange(range)}
              minDate={new Date()}
              maxDate={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
            />
            <Checkbox
              checked={airportTransfer}
              onCheckedChange={setAirportTransfer}
              label="Airport Transfer"
            />
            <Button onClick={() => setStep(2)}>Next</Button>
          </CardContent>
        );
      case 2:
        return (
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {rooms.map((room) => (
                <Card
                  key={room.name}
                  className={`${
                    selectedRoom === room ? "border-blue-500" : ""
                  }`}
                  onClick={() => setSelectedRoom(room)}
                >
                  <CardHeader>
                    <CardTitle>{room.name}</CardTitle>
                    <p className="font-bold">${room.rate}/night</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5">
                      {room.amenities.map((amenity) => (
                        <li key={amenity}>{amenity}</li>
                      ))}
                    </ul>
                    <Carousel>
                      {room.photos.map((photo) => (
                        <Dialog key={photo}>
                          <DialogTrigger>
                            <img src={photo} alt={room.name} />
                          </DialogTrigger>
                          <DialogContent>
                            <img src={photo} alt={room.name} className="w-full" />
                          </DialogContent>
                        </Dialog>
                      ))}
                    </Carousel>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-4 flex justify-between">
              <Button onClick={() => setStep(1)}>Back</Button>
              <Button onClick={() => setStep(3)} disabled={!selectedRoom}>
                Next
              </Button>
            </div>
          </CardContent>
        );
      case 3:
        const totalCost = calculateTotalCost();
        return (
          <CardContent>
            <h3>Summary</h3>
            <p>Dates: {dateRange.start?.toDateString()} - {dateRange.end?.toDateString()}</p>
            <p>Room: {selectedRoom?.name}</p>
            <p>Room Cost: ${selectedRoom?.rate * Math.ceil((dateRange.end - dateRange.start) / (1000 * 60 * 60 * 24))}</p>
            {airportTransfer && <p>Airport Transfer: $120</p>}
            <p>Service Charge (5%): ${totalCost * 0.05}</p>
            <p>SD Duty (10%): ${totalCost * 0.1}</p>
            <p className="font-bold">Total Cost: ${totalCost}</p>
            <div className="mt-4 flex justify-between">
              <Button onClick={() => setStep(2)}>Back</Button>
              <Button onClick={() => setStep(4)}>Proceed to Checkout</Button>
            </div>
          </CardContent>
        );
      case 4:
        return (
          <CardContent>
            <Input
              placeholder="Name"
              value={userDetails.name}
              onChange={(e) =>
                setUserDetails({ ...userDetails, name: e.target.value })
              }
            />
            <Input
              placeholder="Phone"
              value={userDetails.phone}
              onChange={(e) =>
                setUserDetails({ ...userDetails, phone: e.target.value })
              }
            />
            <Input
              placeholder="Email"
              value={userDetails.email}
              onChange={(e) =>
                setUserDetails({ ...userDetails, email: e.target.value })
              }
            />
            <Checkbox
              checked={userDetails.acceptTerms}
              onCheckedChange={(checked) =>
                setUserDetails({ ...userDetails, acceptTerms: checked })
              }
              label="Accept Terms"
            />
            <p>Advance Payment (20%): ${calculateTotalCost() * 0.2}</p>
            <div className="mt-4 flex justify-between">
              <Button onClick={() => setStep(3)}>Back</Button>
              <Button
                onClick={() => setStep(5)}
                disabled={
                  !userDetails.name ||
                  !userDetails.phone ||
                  !userDetails.email ||
                  !userDetails.acceptTerms
                }
              >
                Confirm Reservation
              </Button>
            </div>
          </CardContent>
        );
      case 5:
        const advancePayment = calculateTotalCost() * 0.2;
        const remainingPayment = calculateTotalCost() - advancePayment;
        return (
          <CardContent>
            <h2 className="text-2xl font-bold mb-4">Thank you, {userDetails.name}!</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h3 className="font-bold">Booking Details</h3>
                <p>Dates: {dateRange.start?.toDateString()} - {dateRange.end?.toDateString()}</p>
                <p>Room: {selectedRoom?.name}</p>
                <p>Total Cost: ${calculateTotalCost()}</p>
              </div>
              <div>
                <h3 className="font-bold">Billing Details</h3>
                <p>Name: {userDetails.name}</p>
                <p>Phone: {userDetails.phone}</p>
                <p>Email: {userDetails.email}</p>
                <p>Advance Payment: ${advancePayment}</p>
                <p>Remaining Payment: ${remainingPayment}</p>
              </div>
            </div>
          </CardContent>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Hotel Reservation - Step {step}</CardTitle>
        </CardHeader>
        {renderStep()}
      </Card>
    </div>
  );
}