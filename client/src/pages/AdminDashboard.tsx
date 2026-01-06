import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, Users, Trophy, Loader2, Clock, CheckCircle, RefreshCcw, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface User {
  _id: string;
  name: string;
  email: string;
  number: string;
  score: number;
  completedAt: string;
  answers: Record<string, string | string[]>;
}

const QUESTIONS = [
  { id: 1, text: "Nasohold uses which pump technology to ensure uniform dose delivery with smooth actuation?" },
  { id: 2, text: "What is the mean droplet size delivered by the Aptar VP6 pump used in Nasohold?" },
  { id: 3, text: "Which sweetener is used in Nasohold to improve taste and patient compliance?" },
  { id: 4, text: "What is the plume geometry angle of Nasohold nasal spray?" },
  { id: 5, text: "Which intranasal corticosteroid molecule does Nasohold contain?" },
  { id: 6, text: "In your clinical practice, for which of the following indications will you commonly use Nasohold?" },
  { id: 7, text: "Which feature of Nasohold stood out the most to you?" },
];

export default function AdminDashboard() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
    setIsRefreshing(false);
  };

  const handleExport = async () => {
    try {
      const response = await apiRequest("GET", "/api/admin/export");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `participants_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  const filteredUsers = users?.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.number.includes(searchQuery)
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const totalParticipants = users?.length || 0;
  const averageScore = users?.length 
    ? (users.reduce((acc, user) => acc + user.score, 0) / users.length).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen bg-[#F0F4F8]">
      {/* Dark Header */}
      <header className="bg-[#1A1C2E] text-white py-3 px-4 md:py-4 md:px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="bg-primary p-2 rounded-lg">
            <Trophy className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight">Admin Portal</h1>
            <p className="text-xs text-gray-400">Participant Management System</p>
          </div>
        </div>
        <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
          <div 
            className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer hover:text-white transition-colors"
            onClick={handleRefresh}
          >
            <RefreshCcw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden xs:inline">Refresh Data</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-primary/20 text-primary h-8 w-8 rounded-full flex items-center justify-center font-bold">
              AD
            </div>
            <div className="text-right">
              <p className="text-sm font-bold leading-tight">Admin</p>
              <p className="text-xs text-gray-400">Administrator</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 md:px-6 md:py-8 max-w-7xl">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-8">
          <Card className="border-none shadow-sm overflow-hidden">
            <CardContent className="p-4 md:p-6 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Total Participants</p>
                <div className="text-2xl md:text-3xl font-bold text-[#1A1C2E]">{totalParticipants}</div>
              </div>
              <div className="bg-blue-600/10 p-3 rounded-xl">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-sm overflow-hidden">
            <CardContent className="p-4 md:p-6 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Average Score</p>
                <div className="text-2xl md:text-3xl font-bold text-orange-500">{averageScore}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Section */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-4">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-[#1A1C2E]">User Requests</h2>
              <p className="text-sm text-gray-500">Manage and process quiz participant data</p>
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <Button 
                variant="outline" 
                onClick={handleRefresh} 
                disabled={isRefreshing}
                className="bg-white border-gray-200 flex-1 sm:flex-none"
              >
                <RefreshCcw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} /> Refresh
              </Button>
              <div className="relative flex-1 sm:flex-none sm:min-w-[250px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search users..." 
                  className="pl-10 w-full bg-white border-gray-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button onClick={handleExport} className="bg-primary hover:bg-primary/90 flex-1 sm:flex-none">
                <Download className="h-4 w-4 mr-2" /> Export
              </Button>
            </div>
          </div>

          <Card className="border-none shadow-sm overflow-hidden bg-white">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50/50">
                    <TableRow className="border-b border-gray-100">
                      <TableHead className="py-4 px-4 md:px-6 text-xs font-semibold uppercase tracking-wider text-gray-500">User</TableHead>
                      <TableHead className="hidden sm:table-cell py-4 px-4 md:px-6 text-xs font-semibold uppercase tracking-wider text-gray-500">Email</TableHead>
                      <TableHead className="hidden md:table-cell py-4 px-4 md:px-6 text-xs font-semibold uppercase tracking-wider text-gray-500">Phone</TableHead>
                      <TableHead className="hidden lg:table-cell py-4 px-4 md:px-6 text-xs font-semibold uppercase tracking-wider text-gray-500">Date</TableHead>
                      <TableHead className="py-4 px-4 md:px-6 text-xs font-semibold uppercase tracking-wider text-gray-500">Status</TableHead>
                      <TableHead className="py-4 px-4 md:px-6 text-xs font-semibold uppercase tracking-wider text-right text-gray-500">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers?.map((user) => (
                      <TableRow key={user._id} className="border-b border-gray-50 hover:bg-slate-50/50 transition-colors">
                        <TableCell className="py-4 px-4 md:px-6">
                          <div className="font-medium text-gray-900">{user.name}</div>
                          <div className="sm:hidden text-xs text-gray-500 mt-0.5">{user.email}</div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell py-4 px-4 md:px-6 text-gray-600">{user.email}</TableCell>
                        <TableCell className="hidden md:table-cell py-4 px-4 md:px-6 text-gray-600">{user.number}</TableCell>
                        <TableCell className="hidden lg:table-cell py-4 px-4 md:px-6 text-gray-500">
                          {new Date(user.completedAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="py-4 px-4 md:px-6">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] md:text-xs font-medium bg-green-100 text-green-800">
                            {user.score}/7
                          </span>
                        </TableCell>
                        <TableCell className="py-4 px-4 md:px-6 text-right">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-primary hover:text-primary/80 px-2"
                            onClick={() => setSelectedUser(user)}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  {filteredUsers?.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-20">
                        <div className="flex flex-col items-center gap-2 text-gray-400">
                          <RefreshCcw className="h-8 w-8" />
                          <p>No participants found matching your search.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Details Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-2xl bg-white p-0 overflow-hidden flex flex-col max-h-[90vh] w-[95vw]">
          <DialogHeader className="p-4 md:p-6 pb-4 border-b bg-white">
            <DialogTitle className="text-lg md:text-xl font-bold text-[#1A1C2E]">
              Participant Details: {selectedUser?.name}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="flex-1 overflow-y-auto">
            <div className="p-4 md:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-6">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase font-semibold">Email</p>
                  <p className="text-sm font-medium break-all">{selectedUser?.email}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase font-semibold">Phone</p>
                  <p className="text-sm font-medium">{selectedUser?.number}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase font-semibold">Date Completed</p>
                  <p className="text-sm font-medium">{selectedUser && new Date(selectedUser.completedAt).toLocaleString()}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase font-semibold">Total Score</p>
                  <p className="text-sm font-bold text-primary">{selectedUser?.score} / 7</p>
                </div>
              </div>
              
              <h3 className="font-bold text-sm uppercase tracking-wider text-gray-500 mb-3">Quiz Responses</h3>
              <div className="space-y-4">
                {QUESTIONS.map((q) => (
                  <div key={q.id} className="border-b border-gray-100 pb-3 last:border-0">
                    <p className="text-sm font-bold text-gray-700 mb-2">{q.id}. {q.text}</p>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <p className="text-sm text-gray-600">
                        {selectedUser?.answers?.[q.id] 
                          ? (Array.isArray(selectedUser.answers[q.id]) 
                              ? (selectedUser.answers[q.id] as string[]).join(", ") 
                              : selectedUser.answers[q.id])
                          : "No answer provided"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
