import { useState } from "react"


export const UserDropdown=({user, onLogout, onUpdate})=>{
    const[isEditing,setIsEditing]=useState(false);
    const [firstName, setFirstName] = useState(user.firstName);
    const [lastName, setLastName] = useState(user.lastName);

    const handleUpdate=()=>{
        onUpdate({firstName,lastName});
        setIsEditing(false);
    };

    return (
        <div className="absolute right-0 mt-20 w-48 bg-white border rounded shadow-lg">
            {!isEditing ? (
            <>
                <div className="px-4 py-2">
                    <p className="font-bold">{user.firstName} {user.lastName}</p>
                    <p>{user.email}</p>
                </div>
                <div className="border-t">
                <button
                    className="w-full px-4 py-2 text-left hover:bg-gray-100"
                    onClick={() => setIsEditing(true)}
                >
                    Edit Details
                </button>
                <button
                    className="w-full px-4 py-2 text-left hover:bg-gray-100"
                    onClick={onLogout}
                >
                    Logout
                </button>
                </div>
                </>
            ) : (
            <div className="px-4 py-2">
                <input
                type="text"
                className="w-full mb-2 border rounded px-2 py-1"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                />
                <input
                type="text"
                className="w-full mb-2 border rounded px-2 py-1"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                />
                <button
                className="w-full mb-2 bg-green-500 text-white rounded px-2 py-1"
                onClick={handleUpdate}
                >
                Save
                </button>
                <button
                className="w-full bg-gray-300 rounded px-2 py-1"
                onClick={() => setIsEditing(false)}
                >
                Cancel
                </button>
            </div>
            )}
        </div>
        );
}