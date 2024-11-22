import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ROWS = 11;
const SEATS_PER_ROW = 4;
const LAST_ROW_SEATS = 5;
const TOTAL_SEATS = (ROWS - 1) * SEATS_PER_ROW + LAST_ROW_SEATS;

const SeatButton = ({ label, isSelected, onClick }) => (
  <Button
    className={`w-12 h-12 m-1 ${
      isSelected ? "bg-green-500 text-white" : "bg-gray-200 text-black"
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
        rowSeats.push(
          <SeatButton
            key={seatLabel}
            label={seatLabel}
            isSelected={selectedSeats.includes(seatLabel)}
            onClick={() => onSeatClick(seatLabel)}
          />
        );
        if (seat === 2 && row !== ROWS - 1) {
          rowSeats.push(<div key={`space-${row}`} className="w-8" />);
        }
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
    <Card className="w-full max-w-3xl mx-auto my-4">
      <CardHeader className="flex justify-between items-center">
        <div>Door</div>
        <div>Driver</div>
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
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Book your seat</h1>
      <BusLayout selectedSeats={selectedSeats} onSeatClick={handleSeatClick} />
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Selected Seats</CardTitle>
        </CardHeader>
        <CardContent>
          {selectedSeats.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {selectedSeats.map((seat) => (
                <span
                  key={seat}
                  className="bg-green-500 text-white px-2 py-1 rounded"
                >
                  {seat}
                </span>
              ))}
            </div>
          ) : (
            <p>No seats selected</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}