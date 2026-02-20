import { Link } from 'react-router-dom';
import { Leaf } from 'lucide-react';

export default function Login() {
    return (
        <div className="flex flex-col min-h-screen bg-white max-w-md mx-auto relative px-6 py-12">
            <div className="flex-1 flex flex-col justify-center">
                {/* Logo and Header */}
                <div className="flex flex-col items-center mb-10">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <Leaf className="w-10 h-10 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome to BinGo</h1>
                    <p className="text-gray-500 mt-2 text-center">Smart recycling starts with you.</p>
                </div>

                {/* Login Form */}
                <form className="space-y-4 w-full">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-gray-50"
                            placeholder="Enter your email"
                        />
                    </div>

                    <div>
                        <div className="flex justify-between mb-1">
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <a href="#" className="text-sm text-primary hover:text-primary-hover font-medium">Forgot?</a>
                        </div>
                        <input
                            type="password"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-gray-50"
                            placeholder="Enter your password"
                        />
                    </div>

                    <Link to="/" className="block">
                        <button
                            type="button"
                            className="w-full bg-primary hover:bg-primary-hover text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-primary/20 transition-all active:scale-[0.98] mt-6"
                        >
                            Log In
                        </button>
                    </Link>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-gray-500">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-primary font-semibold hover:underline">
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
