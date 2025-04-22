import { useState } from 'react';
import { EyeIcon, EyeOffIcon, CheckCircleIcon, XCircleIcon } from 'lucide-react';

export default function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [passwordStrength, setPasswordStrength] = useState({
        score: 0,
        hasMinLength: false,
        hasUppercase: false,
        hasNumber: false,
        hasSpecialChar: false
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setError('');
        setFormData(prev => ({ ...prev, [name]: value }));

        // Check password strength when password field changes
        if (name === 'password') {
            checkPasswordStrength(value);
        }
    };

    const checkPasswordStrength = (password) => {
        const hasMinLength = password.length >= 8;
        const hasUppercase = /[A-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        // Calculate score based on criteria met
        const metCriteria = [hasMinLength, hasUppercase, hasNumber, hasSpecialChar].filter(Boolean).length;

        setPasswordStrength({
            score: metCriteria,
            hasMinLength,
            hasUppercase,
            hasNumber,
            hasSpecialChar
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (passwordStrength.score < 3) {
            setError('Please create a stronger password');
            return;
        }

        setLoading(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            console.log('Submitting:', formData);

            // In a real app, you would send this data to your backend

            // For demo: Simulate error if email already exists
            if (formData.email === 'test@example.com') {
                throw new Error('Email already in use. Please use a different email or log in.');
            }

            // Success would redirect or update state
            // window.location.href = '/dashboard';
        } catch (err) {
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const getStrengthColor = (score) => {
        if (score === 0) return 'bg-gray-200';
        if (score === 1) return 'bg-red-500';
        if (score === 2) return 'bg-yellow-500';
        if (score === 3) return 'bg-blue-500';
        return 'bg-green-500';
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-100 via-purple-100 to-pink-100 px-4 py-12">
            <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 sm:p-8 border border-purple-100">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-purple-700">SocialFlow</h1>
                    <p className="text-sm text-gray-500 mt-2">Create your account and start automating</p>
                </div>

                {error && (
                    <div className="mb-6 bg-red-50 text-red-700 p-3 rounded-md text-sm border border-red-200">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            placeholder="John Doe"
                            required
                            disabled={loading}
                            autoComplete="name"
                        />
                    </div>

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
                                required
                                disabled={loading}
                                autoComplete="new-password"
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

                        {/* Password strength meter */}
                        {formData.password && (
                            <div className="mt-2">
                                <div className="w-full h-1.5 flex space-x-1 mb-2">
                                    {[1, 2, 3, 4].map(index => (
                                        <div
                                            key={index}
                                            className={`h-full flex-1 rounded-full ${passwordStrength.score >= index
                                                ? getStrengthColor(passwordStrength.score)
                                                : 'bg-gray-200'
                                                }`}
                                        />
                                    ))}
                                </div>

                                <div className="space-y-1 text-xs">
                                    <div className="flex items-center">
                                        {passwordStrength.hasMinLength ? (
                                            <CheckCircleIcon className="h-4 w-4 text-green-500 mr-1" />
                                        ) : (
                                            <XCircleIcon className="h-4 w-4 text-gray-400 mr-1" />
                                        )}
                                        <span className={passwordStrength.hasMinLength ? "text-green-600" : "text-gray-500"}>
                                            At least 8 characters
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        {passwordStrength.hasUppercase ? (
                                            <CheckCircleIcon className="h-4 w-4 text-green-500 mr-1" />
                                        ) : (
                                            <XCircleIcon className="h-4 w-4 text-gray-400 mr-1" />
                                        )}
                                        <span className={passwordStrength.hasUppercase ? "text-green-600" : "text-gray-500"}>
                                            Contains uppercase letter
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        {passwordStrength.hasNumber ? (
                                            <CheckCircleIcon className="h-4 w-4 text-green-500 mr-1" />
                                        ) : (
                                            <XCircleIcon className="h-4 w-4 text-gray-400 mr-1" />
                                        )}
                                        <span className={passwordStrength.hasNumber ? "text-green-600" : "text-gray-500"}>
                                            Contains number
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        {passwordStrength.hasSpecialChar ? (
                                            <CheckCircleIcon className="h-4 w-4 text-green-500 mr-1" />
                                        ) : (
                                            <XCircleIcon className="h-4 w-4 text-gray-400 mr-1" />
                                        )}
                                        <span className={passwordStrength.hasSpecialChar ? "text-green-600" : "text-gray-500"}>
                                            Contains special character
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="confirmPassword"
                                id="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border ${formData.confirmPassword && formData.password !== formData.confirmPassword
                                    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                    : "border-gray-300 focus:ring-purple-500 focus:border-purple-500"
                                    } rounded-md focus:outline-none focus:ring-2`}
                                required
                                disabled={loading}
                                autoComplete="new-password"
                            />
                        </div>
                        {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                            <p className="mt-1 text-sm text-red-600">Passwords do not match</p>
                        )}
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
                                Creating account...
                            </span>
                        ) : (
                            "Create account"
                        )}
                    </button>
                </form>

                <div className="mt-6 text-sm text-center text-gray-500">
                    Already have an account? <a href="/" className="text-purple-600 font-medium hover:text-purple-800">Sign in</a>
                </div>

                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">or sign up with</span>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                        >
                            <img src="/api/placeholder/20/20" alt="Google icon" className="h-5 w-5 mr-2" />
                            Google
                        </button>
                        <button
                            type="button"
                            className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                        >
                            <img src="/api/placeholder/20/20" alt="Apple icon" className="h-5 w-5 mr-2" />
                            Apple
                        </button>
                    </div>
                </div>

                <p className="mt-6 text-xs text-center text-gray-500">
                    By creating an account, you agree to our <a href="/terms" className="text-purple-600 hover:text-purple-800">Terms</a> and acknowledge our <a href="/privacy" className="text-purple-600 hover:text-purple-800">Privacy Policy</a>.
                </p>
            </div>
        </div>
    );
}