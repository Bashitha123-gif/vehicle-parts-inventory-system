export default function Badge({ children }: { children: string }) {
  return (
    <span
      className="
px-3
py-1
rounded-full
text-xs
bg-blue-100
text-blue-700
"
    >
      {children}
    </span>
  );
}
