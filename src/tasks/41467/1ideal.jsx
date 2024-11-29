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
  return person ? (
    <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-2 py-1">
      <Avatar className="h-6 w-6">
        <AvatarImage src={person.image} alt={person.name} />
        <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <span className="text-sm">{person.name}</span>
    </div>
  ) : '';
}

function ProjectPill({ project }) {
  return project ? (
    <div className="inline-block px-2 py-1 rounded-full text-xs" style={{ backgroundColor: project.color }}>
      {project.name}
    </div>
  ) : '';
}

function SelectStatus({ onValueChange }) {
  return (
    <Select onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select status" />
      </SelectTrigger>
      <SelectContent>
        {Object.keys(statusColors).map((status) => (
          <SelectItem key={status} value={status}>{status}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function SelectPerson({ onValueChange, placeholder, persons }) {
  return (
    <Select onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {persons.map((person) => (
          <SelectItem key={person.id} value={person.id}>{person.name}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function SelectProject({ onValueChange, projects }) {
  return (
    <Select onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select project" />
      </SelectTrigger>
      <SelectContent>
        {projects.map((project) => (
          <SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function SetStatus({ children, handleValueChange }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set Status</DialogTitle>
        </DialogHeader>
        <SelectStatus onValueChange={handleValueChange} />
      </DialogContent>
    </Dialog>
  )
}

function AssignPerson({ children, handleValueChange, persons }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Person</DialogTitle>
        </DialogHeader>
        <SelectPerson onValueChange={handleValueChange} placeholder="Select assigned person" persons={persons} />
      </DialogContent>
    </Dialog>
  )
}

function AssignProject({ children, handleValueChange, projects }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Project</DialogTitle>
        </DialogHeader>
        <SelectProject onValueChange={handleValueChange} projects={projects} />
      </DialogContent>
    </Dialog>
  )
}

function DeleteTask({ children, handleDelete, description }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Task(s)</DialogTitle>
        </DialogHeader>
        <p>{description}</p>
        <Button onClick={handleDelete}>Confirm</Button>
      </DialogContent>
    </Dialog>
  )
}

function TaskRow({ task, onSelect, isSelected, onAction, persons, projects }) {

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
            <SetStatus handleValueChange={(value) => onAction(task.id, "setStatus", value)}>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Set Status</DropdownMenuItem>
            </SetStatus>
            <AssignPerson handleValueChange={(value) => onAction(task.id, "assignPerson", value)} persons={persons}>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Assign Person</DropdownMenuItem>
            </AssignPerson>
            <AssignProject handleValueChange={(value) => onAction(task.id, "assignProject", value)} projects={projects}>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Assign Project</DropdownMenuItem>
            </AssignProject>
            <DeleteTask handleDelete={() => onAction(task.id, 'delete')} description="Are you sure you want to delete this task?">
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Delete Task</DropdownMenuItem>
            </DeleteTask>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

function Filters({ onFilterChange, persons, projects }) {
  return (
    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-4">
      <Input placeholder="Search tasks" onChange={(e) => onFilterChange("search", e.target.value)} />
      <SelectProject onValueChange={(value) => onFilterChange("project", value)} projects={projects} />
      <SelectStatus onValueChange={(value) => onFilterChange("status", value)} />
      <SelectPerson onValueChange={(value) => onFilterChange("assignedTo", value)} placeholder="Select assigned person" persons={persons} />

    </div>
  );
}

function BulkActions({ selectedTasks, onBulkAction, persons, projects }) {
  return (
    <div className="flex space-x-2 mb-4">
      <DeleteTask handleDelete={() => onBulkAction("delete")} description="Are you sure you want to delete the selected tasks?">
        <Button disabled={selectedTasks.length === 0}>Delete</Button>
      </DeleteTask>
      <SetStatus handleValueChange={(value) => onBulkAction("setStatus", value)}>
        <Button disabled={selectedTasks.length === 0}>Set Status</Button>
      </SetStatus>
      <AssignPerson handleValueChange={(value) => onBulkAction("assignPerson", value)} persons={persons}>
        <Button disabled={selectedTasks.length === 0}>Assign Person</Button>
      </AssignPerson>
    </div>
  );
}

function CreateTask({ tasks, setTasks }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState();

  const handleCreate = () => {
    let id = tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1;
    setTasks(prev => [...prev, { id, name, status: 'inactive' }]);
    setName("");
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>Create Task</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Input
            type="text"
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <Button onClick={handleCreate}>Create Task</Button>
      </DialogContent>
    </Dialog>
  )
}

function CreatePerson({ persons, setPersons }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState();

  const handleCreate = () => {
    let id = persons[persons.length - 1].id + 1;
    setPersons(prev => [...prev, { id, name, image: "" }]);
    setName("");
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>Create Person</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Person</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Input
            type="text"
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <Button onClick={handleCreate}>Create Person</Button>
      </DialogContent>
    </Dialog>
  )
}

function CreateProject({ projects, setProjects }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState();
  const [color, setColor] = useState();

  const handleCreate = () => {
    let id = projects[projects.length - 1].id + 1;
    setProjects(prev => [...prev, { id, name, color }])
    setName("");
    setColor("");
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>Create Project</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Input
            type="text"
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            type="color"
            placeholder="Color"
            onChange={(e) => setColor(e.target.value)}
          />
        </div>
        <Button onClick={handleCreate}>Create Project</Button>
      </DialogContent>
    </Dialog>
  )
}

export default function App() {
  const [tasks, setTasks] = useState(mockTasks);
  const [persons, setPersons] = useState(mockPersons);
  const [projects, setProjects] = useState(mockProjects);
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

  const handleTaskAction = (id, action, value) => {
    console.log({id,action,value});
    switch (action) {
      case 'setStatus':
        setTasks(prev => {
          return prev.map(task => {
            if (task.id === id) {
              return { ...task, status: value };
            }
            return task;
          });
        });
        break;
      case 'assignProject':
        setTasks(prev => {
          return prev.map(task => {
            if (task.id === id) {
              const project = projects.find(p => p.id === value);
              if (project) {
                return { ...task, project: { ...project } };
              }
            }
            return task;
          });
        });
        break;
      case 'assignPerson':
        setTasks(prev => {
          return prev.map(task => {
            if (task.id === id) {
              const person = persons.find(p => p.id === value);
              if (person) {
                return { ...task, assignedTo: { ...person } };
              }
            }
            return task;
          });
        });
        break;
      case 'delete':
        setTasks(prev =>
          prev.filter(task => task.id !== id)
        );
        break;

    }
  }

  const handleBulkAction = (action, value) => {
    switch (action) {
      case 'delete':
        setTasks(prev =>
          prev.filter(task => !selectedTasks.includes(task.id))
        );
        break;
      case 'setStatus':
        setTasks(prev => {
          return prev.map(task => {
            if (selectedTasks.includes(task.id)) {
              return { ...task, status: value };
            }
            return task;
          });
        });
        break;
      case 'assignPerson':
        setTasks(prev => {
          return prev.map(task => {
            if (selectedTasks.includes(task.id)) {
              const person = persons.find(p => p.id === value);
              if (person) {
                return { ...task, assignedTo: { ...person } };
              }
            }
            return task;
          });
        });
        break;
    }
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
      <div className="flex gap-4 mb-4">
        <CreateTask tasks={tasks} setTasks={setTasks} />
        <CreatePerson persons={persons} setPersons={setPersons} />
        <CreateProject projects={projects} setProjects={setProjects} />
      </div>
      <Filters persons={persons} projects={projects} onFilterChange={handleFilterChange} />
      <BulkActions selectedTasks={selectedTasks} onBulkAction={handleBulkAction} persons={persons} />
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
              onAction={handleTaskAction}
              persons={persons}
              projects={projects}
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