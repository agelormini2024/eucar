import ButtonGoBack from "./ButtonGoBack"

type AlertVariant = "info" | "warning" | "success" | "error"

interface InfoAlertProps {
    title: string
    message: string
    subMessage?: string
    variant?: AlertVariant
    showBackButton?: boolean
}

const variantStyles = {
    info: {
        container: "bg-blue-50 border-blue-200",
        icon: "text-blue-500",
        title: "text-gray-800"
    },
    warning: {
        container: "bg-yellow-50 border-yellow-200",
        icon: "text-yellow-500",
        title: "text-gray-800"
    },
    success: {
        container: "bg-green-50 border-green-200",
        icon: "text-green-500",
        title: "text-gray-800"
    },
    error: {
        container: "bg-red-50 border-red-200",
        icon: "text-red-500",
        title: "text-gray-800"
    }
}

const icons = {
    info: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    ),
    warning: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    ),
    success: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    ),
    error: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    )
}

export default function InfoAlert({ 
    title, 
    message, 
    subMessage, 
    variant = "info",
    showBackButton = true 
}: InfoAlertProps) {
    const styles = variantStyles[variant]
    const icon = icons[variant]

    return (
        <div className={`${styles.container} border rounded-lg p-6 max-w-2xl mx-auto mt-8`}>
            <div className="flex items-start">
                <svg 
                    className={`h-6 w-6 ${styles.icon} mr-3 mt-1 flex-shrink-0`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                >
                    {icon}
                </svg>
                <div className="flex-1">
                    <h3 className={`text-lg font-semibold ${styles.title} mb-2`}>
                        {title}
                    </h3>
                    <p className="text-gray-700 mb-4">
                        {message}
                    </p>
                    {subMessage && (
                        <p className="text-gray-600 text-sm">
                            {subMessage}
                        </p>
                    )}
                </div>
            </div>
            {showBackButton && (
                <div className="mt-6">
                    <ButtonGoBack />
                </div>
            )}
        </div>
    )
}
