import { FormEvent, useState } from 'react';
import { Leaf } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import { api } from '../../lib/api';
import { setSession } from '../../lib/session';

interface AuthUser {
    _id: string;
    token: string;
}

interface ApiEnvelope<T> {
    success: boolean;
    data: T;
}

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await api.post<ApiEnvelope<AuthUser>>('/api/users/login', {
                email,
                password
            });

            if (response.data.success) {
                setSession({ userId: response.data.data._id, token: response.data.data.token });
                navigate('/');
            }
        } catch (submitError) {
            const message = submitError instanceof Error ? submitError.message : 'Invalid email or password';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-white max-w-md mx-auto relative px-6 py-12">
            <div className="flex-1 flex flex-col justify-center">
                <div className="flex flex-col items-center mb-10">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <Leaf className="w-10 h-10 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome to BinGo</h1>
                    <p className="text-gray-500 mt-2 text-center">Smart recycling starts with you.</p>
                </div>

                <form className="space-y-4 w-full" onSubmit={handleSubmit}>
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-gray-50"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                        />
                    </div>

                    <div>
                        <div className="flex justify-between mb-1">
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <a href="#" className="text-sm text-primary hover:text-primary-hover font-medium">Forgot?</a>
                        </div>
                        <input
                            type="password"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-gray-50"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primary-hover text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-primary/20 transition-all active:scale-[0.98] mt-6 disabled:opacity-70"
                    >
                        {loading ? 'Logging in...' : 'Log In'}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-gray-500">
                        Don&apos;t have an account?{' '}
                        <Link to="/signup" className="text-primary font-semibold hover:underline">
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
