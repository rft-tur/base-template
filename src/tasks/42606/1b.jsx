import React, { useState, useEffect } from 'react';
//commented to prevent stackblitz from crashing
import { Button, Card, CardContent, Modal, Input, Textarea, Select, SelectItem, Toast, useToast } from "@/components/ui";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, getDate, getMonth, getYear } from 'date-fns';

// Mock data for social media platforms
const platforms = [
  { name: 'facebook', color: 'bg-blue-600' },
  { name: 'instagram', color: 'bg-pink-500' },
  { name: 'tiktok', color: 'bg-black' },
  { name: 'youtube', color: 'bg-red-600' },
];

// Mock posts data
let mockPosts = [
  { date: new Date(2023, 3, 15), platform: 'facebook', text: 'Launching new product!', image: 'thumbnail.jpg' },
  { date: new Date(2023, 3, 20), platform: 'instagram', text: 'Check out our latest post.', image: 'insta.jpg' },
];

export default function App() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [posts, setPosts] = useState(mockPosts);
  const [modalOpen, setModalOpen] = useState(false);
  const [editPost, setEditPost] = useState(null);
  const { toast } = useToast();

  const start = startOfMonth(currentMonth);
  const end = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start, end });

  const handleMonthChange = (direction) => {
    setCurrentMonth(direction === 'next' ? addMonths(currentMonth, 1) : subMonths(currentMonth, 1));
  };

  const handleOpenModal = (day = null, post = null) => {
    if (day && day < new Date()) {
      toast({
        variant: "destructive",
        title: "Cannot schedule in the past.",
      });
      return;
    }
    setEditPost(post || { date: day || new Date(), platform: platforms[0].name, text: '', image: '' });
    setModalOpen(true);
  };

  const handleSubmitPost = (e) => {
    e.preventDefault();
    let updatedPosts = editPost.id ? 
      posts.map(p => p.id === editPost.id ? { ...editPost, id: editPost.id } : p) : 
      [...posts, { ...editPost, id: Date.now() }];
    setPosts(updatedPosts);
    setModalOpen(false);
    toast({
      title: "Post Scheduled.",
      description: "Your post has been successfully scheduled."
    });
  };

  return (
    <div className="p-4 sm:p-8">
      <Card className="mb-4">
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <Button onClick={() => handleMonthChange('prev')}>Previous</Button>
            <h2>{format(currentMonth, 'MMMM yyyy')}</h2>
            <Button onClick={() => handleMonthChange('next')}>Next</Button>
          </div>
          <table className="w-full table-auto">
            <thead>
              <tr>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <th key={day} className="text-xs">{day}</th>)}
              </tr>
            </thead>
            <tbody>
              {Array(Math.ceil(days.length / 7)).fill().map((_, rowIndex) => (
                <tr key={rowIndex}>
                  {days.slice(rowIndex * 7, (rowIndex + 1) * 7).map((day, idx) => {
                    const dayPosts = posts.filter(p => getDate(p.date) === getDate(day));
                    return (
                      <td key={idx} className="border p-2 h-24 relative">
                        <div onClick={() => handleOpenModal(day)} className="cursor-pointer">
                          {getDate(day)}
                          {dayPosts.map((post, i) => (
                            <div key={i} className={`mt-1 p-1 rounded ${platforms.find(p => p.name === post.platform).color} text-white`}>
                              <div>{format(post.date, 'HH:mm')}</div>
                              <div>{post.text.slice(0, 100)}...</div>
                            </div>
                          ))}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSubmitPost}>
          <Card>
            <CardContent>
              <Input type="date" value={format(editPost.date, 'yyyy-MM-dd')} onChange={e => setEditPost({...editPost, date: new Date(e.target.value)})} />
              <Select value={editPost.platform} onChange={value => setEditPost({...editPost, platform: value})}>
                {platforms.map(p => <SelectItem key={p.name} value={p.name}>{p.name}</SelectItem>)}
              </Select>
              <Textarea value={editPost.text} onChange={e => setEditPost({...editPost, text: e.target.value})} placeholder="Post content" />
              <Input type="text" value={editPost.image} onChange={e => setEditPost({...editPost, image: e.target.value})} placeholder="Image URL" />
            </CardContent>
            <Button type="submit">Save Post</Button>
          </Card>
        </form>
      </Modal>
    </div>
  );
}