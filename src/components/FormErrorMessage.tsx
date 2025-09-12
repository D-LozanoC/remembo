import { ReactNode } from 'react';
import { MdError } from 'react-icons/md';

interface FormErrorMessageProps {
    children: ReactNode;
    className?: string;
}

export default function FormErrorMessage({ children, className = '' }: FormErrorMessageProps) {
    if (!children) return null;

    return (
        <div
            role="alert"
            className={`flex items-center text-red-600 text-sm font-medium space-x-2 mt-1 ${className}`}
        >
            <MdError className="h-4 w-4 text-red-600" />
            <span>{children}</span>
        </div>
    );
}
