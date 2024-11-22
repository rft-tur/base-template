import React, { useState } from 'react';
import { Button } from "@/components/ui/button";

function Seat({ label, onClick, selected }) {
  return (
    <Button 
      variant={selected ? "secondary" : "default"} 
      className={`w-10 h-10 m-1 ${selected ? 'bg-green-500 text-white' : ''}`} 
      onClick={() => onClick(label)}
    >
      {label}
    </Button>
  );
}

function BusLayout() {
  const [selectedSeats, setSelectedSeats] = useState([]);

  const handleSeatClick = (seat) => {
    setSelectedSeats(prev => 
      prev.includes(seat) ? prev.filter(s => s !== seat) : [...prev, seat]
    );
  };

  const rows = 'ABCDE';
  const seats = [];
  for (let r = 0; r < rows.length; r++) {
    for (let c = 1; c <= (r === rows.length - 1 ? 5 : 4); c++) {
      if (r !== 2 || (c !== 2 && c !== 3)) { // Skip center passage
        seats.push(rows[r] + c);
      }
    }
  }

  return (
    <div className="flex flex-col items-center p-4">
      <div className="text-xl font-bold mb-4">Book your seat</div>
      <div className="border-2 border-gray-400 p-4 rounded-lg relative w-full max-w-lg">
        <div className="absolute top-2 right-2 text-sm">Driver</div>
        <div className="absolute top-2 left-2 text-sm">Door</div>
        <div className="grid grid-cols-4 gap-2">
          {seats.map(seat => (
            <Seat 
              key={seat} 
              label={seat} 
              onClick={handleSeatClick} 
              selected={selectedSeats.includes(seat)} 
            />
          ))}
        </div>
      </div>
      <div className="mt-4">
        <h2 className="font-semibold">Selected Seats:</h2>
        <div>{selectedSeats.join(', ') || 'No seats selected'}</div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <BusLayout />
    </div>
  );
}