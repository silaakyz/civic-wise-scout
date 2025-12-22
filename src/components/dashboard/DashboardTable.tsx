import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  TableIcon,
  Search,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { District } from "@/lib/district";
import { cn } from "@/lib/utils";
import { DistrictDetailDialog } from "./DistrictDetailDialog";

interface DashboardTableProps {
  districts: District[];
}

const getScoreClass = (score: number) => {
  if (score >= 8) return "bg-emerald-500/10 text-emerald-500";
  if (score >= 6) return "bg-green-500/10 text-green-500";
  if (score >= 5) return "bg-amber-500/10 text-amber-500";
  if (score >= 3) return "bg-orange-500/10 text-orange-500";
  return "bg-red-500/10 text-red-500";
};

const ITEMS_PER_PAGE = 10;

export const DashboardTable = ({ districts }: DashboardTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const filteredDistricts = districts.filter((d) =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredDistricts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedDistricts = filteredDistricts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <TableIcon className="w-4 h-4 text-primary" />
            Bölge Detayları
            <Badge variant="secondary" className="ml-2">
              {filteredDistricts.length} bölge
            </Badge>
          </CardTitle>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Bölge ara..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9 bg-background/50"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-border/50 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="text-xs font-semibold">Sıra</TableHead>
                <TableHead className="text-xs font-semibold">Bölge</TableHead>
                <TableHead className="text-xs font-semibold text-center">
                  Genel
                </TableHead>
                <TableHead className="text-xs font-semibold text-center hidden md:table-cell">
                  Altyapı
                </TableHead>
                <TableHead className="text-xs font-semibold text-center hidden md:table-cell">
                  Çevre
                </TableHead>
                <TableHead className="text-xs font-semibold text-center hidden lg:table-cell">
                  Sosyal
                </TableHead>
                <TableHead className="text-xs font-semibold text-center hidden lg:table-cell">
                  Ulaşım
                </TableHead>
                <TableHead className="text-xs font-semibold text-center hidden xl:table-cell">
                  Güvenlik
                </TableHead>
                <TableHead className="text-xs font-semibold text-center">
                  Aksiyon
                </TableHead>
                <TableHead className="text-xs font-semibold w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedDistricts.map((district, index) => (
                <TableRow
                  key={district.id}
                  className="hover:bg-muted/20 transition-colors"
                >
                  <TableCell className="text-xs font-medium text-muted-foreground">
                    #{startIndex + index + 1}
                  </TableCell>
                  <TableCell className="text-xs font-medium">
                    {district.name}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className={cn("text-xs", getScoreClass(district.scores.overall))}>
                      {district.scores.overall.toFixed(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center hidden md:table-cell">
                    <span className="text-xs text-muted-foreground">
                      {district.scores.infrastructure.toFixed(1)}
                    </span>
                  </TableCell>
                  <TableCell className="text-center hidden md:table-cell">
                    <span className="text-xs text-muted-foreground">
                      {district.scores.environment.toFixed(1)}
                    </span>
                  </TableCell>
                  <TableCell className="text-center hidden lg:table-cell">
                    <span className="text-xs text-muted-foreground">
                      {district.scores.social.toFixed(1)}
                    </span>
                  </TableCell>
                  <TableCell className="text-center hidden lg:table-cell">
                    <span className="text-xs text-muted-foreground">
                      {district.scores.transportation.toFixed(1)}
                    </span>
                  </TableCell>
                  <TableCell className="text-center hidden xl:table-cell">
                    <span className="text-xs text-muted-foreground">
                      {district.scores.security.toFixed(1)}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="text-xs">
                      {district.recommendedActions.length}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => {
                        setSelectedDistrict(district);
                        setDetailOpen(true);
                      }}
                    >
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-xs text-muted-foreground">
              {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredDistricts.length)}{" "}
              / {filteredDistricts.length} bölge
            </p>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (page) =>
                    page === 1 ||
                    page === totalPages ||
                    Math.abs(page - currentPage) <= 1
                )
                .map((page, index, arr) => (
                  <span key={page}>
                    {index > 0 && arr[index - 1] !== page - 1 && (
                      <span className="text-muted-foreground px-1">...</span>
                    )}
                    <Button
                      variant={currentPage === page ? "default" : "outline"}
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  </span>
                ))}
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      <DistrictDetailDialog
        district={selectedDistrict}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </Card>
  );
};
