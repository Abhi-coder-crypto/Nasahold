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

interface User {
  _id: string;
  name: string;
  email: string;
  number: string;
  score: number;
  completedAt: string;
}

export default function AdminDashboard() {
  const { data: users, isLoading, refetch } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
  });

  const handleExport = async () => {
    window.open("/api/admin/export", "_blank");
  };

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
      <header className="bg-[#1A1C2E] text-white py-4 px-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-primary p-2 rounded-lg">
            <Trophy className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight">Admin Portal</h1>
            <p className="text-xs text-gray-400">Participant Management System</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <RefreshCcw className="h-4 w-4" />
            <span>Auto-refresh</span>
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

      <main className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-none shadow-sm overflow-hidden">
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Total Participants</p>
                <div className="text-3xl font-bold text-[#1A1C2E]">{totalParticipants}</div>
              </div>
              <div className="bg-blue-600/10 p-3 rounded-xl">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-sm overflow-hidden">
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Average Score</p>
                <div className="text-3xl font-bold text-orange-500">{averageScore}</div>
              </div>
              <div className="bg-orange-500/10 p-3 rounded-xl">
                <Trophy className="h-6 w-6 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm overflow-hidden">
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Recent Activity</p>
                <div className="text-3xl font-bold text-green-500">{totalParticipants > 0 ? 'Active' : 'Idle'}</div>
              </div>
              <div className="bg-green-500/10 p-3 rounded-xl">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm overflow-hidden">
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">System Status</p>
                <div className="text-3xl font-bold text-purple-600">Online</div>
              </div>
              <div className="bg-purple-600/10 p-3 rounded-xl">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Section */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-bold text-[#1A1C2E]">User Requests</h2>
              <p className="text-sm text-gray-500">Manage and process quiz participant data</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => refetch()} className="bg-white border-gray-200">
                <RefreshCcw className="h-4 w-4 mr-2" /> Refresh
              </Button>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Search users..." className="pl-10 w-64 bg-white border-gray-200" />
              </div>
              <Button onClick={handleExport} className="bg-primary hover:bg-primary/90">
                <Download className="h-4 w-4 mr-2" /> Export
              </Button>
            </div>
          </div>

          <Card className="border-none shadow-sm overflow-hidden bg-white">
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow className="border-b border-gray-100">
                    <TableHead className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-gray-500">User</TableHead>
                    <TableHead className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-gray-500">Email</TableHead>
                    <TableHead className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-gray-500">Phone</TableHead>
                    <TableHead className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-gray-500">Date</TableHead>
                    <TableHead className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-gray-500">Status</TableHead>
                    <TableHead className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-right text-gray-500">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users?.map((user) => (
                    <TableRow key={user._id} className="border-b border-gray-50 hover:bg-slate-50/50 transition-colors">
                      <TableCell className="py-4 px-6 font-medium text-gray-900">{user.name}</TableCell>
                      <TableCell className="py-4 px-6 text-gray-600">{user.email}</TableCell>
                      <TableCell className="py-4 px-6 text-gray-600">{user.number}</TableCell>
                      <TableCell className="py-4 px-6 text-gray-500">
                        {new Date(user.completedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Completed: {user.score}/7
                        </span>
                      </TableCell>
                      <TableCell className="py-4 px-6 text-right">
                        <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">View</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {users?.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-20">
                        <div className="flex flex-col items-center gap-2 text-gray-400">
                          <RefreshCcw className="h-8 w-8 animate-spin-slow" />
                          <p>No participants found yet.</p>
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
    </div>
  );
}
