import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const mockTasks = [
  { id: 1, name: "Task 1", project: { id: 1, name: "Project A", color: "#FF5733" }, startDate: "2023-07-01", endDate: "2023-07-15", assignedTo: { id: 1, name: "John Doe", image: "" }, reportedTo: { id: 2, name: "Jane Smith", image: "" }, status: "active" },
  { id: 2, name: "Task 2", project: { id: 2, name: "Project B", color: "#33FF57" }, startDate: "2023-07-05", endDate: "2023-07-20", assignedTo: { id: 3, name: "Alice Johnson", image: "" }, reportedTo: { id: 4, name: "Bob Brown", image: "" }, status: "inactive" },
  // Add more mock tasks as needed
];

const mockProjects = [
  { id: 1, name: "Project A", color: "#FF5733" },
  { id: 2, name: "Project B", color: "#33FF57" },
  // Add more mock projects as needed
];

const mockPersons = [
  { id: 1, name: "John Doe", image: "/john-doe.jpg" },
  { id: 2, name: "Jane Smith", image: "/jane-smith.jpg" },
  { id: 3, name: "Alice Johnson", image: "/alice-johnson.jpg" },
  { id: 4, name: "Bob Brown", image: "/bob-brown.jpg" },
  // Add more mock persons as needed
];

const statusColors = {
  inactive: "bg-gray-200",
  active: "bg-green-200",
  done: "bg-green-500",
  due: "bg-yellow-200",
};

function PersonPill({ person }) {
  return (
    <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-2 py-1">
      <Avatar className="h-6 w-6">
        <AvatarImage src={person.image} alt={person.name} />
        <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <span className="text-sm">{person.name}</span>
    </div>
  );
}

function ProjectPill({ project }) {
  return (
    <div className="inline-block px-2 py-1 rounded-full text-xs" style={{ backgroundColor: project.color }}>
      {project.name}
    </div>
  );
}

function TaskRow({ task, onSelect, isSelected }) {
  return (
    <TableRow>
      <TableCell>
        <Checkbox checked={isSelected} onCheckedChange={() => onSelect(task.id)} />
      </TableCell>
      <TableCell>{task.name}</TableCell>
      <TableCell><ProjectPill project={task.project} /></TableCell>
      <TableCell>{task.startDate}</TableCell>
      <TableCell>{task.endDate}</TableCell>
      <TableCell><PersonPill person={task.assignedTo} /></TableCell>
      <TableCell><PersonPill person={task.reportedTo} /></TableCell>
      <TableCell>
        <Badge className={statusColors[task.status]}>{task.status}</Badge>
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">Actions</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Set Status</DropdownMenuItem>
            <DropdownMenuItem>Assign Person</DropdownMenuItem>
            <DropdownMenuItem>Assign Project</DropdownMenuItem>
            <DropdownMenuItem>Remove Task</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

function Filters({ onFilterChange }) {
  return (
    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-4">
      <Input placeholder="Search tasks" onChange={(e) => onFilterChange("search", e.target.value)} />
      <Select onValueChange={(value) => onFilterChange("project", value)}>
        <SelectTrigger>
          <SelectValue placeholder="Select project" />
        </SelectTrigger>
        <SelectContent>
          {mockProjects.map((project) => (
            <SelectItem key={project.id} value={project.id.toString()}>{project.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select onValueChange={(value) => onFilterChange("status", value)}>
        <SelectTrigger>
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          {Object.keys(statusColors).map((status) => (
            <SelectItem key={status} value={status}>{status}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select onValueChange={(value) => onFilterChange("assignedTo", value)}>
        <SelectTrigger>
          <SelectValue placeholder="Select assigned person" />
        </SelectTrigger>
        <SelectContent>
          {mockPersons.map((person) => (
            <SelectItem key={person.id} value={person.id.toString()}>{person.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function BulkActions({ selectedTasks, onBulkAction }) {
  return (
    <div className="flex space-x-2 mb-4">
      <Dialog>
        <DialogTrigger asChild>
          <Button disabled={selectedTasks.length === 0}>Delete</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Tasks</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete the selected tasks?</p>
          <Button onClick={() => onBulkAction("delete")}>Confirm</Button>
        </DialogContent>
      </Dialog>
      <Dialog>
        <DialogTrigger asChild>
          <Button disabled={selectedTasks.length === 0}>Set Status</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Status</DialogTitle>
          </DialogHeader>
          <Select onValueChange={(value) => onBulkAction("setStatus", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(statusColors).map((status) => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </DialogContent>
      </Dialog>
      <Dialog>
        <DialogTrigger asChild>
          <Button disabled={selectedTasks.length === 0}>Assign Person</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Person</DialogTitle>
          </DialogHeader>
          <Select onValueChange={(value) => onBulkAction("assignPerson", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select person" />
            </SelectTrigger>
            <SelectContent>
              {mockPersons.map((person) => (
                <SelectItem key={person.id} value={person.id.toString()}>{person.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function App() {
  const [tasks, setTasks] = useState(mockTasks);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [filters, setFilters] = useState({});
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10 });

  const handleFilterChange = (filterType, value) => {
    setFilters({ ...filters, [filterType]: value });
  };

  const handleTaskSelect = (taskId) => {
    setSelectedTasks(prev => 
      prev.includes(taskId) ? prev.filter(id => id !== taskId) : [...prev, taskId]
    );
  };

  const handleBulkAction = (action, value) => {
    // Implement bulk actions here
    console.log(`Bulk action: ${action}, value: ${value}, tasks: ${selectedTasks}`);
  };

  const filteredTasks = tasks.filter(task => {
    if (filters.search && !task.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.project && task.project.id.toString() !== filters.project) return false;
    if (filters.status && task.status !== filters.status) return false;
    if (filters.assignedTo && task.assignedTo.id.toString() !== filters.assignedTo) return false;
    return true;
  });

  const paginatedTasks = filteredTasks.slice(
    (pagination.page - 1) * pagination.pageSize,
    pagination.page * pagination.pageSize
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Team Task Management</h1>
      <div className="flex justify-between mb-4">
        <Button>Create Person</Button>
        <Button>Create Project</Button>
      </div>
      <Filters onFilterChange={handleFilterChange} />
      <BulkActions selectedTasks={selectedTasks} onBulkAction={handleBulkAction} />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>Task Name</TableHead>
            <TableHead>Project</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Assigned To</TableHead>
            <TableHead>Reported To</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedTasks.map(task => (
            <TaskRow 
              key={task.id} 
              task={task} 
              onSelect={handleTaskSelect}
              isSelected={selectedTasks.includes(task.id)}
            />
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-between items-center mt-4">
        <span>Total tasks: {filteredTasks.length}</span>
        <div className="flex items-center space-x-2">
          <Select value={pagination.pageSize.toString()} onValueChange={(value) => setPagination({ ...pagination, pageSize: parseInt(value) })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[10, 50, 100].map(size => (
                <SelectItem key={size} value={size.toString()}>{size}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => setPagination({ ...pagination, page: Math.max(1, pagination.page - 1) })}>Previous</Button>
          <span>Page {pagination.page}</span>
          <Button onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}>Next</Button>
        </div>
      </div>
    </div>
  );
}