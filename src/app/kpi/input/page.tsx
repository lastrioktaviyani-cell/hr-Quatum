"use client";

import { useState } from "react";
import { AppShell } from "@/components/dashboard/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Save, Info, CheckCircle2 } from "lucide-react";

// --- Mock Initial State ---
const INITIAL_ASSIGNMENTS = [
  {
    id: "sulaiman",
    employeeName: "Sulaiman",
    position: "Advertiser",
    period: "Februari 2026",
    status: "DRAFT",
    kpiItems: [
      { id: "k1", name: "Cost Acquisition Iklan", target: 70, targetStr: "70%", actual: "35", weight: 25, type: "LOWER_BETTER" },
      { id: "k2", name: "Cost Per Lead", target: 25000, targetStr: "25.000", actual: "20000", weight: 20, type: "LOWER_BETTER" },
      { id: "k3", name: "Botol Terjual", target: 1000, targetStr: "1.000", actual: "1200", weight: 20, type: "HIGHER_BETTER" },
      { id: "k4", name: "Impresi", target: 5000000, targetStr: "5.000.000", actual: "4500000", weight: 20, type: "HIGHER_BETTER" },
      { id: "k5", name: "CPM", target: 10000, targetStr: "10.000", actual: "11000", weight: 15, type: "LOWER_BETTER" },
    ],
    penaltyItems: [
      { id: "p1", name: "Izin tanpa alasan", points: 5, pointsStr: "-5.000", occurrences: "0" },
      { id: "p2", name: "Perintah Atasan tidak dilaksanakan", points: 1.5, pointsStr: "-1.500", occurrences: "0" },
      { id: "p3", name: "Keterlambatan", points: 1.5, pointsStr: "-1.500", occurrences: "0" },
      { id: "p4", name: "Pelanggaran KAK Mingguan", points: 2, pointsStr: "-2.000", occurrences: "0" },
    ],
    history: [
      { month: "Januari", year: "2026", score: 58.25, category: "Cukup", rank: "4 / 10" },
      { month: "Desember", year: "2025", score: 72.10, category: "Baik", rank: "1 / 10" },
      { month: "November", year: "2025", score: 65.40, category: "Baik", rank: "2 / 10" },
    ]
  },
  {
    id: "thoriq",
    employeeName: "Thoriq Al Ghifari",
    position: "General Affair",
    period: "Februari 2026",
    status: "DRAFT",
    kpiItems: [
      { id: "k1", name: "Fasilitas Berfungsi Baik", target: 100, targetStr: "100%", actual: "", weight: 60, type: "HIGHER_BETTER" },
      { id: "k2", name: "SLA Komplain < 1 Jam", target: 90, targetStr: "90%", actual: "", weight: 40, type: "HIGHER_BETTER" },
    ],
    penaltyItems: [
      { id: "p1", name: "Izin tanpa alasan", points: 5, pointsStr: "-5.000", occurrences: "0" },
      { id: "p3", name: "Keterlambatan", points: 1.5, pointsStr: "-1.500", occurrences: "0" },
    ],
    history: [
      { month: "Januari", year: "2026", score: 88.50, category: "Baik", rank: "2 / 10" },
    ]
  }
];

