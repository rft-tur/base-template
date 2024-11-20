import React, { useState } from "react";
import { Button } from "@/components/ui/button";

const ROWS = 11;
const SEATS_PER_ROW = 4;
const LAST_ROW_SEATS = 5;

export default function App() {
  const [selectedSeats, setSelectedSeats] = useState([]);

  const toggleSeat = (seat) => {
    setSelectedSeats((prev) =>
      prev.includes(seat)
        ? prev.filter((s) => s !== seat)
        : [...prev, seat]
    );
  };

  const renderSeat = (row, col) => {
    const seatLabel = `${String.fromCharCode(65 + row)}${col + 1}`;
    const isSelected = selectedSeats.includes(seatLabel);

    return (
      <Button
        key={seatLabel}
        className={`w-12 h-12 m-1 ${isSelected ? "bg-green-500 text-white" : "bg-gray-200 text-black"
          }`}
        onClick={() => toggleSeat(seatLabel)}
      >
        {seatLabel}
      </Button>
    );
  };

  const renderRow = (row) => {
    const isLastRow = row === ROWS - 1;
    const seatsInRow = isLastRow ? LAST_ROW_SEATS : SEATS_PER_ROW;

    return (
      <div key={row} className="flex justify-center space-x-4">
        {[...Array(seatsInRow)].map((_, col) => {
          if (col === 2 && !isLastRow) {
            return (
              <>
                <div key="aisle" className="w-12" />
                {renderSeat(row, col)}
                
              </>);
          }
          return renderSeat(row, col);
        })}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Book your seat</h1>

      <div className="border-2 border-gray-300 p-4 mb-4 relative">
        <div className="absolute top-2 left-2 text-sm">Door</div>
        <div className="absolute top-2 right-2 text-sm">Drive</div>

        <div className="mt-8">
          {[...Array(ROWS)].map((_, row) => renderRow(row))}
        </div>
      </div>

      <div className="mt-4">
        <h2 className="text-lg font-semibold mb-2">Selected Seats:</h2>
        {selectedSeats.length > 0 ? (
          <ul className="list-disc list-inside">
            {selectedSeats.join(', ')}
          </ul>
        ) : (
          <p>No seats selected</p>
        )}
      </div>
    </div>
  );
}