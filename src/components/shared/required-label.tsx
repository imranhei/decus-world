import { Label } from "@/components/ui/label";

type RequiredLabelProps = {
  children: React.ReactNode;
};

export function RequiredLabel({ children }: RequiredLabelProps) {
  return (
    <Label>
      {children} <span className="text-red-500">*</span>
    </Label>
  );
}
