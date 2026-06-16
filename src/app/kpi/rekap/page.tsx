"use client";

import { AppShell } from "@/components/dashboard/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { REKAP_KPI_DEPARTMENTS, KPI_DATA } from "@/lib/mock-data";

export default function RekapKpiPage() {
  // Aggregate data for top performers
  const topPerformers = [...KPI_DATA]
    .sort((a, b) => b.finalScore - a.finalScore)
    .slice(0, 5);

  // Prepare chart data
  const chartData = REKAP_KPI_DEPARTMENTS.map(dept => ({
    name: dept.department,
    "Rata-rata Skor": dept.averageScore,
    "Skor Tertinggi": dept.highestScore,
    "Skor Terendah": dept.lowestScore,
  }));

  return (
    <AppShell title="Rekapitulasi KPI" currentPath="/kpi/rekap">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <p className="text-sm font-medium text-muted-foreground mb-1">Rata-rata Perusahaan</p>
              <h3 className="text-3xl font-bold text-foreground">81.54</h3>
              <p className="text-xs text-emerald-600 mt-2 font-medium">Kategori Baik</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm font-medium text-muted-foreground mb-1">Total Dievaluasi</p>
              <h3 className="text-3xl font-bold text-foreground">77</h3>
              <p className="text-xs text-muted-foreground mt-2">Dari 100 Karyawan</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm font-medium text-muted-foreground mb-1">Skor Tertinggi</p>
              <h3 className="text-3xl font-bold text-emerald-600">96.00</h3>
              <p className="text-xs text-muted-foreground mt-2">Business Development</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm font-medium text-muted-foreground mb-1">Skor Terendah</p>
              <h3 className="text-3xl font-bold text-rose-500">58.00</h3>
              <p className="text-xs text-muted-foreground mt-2">Upper Funnel</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts & Top Performers */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Perbandingan Skor Antar Departemen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      cursor={{ fill: 'transparent' }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                    <Bar dataKey="Rata-rata Skor" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={16} />
                    <Bar dataKey="Skor Tertinggi" fill="#10b981" radius={[4, 4, 0, 0]} barSize={16} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-base font-semibold">Top 5 Performer (Feb 2026)</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {topPerformers.map((emp, idx) => (
                  <div key={emp.id} className="p-4 flex items-center justify-between hover:bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div className={`flex items-center justify-center size-6 rounded-full text-xs font-bold text-white ${
                        idx === 0 ? 'bg-amber-400' : idx === 1 ? 'bg-slate-400' : idx === 2 ? 'bg-amber-600' : 'bg-blue-600'
                      }`}>
                        {idx + 1}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{emp.name}</p>
                        <p className="text-[10px] text-muted-foreground">{emp.department}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-bold text-emerald-600">{emp.finalScore.toFixed(1)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Department Table */}
        <Card>
          <CardHeader className="pb-3 border-b">
            <CardTitle className="text-base font-semibold">Rekapitulasi per Departemen</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="w-12 text-center">No</TableHead>
                  <TableHead>Departemen</TableHead>
                  <TableHead className="text-center">Total Karyawan</TableHead>
                  <TableHead className="text-center">Skor Tertinggi</TableHead>
                  <TableHead className="text-center">Skor Terendah</TableHead>
                  <TableHead className="text-center font-bold">Rata-rata Skor</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {REKAP_KPI_DEPARTMENTS.map((dept, index) => (
                  <TableRow key={dept.department} className="hover:bg-muted/30">
                    <TableCell className="text-center text-muted-foreground">{index + 1}</TableCell>
                    <TableCell className="font-medium">{dept.department}</TableCell>
                    <TableCell className="text-center">{dept.totalEmployees}</TableCell>
                    <TableCell className="text-center text-emerald-600 font-medium">{dept.highestScore.toFixed(2)}</TableCell>
                    <TableCell className="text-center text-rose-500 font-medium">{dept.lowestScore.toFixed(2)}</TableCell>
                    <TableCell className="text-center font-bold text-primary">{dept.averageScore.toFixed(2)}</TableCell>
                    <TableCell className="text-center">
                      <span className={`inline-block rounded px-2.5 py-0.5 text-xs font-semibold ${
                        dept.averageScore >= 85 ? "bg-emerald-100 text-emerald-700" :
                        dept.averageScore >= 75 ? "bg-blue-100 text-blue-700" :
                        "bg-amber-100 text-amber-700"
                      }`}>
                        {dept.averageScore >= 85 ? "Sangat Baik" : dept.averageScore >= 75 ? "Baik" : "Cukup"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

      </div>
    </AppShell>
  );
}
