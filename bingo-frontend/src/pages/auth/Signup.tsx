import { Link } from 'react-router-dom';
import { Leaf } from 'lucide-react';

export default function Signup() {
    return (
        <div className="flex flex-col min-h-screen bg-white max-w-md mx-auto relative px-6 py-12">
            <div className="flex-1 flex flex-col justify-center">
                {/* Logo and Header */}
                <div className="flex flex-col items-center mb-10">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <Leaf className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Create Account</h1>
                    <p className="text-gray-500 mt-2 text-center">Join the eco-friendly community.</p>
                </div>

                {/* Signup Form */}
                <form className="space-y-4 w-full">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-gray-50"
                            placeholder="John Doe"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-gray-50"
                            placeholder="Enter your email"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-gray-50"
                            placeholder="Create a password"
                        />
                    </div>

                    <Link to="/" className="block">
                        <button
                            type="button"
                            className="w-full bg-primary hover:bg-primary-hover text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-primary/20 transition-all active:scale-[0.98] mt-6"
                        >
                            Sign Up
                        </button>
                    </Link>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-gray-500">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary font-semibold hover:underline">
                            Log In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
