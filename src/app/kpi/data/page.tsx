"use client";

import { useState } from "react";
import { AppShell } from "@/components/dashboard/AppShell";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { KPI_DATA, type KpiDataRow } from "@/lib/mock-data";
import { Search, Filter } from "lucide-react";

export default function DataKpiPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredData = KPI_DATA.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.nip.includes(searchTerm) ||
                          item.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <AppShell title="Data KPI Karyawan" currentPath="/kpi/data">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">

        <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center bg-card p-4 rounded-2xl border border-border shadow-sm">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Cari nama, NIP, atau departemen..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value || "all")}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="Selesai">Selesai</SelectItem>
                <SelectItem value="Review">Review</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-12 text-center whitespace-nowrap">No</TableHead>
                  <TableHead className="whitespace-nowrap">NIP</TableHead>
                  <TableHead className="min-w-[180px]">Nama Karyawan</TableHead>
                  <TableHead className="min-w-[150px]">Departemen</TableHead>
                  <TableHead className="whitespace-nowrap">Periode</TableHead>
                  <TableHead className="text-center whitespace-nowrap">Skor KPI</TableHead>
                  <TableHead className="text-center whitespace-nowrap">Potongan</TableHead>
                  <TableHead className="text-center font-bold text-primary whitespace-nowrap">Skor Akhir</TableHead>
                  <TableHead className="text-center whitespace-nowrap">Predikat</TableHead>
                  <TableHead className="text-center whitespace-nowrap">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length > 0 ? (
                  filteredData.map((row, index) => (
                    <TableRow key={row.id} className="hover:bg-muted/30">
                      <TableCell className="text-center text-muted-foreground">{index + 1}</TableCell>
                      <TableCell className="font-medium">{row.nip}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-foreground">{row.name}</p>
                          <p className="text-xs text-muted-foreground">{row.position}</p>
                        </div>
                      </TableCell>
                      <TableCell>{row.department}</TableCell>
                      <TableCell>{row.period}</TableCell>
                      <TableCell className="text-center">{row.kpiScore.toFixed(2)}</TableCell>
                      <TableCell className="text-center text-rose-500">{row.penaltyScore > 0 ? `-${row.penaltyScore}` : "0"}</TableCell>
                      <TableCell className="text-center font-bold text-primary">{row.finalScore.toFixed(2)}</TableCell>
                      <TableCell className="text-center">
                        <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          row.predicate === "SANGAT BAIK" ? "bg-emerald-100 text-emerald-700 border border-emerald-200" :
                          row.predicate === "BAIK" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                          row.predicate === "CUKUP" ? "bg-amber-100 text-amber-700 border border-amber-200" :
                          "bg-rose-100 text-rose-700 border border-rose-200"
                        }`}>
                          {row.predicate}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium ${
                          row.status === "Selesai" ? "bg-emerald-50 text-emerald-700" :
                          row.status === "Review" ? "bg-amber-50 text-amber-700" :
                          "bg-slate-100 text-slate-700"
                        }`}>
                          <span className={`size-1.5 rounded-full ${
                            row.status === "Selesai" ? "bg-emerald-500" :
                            row.status === "Review" ? "bg-amber-500" :
                            "bg-slate-400"
                          }`} />
                          {row.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={10} className="h-32 text-center text-muted-foreground">
                      Tidak ada data KPI yang sesuai dengan filter.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
