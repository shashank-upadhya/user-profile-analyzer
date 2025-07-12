import { cn } from '@/lib/utils'; // Assuming you have a utils.ts with the cn function

interface ListItem {
    label: string;
    href?: string | null;
    description?: string | null;
}

interface ListProps {
    items: ListItem[];
    className?: string;
}

export const List: React.FC<ListProps> = ({ items, className }) => {
    return (
        <ul className={cn('list-disc pl-5 space-y-2', className)}>
            {items.map((item, index) => (
                <li key={index}>
                    {item.href ? (
                        <a href={item.href} target="_blank" rel="noopener noreferrer" className="font-medium">
                            {item.label}
                        </a>
                    ) : (
                        <span className="font-medium">{item.label}</span>
                    )}
                    {item.description && <div className="text-sm text-muted-foreground">{item.description}</div>}
                </li>
            ))}
        </ul>
    );
};