export default function InputKpiPage() {
  const [assignments, setAssignments] = useState(INITIAL_ASSIGNMENTS);
  const [selectedId, setSelectedId] = useState("sulaiman");
  const [isSaved, setIsSaved] = useState(false);

  // Get current assignment
  const current = assignments.find(a => a.id === selectedId);

  // --- Handlers ---
  const handleKpiChange = (itemId: string, value: string) => {
    setIsSaved(false);
    setAssignments(prev => prev.map(a => {
      if (a.id !== selectedId) return a;
      return {
        ...a,
        kpiItems: a.kpiItems.map(k => k.id === itemId ? { ...k, actual: value } : k)
      };
    }));
  };

  const handlePenaltyChange = (itemId: string, value: string) => {
    setIsSaved(false);
    setAssignments(prev => prev.map(a => {
      if (a.id !== selectedId) return a;
      return {
        ...a,
        penaltyItems: a.penaltyItems.map(p => p.id === itemId ? { ...p, occurrences: value } : p)
      };
    }));
  };

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  if (!current) return null;

  // --- Calculations ---
  const computeKpiPoint = (item: typeof current.kpiItems[0]) => {
    const actual = Number(item.actual);
    if (!item.actual || isNaN(actual) || actual === 0) return 0;

    let ratio = 0;
    if (item.type === "HIGHER_BETTER") {
      ratio = actual / item.target;
    } else {
      ratio = item.target / actual; // Lower is better
    }

    const score = ratio * item.weight;
    return Math.min(score, item.weight); // Capped at max weight
  };

  const totalPerformance = current.kpiItems.reduce((acc, item) => acc + computeKpiPoint(item), 0);
  const totalWeight = current.kpiItems.reduce((acc, item) => acc + item.weight, 0);

  const computePenaltyPoint = (item: typeof current.penaltyItems[0]) => {
    const occ = Number(item.occurrences);
    if (isNaN(occ)) return 0;
    return occ * item.points;
  };

  const totalPenalty = current.penaltyItems.reduce((acc, item) => acc + computePenaltyPoint(item), 0);

  const finalScore = Math.max(totalPerformance - totalPenalty, 0);

  let category = "KURANG";
  let catColor = "bg-rose-100 text-rose-700 border-rose-200";
  if (finalScore >= 90) {
    category = "SANGAT BAIK";
    catColor = "bg-emerald-100 text-emerald-700 border-emerald-200";
  } else if (finalScore >= 75) {
    category = "BAIK";
    catColor = "bg-emerald-50 text-emerald-600 border-emerald-100";
  } else if (finalScore >= 60) {
    category = "CUKUP";
    catColor = "bg-amber-100 text-amber-700 border-amber-200";
  }

  return (
    <AppShell title="Input KPI Per Karyawan" currentPath="/kpi/input">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">

        {/* Success Alert */}
        {isSaved && (
          <div className="flex items-center gap-3 bg-emerald-50 text-emerald-800 p-4 rounded-xl border border-emerald-200">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <p className="text-sm font-medium">Data KPI untuk {current.employeeName} berhasil disimpan!</p>
          </div>
        )}

        {/* Header Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block">Nama Karyawan</label>
                <Select value={selectedId} onValueChange={(val) => { if (val) { setSelectedId(val); setIsSaved(false); } }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Karyawan" />
                  </SelectTrigger>
                  <SelectContent>
                    {assignments.map(a => (
                      <SelectItem key={a.id} value={a.id}>{a.employeeName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block">Jabatan</label>
                <Input value={current.position} readOnly className="bg-muted/50 text-muted-foreground" />
              </div>
              <div className="flex items-end gap-4">
                <div className="flex-1">
                  <label className="text-xs font-medium text-muted-foreground mb-2 block">Bulan Penilaian</label>
                  <div className="relative">
                    <Input value={current.period} readOnly className="pl-9 bg-muted/50 text-muted-foreground" />
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                  </div>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" /> Simpan KPI
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Tables */}
          <div className="xl:col-span-2 flex flex-col gap-6">

            {/* Table A */}
            <Card>
              <CardHeader className="pb-3 border-b">
                <CardTitle className="text-base text-blue-600 font-semibold">A. Penilaian Performa (KPI)</CardTitle>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                <Table className="min-w-[600px]">
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead className="w-12 text-center">No</TableHead>
                      <TableHead>Indikator</TableHead>
                      <TableHead className="text-center">Target</TableHead>
                      <TableHead className="text-center">Realisasi</TableHead>
                      <TableHead className="text-center">Bobot</TableHead>
                      <TableHead className="text-center">Poin Otomatis</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {current.kpiItems.map((item, index) => {
                      const points = computeKpiPoint(item);
                      return (
                        <TableRow key={item.id}>
                          <TableCell className="text-center text-muted-foreground">{index + 1}</TableCell>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell className="text-center text-muted-foreground">{item.targetStr}</TableCell>
                          <TableCell className="text-center">
                            <Input
                              type="number"
                              value={item.actual}
                              onChange={(e) => handleKpiChange(item.id, e.target.value)}
                              className="h-8 w-24 text-center mx-auto"
                            />
                          </TableCell>
                          <TableCell className="text-center">{item.weight}%</TableCell>
                          <TableCell className="text-center text-emerald-600 font-medium bg-emerald-50/30">
                            {points.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    <TableRow className="bg-blue-50/50 font-medium">
                      <TableCell colSpan={4} className="text-blue-800 text-right pr-4">TOTAL PENILAIAN PERFORMA</TableCell>
                      <TableCell className="text-center text-blue-800">{totalWeight}%</TableCell>
                      <TableCell className="text-center text-blue-800 text-base">{totalPerformance.toFixed(2)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                <div className="p-4 bg-muted/20 text-xs text-muted-foreground italic border-t">
                  * Poin otomatis dihitung berdasarkan pencapaian realisasi terhadap target (batas maksimal sesuai bobot).
                </div>
              </CardContent>
            </Card>

            {/* Table B */}
            <Card>
              <CardHeader className="pb-3 border-b">
                <CardTitle className="text-base text-amber-600 font-semibold">B. Pengurangan Poin</CardTitle>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                <Table className="min-w-[600px]">
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead className="w-12 text-center">No</TableHead>
                      <TableHead>Jenis Pengurangan</TableHead>
                      <TableHead className="text-center">Aturan / Poin</TableHead>
                      <TableHead className="text-center">Jumlah Kejadian</TableHead>
                      <TableHead className="text-center">Total Potongan</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {current.penaltyItems.map((item, index) => {
                      const totalPotongan = computePenaltyPoint(item);
                      return (
                        <TableRow key={item.id}>
                          <TableCell className="text-center text-muted-foreground">{index + 1}</TableCell>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell className="text-center text-rose-500">{item.pointsStr}</TableCell>
                          <TableCell className="text-center">
                            <Input
                              type="number"
                              min="0"
                              value={item.occurrences}
                              onChange={(e) => handlePenaltyChange(item.id, e.target.value)}
                              className="h-8 w-16 text-center mx-auto"
                            />
                          </TableCell>
                          <TableCell className="text-center font-medium text-rose-600">
                            {totalPotongan > 0 ? `-${totalPotongan.toFixed(2)}` : "0"}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    <TableRow className="bg-amber-50/50 font-medium">
                      <TableCell colSpan={4} className="text-amber-800 text-right pr-4">TOTAL PENGURANGAN</TableCell>
                      <TableCell className="text-center text-rose-600 text-base">
                        {totalPenalty > 0 ? `-${totalPenalty.toFixed(2)}` : "0"}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-50 border border-blue-100 text-blue-800 text-sm">
              <Info className="h-5 w-5 shrink-0" />
              <span>Setelah semua data diisi, klik tombol <strong>Simpan KPI</strong> di bagian atas untuk menyimpan dan mengajukan penilaian ke atasan.</span>
            </div>
          </div>

          {/* Right Column - Summary */}
          <div className="flex flex-col gap-6">

            {/* Score Card */}
            <Card className="shadow-md border-primary/20">
              <CardHeader className="pb-2 border-b bg-blue-50/50">
                <CardTitle className="text-sm font-bold text-blue-900">Hasil Penilaian KPI</CardTitle>
              </CardHeader>
              <CardContent className="p-6 flex flex-col gap-6">
                <div className="text-center space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total KPI Akhir</p>
                  <p className={`text-6xl font-bold tracking-tight ${finalScore >= 75 ? 'text-emerald-600' : finalScore >= 60 ? 'text-amber-500' : 'text-rose-500'}`}>
                    {finalScore.toFixed(2)}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 border-y py-5">
                  <div className="flex flex-col items-center justify-center gap-1 border-r">
                    <span className="text-xs text-muted-foreground mb-1">Kategori</span>
                    <span className={`px-3 py-1 rounded text-xs font-bold tracking-wide ${catColor}`}>
                      {category}
                    </span>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-1">
                    <span className="text-xs text-muted-foreground mb-1">Peringkat</span>
                    <span className="text-sm font-bold bg-slate-100 px-3 py-1 rounded">2 dari 10</span>
                  </div>
                </div>

                <div className="space-y-4 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Penilaian Performa</span>
                    <span className="font-semibold">{totalPerformance.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Pengurangan Poin</span>
                    <span className="font-semibold text-rose-500">{totalPenalty > 0 ? `-${totalPenalty.toFixed(2)}` : "0"}</span>
                  </div>
                  <div className="flex justify-between items-center font-bold pt-3 border-t">
                    <span className="text-blue-800">TOTAL KPI AKHIR</span>
                    <span className="text-primary text-lg">{finalScore.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Formula Legend */}
            <Card className="bg-amber-50/40 border-amber-200/60 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold text-amber-900 uppercase tracking-wide">Keterangan Perhitungan</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2.5 text-xs text-amber-900/80 leading-relaxed">
                  <li className="flex gap-2">
                    <span className="font-bold text-amber-500">•</span>
                    <span><strong>Poin Otomatis</strong> dihitung berdasarkan rasio <em>Realisasi</em> terhadap <em>Target</em> dikali <em>Bobot</em>.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-amber-500">•</span>
                    <span>Jika realisasi melebihi target, poin maksimal adalah sebesar persentase bobot indikator tersebut.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-amber-500">•</span>
                    <span><strong>Total KPI Akhir</strong> = Total Performa - Total Pengurangan Poin.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* History Table */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3 border-b bg-muted/10">
                <CardTitle className="text-sm font-semibold text-foreground">Riwayat KPI Terakhir</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead className="text-xs h-8">Bulan</TableHead>
                      <TableHead className="text-xs h-8 text-center">Tahun</TableHead>
                      <TableHead className="text-xs h-8 text-center">Skor</TableHead>
                      <TableHead className="text-xs h-8 text-center">Kategori</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {current.history.map((hist, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="text-xs py-2">{hist.month}</TableCell>
                        <TableCell className="text-xs py-2 text-center text-muted-foreground">{hist.year}</TableCell>
                        <TableCell className="text-xs py-2 text-center font-bold text-foreground">{hist.score.toFixed(2)}</TableCell>
                        <TableCell className="text-center py-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            hist.category === "Sangat Baik" ? "bg-emerald-100 text-emerald-700" :
                            hist.category === "Baik" ? "bg-emerald-50 text-emerald-600" :
                            "bg-amber-100 text-amber-700"
                          }`}>
                            {hist.category}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </AppShell>
  );
}
