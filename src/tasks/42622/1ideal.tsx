import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const initialStudents = [
  { id: 1, fullname: "John Doe", section: "A", rollNumber: 1, mathScore: 85, scienceScore: 90, englishScore: 88 },
  { id: 2, fullname: "Jane Smith", section: "B", rollNumber: 2, mathScore: 92, scienceScore: 88, englishScore: 95 },
  // Add more students as needed
];

export default function App() {
  const [students, setStudents] = useState(initialStudents);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [editingStudent, setEditingStudent] = useState(null);
  const [isEditNameOpen, setIsEditNameOpen] = useState(false);
  const [isSetScoresOpen, setIsSetScoresOpen] = useState(false);
  const [isConfirmRemoveOpen, setIsConfirmRemoveOpen] = useState(false);

  const sortedStudents = React.useMemo(() => {
    let sortableStudents = [...students];
    if (sortConfig.key !== null) {
      sortableStudents.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableStudents;
  }, [students, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleEditName = () => {
    setStudents(students.map(s => s.id === editingStudent.id ? { ...s, fullname: editingStudent.fullname } : s));
    setIsEditNameOpen(false);
  };

  const handleSetScores = () => {
    setStudents(students.map(s => s.id === editingStudent.id ? { ...s, ...editingStudent } : s));
    setIsSetScoresOpen(false);
  };

  const handleRemoveStudent = () => {
    setStudents(students.filter(s => s.id !== editingStudent.id));
    setIsConfirmRemoveOpen(false);
  };

  return (
    <div className="container mx-auto p-4">
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead onClick={() => requestSort('fullname')} className="cursor-pointer">Full Name</TableHead>
            <TableHead>Section</TableHead>
            <TableHead onClick={() => requestSort('rollNumber')} className="cursor-pointer">Roll Number</TableHead>
            <TableHead onClick={() => requestSort('mathScore')} className="cursor-pointer">Math Score</TableHead>
            <TableHead onClick={() => requestSort('scienceScore')} className="cursor-pointer">Science Score</TableHead>
            <TableHead onClick={() => requestSort('englishScore')} className="cursor-pointer">English Score</TableHead>
            <TableHead onClick={() => requestSort('totalScore')} className="cursor-pointer">Total Score</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedStudents.map((student) => (
            <TableRow key={student.id}>
              <TableCell>{student.fullname}</TableCell>
              <TableCell>{student.section}</TableCell>
              <TableCell>{student.rollNumber}</TableCell>
              <TableCell>{student.mathScore}</TableCell>
              <TableCell>{student.scienceScore}</TableCell>
              <TableCell>{student.englishScore}</TableCell>
              <TableCell>{student.mathScore + student.scienceScore + student.englishScore}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">Actions</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => { setEditingStudent(student); setIsEditNameOpen(true); }}>
                      Edit Name
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => { setEditingStudent(student); setIsSetScoresOpen(true); }}>
                      Set Scores
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => { setEditingStudent(student); setIsConfirmRemoveOpen(true); }}>
                      Remove
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isEditNameOpen} onOpenChange={setIsEditNameOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Name</DialogTitle>
          </DialogHeader>
          <Input
            value={editingStudent?.fullname || ''}
            onChange={(e) => setEditingStudent({ ...editingStudent, fullname: e.target.value })}
          />
          <DialogFooter>
            <Button onClick={handleEditName}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isSetScoresOpen} onOpenChange={setIsSetScoresOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Scores</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <Label>Math Score</Label>
            <Input
              type="number"
              value={editingStudent?.mathScore || ''}
              onChange={(e) => setEditingStudent({ ...editingStudent, mathScore: parseInt(e.target.value) })}
            />
            <Label>Science Score</Label>
            <Input
              type="number"
              value={editingStudent?.scienceScore || ''}
              onChange={(e) => setEditingStudent({ ...editingStudent, scienceScore: parseInt(e.target.value) })}
            />
            <Label>English Score</Label>
            <Input
              type="number"
              value={editingStudent?.englishScore || ''}
              onChange={(e) => setEditingStudent({ ...editingStudent, englishScore: parseInt(e.target.value) })}
            />
          </div>
          <DialogFooter>
            <Button onClick={handleSetScores}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isConfirmRemoveOpen} onOpenChange={setIsConfirmRemoveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Removal</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to remove this student?</p>
          <DialogFooter>
            <Button variant="destructive" onClick={handleRemoveStudent}>Remove</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}