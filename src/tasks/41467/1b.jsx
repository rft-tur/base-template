import React, { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast, ToastProvider } from "@/components/ui/toast";

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
  const [disabledDates, setDisabledDates] = useState([]);

  useEffect(() => {
    const generateDisabledDates = () => {
      const dates = [];
      const currentDate = new Date();
      const endDate = new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), currentDate.getDate());

      while (currentDate <= endDate) {
        if (
          isFirstMonday(currentDate) ||
          isLastFriday(currentDate) ||
          isPastDate(currentDate) ||
          isTooSoon(currentDate)
        ) {
          dates.push(new Date(currentDate));
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
      setDisabledDates(dates);
    };

    generateDisabledDates();
  }, []);

  const handleSelect = (date) => {
    if (selectedDates.some((d) => d.toDateString() === date.toDateString())) {
      setSelectedDates(selectedDates.filter((d) => d.toDateString() !== date.toDateString()));
    } else {
      const newSelectedDates = [...selectedDates, date].sort((a, b) => a - b);
      const isConsecutiveWeekend =
        newSelectedDates.length >= 2 &&
        isWeekend(newSelectedDates[newSelectedDates.length - 1]) &&
        isWeekend(newSelectedDates[newSelectedDates.length - 2]) &&
        Math.abs(newSelectedDates[newSelectedDates.length - 1] - newSelectedDates[newSelectedDates.length - 2]) ===
          86400000;

      if (isConsecutiveWeekend) {
        toast({
          title: "Invalid Selection",
          description: "You cannot book consecutive Saturday and Sunday together.",
          variant: "destructive",
        });
      } else {
        setSelectedDates(newSelectedDates);
      }
    }
  };

  const handleBooking = () => {
    if (selectedDates.length > 0) {
      toast({
        title: "Booking Successful",
        description: `You have booked ${selectedDates.length} date(s).`,
        variant: "success",
      });
      setSelectedDates([]);
    } else {
      toast({
        title: "No Dates Selected",
        description: "Please select at least one date to book.",
        variant: "destructive",
      });
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
    <ToastProvider>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <EventBookingCalendar />
      </div>
    </ToastProvider>
  );
}