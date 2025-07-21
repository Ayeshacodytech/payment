import React, { useEffect, useState } from "react";
import axios from "axios";

export const Balance = () => {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showBalance, setShowBalance] = useState(true);
  const [stats, setStats] = useState({ thisMonth: 0, lastTransfer: 0 }); // Initialize stats

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch balance
        const balanceResponse = await axios.get(
          "https://payment-ez9j.onrender.com/api/v1/account/balance",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setBalance(balanceResponse.data.balance);

        // Fetch transaction statistics
        const statsResponse = await axios.get(
          "https://payment-ez9j.onrender.com/api/v1/account/stats",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setStats(statsResponse.data);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  console.log(stats)
  return (
    <div className="bg-gradient-to-br from-green-400 to-blue-500 rounded-xl p-6 text-white shadow-lg mb-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-green-100 text-sm font-medium mb-1">
            Available Balance
          </p>
          <div className="flex items-center space-x-3">
            {loading ? (
              <div className="animate-pulse bg-white bg-opacity-20 h-8 w-32 rounded"></div>
            ) : (
              typeof balance === "object" && balance !== null &&
                typeof balance.net !== "undefined" ? (
                <div>
                  <p className="text-sm">Sent: ₹ {balance.sent ?? 0}</p>
                  <p className="text-sm">Received: ₹ {balance.received ?? 0}</p>
                  <p className="text-3xl font-bold">
                    Net: ₹ {showBalance ? (balance.net ?? 0).toFixed(2) : "••••••"}
                  </p>
                </div>
              ) : (
                <p className="text-3xl font-bold">
                  ₹ {showBalance ? (Number(balance) || 0).toFixed(2) : "••••••"}
                </p>
              )
            )}
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="text-white hover:text-green-200 transition-colors"
            >
              {showBalance ? "👁️" : "🙈"}
            </button>
          </div>
        </div>
        <div className="text-right">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <span className="text-2xl">💰</span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex space-x-2">
        <div className="flex-1 bg-white bg-opacity-20 rounded-lg p-2 text-center">
          <p className="text-xs text-green-100">This Month</p>
          <p className="font-semibold">
            Sent: ₹ {stats?.thisMonth?.sent ?? 0}<br />
            Received: ₹ {stats?.thisMonth?.received ?? 0}<br />
            Net: ₹ {stats?.thisMonth?.net ?? 0}
          </p>
        </div>
        <div className="flex-1 bg-white bg-opacity-20 rounded-lg p-2 text-center">
          <p className="text-xs text-green-100">Last Month</p>
          <p className="font-semibold">
            Sent: ₹ {stats?.lastMonth?.sent ?? 0}<br />
            Received: ₹ {stats?.lastMonth?.received ?? 0}<br />
            Net: ₹ {stats?.lastMonth?.net ?? 0}
          </p>
        </div>
      </div>
    </div>
  );
};
