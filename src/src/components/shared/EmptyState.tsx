interface EmptyStateProps {
    message: string;
    className?: string;
}

export default function EmptyState({ message, className = "text-gray-600 dark:text-gray-400" }: EmptyStateProps) {
    return <p className={className}>{message}</p>;
}
