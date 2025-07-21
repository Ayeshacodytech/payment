import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../authentications/AuthContext";
import { UserDropdown } from "./UserDropdown";

const getUserDetails = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found");
  }

  try {
    const response = await axios.get(
      "https://payment-ez9j.onrender.com/api/v1/user/me",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching user details:", error);
    throw error;
  }
};

export const Appbar = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userDetails = await getUserDetails();
        setUser(userDetails);
      } catch (error) {
        setError("Failed to fetch user details");
      } finally {
        setLoading(false);
      }
    };
    fetchUserDetails();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  const handleUpdate = async (updatedUser) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "https://payment-ez9j.onrender.com/api/v1/user/me",
        updatedUser,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUser(updatedUser);
    } catch (error) {
      console.error("Error updating user details:", error);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-700 shadow-lg h-16 flex justify-between items-center">
      <div className="flex items-center ml-6">
        <div className="text-white text-2xl font-bold tracking-wide">
          💳 SPAY
        </div>
        <div className="ml-8 hidden md:flex space-x-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-white hover:text-blue-200 transition-colors font-medium"
          >
            Dashboard
          </button>
          <button
            onClick={() => navigate('/sendmoney')}
            className="text-white hover:text-blue-200 transition-colors font-medium"
          >
            Send Money
          </button>
        </div>
      </div>

      <div className="flex items-center relative">
        {user && user.firstName && (
          <>
            <div className="hidden md:flex items-center mr-4 text-white">
              <span className="text-sm">Welcome back,</span>
              <span className="ml-1 font-semibold">{user.firstName}</span>
            </div>

            <div
              className="relative flex items-center cursor-pointer group"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <div className="rounded-full h-12 w-12 bg-white bg-opacity-20 backdrop-blur-sm flex justify-center items-center mr-4 group-hover:bg-opacity-30 transition-all">
                <div className="text-white text-lg font-bold">
                  {user.firstName[0].toUpperCase()}
                </div>
              </div>
            </div>

            {showDropdown && (
              <UserDropdown
                user={user}
                onLogout={handleLogout}
                onUpdate={handleUpdate}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};
