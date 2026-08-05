import React from "react";

interface Props {
  children: React.ReactNode;

  title?: string;

  className?: string;
}

export default function Card({ children, title, className = "" }: Props) {
  return (
    <div
      className={`
bg-white
rounded-xl
border
shadow-sm
p-6

${className}
`}
    >
      {title && (
        <h2
          className="
text-lg
font-semibold
mb-4
"
        >
          {title}
        </h2>
      )}

      {children}
    </div>
  );
}
