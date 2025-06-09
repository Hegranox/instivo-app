import { Button } from "@/components/ui/button";
import { DatePickerField } from "@/components/ui/date-picker-field";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import MoneyInput from "@/components/ui/money-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Filter, X } from "lucide-react";
import moment from "moment";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface FilterSalaryModalProps {
  onSubmit: (data: {
    dataAdmissaoInicio: string;
    dataAdmissaoFim: string;
    salarioBrutoInicio: number;
    salarioBrutoFim: number;
  }) => void;
}

const FormSchema = z.object({
  dataAdmissaoInicio: z.date().optional(),
  dataAdmissaoFim: z.date().optional(),
  salarioBrutoInicio: z.number().min(0).optional(),
  salarioBrutoFim: z.number().min(0).optional(),
});

export default function FilterSalaryModal({
  onSubmit,
}: FilterSalaryModalProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      dataAdmissaoInicio: undefined,
      dataAdmissaoFim: undefined,
      salarioBrutoInicio: undefined,
      salarioBrutoFim: undefined,
    },
  });

  const clearFilters = () => {
    form.reset({
      dataAdmissaoInicio: undefined,
      dataAdmissaoFim: undefined,
      salarioBrutoInicio: undefined,
      salarioBrutoFim: undefined,
    });

    onSubmit({
      dataAdmissaoInicio: "",
      dataAdmissaoFim: "",
      salarioBrutoInicio: 0,
      salarioBrutoFim: 0,
    });
  };

  const onSubmitForm = (data: z.infer<typeof FormSchema>) => {
    onSubmit({
      dataAdmissaoInicio: data.dataAdmissaoInicio
        ? moment(data.dataAdmissaoInicio).format("YYYY-MM-DD")
        : "",
      dataAdmissaoFim: data.dataAdmissaoFim
        ? moment(data.dataAdmissaoFim).format("YYYY-MM-DD")
        : "",
      salarioBrutoInicio: data.salarioBrutoInicio ?? 0,
      salarioBrutoFim: data.salarioBrutoFim ?? 0,
    });
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Filtros</h3>
        <Button variant="outline" size="sm" onClick={clearFilters}>
          <X className="w-4 h-4 mr-2" />
          Limpar
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmitForm)} className="space-y-4">
          <DatePickerField
            control={form.control}
            name="dataAdmissaoInicio"
            label="Data Início Admissão"
          />

          <DatePickerField
            control={form.control}
            name="dataAdmissaoFim"
            label="Data Fim Admissão"
          />

          <FormField
            control={form.control}
            name="salarioBrutoInicio"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormControl>
                  <MoneyInput
                    label="Salário Mínimo"
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                {fieldState.error && (
                  <FormMessage>{fieldState.error.message}</FormMessage>
                )}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="salarioBrutoFim"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormControl>
                  <MoneyInput
                    label="Salário Máximo"
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                {fieldState.error && (
                  <FormMessage>{fieldState.error.message}</FormMessage>
                )}
              </FormItem>
            )}
          />

          <div className="mt-auto pt-4">
            <Button type="submit" className="w-full">
              <Filter className="w-4 h-4 mr-2" />
              Aplicar Filtros
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
