
export function Button({ label, onClick, loading = false, variant = "primary" }) {
    const baseClasses = "w-full font-medium rounded-lg text-sm px-5 py-3 transition-all duration-200 focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-300",
        secondary: "text-blue-600 bg-blue-50 hover:bg-blue-100 focus:ring-blue-300",
        danger: "text-white bg-red-600 hover:bg-red-700 focus:ring-red-300"
    };

    return (
        <button
            onClick={onClick}
            disabled={loading}
            className={`${baseClasses} ${variants[variant]}`}
        >
            {loading ? (
                <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Loading...</span>
                </div>
            ) : (
                label
            )}
        </button>
    )
}
