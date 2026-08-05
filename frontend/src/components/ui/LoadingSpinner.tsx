import { Loader2 } from "lucide-react";

export default function LoadingSpinner() {
  return (
    <div
      className="
flex
justify-center
p-10
"
    >
      <Loader2 className="animate-spin" size={35} />
    </div>
  );
}
