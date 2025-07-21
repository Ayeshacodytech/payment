
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Appbar } from '../Componenets/AppBar';

export const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchTransactions(currentPage);
    }, [currentPage]);

    const fetchTransactions = async (page) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `https://payment-ez9j.onrender.com/api/v1/account/transactions?page=${page}&limit=10`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setTransactions(response.data.transactions);
            setTotalPages(response.data.totalPages);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching transactions:', error);
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Appbar />
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
                        <div className="space-y-4">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="bg-white p-4 rounded-lg shadow">
                                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Appbar />
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">Transaction History</h1>

                    {transactions.length === 0 ? (
                        <div className="text-center py-8">
                            <div className="text-6xl mb-4">💸</div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No transactions yet</h3>
                            <p className="text-gray-500">Start sending money to see your transaction history.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {transactions.map((transaction) => (
                                <div
                                    key={transaction._id}
                                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${transaction.type === 'sent'
                                                ? 'bg-red-100 text-red-600'
                                                : 'bg-green-100 text-green-600'
                                            }`}>
                                            <span className="text-xl">
                                                {transaction.type === 'sent' ? '↗️' : '↙️'}
                                            </span>
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900">
                                                {transaction.type === 'sent' ? `To ${transaction.to}` : `From ${transaction.from}`}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {formatDate(transaction.timestamp)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className={`font-semibold ${transaction.type === 'sent' ? 'text-red-600' : 'text-green-600'
                                            }`}>
                                            {transaction.type === 'sent' ? '-' : '+'}₹{transaction.amount.toFixed(2)}
                                        </div>
                                        <div className={`text-xs px-2 py-1 rounded-full ${transaction.status === 'completed'
                                                ? 'bg-green-100 text-green-800'
                                                : transaction.status === 'pending'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                            {transaction.status}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {totalPages > 1 && (
                        <div className="flex justify-center space-x-2 mt-6">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <span className="px-4 py-2 text-gray-700">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
