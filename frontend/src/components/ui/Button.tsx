import React from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;

  variant?: "primary" | "secondary" | "danger" | "success";

  loading?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  loading = false,
  disabled,
  className = "",
  ...props
}: ButtonProps) {
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",

    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800",

    danger: "bg-red-600 hover:bg-red-700 text-white",

    success: "bg-green-600 hover:bg-green-700 text-white",
  };

  return (
    <button
      disabled={disabled || loading}
      className={`
px-4
py-2
rounded-lg
font-medium
flex
items-center
justify-center
gap-2
transition
disabled:opacity-50
disabled:cursor-not-allowed

${variants[variant]}

${className}
`}
      {...props}
    >
      {loading && <Loader2 className="animate-spin" size={18} />}

      {children}
    </button>
  );
}
