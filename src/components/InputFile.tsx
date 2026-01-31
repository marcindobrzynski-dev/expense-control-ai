import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

interface InputFileProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function InputFile({ onChange }: InputFileProps) {
  return (
    <Field>
      <Input type="file" accept="image/*" onChange={onChange} />
      <FieldDescription className="text-sm mb-5">Paste your purchase receipt in photo format.</FieldDescription>
    </Field>
  );
}
