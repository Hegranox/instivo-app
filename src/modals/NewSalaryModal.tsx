import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { DatePickerField } from "@/components/ui/date-picker-field";
import MoneyInput from "@/components/ui/money-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface NewSalaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { dataAdmissao: Date; salarioBruto: number }) => void;
}

const FormSchema = z.object({
  dataAdmissao: z
    .date({
      required_error: "Data de admissão é obrigatória",
    })
    .refine((date) => date <= new Date(), {
      message: "Data de admissão não pode ser maior que hoje",
    }),
  salarioBruto: z
    .number({
      required_error: "Salário bruto é obrigatório",
    })
    .min(1518, "Salário deve ser maior ou igual a R$ 1.518,00")
    .max(30000, "Salário deve ser menor ou igual a R$ 30.000,00"),
});

export default function NewSalaryModal({
  isOpen,
  onClose,
  onSubmit,
}: NewSalaryModalProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      dataAdmissao: undefined,
      salarioBruto: 0,
    },
  });

  useEffect(() => {
    if (isOpen) form.reset();
  }, [form, isOpen]);

  function onSubmitForm(data: z.infer<typeof FormSchema>) {
    onSubmit(data);
    form.reset();
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Novo Salário</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmitForm)}
            className="space-y-4"
          >
            <DatePickerField
              control={form.control}
              name="dataAdmissao"
              label="Data de Admissão"
            />

            <FormField
              control={form.control}
              name="salarioBruto"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <MoneyInput
                      label="Salário Bruto"
                      value={field.value}
                      onChange={field.onChange}
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="flex space-x-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
