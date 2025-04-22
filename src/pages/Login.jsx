import { useState } from 'react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginUser } from '../slices/authSlice';


export default function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleChange = (e) => {
        setError('');
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            const response = await dispatch(loginUser(formData)).unwrap();
            if (response.token) {
                navigate('/projects');
            }

            // For demo purposes, show error if email doesn't contain @
            if (!formData.email.includes('@')) {
                throw new Error('Please enter a valid email address');
            }

            // Success would redirect or update state
        } catch (err) {
            setError(err.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-100 via-purple-100 to-pink-100 px-4">
            <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 sm:p-8 border border-purple-100">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-purple-700">SocialFlow</h1>
                    <p className="text-sm text-gray-500 mt-2">Automate your social presence effortlessly</p>
                </div>

                {error && (
                    <div className="mb-4 bg-red-50 text-red-700 p-3 rounded-md text-sm border border-red-200">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            placeholder="you@example.com"
                            required
                            disabled={loading}
                            autoComplete="email"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                id="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                placeholder="••••••••"
                                required
                                disabled={loading}
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                                tabIndex="-1"
                            >
                                {showPassword ? (
                                    <EyeOffIcon className="h-5 w-5" />
                                ) : (
                                    <EyeIcon className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                        <div className="flex justify-end mt-1">
                            <a href="/forgot-password" className="text-xs text-purple-600 hover:text-purple-800">
                                Forgot password?
                            </a>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className={`w-full bg-purple-600 text-white py-2 rounded-md font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition ${loading ? "opacity-80 cursor-not-allowed" : ""
                            }`}
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Signing in...
                            </span>
                        ) : (
                            "Sign in"
                        )}
                    </button>

                    <div className="flex items-center">
                        <input
                            id="remember-me"
                            name="remember-me"
                            type="checkbox"
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                            Remember me
                        </label>
                    </div>
                </form>

                <div className="mt-6 text-sm text-center text-gray-500">
                    Don't have an account? <a href="/register" className="text-purple-600 font-medium hover:text-purple-800">Sign up</a>
                </div>

                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        {/* <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">or continue with</span>
                        </div> */}
                    </div>
                    {/* 
                    <div className="mt-6 grid grid-cols-2 gap-3">
                        <button
                            className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                        >
                            <img src="/api/placeholder/20/20" alt="Google icon" className="h-5 w-5 mr-2" />
                            Google
                        </button>
                        <button
                            className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                        >
                            <img src="/api/placeholder/20/20" alt="Apple icon" className="h-5 w-5 mr-2" />
                            Apple
                        </button>
                    </div> */}
                </div>

                <p className="mt-6 text-xs text-center text-gray-500">
                    By signing in, you agree to our <a href="/terms" className="text-purple-600 hover:text-purple-800">Terms</a> and <a href="/privacy" className="text-purple-600 hover:text-purple-800">Privacy Policy</a>.
                </p>
            </div>
        </div>
    );
}