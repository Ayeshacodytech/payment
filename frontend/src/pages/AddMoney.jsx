
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Appbar } from '../Componenets/AppBar';

export const AddMoney = () => {
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleAddMoney = async () => {
        if (!amount || amount <= 0) {
            setMessage('Please enter a valid amount');
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                'https://payment-ez9j.onrender.com/api/v1/account/add-money',
                {
                    amount: parseFloat(amount),
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                setMessage('Money added successfully!');
                setTimeout(() => {
                    navigate('/dashboard');
                }, 2000);
            }
        } catch (error) {
            setMessage(
                'Failed to add money: ' + (error.response?.data?.message || error.message)
            );
        } finally {
            setLoading(false);
        }
    };

    const quickAmounts = [100, 500, 1000, 2000, 5000];

    return (
        <div className="min-h-screen bg-gray-50">
            <Appbar />
            <div className="max-w-md mx-auto px-4 py-8">
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl">💰</span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Add Money</h1>
                        <p className="text-gray-600 mt-2">Add funds to your wallet</p>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Enter Amount (₹)
                            </label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                                placeholder="0.00"
                                min="1"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Quick Select
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {quickAmounts.map((quickAmount) => (
                                    <button
                                        key={quickAmount}
                                        onClick={() => setAmount(quickAmount.toString())}
                                        className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                                    >
                                        ₹{quickAmount}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={handleAddMoney}
                            disabled={loading || !amount}
                            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-3 rounded-lg transition-colors"
                        >
                            {loading ? 'Processing...' : `Add ₹${amount || '0'}`}
                        </button>

                        {message && (
                            <div className={`text-center p-3 rounded-lg ${message.includes('successfully')
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                {message}
                            </div>
                        )}

                        <div className="text-xs text-gray-500 text-center">
                            <p>💡 This is a demo feature for testing purposes</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
