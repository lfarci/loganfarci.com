interface EmptyStateProps {
    message: string;
    className?: string;
}

export default function EmptyState({ message, className = "text-text-secondary" }: EmptyStateProps) {
    return <p className={className}>{message}</p>;
}
