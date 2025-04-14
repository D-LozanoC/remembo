import ReactDOM from 'react-dom';

// Components
import { Button } from './Button';
import { useRouter } from 'next/navigation';

interface SuccessAlertProps {
    show: boolean;
    title: string;
    description: string;
    buttonText: string;
    url: string;
}

export function SuccessAlert({ show, title, description, buttonText, url, }: SuccessAlertProps) {
    const router = useRouter();

    if (!show) return null;

    return ReactDOM.createPortal(
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="flex flex-row justify-around bg-green-100 border border-green-400 text-green-800 rounded-md w-full max-w-sm shadow-lg transition-all duration-300">
                <div className="self-center">
                    <svg
                        className="h-8 w-8 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <div className="flex flex-col gap-4 justify-between text-center p-5">
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <p className="text-sm">{description}</p>
                    <Button variant='success' onClick={() => router.push(url)}>
                        {buttonText}
                    </Button>
                </div>
            </div>
            <div className="mt-4 flex justify-center">

            </div>
        </div>,
        document.body
    );
}
