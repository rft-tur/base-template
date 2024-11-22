import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const generateCalendar = (year, month) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const calendar = [];

  let dayCounter = 1;
  for (let week = 0; dayCounter <= daysInMonth; week++) {
    calendar[week] = [];
    for (let day = 0; day < 7 && dayCounter <= daysInMonth; day++) {
      if (week === 0 && day < firstDay.getDay()) {
        calendar[week][day] = null;
      } else {
        calendar[week][day] = dayCounter++;
      }
    }
  }

  return calendar;
};

const isFirstMonday = (year, month, day) => {
  return new Date(year, month, day).getDay() === 1 && day <= 7;
};

const isLastFriday = (year, month, day) => {
  const date = new Date(year, month, day);
  const lastDay = new Date(year, month + 1, 0);
  return date.getDay() === 5 && lastDay.getDate() - date.getDate() < 7;
};

const isWeekend = (dayOfWeek) => dayOfWeek === 0 || dayOfWeek === 6;

function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [calendar, setCalendar] = useState(generateCalendar(currentDate.getFullYear(), currentDate.getMonth()));

  useEffect(() => {
    setCalendar(generateCalendar(currentDate.getFullYear(), currentDate.getMonth()));
  }, [currentDate]);

  const handleDateSelect = (day) => {
    if (day) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      if (selectedDate) {
        const selected = new Date(selectedDate);
        if (isWeekend(date.getDay()) && isWeekend(selected.getDay())) {
          alert("Cannot book consecutive Saturday and Sunday.");
          return;
        }
      }
      setSelectedDate(date);
    }
  };

  const nextMonth = () => {
    setCurrentDate(prev => new Date(prev.setMonth(prev.getMonth() + 1)));
  };

  const prevMonth = () => {
    setCurrentDate(prev => new Date(prev.setMonth(prev.getMonth() - 1)));
  };

  const today = new Date();
  const minDate = new Date(today);
  minDate.setDate(today.getDate() + 2);

  return (
    <div className="p-4 sm:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Event Booking Calendar</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-7 gap-2 text-center">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="font-bold">{day}</div>
          ))}
          {calendar.flat().map((day, idx) => {
            const date = day ? new Date(currentDate.getFullYear(), currentDate.getMonth(), day) : null;
            const isDisabled = !day || 
              date < minDate || 
              isFirstMonday(currentDate.getFullYear(), currentDate.getMonth(), day) ||
              isLastFriday(currentDate.getFullYear(), currentDate.getMonth(), day);

            return (
              <Button 
                key={idx} 
                variant={day === selectedDate?.getDate() ? "default" : "outline"}
                onClick={() => handleDateSelect(day)} 
                disabled={isDisabled}
                className={cn(
                  "p-2",
                  isDisabled ? "text-muted-foreground bg-muted" : "",
                  date?.getDay() === 0 || date?.getDay() === 6 ? "text-red-500" : ""
                )}
              >
                {day || ''}
              </Button>
            );
          })}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={prevMonth}>Previous</Button>
          <Button onClick={nextMonth}>Next</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function App() {
  return <Calendar />;
}