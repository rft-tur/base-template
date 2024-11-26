import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const initialStudents = [
  { id: 1, fullname: "John Doe", section: "A", rollNumber: 1, mathScore: 85, scienceScore: 92, englishScore: 78 },
  { id: 2, fullname: "Jane Smith", section: "B", rollNumber: 2, mathScore: 20, scienceScore: 30, englishScore: 20 },
  // Add more students here...
];

export default function App() {
  const [students, setStudents] = useState(initialStudents);
  const [searchTerm, setSearchTerm] = useState("");
  const [sectionFilter, setSectionFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" });

  const filteredStudents = useMemo(() => {
    return students
      .filter((student) => student.fullname.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter((student) => sectionFilter === "" || student.section === sectionFilter)
      .filter((student) => {
        const totalScore = (student.mathScore + student.scienceScore + student.englishScore) / 3;
        const status = totalScore > 60 ? "pass" : "fail";
        return statusFilter === "" || status === statusFilter;
      });
  }, [students, searchTerm, sectionFilter, statusFilter]);

  const sortedStudents = useMemo(() => {
    let sortableItems = [...filteredStudents];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredStudents, sortConfig]);

  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedStudents.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedStudents, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedStudents.length / itemsPerPage);

  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === "ascending" ? "descending" : "ascending",
    }));
  };

  const handleEditName = (id, newName) => {
    setStudents((prevStudents) =>
      prevStudents.map((student) => (student.id === id ? { ...student, fullname: newName } : student))
    );
  };

  const handleSetScores = (id, mathScore, scienceScore, englishScore) => {
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.id === id ? { ...student, mathScore, scienceScore, englishScore } : student
      )
    );
  };

  const handleRemove = (id) => {
    setStudents((prevStudents) => prevStudents.filter((student) => student.id !== id));
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Student Table</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <Input
              placeholder="Search by name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow"
            />
            <Select value={sectionFilter} onValueChange={setSectionFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by section" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A">Section A</SelectItem>
                <SelectItem value="B">Section B</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pass">Pass</SelectItem>
                <SelectItem value="fail">Fail</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer" onClick={() => handleSort("fullname")}>Full Name</TableHead>
                <TableHead>Section</TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("rollNumber")}>Roll Number</TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("mathScore")}>Math Score</TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("scienceScore")}>Science Score</TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("englishScore")}>English Score</TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("totalScore")}>Total Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedStudents.map((student) => {
                const totalScore = (student.mathScore + student.scienceScore + student.englishScore) / 3;
                const status = totalScore > 60 ? "pass" : "fail";
                return (
                  <TableRow key={student.id}>
                    <TableCell>{student.fullname}</TableCell>
                    <TableCell>{student.section}</TableCell>
                    <TableCell>{student.rollNumber}</TableCell>
                    <TableCell>{student.mathScore}</TableCell>
                    <TableCell>{student.scienceScore}</TableCell>
                    <TableCell>{student.englishScore}</TableCell>
                    <TableCell>{totalScore.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={status === "pass" ? "default" : "destructive"} className={status == "pass" ? "bg-green-600" : ""}>{status}</Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline">Actions</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <Dialog>
                            <DialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Edit Name</DropdownMenuItem>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit Name</DialogTitle>
                              </DialogHeader>
                              <Input
                                defaultValue={student.fullname}
                                onChange={(e) => handleEditName(student.id, e.target.value)}
                              />
                            </DialogContent>
                          </Dialog>
                          <Dialog>
                            <DialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Set Scores</DropdownMenuItem>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Set Scores</DialogTitle>
                              </DialogHeader>
                              <div className="flex flex-col gap-4">
                                <Input
                                  type="number"
                                  placeholder="Math Score"
                                  defaultValue={student.mathScore}
                                  onChange={(e) => handleSetScores(student.id, parseInt(e.target.value), student.scienceScore, student.englishScore)}
                                />
                                <Input
                                  type="number"
                                  placeholder="Science Score"
                                  defaultValue={student.scienceScore}
                                  onChange={(e) => handleSetScores(student.id, student.mathScore, parseInt(e.target.value), student.englishScore)}
                                />
                                <Input
                                  type="number"
                                  placeholder="English Score"
                                  defaultValue={student.englishScore}
                                  onChange={(e) => handleSetScores(student.id, student.mathScore, student.scienceScore, parseInt(e.target.value))}
                                />
                              </div>
                            </DialogContent>
                          </Dialog>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600">
                                Remove
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the student's data.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => handleRemove(student.id)}>
                                  Remove
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <div className="flex justify-between items-center mt-4">
            <div>
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, sortedStudents.length)} of {sortedStudents.length} results
            </div>
            <div className="flex items-center gap-2">
              <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(parseInt(value))}>
                <SelectTrigger className="w-[70px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                Previous
              </Button>
              <Button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}