import React, { useState } from 'react';
import { Button } from "@/components/ui/button";

const Seat = ({ seatId, onClick, selected }) => {
  const style = selected ? "bg-green-500 text-white" : "bg-white hover:bg-gray-100";
  return (
    <Button variant="outline" className={`m-1 w-10 h-10 ${style}`} onClick={() => onClick(seatId)}>
      {seatId}
    </Button>
  );
};

export default function App() {
  const [selectedSeats, setSelectedSeats] = useState([]);

  const rows = 'ABCDEFGHIJKLMNOPQRSTU';
  const seatMap = [];
  for (let i = 0; i < 11; i++) {
    if (i === 10) {
      // Last row has 5 seats
      for (let j = 1; j <= 5; j++) seatMap.push(rows[i] + j);
    } else {
      for (let j = 1; j <= 4; j++) {
        if (j === 3) continue; // Skip for aisle
        seatMap.push(rows[i] + j);
      }
    }
  }

  const toggleSeat = (seat) => {
    setSelectedSeats(prev => 
      prev.includes(seat) ? prev.filter(s => s !== seat) : [...prev, seat]
    );
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-xl font-bold mb-4">Book your seat</h1>
      <div className="border-2 border-gray-300 p-4 rounded-lg relative">
        <div className="absolute top-2 right-2 text-sm">Driver</div>
        <div className="absolute top-2 left-2 text-sm">Door</div>
        <div className="grid grid-cols-4 gap-x-4 gap-y-2">
          {seatMap.map(seat => (
            <Seat 
              key={seat} 
              seatId={seat} 
              onClick={toggleSeat} 
              selected={selectedSeats.includes(seat)} 
            />
          ))}
        </div>
      </div>
      <div className="mt-4">
        <h2 className="font-semibold">Selected Seats:</h2>
        <p>{selectedSeats.join(', ') || 'No seats selected'}</p>
      </div>
    </div>
  );
}