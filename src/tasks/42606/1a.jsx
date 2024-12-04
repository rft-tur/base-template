import React, { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
//commented to prevent stackblitz from crashing
//import { useToast } from "@/components/ui/use-toast";

const platformColors = {
  facebook: "bg-blue-600",
  instagram: "bg-pink-600",
  tiktok: "bg-black",
  youtube: "bg-red-600",
};

function PostPreview({ post }) {
  return (
    <div className={`${platformColors[post.platform]} text-white p-2 rounded-md text-xs`}>
      <div className="font-bold">{post.time}</div>
      {post.image && <div className="w-8 h-8 bg-gray-300 rounded-sm mt-1"></div>}
      <div className="mt-1">{post.content.slice(0, 100)}...</div>
    </div>
  );
}

function PostModal({ isOpen, onClose, onSubmit, initialData }) {
  const [postData, setPostData] = useState(initialData || {
    date: new Date(),
    time: "",
    platform: "",
    content: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPostData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSubmit(postData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Post" : "Schedule New Post"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input type="date" name="date" value={postData.date} onChange={handleChange} />
          <Input type="time" name="time" value={postData.time} onChange={handleChange} />
          <Select name="platform" value={postData.platform} onValueChange={(value) => setPostData((prev) => ({ ...prev, platform: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select platform" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(platformColors).map((platform) => (
                <SelectItem key={platform} value={platform}>
                  {platform.charAt(0).toUpperCase() + platform.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Textarea name="content" value={postData.content} onChange={handleChange} placeholder="Post content" />
          <Input type="file" name="image" onChange={(e) => setPostData((prev) => ({ ...prev, image: e.target.files[0] }))} />
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Save Post</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [scheduledPosts, setScheduledPosts] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const { toast } = useToast();

  const handleDateClick = (date) => {
    if (date < new Date()) {
      toast({
        title: "Error",
        description: "Cannot schedule posts for past dates",
        variant: "destructive",
      });
      return;
    }
    setSelectedPost(null);
    setIsModalOpen(true);
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handlePostSubmit = (postData) => {
    const dateKey = postData.date.toISOString().split("T")[0];
    setScheduledPosts((prev) => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), postData],
    }));
    toast({
      title: "Success",
      description: "Post scheduled successfully",
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Social Media Planner</h1>
      <div className="mb-4">
        <Button onClick={() => setCurrentDate(new Date())}>Today</Button>
        <Button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}>Previous Month</Button>
        <Button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}>Next Month</Button>
      </div>
      <Calendar
        mode="single"
        selected={currentDate}
        onSelect={setCurrentDate}
        className="rounded-md border"
        components={{
          Day: ({ day }) => {
            const dateKey = day.toISOString().split("T")[0];
            const posts = scheduledPosts[dateKey] || [];
            return (
              <div
                className="h-20 w-full border p-1 cursor-pointer"
                onClick={() => handleDateClick(day)}
              >
                <div className="text-sm font-semibold">{day.getDate()}</div>
                {posts.map((post, index) => (
                  <div key={index} onClick={(e) => { e.stopPropagation(); handlePostClick(post); }}>
                    <PostPreview post={post} />
                  </div>
                ))}
              </div>
            );
          },
        }}
      />
      <PostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handlePostSubmit}
        initialData={selectedPost}
      />
    </div>
  );
}