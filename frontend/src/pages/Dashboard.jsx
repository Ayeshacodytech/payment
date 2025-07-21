
import { Appbar } from "../Componenets/AppBar"
import { Balance } from "../Componenets/Balance"
import { Users } from "../Componenets/User"
import { useNavigate } from "react-router-dom"

export const Dashboard = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50">
            <Appbar />
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <Balance />

                        {/* Quick Actions */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                <button
                                    onClick={() => navigate('/transactions')}
                                    className="w-full p-3 text-left hover:bg-gray-50 rounded-lg flex items-center space-x-3 transition-colors"
                                >
                                    <span className="text-2xl">📊</span>
                                    <span className="font-medium text-gray-700">View Transactions</span>
                                </button>
                                <button
                                    onClick={() => navigate('/addmoney')}
                                    className="w-full p-3 text-left hover:bg-gray-50 rounded-lg flex items-center space-x-3 transition-colors"
                                >
                                    <span className="text-2xl">💳</span>
                                    <span className="font-medium text-gray-700">Add Money</span>
                                </button>
                                <button className="w-full p-3 text-left hover:bg-gray-50 rounded-lg flex items-center space-x-3 transition-colors opacity-50 cursor-not-allowed">
                                    <span className="text-2xl">🎯</span>
                                    <span className="font-medium text-gray-700">Set Budget</span>
                                    <span className="text-xs text-gray-400 ml-auto">Coming Soon</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <Users />
                    </div>
                </div>
            </div>
        </div>
    );
};
