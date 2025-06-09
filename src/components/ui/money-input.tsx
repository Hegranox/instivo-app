import React, { useState, useRef, forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface MoneyInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "onBlur" | "value"
  > {
  label?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: (value: number, name?: string) => void;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  id?: string;
  name?: string;
}

const MoneyInput = forwardRef<HTMLInputElement, MoneyInputProps>(
  (
    {
      label,
      placeholder = "0,00",
      value = 0,
      onChange,
      disabled = false,
      required = false,
      className = "",
      id,
      name,
      ...props
    },
    ref
  ) => {
    const [displayValue, setDisplayValue] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    // Função para limpar e extrair apenas números
    const cleanValue = (val: string): string => {
      return val.replace(/\D/g, "");
    };

    // Função para formatar o valor como moeda
    const formatCurrency = (val: string): string => {
      if (!val || val === "0") return "";

      // Remove zeros à esquerda
      val = val.replace(/^0+/, "") || "0";

      // Converte para número com duas casas decimais
      const numericValue = parseFloat(val) / 100;

      // Formata como moeda brasileira
      return numericValue.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    };

    // Função para obter o valor numérico real
    const getNumericValue = (val: string): number => {
      const cleaned = cleanValue(val);
      if (!cleaned || cleaned === "0") return 0;
      return parseFloat(cleaned) / 100;
    };

    // Inicializar displayValue baseado no value prop
    React.useEffect(() => {
      if (value) {
        const numericValue =
          typeof value === "string" ? parseFloat(value) : value;
        if (!isNaN(numericValue) && numericValue > 0) {
          const centavos = Math.round(numericValue * 100).toString();
          setDisplayValue(formatCurrency(centavos));
        } else {
          setDisplayValue("");
        }
      } else {
        setDisplayValue("");
      }
    }, [value]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      const cleaned = cleanValue(inputValue);

      // Limita a 11 dígitos (até 999.999.999,99)
      if (cleaned.length > 11) return;

      const formatted = formatCurrency(cleaned);
      setDisplayValue(formatted);

      // Chama onChange com o valor numérico
      if (onChange) {
        const numericValue = getNumericValue(inputValue);
        onChange(numericValue, name || id);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Permite: backspace, delete, tab, escape, enter
      if (
        [8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
        // Permite: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
        (e.keyCode === 65 && e.ctrlKey === true) ||
        (e.keyCode === 67 && e.ctrlKey === true) ||
        (e.keyCode === 86 && e.ctrlKey === true) ||
        (e.keyCode === 88 && e.ctrlKey === true)
      ) {
        return;
      }
      // Garante que é um número
      if (
        (e.shiftKey || e.keyCode < 48 || e.keyCode > 57) &&
        (e.keyCode < 96 || e.keyCode > 105)
      ) {
        e.preventDefault();
      }
    };

    return (
      <div className="space-y-2">
        {label && (
          <Label htmlFor={id} className="text-sm font-medium">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </Label>
        )}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <span className="text-gray-500 text-sm font-medium">R$</span>
          </div>
          <Input
            {...props}
            ref={ref || inputRef}
            id={id}
            name={name}
            type="text"
            value={displayValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            className={`pl-8 ${className}`}
          />
        </div>
      </div>
    );
  }
);

MoneyInput.displayName = "MoneyInput";

export default MoneyInput;
