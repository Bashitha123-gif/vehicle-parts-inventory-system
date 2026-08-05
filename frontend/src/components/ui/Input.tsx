import React from "react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;

  error?: string;
}

export default function Input({
  label,
  error,
  className = "",
  ...props
}: Props) {
  return (
    <div className="space-y-1">
      {label && (
        <label
          className="
text-sm
font-medium
text-gray-700
"
        >
          {label}
        </label>
      )}

      <input
        className={`
w-full
rounded-lg
border
px-4
py-2
outline-none

focus:ring-2
focus:ring-blue-500

${className}

`}
        {...props}
      />

      {error && (
        <p
          className="
text-sm
text-red-500
"
        >
          {error}
        </p>
      )}
    </div>
  );
}
