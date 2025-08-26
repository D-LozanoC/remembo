import { MdCheckCircle, MdError } from "react-icons/md";
import { HiX } from "react-icons/hi";
import { IconType } from "react-icons";
import { FeedbackMessageProps } from "@/types/props";



export default function FeedbackMessage({
  type,
  message,
  onDismiss,
  className = "",
  iconSize = 24
}: FeedbackMessageProps) {
  if (!message) return null;

  const Icon: IconType = type === "success" ? MdCheckCircle : MdError;

  return (
    <div
      role={type === "error" ? "alert" : "status"}
      className={`relative p-4 pr-12 rounded-lg flex items-start gap-4 shadow-lg ${
        type === "success"
          ? "bg-green-50 border-2 border-green-200"
          : "bg-red-50 border-2 border-red-200"
      } ${className}`}
    >
      {/* Icono principal */}
      <div className="flex-shrink-0">
        <Icon 
          size={iconSize} 
          className={type === "success" ? "text-green-500" : "text-red-500"}
          aria-hidden="true"
        />
      </div>
      
      {/* Mensaje */}
      <div className="flex-1">
        <p className={`text-sm font-semibold ${
          type === "success" ? "text-green-800" : "text-red-800"
        }`}>
          {message}
        </p>
      </div>
      
      {/* Botón de cierre */}
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Cerrar mensaje"
          className={`absolute top-3 right-3 p-1 rounded-full hover:bg-opacity-20 transition-colors
            ${
              type === "success" 
                ? "hover:bg-green-500 text-green-700" 
                : "hover:bg-red-500 text-red-700"
            }`
          }
        >
          <HiX className="w-5 h-5" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}