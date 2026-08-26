import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export type FieldErrors<T extends string> = Partial<Record<T, string[]>>;

export function getFieldError<T extends string>(
  errors: FieldErrors<T>,
  name: T
) {
  return errors[name]?.[0];
}

export function AuthField({
  name,
  label,
  error,
  description,
  labelAction,
  disabled,
  ...inputProps
}: {
  name: string;
  label: string;
  error?: string;
  description?: string;
  labelAction?: React.ReactNode;
} & Omit<React.ComponentProps<typeof Input>, "id" | "name">) {
  const invalid = Boolean(error);
  const describedBy = error
    ? `${name}-error`
    : description
      ? `${name}-description`
      : undefined;

  return (
    <Field data-invalid={invalid || undefined}>
      {labelAction ? (
        <div className="flex items-center">
          <FieldLabel htmlFor={name}>{label}</FieldLabel>
          {labelAction}
        </div>
      ) : (
        <FieldLabel htmlFor={name}>{label}</FieldLabel>
      )}
      <Input
        id={name}
        name={name}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        {...inputProps}
      />
      {error ? (
        <FieldError id={`${name}-error`}>{error}</FieldError>
      ) : description ? (
        <FieldDescription id={`${name}-description`}>
          {description}
        </FieldDescription>
      ) : null}
    </Field>
  );
}
