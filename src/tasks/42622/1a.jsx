import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function App() {
  const [students, setStudents] = useState([
    { id: 1, fullname: 'John Doe', section: 'A', roleNumber: 101, math: 85, science: 90, english: 88, total: 263 },
    { id: 2, fullname: 'Jane Smith', section: 'B', roleNumber: 102, math: 92, science: 88, english: 95, total: 275 },
    // Add more students as needed
  ]);

  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [modalOpen, setModalOpen] = useState({ editName: false, setScores: false, remove: false });
  const [currentStudent, setCurrentStudent] = useState(null);

  const sortedStudents = React.useMemo(() => {
    let sortableItems = [...students];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [students, sortConfig]);

  const requestSort = key => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleEditName = (student) => {
    setCurrentStudent(student);
    setModalOpen({ ...modalOpen, editName: true });
  };

  const handleSetScores = (student) => {
    setCurrentStudent(student);
    setModalOpen({ ...modalOpen, setScores: true });
  };

  const handleRemove = (student) => {
    setCurrentStudent(student);
    setModalOpen({ ...modalOpen, remove: true });
  };

  const updateName = (newName) => {
    setStudents(prev => prev.map(s => s.id === currentStudent.id ? { ...s, fullname: newName } : s));
    setModalOpen({ ...modalOpen, editName: false });
  };

  const updateScores = (math, science, english) => {
    setStudents(prev => prev.map(s => 
      s.id === currentStudent.id ? { 
        ...s, 
        math, 
        science, 
        english, 
        total: parseInt(math) + parseInt(science) + parseInt(english) 
      } : s
    ));
    setModalOpen({ ...modalOpen, setScores: false });
  };

  const confirmRemove = () => {
    setStudents(prev => prev.filter(s => s.id !== currentStudent.id));
    setModalOpen({ ...modalOpen, remove: false });
  };

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead onClick={() => requestSort('fullname')}>Fullname</TableHead>
            <TableHead>Section</TableHead>
            <TableHead onClick={() => requestSort('roleNumber')}>Role Number</TableHead>
            <TableHead onClick={() => requestSort('math')}>Math</TableHead>
            <TableHead onClick={() => requestSort('science')}>Science</TableHead>
            <TableHead onClick={() => requestSort('english')}>English</TableHead>
            <TableHead onClick={() => requestSort('total')}>Total</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedStudents.map((student) => (
            <TableRow key={student.id}>
              <TableCell>{student.fullname}</TableCell>
              <TableCell>{student.section}</TableCell>
              <TableCell>{student.roleNumber}</TableCell>
              <TableCell>{student.math}</TableCell>
              <TableCell>{student.science}</TableCell>
              <TableCell>{student.english}</TableCell>
              <TableCell>{student.total}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">Actions</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleEditName(student)}>Edit Name</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSetScores(student)}>Set Scores</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleRemove(student)}>Remove</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Edit Name Modal */}
      <Dialog open={modalOpen.editName} onOpenChange={() => setModalOpen({ ...modalOpen, editName: false })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Name</DialogTitle>
          </DialogHeader>
          <Label htmlFor="name">New Name</Label>
          <Input id="name" defaultValue={currentStudent?.fullname} onChange={(e) => updateName(e.target.value)} />
        </DialogContent>
      </Dialog>

      {/* Set Scores Modal */}
      <Dialog open={modalOpen.setScores} onOpenChange={() => setModalOpen({ ...modalOpen, setScores: false })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Scores</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="math">Math</Label>
              <Input id="math" defaultValue={currentStudent?.math} onChange={(e) => updateScores(e.target.value, currentStudent?.science, currentStudent?.english)} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="science">Science</Label>
              <Input id="science" defaultValue={currentStudent?.science} onChange={(e) => updateScores(currentStudent?.math, e.target.value, currentStudent?.english)} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="english">English</Label>
              <Input id="english" defaultValue={currentStudent?.english} onChange={(e) => updateScores(currentStudent?.math, currentStudent?.science, e.target.value)} />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Remove Confirmation Modal */}
      <Dialog open={modalOpen.remove} onOpenChange={() => setModalOpen({ ...modalOpen, remove: false })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">Confirm Removal</DialogTitle>
            <DialogDescription>Are you sure you want to remove this student?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={confirmRemove} className="bg-red-500 hover:bg-red-600">Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default App;