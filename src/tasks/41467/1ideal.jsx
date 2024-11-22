import React, { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const isFirstMonday = (date) => {
  return date.getDay() === 1 && date.getDate() <= 7;
};

const isLastFriday = (date) => {
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return date.getDay() === 5 && lastDay.getDate() - date.getDate() < 7;
};

const isPastDate = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
};

const isTooSoon = (date) => {
  const twoDaysFromNow = new Date();
  twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);
  twoDaysFromNow.setHours(0, 0, 0, 0);
  return date < twoDaysFromNow;
};

const isWeekend = (date) => {
  return date.getDay() === 0 || date.getDay() === 6;
};

const EventBookingCalendar = () => {
  const [selectedDates, setSelectedDates] = useState([]);
  
  const disabledDates = (date) => {

    return isFirstMonday(date) ||
    isLastFriday(date) ||
    isPastDate(date) ||
    isTooSoon(date)

  }

  const handleSelect = (dates) => {
    if(dates.length==0) {
      setSelectedDates([]);
      return;
    }
    let date = dates[dates.length - 1];
    if (selectedDates.some((d) => d.toDateString() === date.toDateString())) {
      setSelectedDates(selectedDates.filter((d) => d.toDateString() !== date.toDateString()));
    } else {
      const newSelectedDates = [...selectedDates, date];

      const isConsecutiveWeekend =
        newSelectedDates.length >= 2 &&
        isWeekend(newSelectedDates[newSelectedDates.length - 1]) &&
        isWeekend(newSelectedDates[newSelectedDates.length - 2]) &&
        Math.abs(newSelectedDates[newSelectedDates.length - 1] - newSelectedDates[newSelectedDates.length - 2]) ===
        86400000;

      if (isConsecutiveWeekend) {
        alert("You cannot book consecutive Saturday and Sunday together.");
      } else {
        setSelectedDates(newSelectedDates);
      }
    }
  };

  const handleBooking = () => {
    if (selectedDates.length > 0) {
      alert(`You have booked ${selectedDates.length} date(s).`);
      setSelectedDates([]);
    } else {
      alert("Please select at least one date to book.");
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Event Booking Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="multiple"
          selected={selectedDates}
          onSelect={handleSelect}
          disabled={disabledDates}
          className="rounded-md border"
        />
        <div className="mt-4">
          <Button onClick={handleBooking} className="w-full">
            Book Selected Dates
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <EventBookingCalendar />
    </div>
  );
}