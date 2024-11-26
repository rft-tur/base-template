import React, { useState, useEffect, useMemo } from 'react';
// commented so that stackblitz does not crash
// import { 
//   Table, TableBody, TableCell, TableHead, TableHeader, TableRow, 
//   Card, CardContent, CardHeader, CardTitle, 
//   Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
//   Input, Select, SelectItem, Badge, Pagination, Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger,
//   useDisclosure,
// } from "@/components/ui";

const initialStudents = [
  { id: 1, fullname: 'John Doe', section: 'A', roleNumber: 1, math: 75, science: 80, english: 85 },
  { id: 2, fullname: 'Jane Smith', section: 'B', roleNumber: 2, math: 55, science: 65, english: 70 },
  // Add more students here for testing
];

export default function App() {
  const [students, setStudents] = useState(initialStudents);
  const [search, setSearch] = useState('');
  const [sectionFilter, setSectionFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const filteredStudents = useMemo(() => {
    return students.filter(student => 
      student.fullname.toLowerCase().includes(search.toLowerCase()) &&
      (sectionFilter === '' || student.section === sectionFilter) &&
      (statusFilter === '' || (student.totalScore > 60 ? 'pass' : 'fail') === statusFilter)
    );
  }, [students, search, sectionFilter, statusFilter]);

  const paginatedStudents = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredStudents.slice(start, end);
  }, [filteredStudents, page, itemsPerPage]);

  const handleSort = (key) => {
    const sortedStudents = [...students].sort((a, b) => 
      a[key] > b[key] ? 1 : a[key] < b[key] ? -1 : 0
    );
    setStudents(sortedStudents);
  };

  const EditNameModal = ({ student, onClose }) => {
    const [name, setName] = useState(student.fullname);
    
    const handleSave = () => {
      setStudents(prev => prev.map(s => s.id === student.id ? { ...s, fullname: name } : s));
      onClose();
    };

    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Name</DialogTitle>
          </DialogHeader>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
          <DialogFooter>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  const SetScoresModal = ({ student, onClose }) => {
    const [scores, setScores] = useState({ math: student.math, science: student.science, english: student.english });

    const handleSave = () => {
      setStudents(prev => prev.map(s => 
        s.id === student.id ? { ...s, ...scores, totalScore: (scores.math + scores.science + scores.english) / 3 } : s
      ));
      onClose();
    };

    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Scores</DialogTitle>
          </DialogHeader>
          <Input type="number" value={scores.math} onChange={(e) => setScores({...scores, math: e.target.value})} placeholder="Math" />
          <Input type="number" value={scores.science} onChange={(e) => setScores({...scores, science: e.target.value})} placeholder="Science" />
          <Input type="number" value={scores.english} onChange={(e) => setScores({...scores, english: e.target.value})} placeholder="English" />
          <DialogFooter>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  const ConfirmRemove = ({ student, onClose }) => {
    const handleRemove = () => {
      setStudents(prev => prev.filter(s => s.id !== student.id));
      onClose();
    };

    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="bg-red-500 text-white">
          <DialogHeader>
            <DialogTitle>Confirm Removal</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to remove {student.fullname}?</p>
          <DialogFooter>
            <Button onClick={handleRemove} className="bg-red-600 hover:bg-red-700">Remove</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="flex justify-center p-4">
      <Card className="w-full max-w-5xl">
        <CardHeader>
          <CardTitle>Student Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between mb-4">
            <Input 
              placeholder="Search by name..." 
              value={search} 
              onChange={(e) => { setSearch(e.target.value); setPage(1); }} 
              className="mb-2 sm:mb-0 sm:mr-2"
            />
            <Select value={sectionFilter} onValueChange={(value) => { setSectionFilter(value); setPage(1); }}>
              <SelectItem value="">All Sections</SelectItem>
              <SelectItem value="A">A</SelectItem>
              <SelectItem value="B">B</SelectItem>
            </Select>
            <Select value={statusFilter} onValueChange={(value) => { setStatusFilter(value); setPage(1); }}>
              <SelectItem value="">All Statuses</SelectItem>
              <SelectItem value="pass">Pass</SelectItem>
              <SelectItem value="fail">Fail</SelectItem>
            </Select>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead onClick={() => handleSort('fullname')}>Fullname</TableHead>
                <TableHead>Section</TableHead>
                <TableHead onClick={() => handleSort('roleNumber')}>Role Number</TableHead>
                <TableHead onClick={() => handleSort('math')}>Math Score</TableHead>
                <TableHead onClick={() => handleSort('science')}>Science Score</TableHead>
                <TableHead onClick={() => handleSort('english')}>English Score</TableHead>
                <TableHead onClick={() => handleSort('totalScore')}>Total Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedStudents.map(student => (
                <TableRow key={student.id}>
                  <TableCell>{student.fullname}</TableCell>
                  <TableCell>{student.section}</TableCell>
                  <TableCell>{student.roleNumber}</TableCell>
                  <TableCell>{student.math}</TableCell>
                  <TableCell>{student.science}</TableCell>
                  <TableCell>{student.english}</TableCell>
                  <TableCell>{student.totalScore = ((student.math + student.science + student.english) / 3).toFixed(2)}</TableCell>
                  <TableCell><Badge variant={student.totalScore > 60 ? 'success' : 'destructive'}>{student.totalScore > 60 ? 'Pass' : 'Fail'}</Badge></TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline">Actions</Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>
                          <DialogTrigger asChild>
                            <Button variant="ghost" onClick={onOpen}>Edit Name</Button>
                          </DialogTrigger>
                          {isOpen && <EditNameModal student={student} onClose={onClose} />}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <DialogTrigger asChild>
                            <Button variant="ghost">Set Scores</Button>
                          </DialogTrigger>
                          <SetScoresModal student={student} onClose={() => onClose()} />
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <DialogTrigger asChild>
                            <Button variant="destructive">Remove</Button>
                          </DialogTrigger>
                          <ConfirmRemove student={student} onClose={() => onClose()} />
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-between items-center mt-4">
            <Pagination
              total={filteredStudents.length}
              page={page}
              onChange={setPage}
              showControls
            />
            <Select value={itemsPerPage.toString()} onValueChange={(value) => { setItemsPerPage(parseInt(value)); setPage(1); }}>
              <SelectItem value="10">10 per page</SelectItem>
              <SelectItem value="20">20 per page</SelectItem>
              <SelectItem value="50">50 per page</SelectItem>
            </Select>
            <div>
              Showing {Math.min(page * itemsPerPage, filteredStudents.length)} of {filteredStudents.length}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}