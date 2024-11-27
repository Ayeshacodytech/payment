import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserDropdown } from "./UserDropdown";

const getUserDetails = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found");
  }

  try {
    const response = await axios.get("http://localhost:3000/api/v1/user/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
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
    localStorage.removeItem("token");
    navigate("/signin");
  };
  const handleUpdate = async (updatedUser) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put("http://localhost:3000/api/v1/user/me", updatedUser, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(updatedUser);
    } catch (error) {
      console.error("Error updating user details:", error);
    }
  };
  return (
    <div className="shadow h-14 flex justify-between">
      <div className="flex flex-col justify-center h-full ml-4">SPAY</div>
      <div className="flex">
        {user && user.firstName && (
          <>
            <div
              className="flex flex-col justify-center h-full mr-4"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              Welcome, {user.firstName.toUpperCase()}
            </div>
            <div
              className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <div className="flex flex-col justify-center h-full text-xl">
                {user.firstName[0].toUpperCase()}
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
