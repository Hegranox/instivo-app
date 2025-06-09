import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useId } from "react";

interface InputFieldProps {
  label: string;
  value: string | number | undefined;
  className?: string;
  inputClassName?: string;
  disabled?: boolean;
}

export function InputField({
  label,
  value,
  className,
  inputClassName,
  disabled = true,
}: InputFieldProps) {
  const id = useId();

  return (
    <div className={cn("space-y-1", className)}>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="text"
        value={value}
        disabled={disabled}
        readOnly
        className={cn("bg-muted", inputClassName)}
        aria-label={label}
      />
    </div>
  );
}
