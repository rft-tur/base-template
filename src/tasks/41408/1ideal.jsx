import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ROWS = 11;
const SEATS_PER_ROW = 4;
const LAST_ROW_SEATS = 5;
const TOTAL_SEATS = (ROWS - 1) * SEATS_PER_ROW + LAST_ROW_SEATS;

const SeatButton = ({ label, isSelected, onClick }) => (
  <Button
    className={`w-12 h-12 m-1 ${isSelected ? "bg-green-500 text-white" : "bg-gray-200 text-black"
      }`}
    onClick={onClick}
  >
    {label}
  </Button>
);

const BusLayout = ({ selectedSeats, onSeatClick }) => {
  const renderSeats = () => {
    let seats = [];
    for (let row = 0; row < ROWS; row++) {
      const rowLabel = String.fromCharCode(65 + row);
      const seatsInRow = row === ROWS - 1 ? LAST_ROW_SEATS : SEATS_PER_ROW;
      let rowSeats = [];
      for (let seat = 1; seat <= seatsInRow; seat++) {
        const seatLabel = `${rowLabel}${seat}`;
        if (seat === 3 && row !== ROWS - 1) {
          rowSeats.push(<div key={`space-${row}`} className="w-12 m-1" />);
        }
        rowSeats.push(
          <SeatButton
            key={seatLabel}
            label={seatLabel}
            isSelected={selectedSeats.includes(seatLabel)}
            onClick={() => onSeatClick(seatLabel)}
          />
        );
      }
      seats.push(
        <div key={rowLabel} className="flex justify-center">
          {rowSeats}
        </div>
      );
    }
    return seats;
  };

  return (
    <Card className="w-full max-w-xs mx-auto my-4">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>Door</div>
          <div>Driver</div>
        </div>
      </CardHeader>
      <CardContent>{renderSeats()}</CardContent>
    </Card>
  );
};

export default function App() {
  const [selectedSeats, setSelectedSeats] = useState([]);

  const handleSeatClick = (seatLabel) => {
    setSelectedSeats((prevSelected) =>
      prevSelected.includes(seatLabel)
        ? prevSelected.filter((seat) => seat !== seatLabel)
        : [...prevSelected, seatLabel]
    );
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-center text-xl font-bold mb-4">Book your seat</h1>
      <BusLayout selectedSeats={selectedSeats} onSeatClick={handleSeatClick} />
      <div className="text-center mt-4">
        <h2 className="font-semibold">Selected Seats:</h2>
        <div>{selectedSeats.join(', ') || 'No seats selected'}</div>
      </div>
    </div>
  );
}