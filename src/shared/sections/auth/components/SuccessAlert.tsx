import ReactDOM from 'react-dom';
import { Button } from '../../../atoms/Button';
import { useRouter } from 'next/navigation';

interface SuccessAlertProps {
    show: boolean;
    title: string;
    description: string;
    buttonText: string;
    url?: string;
}

export default function SuccessAlert({ show, title, description, buttonText, url }: SuccessAlertProps) {
    const router = useRouter();

    if (!show) return null;

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
            <div className="w-full max-w-md max-[400px]:max-w-[90%] bg-green-50 border border-green-400 text-green-800 rounded-2xl shadow-xl transition-all duration-300 animate-fadeIn flex flex-col items-center p-6 space-y-4">
                <div className="bg-green-100 rounded-full p-2">
                    <svg
                        className="h-10 w-10 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-center">{title}</h3>
                <p className="text-sm text-center px-2 text-green-900">{description}</p>
                <Button
                    variant="success"
                    onClick={() => url ? router.push(url) : location.reload()}
                    className="w-full"
                >
                    {buttonText}
                </Button>
            </div>
        </div>,
        document.body
    );
}
