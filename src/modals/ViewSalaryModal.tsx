import type { Salary } from "@/@types/salary";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InputField } from "@/components/ui/input-field";
import { formatCurrency, formatDate } from "@/lib/utils";

interface ViewSalaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSalary: Salary | null;
}

export default function ViewSalaryModal({
  isOpen,
  onClose,
  selectedSalary,
}: ViewSalaryModalProps) {
  const {
    dataAdmissao,
    salarioBruto,
    salarioLiquido,
    diasDecorridosAdmissao,
    mesesDecorridosAdmissao,
    anosDecorridosAdmissao,
  } = selectedSalary ?? {};

  if (!selectedSalary) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Detalhes do Salário</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <InputField
            label="Data de Admissão"
            value={formatDate(dataAdmissao)}
          />
          <InputField
            label="Salário Bruto"
            value={formatCurrency(salarioBruto ?? 0)}
          />
          <InputField
            label="Salário Líquido"
            value={formatCurrency(salarioLiquido ?? 0)}
          />

          <div className="grid grid-cols-3 gap-4">
            <InputField
              label="Dias Decorridos"
              value={diasDecorridosAdmissao ?? 0}
            />
            <InputField
              label="Meses Decorridos"
              value={mesesDecorridosAdmissao ?? 0}
            />
            <InputField
              label="Anos Decorridos"
              value={anosDecorridosAdmissao ?? 0}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
