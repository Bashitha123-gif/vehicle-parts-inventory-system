interface Props {
  message: string;
}

export default function EmptyState({ message }: Props) {
  return (
    <div
      className="
text-center
py-10
text-gray-500
"
    >
      <p>{message}</p>
    </div>
  );
}
