import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast";

const platforms = {
  facebook: { name: "Facebook", color: "bg-blue-600" },
  instagram: { name: "Instagram", color: "bg-pink-500" },
  tiktok: { name: "TikTok", color: "bg-black" },
  youtube: { name: "YouTube", color: "bg-red-600" },
};

const initialData = [
  { id: 1, date: "2023-06-15", time: "10:00", platform: "facebook", content: "Check out our new product launch!", media: "product.jpg" },
  { id: 2, date: "2023-06-20", time: "14:30", platform: "instagram", content: "Behind the scenes at our photo shoot", media: "photoshoot.mp4" },
];

function CalendarMonthView({ currentDate, data, setSelectedContent, setIsDialogOpen }) {

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handleDayClick = (day) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    if (clickedDate < new Date()) {
      toast({ title: "Error", description: "Cannot edit past dates", variant: "destructive" });
      return;
    }
    setSelectedContent({ id: Date.now(), date: clickedDate.toISOString().split("T")[0] });
    setIsDialogOpen(true);
  };

  const handleContentClick = (content) => {
    setSelectedContent(content);
    setIsDialogOpen(true);
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<td key={`empty-${i}`} className="border p-2"></td>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toISOString().split("T")[0];
      const dayContent = data.filter((item) => item.date === date);

      days.push(
        <td key={day} className="border p-2 h-32 align-top cursor-pointer" onClick={() => handleDayClick(day)}>
          <div className="font-bold mb-1">{day}</div>
          {dayContent.map((content) => (
            <div
              key={content.id}
              className={`${platforms[content.platform].color} text-white p-1 mb-1 rounded text-xs`}
              onClick={(e) => {
                e.stopPropagation();
                handleContentClick(content);
              }}
            >
              <div className="flex items-center">
                <span className="mr-1">{content.time}</span>
                {content.media && (
                  <img src={content.media} className="w-6 h-6 bg-gray-200 rounded mr-1 relative" />
                )}
                <span>{content.content.slice(0, 100)}...</span>
              </div>
            </div>
          ))}
        </td>
      );
    }

    const rows = [];
    let cells = [];

    days.forEach((day, index) => {
      if (index % 7 !== 0) {
        cells.push(day);
      } else {
        rows.push(cells);
        cells = [day];
      }
      if (index === days.length - 1) {
        rows.push(cells);
      }
    });

    return rows.map((row, index) => <tr key={index}>{row}</tr>);
  };

  return (
    <table className="w-full border-collapse table-fixed">
      <thead>
        <tr>
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <th key={day} className="border p-2">
              {day}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{renderCalendar()}</tbody>
    </table>
  )
}

function ContentEditDialog({ isOpen, onClose, content, onSave }) {
  const [data, setData] = useState({});

  useEffect(() => {
    if(content) setData(content);
  }, [content])

  const handleChange = (e) => {
    setData(prev => { return { ...prev, [e.target.name]: e.target.value } });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{content?.id ? "Edit Content" : "Add New Content"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input type="time" name="time" value={data.time || ""} onChange={handleChange} required />
            <Select name="platform" value={data.platform || ""} onValueChange={(value) => setData({ ...data, platform: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(platforms).map(([key, { name }]) => (
                  <SelectItem key={key} value={key}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Textarea name="content" value={data.content || ""} onChange={handleChange} placeholder="Content" required />
            <Input type="text" name="media" value={data.media || ""} onChange={handleChange} placeholder="Media URL" />
          </div>
          <DialogFooter>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [data, setData] = useState(initialData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
  const { toast } = useToast();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleSaveContent = (updatedContent) => {
    console.log({ updatedContent })
    if (data.find(item => item.id === updatedContent.id)) {
      setData(prev => prev.map((item) => (item.id === updatedContent.id ? updatedContent : item)));
    } else {
      setData(prev => [...prev, { ...updatedContent }]);
    }
    setIsDialogOpen(false);
    toast({ title: "Success", description: "Content saved successfully" });
  };



  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <Button size="sm" onClick={handlePrevMonth}>
          <ChevronLeft size={16} />
        </Button>
        <h2 className="text-lg font-bold">
          {currentDate.toLocaleString("default", { month: "long", year: "numeric" })}
        </h2>
        <Button size="sm" onClick={handleNextMonth}>
          <ChevronRight size={16} />
        </Button>
      </div>
      <CalendarMonthView
        currentDate={currentDate}
        data={data}
        setSelectedContent={setSelectedContent}
        setIsDialogOpen={setIsDialogOpen}
      />
      <ContentEditDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        content={selectedContent}
        onSave={handleSaveContent}
      />
      <Toaster />
    </div>
  );
}

