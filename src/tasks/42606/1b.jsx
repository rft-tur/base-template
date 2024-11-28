import React, { useState, useEffect } from 'react';
import { format, addMonths, subMonths, startOfWeek, startOfMonth, getDaysInMonth, isFuture } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";
import { toast, Toaster } from "@/components/ui/toast";
import { ChevronLeft, ChevronRight, PlayCircle } from "lucide-react";

const platforms = {
  facebook: '#3b5998',
  instagram: '#E1306C',
  tiktok: '#000000',
  youtube: '#FF0000'
};

function App() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendar, setCalendar] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editContent, setEditContent] = useState(null);
  const [newContent, setNewContent] = useState({
    date: null,
    platform: 'facebook',
    time: '09:00',
    text: '',
    media: null
  });

  useEffect(() => {
    generateCalendar();
  }, [currentMonth]);

  const generateCalendar = () => {
    const startDay = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 0 });
    const daysInMonth = getDaysInMonth(currentMonth);
    let day = startDay;
    let calendarDays = [];

    for (let i = 0; i < 6 * 7; i++) {
      calendarDays.push({
        date: new Date(day),
        content: null,
        isCurrentMonth: day.getMonth() === currentMonth.getMonth()
      });
      day = addMonths(day, 1);
    }
    setCalendar(calendarDays);
  };

  const handleDateClick = (day) => {
    if (!day.isCurrentMonth || isFuture(day.date)) return toast({ variant: "destructive", title: "Cannot schedule for this date." });
    setNewContent({ ...newContent, date: day.date });
    setEditContent(day.content);
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    // Here you would typically send data to an API
    toast({ title: "Content Saved Successfully" });
    setDialogOpen(false);
    generateCalendar(); // Refresh calendar to show updated content
  };

  return (
    <div className="container mx-auto p-4">
      <Toaster />
      <div className="flex justify-between items-center mb-4">
        <Button size="sm" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}><ChevronLeft /></Button>
        <h2 className="text-lg font-bold">{format(currentMonth, 'MMMM yyyy')}</h2>
        <Button size="sm" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}><ChevronRight /></Button>
      </div>
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <th key={day} className="p-2 border">{day}</th>)}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 6 }).map((_, rowIndex) => (
            <tr key={rowIndex}>
              {calendar.slice(rowIndex * 7, (rowIndex + 1) * 7).map(day => (
                <td key={day.date.toISOString()} 
                    className={`p-2 border ${!day.isCurrentMonth ? 'opacity-50' : ''}`}
                    onClick={() => handleDateClick(day)}>
                  <div>{format(day.date, 'd')}</div>
                  {day.content && <ContentPreview content={day.content} />}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <ContentDialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)} 
        content={editContent || newContent} 
        onChange={setNewContent}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

function ContentPreview({ content }) {
  return (
    <div className="mt-2 space-y-1">
      <div className="flex items-center">
        <div className="w-12 text-sm">{content.time}</div>
        {content.media && 
          <div className="relative w-8 h-8 bg-gray-200 mr-2">
            {content.media.type.startsWith('video') && <PlayCircle className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />}
          </div>
        }
        <div>{content.text.slice(0, 100)}...</div>
      </div>
    </div>
  );
}

function ContentDialog({ open, onClose, content, onChange, onSubmit }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{content.date ? format(content.date, 'MMMM d, yyyy') : 'New Content'}</DialogTitle>
        </DialogHeader>
        <Input type="time" value={content.time} onChange={(e) => onChange({...content, time: e.target.value})} />
        <Select value={content.platform} onValueChange={(value) => onChange({...content, platform: value})}>
          {Object.keys(platforms).map(platform => <SelectItem key={platform} value={platform}>{platform}</SelectItem>)}
        </Select>
        <Input value={content.text} onChange={(e) => onChange({...content, text: e.target.value})} placeholder="Content text" />
        {/* Add file input for media here */}
        <DialogFooter>
          <Button type="submit" onClick={onSubmit}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default App;