
export function InputBox({ label, placeholder, onChange, type = "text" }) {
    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>
            <input
                onChange={onChange}
                placeholder={placeholder}
                type={type}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
            />
        </div>
    )
}
