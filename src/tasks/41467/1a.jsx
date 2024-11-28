import React, { useState, useEffect } from 'react';
// commented out since stackblitz does not compile
// import { Checkbox, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Badge, Input, Select, SelectItem, Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, Pagination } from "@/components/ui";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const statuses = [
  { value: 'inactive', label: 'Inactive', color: 'bg-gray-100 text-gray-800' },
  { value: 'active', label: 'Active', color: 'bg-green-100 text-green-800' },
  { value: 'done', label: 'Done', color: 'bg-green-500 text-white' },
  { value: 'due', label: 'Due', color: 'bg-yellow-100 text-yellow-800' },
];

const projects = [
  { name: 'Project A', color: 'bg-blue-200' },
  { name: 'Project B', color: 'bg-purple-200' },
  // Add more projects as needed
];

const people = [
  { id: 1, name: 'Alice', image: '/placeholder.jpg' },
  { id: 2, name: 'Bob', image: '/placeholder.jpg' },
  // Add more people as needed
];

function TaskRow({ task, toggleSelect, isSelected, onAction }) {
  return (
    <TableRow key={task.id}>
      <TableCell><Checkbox checked={isSelected} onCheckedChange={() => toggleSelect(task.id)} /></TableCell>
      <TableCell>{task.name}</TableCell>
      <TableCell><span className={`px-2 py-1 rounded-full text-xs ${task.project.color}`}>{task.project.name}</span></TableCell>
      <TableCell>{task.startDate}</TableCell>
      <TableCell>{task.endDate}</TableCell>
      <TableCell><Avatar className="mr-2"><AvatarImage src={task.assigned.image} /><AvatarFallback>{task.assigned.name.charAt(0)}</AvatarFallback></Avatar>{task.assigned.name}</TableCell>
      <TableCell>{task.reportedTo.name}</TableCell>
      <TableCell><Badge className={statuses.find(s => s.value === task.status).color}>{task.status}</Badge></TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">Actions</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => onAction('setStatus', task)}>Set Status</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAction('assignPerson', task)}>Assign Person</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAction('assignProject', task)}>Assign Project</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAction('remove', task)}>Remove</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filter, setFilter] = useState({ search: '', project: '', status: '', person: '' });

  useEffect(() => {
    // Simulate fetching tasks from an API
    setTasks([
      { id: 1, name: 'Task 1', project: projects[0], startDate: '2023-01-01', endDate: '2023-01-31', assigned: people[0], reportedTo: people[1], status: 'active' },
      // More mock tasks...
    ]);
  }, []);

  const filteredTasks = tasks.filter(task => 
    (task.name.includes(filter.search) || 
     task.assigned.name.includes(filter.search)) &&
    (filter.project === '' || task.project.name === filter.project) &&
    (filter.status === '' || task.status === filter.status) &&
    (filter.person === '' || task.assigned.id === parseInt(filter.person))
  );

  const paginatedTasks = filteredTasks.slice((page - 1) * pageSize, page * pageSize);

  const toggleSelect = (id) => {
    setSelectedTasks(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleAction = (action, task) => {
    console.log(`Action ${action} on task`, task);
    // Implement action logic here
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Team Task Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0 sm:space-x-4">
            <Input placeholder="Search tasks or people" value={filter.search} onChange={(e) => setFilter({...filter, search: e.target.value})} />
            <Select onValueChange={(value) => setFilter({...filter, project: value})}>
              <SelectItem value="">All Projects</SelectItem>
              {projects.map(p => <SelectItem key={p.name} value={p.name}>{p.name}</SelectItem>)}
            </Select>
            <Select onValueChange={(value) => setFilter({...filter, status: value})}>
              <SelectItem value="">All Statuses</SelectItem>
              {statuses.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
            </Select>
            <Select onValueChange={(value) => setFilter({...filter, person: value})}>
              <SelectItem value="">All People</SelectItem>
              {people.map(p => <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>)}
            </Select>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead>Task</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Start</TableHead>
                <TableHead>End</TableHead>
                <TableHead>Assigned</TableHead>
                <TableHead>Reported</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTasks.map(task => (
                <TaskRow key={task.id} task={task} toggleSelect={toggleSelect} isSelected={selectedTasks.includes(task.id)} onAction={handleAction} />
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-between items-center">
            <div>Total Tasks: {filteredTasks.length}</div>
            <Pagination 
              total={Math.ceil(filteredTasks.length / pageSize)} 
              current={page} 
              onChange={setPage} 
              pageSize={pageSize} 
              onPageSizeChange={setPageSize} 
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}