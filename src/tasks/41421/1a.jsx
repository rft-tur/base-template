import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

function App() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [step, setStep] = useState(1);

  const today = new Date();
  const minDate = new Date(today);
  minDate.setDate(minDate.getDate() + 1); // Start from tomorrow
  const maxDate = new Date(minDate);
  maxDate.setDate(maxDate.getDate() + 9); // Up to 10 days in advance

  const isWeekend = (date) => {
    const day = date.getDay();
    return day === 0 || day === 6; // 0 = Sunday, 6 = Saturday
  };

  const generateTimeSlots = (date) => {
    const slots = [];
    const startHour = date.getDay() === 3 || date.getDay() === 5 ? 10 : 15; // 3 = Wednesday, 5 = Friday
    const endHour = date.getDay() === 3 || date.getDay() === 5 ? 12 : 17;

    for (let hour = startHour; hour < endHour; hour++) {
      slots.push(`${hour}:00`);
      slots.push(`${hour}:30`);
    }
    return slots;
  };

  const handleDateSelect = (date) => {
    if (!isWeekend(date)) {
      setSelectedDate(date);
      setStep(2);
    }
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 sm:px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Book Your Appointment</CardTitle>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <div>
              <Calendar 
                mode="single" 
                selected={selectedDate} 
                onSelect={handleDateSelect} 
                minDate={minDate}
                maxDate={maxDate}
                disabledDates={(date) => isWeekend(date)}
              />
            </div>
          )}
          {step === 2 && (
            <div>
              <h2 className="text-lg mb-4">Select a Time on {format(selectedDate, 'PP')}</h2>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {generateTimeSlots(selectedDate).map(time => (
                  <Button 
                    key={time} 
                    variant={selectedTime === time ? "secondary" : "outline"}
                    onClick={() => handleTimeSelect(time)}
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </div>
          )}
          {selectedTime && (
            <p className="mt-4 text-center text-green-600">
              You have selected {format(selectedDate, 'PP')} at {selectedTime}.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default App;