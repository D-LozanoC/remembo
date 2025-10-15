import { ActionButtonProps } from '@/types/props';
import { cn } from '@/utils/cn';

const variantStyles = {
    close: 'text-gray-600 hover:text-red-600 hover:bg-red-100 focus:ring-red-300',
    edit: 'text-gray-600 hover:text-blue-600 hover:bg-blue-100 focus:ring-blue-300',
    delete: 'text-gray-600 hover:text-red-600 hover:bg-red-100 focus:ring-red-300',
    back: 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-100 focus:ring-indigo-300',
    relate: 'text-gray-600 hover:text-green-600 hover:bg-green-100 focus:ring-green-300',
    validate: 'text-gray-600 hover:text-yellow-600 hover:bg-yellow-100 focus:ring-yellow-300',
    derive: 'text-gray-600 hover:text-purple-600 hover:bg-purple-100 focus:ring-purple-300',
} as const;

export function ActionButton({ icon: Icon, label, variant, onClick, isDisabled = false }: ActionButtonProps) {
    return (
        <button
            onClick={onClick}
            aria-label={label ?? variant}
            className={cn(
                'flex items-center gap-1 p-2 sm:p-3 rounded-lg text-xl sm:text-2xl bg-white border border-gray-200',
                'shadow-sm hover:shadow-md transition transform hover:scale-105',
                'focus:outline-none focus:ring-2 focus:ring-offset-1',
                'disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none',
                variantStyles[variant]
            )}
            disabled={isDisabled}
        >
            <Icon />
            {label && <span className="text-xs sm:text-sm font-medium">{label}</span>}
        </button>
    );
}
