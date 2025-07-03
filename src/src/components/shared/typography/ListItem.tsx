type ListItemProps = {
    className?: string;
    children: React.ReactNode;
};

const ListItem: React.FC<ListItemProps> = ({ children, className = "" }) => {
    return (
        <li className={`!leading-relaxed ${className}`}>
            {children}
        </li>
    );
};

export default ListItem;
