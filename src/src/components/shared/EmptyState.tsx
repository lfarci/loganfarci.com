interface EmptyStateProps {
  message: string;
  className?: string;
}

export default function EmptyState({ message, className = "text-gray-600" }: EmptyStateProps) {
  return <p className={className}>{message}</p>;
}
