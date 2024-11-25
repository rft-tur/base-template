import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

const TimeSlot = ({ time, isSelected, onClick }) => (
  <Button
    className={`w-full mb-2 ${isSelected ? "bg-blue-500" : "bg-gray-200"}`}
    onClick={onClick}
  >
    {time}
  </Button>
);

const AppointmentBooking = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);

  const generateTimeSlots = (date) => {
    const day = date.getDay();
    const isWednesdayOrFriday = day === 3 || day === 5;
    const startHour = isWednesdayOrFriday ? 10 : 15;
    const endHour = isWednesdayOrFriday ? 12 : 17;
    const slots = [];

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        slots.push(time);
      }
    }

    return slots;
  };

  useEffect(() => {
    if (selectedDate) {
      setTimeSlots(generateTimeSlots(selectedDate));
    }
  }, [selectedDate]);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const isDateDisabled = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tenDaysFromNow = new Date(today);
    tenDaysFromNow.setDate(today.getDate() + 10);

    return (
      date < today ||
      date > tenDaysFromNow ||
      date.getDay() === 0 ||
      date.getDay() === 6
    );
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Book Appointment</CardTitle>
      </CardHeader>
      <CardContent>
        {!selectedDate && (
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={isDateDisabled}
            className="rounded-md border"
          />
        )}
        {selectedDate && !selectedTime && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Select Time Slot</h3>
            <div className="grid grid-cols-2 gap-2">
              {timeSlots.map((time) => (
                <TimeSlot
                  key={time}
                  time={time}
                  isSelected={time === selectedTime}
                  onClick={() => handleTimeSelect(time)}
                />
              ))}
            </div>
          </div>
        )}
        {selectedDate && selectedTime && (
          <div className="mt-4">
            <p className="text-lg font-semibold">
              You have selected: {selectedDate.toDateString()} at {selectedTime}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <AppointmentBooking />
    </div>
  );
}