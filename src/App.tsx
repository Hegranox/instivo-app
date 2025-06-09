import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import moment from "moment";
import { Eye, Menu, Plus } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { DataTable } from "./components/ui/data-table";
import DataTablePagination from "./components/ui/data-table-pagination";
import FilterSalaryModal from "./modals/FilterSalaryModal";
import NewSalaryModal from "./modals/NewSalaryModal";
import ViewSalaryModal from "./modals/ViewSalaryModal";

import { getSalaries, createSalary } from "./services/salary";
import type { Salary } from "./@types/salary";

const SalaryManagementApp = () => {
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState({
    dataAdmissaoInicio: "",
    dataAdmissaoFim: "",
    salarioBrutoInicio: 0,
    salarioBrutoFim: 0,
    page: 1,
    limit: 5,
  });

  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedSalary, setSelectedSalary] = useState<Salary | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data, error, isPending } = useQuery({
    queryKey: ["salaries", filters],
    queryFn: async () => {
      try {
        return await getSalaries(filters);
      } catch (err) {
        const axiosErr = err as AxiosError<{ message: string }>;
        throw new Error(
          axiosErr.response?.data?.message || "Erro ao carregar salários"
        );
      }
    },
  });

  const { mutate } = useMutation({
    mutationFn: async (salary: {
      dataAdmissao: Date;
      salarioBruto: number;
    }) => {
      try {
        return await createSalary(salary);
      } catch (err) {
        const axiosErr = err as AxiosError<{ message: string }>;
        throw new Error(
          axiosErr.response?.data?.message || "Erro ao criar salário"
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["salaries", filters] });
    },
  });

  const handleCreate = useCallback(
    (salary: { dataAdmissao: Date; salarioBruto: number }) => {
      mutate(salary);
    },
    [mutate]
  );

  const handleApplyFilters = useCallback(
    (values: Partial<typeof filters>) => {
      setFilters((prev) => ({ ...prev, ...values }));
      queryClient.invalidateQueries({ queryKey: ["salaries", filters] });
    },
    [filters, queryClient]
  );

  const handleViewSalary = useCallback((salary: Salary) => {
    setSelectedSalary(salary);
    setIsViewModalOpen(true);
  }, []);

  const columns: ColumnDef<Salary>[] = [
    {
      accessorKey: "dataAdmissao",
      header: "Data Admissão",
      cell: ({ row }) => moment(row.original.dataAdmissao).format("DD/MM/YYYY"),
    },
    {
      accessorKey: "salarioBruto",
      header: "Salário Bruto",
      cell: ({ row }) =>
        new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(row.original.salarioBruto),
    },
    {
      accessorKey: "salarioLiquido",
      header: "Salário Líquido",
      cell: ({ row }) =>
        new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(row.original.salarioLiquido),
    },
    {
      accessorKey: "diasDecorridosAdmissao",
      header: "Dias Decorridos",
    },
    {
      accessorKey: "mesesDecorridosAdmissao",
      header: "Meses Decorridos",
    },
    {
      accessorKey: "anosDecorridosAdmissao",
      header: "Anos Decorridos",
    },
    {
      accessorKey: "actions",
      header: "Ações",
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleViewSalary(row.original)}
        >
          <Eye className="w-4 h-4" />
        </Button>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar (Desktop) */}
        <aside className="hidden lg:block w-80 border-r border-gray-200 bg-white shadow-sm h-screen">
          <FilterSalaryModal onSubmit={handleApplyFilters} />
        </aside>

        {/* Conteúdo principal */}
        <main className="flex-1 p-4 lg:p-6">
          {/* Header */}
          <header className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="lg:hidden">
                    <Menu className="w-4 h-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader>
                    <SheetTitle>Filtros</SheetTitle>
                  </SheetHeader>
                  <FilterSalaryModal onSubmit={handleApplyFilters} />
                </SheetContent>
              </Sheet>

              <h1 className="text-2xl font-semibold text-gray-900">
                Gestão de Salários
              </h1>
            </div>

            <Button onClick={() => setIsNewModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Salário
            </Button>
          </header>

          {/* Tabela */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <DataTable
                  columns={columns}
                  data={data?.salarios || []}
                  isLoading={isPending}
                  isError={!!error}
                  errorMessage={error?.message || "Erro ao carregar salários"}
                />
              </div>

              {/* Paginação */}
              <DataTablePagination
                currentPage={filters.page}
                totalItems={data?.total || 0}
                itemsPerPage={filters.limit}
                onPageChange={(page) =>
                  setFilters((prev) => ({ ...prev, page }))
                }
              />
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Modal: Novo Salário */}
      <NewSalaryModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onSubmit={(values) => {
          handleCreate(values);
          setIsNewModalOpen(false);
        }}
      />

      {/* Modal: Visualizar Salário */}
      <ViewSalaryModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        selectedSalary={selectedSalary}
      />
    </div>
  );
};

export default SalaryManagementApp;
