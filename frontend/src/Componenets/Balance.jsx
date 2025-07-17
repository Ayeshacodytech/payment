import axios from "axios";
import { useEffect, useState } from "react";
const fetchBalance = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found");
  }

  try {
    const response = await axios.get(
      "https://payment-ez9j.onrender.com/api/v1/account/balance",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.balance;
  } catch (error) {
    console.error("Error fetching balance:", error);
    throw error;
  }
};
export const Balance = () => {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const getBalance = async () => {
      try {
        const balance = await fetchBalance();
        setBalance(balance);
      } catch (error) {
        setError("Failed to fetch balance");
      } finally {
        setLoading(false);
      }
    };
    getBalance();
  }, []);
  return (
    <div className="flex">
      <div className="font-bold text-lg">Your balance</div>
      <div className="font-semibold ml-4 text-lg">Rs {balance}</div>
    </div>
  );
};
