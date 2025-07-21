
import { useState } from "react"

export const UserDropdown = ({ user, onLogout, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [firstName, setFirstName] = useState(user.firstName);
    const [lastName, setLastName] = useState(user.lastName);

    const handleUpdate = () => {
        onUpdate({ firstName, lastName });
        setIsEditing(false);
    };

    return (
        <div className="absolute right-4 top-16 w-64 bg-white border border-gray-200 rounded-lg shadow-xl z-50 animate-fade-in">
            {!isEditing ? (
                <>
                    <div className="px-6 py-4 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-lg">
                                    {user.firstName[0].toUpperCase()}
                                </span>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">{user.firstName} {user.lastName}</p>
                                <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                        </div>
                    </div>

                    <div className="py-2">
                        <button
                            className="w-full px-6 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 transition-colors"
                            onClick={() => setIsEditing(true)}
                        >
                            <span className="text-gray-600">✏️</span>
                            <span className="text-gray-700 font-medium">Edit Profile</span>
                        </button>
                        <button
                            className="w-full px-6 py-3 text-left hover:bg-red-50 flex items-center space-x-3 transition-colors text-red-600"
                            onClick={onLogout}
                        >
                            <span>🚪</span>
                            <span className="font-medium">Logout</span>
                        </button>
                    </div>
                </>
            ) : (
                <div className="px-6 py-4">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900">Edit Profile</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                            <input
                                type="text"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                            <input
                                type="text"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>
                        <div className="flex space-x-2 pt-2">
                            <button
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 font-medium transition-colors"
                                onClick={handleUpdate}
                            >
                                Save Changes
                            </button>
                            <button
                                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg px-4 py-2 font-medium transition-colors"
                                onClick={() => setIsEditing(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
