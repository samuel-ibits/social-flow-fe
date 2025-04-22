import { useState, useEffect } from 'react';
import { PlusIcon, SearchIcon, TrashIcon, ExternalLinkIcon, AlertCircleIcon, CheckCircleIcon, RefreshCwIcon } from 'lucide-react';

export default function SocialMediaAccountsPage() {
    const [accounts, setAccounts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProject, setSelectedProject] = useState('');
    const [projects, setProjects] = useState([]);
    const [formData, setFormData] = useState({
        projectId: '',
        platform: '',
        accountName: '',
        accessToken: '',
        bearerToken: '',
        refreshToken: '',
        expiresAt: ''
    });
    const [formErrors, setFormErrors] = useState({});

    // Sample data for platforms
    const platforms = [
        { id: 'twitter', name: 'Twitter', logo: '/api/placeholder/24/24', color: 'bg-blue-500' },
        { id: 'facebook', name: 'Facebook', logo: '/api/placeholder/24/24', color: 'bg-indigo-600' },
        { id: 'instagram', name: 'Instagram', logo: '/api/placeholder/24/24', color: 'bg-pink-600' },
        { id: 'linkedin', name: 'LinkedIn', logo: '/api/placeholder/24/24', color: 'bg-blue-700' },
        { id: 'tiktok', name: 'TikTok', logo: '/api/placeholder/24/24', color: 'bg-black' },
        { id: 'pinterest', name: 'Pinterest', logo: '/api/placeholder/24/24', color: 'bg-red-600' },
    ];

    // Sample projects data
    const sampleProjects = [
        { id: '680353c0f7c994b61e9e33bd', name: 'Acme Corp' },
        { id: '680353c0f7c994b61e9e33be', name: 'Globex Healthcare' },
        { id: '680353c0f7c994b61e9e33bf', name: 'Initech Financial' },
    ];

    // Sample accounts data
    const sampleAccounts = [
        {
            id: '1',
            projectId: '680353c0f7c994b61e9e33bd',
            platform: 'twitter',
            accountName: '@3d7tech',
            accessToken: '1393363644377968640-lXAjQ65DT03oKi10KlD6jCFu5o289u',
            bearerToken: 'AAAAAAAAAAAAAAAAAAAAAPn%2FvgEAAAAApXW8rB8V%2BzqFoOoDAf46s%2BTJXV0%3D0ZnO94zmbiUCUIK3RF5JT4Ih9jZzQoLpC2dMD7KBu6OGhrTdX3',
            refreshToken: 'refresh123',
            expiresAt: '2025-06-30T00:00:00.000Z',
            status: 'active'
        },
        {
            id: '2',
            projectId: '680353c0f7c994b61e9e33bd',
            platform: 'instagram',
            accountName: '@acmecorp_official',
            accessToken: 'IGQVJYeW02ZAG5LR2RFNi1nUENtbkYzMlptRTRnMHdNSzJuY0k3ZAlk5T09XV3ZAOMDNoUUdLbno5WHFZIaTFGa2FtaWpXNTJVckdueU9BNkItM0tZAR3R2MTlhdTlHU0dUUFNQOU5zRjh3',
            bearerToken: '',
            refreshToken: 'refresh456',
            expiresAt: '2025-05-15T00:00:00.000Z',
            status: 'active'
        },
        {
            id: '3',
            projectId: '680353c0f7c994b61e9e33be',
            platform: 'facebook',
            accountName: 'Globex Healthcare',
            accessToken: 'EAAEZAhglFmfMBANJbcPXdYgPvP6M5l3WYM3mUVRqZBc6DI2cXZCdDg2oJFuFzZBU9CaFIh6eFa71T3uIqRnZCHXZCTsB59LQaVbMkVSO25OWr2',
            bearerToken: '',
            refreshToken: 'refresh789',
            expiresAt: '2025-04-30T00:00:00.000Z',
            status: 'warning'
        },
        {
            id: '4',
            projectId: '680353c0f7c994b61e9e33bf',
            platform: 'linkedin',
            accountName: 'Initech Financial',
            accessToken: 'AQXKjH1XAF-R4o-OULUbaTMdQT8bUwUxJr2u3oLQKEgRzFc5f3M9c0OjdzXj2FtBKO1SOyA',
            bearerToken: '',
            refreshToken: 'refresh101',
            expiresAt: '2025-01-15T00:00:00.000Z',
            status: 'expired'
        }
    ];

    // Fetch accounts and projects
    useEffect(() => {
        // Simulate API calls
        setTimeout(() => {
            setAccounts(sampleAccounts);
            setProjects(sampleProjects);
            setIsLoading(false);
        }, 800);
    }, []);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error for this field
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    // Basic validation
    const validateForm = () => {
        const errors = {};

        if (!formData.projectId) errors.projectId = 'Project is required';
        if (!formData.platform) errors.platform = 'Platform is required';
        if (!formData.accountName) errors.accountName = 'Account name is required';
        if (!formData.accessToken) errors.accessToken = 'Access token is required';

        // Check if expires at is a valid future date
        if (!formData.expiresAt) {
            errors.expiresAt = 'Expiration date is required';
        } else {
            const expiryDate = new Date(formData.expiresAt);
            if (isNaN(expiryDate) || expiryDate <= new Date()) {
                errors.expiresAt = 'Must be a valid future date';
            }
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        // Create new account with generated ID
        const newAccount = {
            id: Date.now().toString(),
            ...formData,
            status: 'active'
        };

        // Add to accounts list
        setAccounts([newAccount, ...accounts]);

        // Close modal and reset form
        setIsCreateModalOpen(false);
        setFormData({
            projectId: '',
            platform: '',
            accountName: '',
            accessToken: '',
            bearerToken: '',
            refreshToken: '',
            expiresAt: ''
        });
    };

    // Get project name by ID
    const getProjectName = (projectId) => {
        const project = projects.find(p => p.id === projectId);
        return project ? project.name : 'Unknown Project';
    };

    // Get platform details by ID
    const getPlatform = (platformId) => {
        return platforms.find(p => p.id === platformId) || {
            name: platformId.charAt(0).toUpperCase() + platformId.slice(1),
            color: 'bg-gray-500'
        };
    };

    // Filter accounts based on search query and selected project
    const filteredAccounts = accounts.filter(account => {
        const matchesSearch = account.accountName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            getPlatform(account.platform).name.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesProject = selectedProject ? account.projectId === selectedProject : true;

        return matchesSearch && matchesProject;
    });

    // Calculate days until expiration
    const getDaysUntilExpiration = (expiresAt) => {
        const today = new Date();
        const expiry = new Date(expiresAt);
        const diffTime = expiry - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    // Get status badge based on expiration
    const renderStatusBadge = (account) => {
        const daysLeft = getDaysUntilExpiration(account.expiresAt);

        if (account.status === 'expired' || daysLeft <= 0) {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <AlertCircleIcon className="mr-1 h-3 w-3" />
                    Expired
                </span>
            );
        }

        if (account.status === 'warning' || daysLeft <= 14) {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    <AlertCircleIcon className="mr-1 h-3 w-3" />
                    Expires soon
                </span>
            );
        }

        return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <CheckCircleIcon className="mr-1 h-3 w-3" />
                Active
            </span>
        );
    };

    // Function to mask sensitive token data
    const maskToken = (token) => {
        if (!token) return '';
        if (token.length <= 8) return '••••••••';
        return token.substring(0, 4) + '••••••••' + token.substring(token.length - 4);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">Social Media Accounts</h1>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Connect Account
                    </button>
                </div>
            </header>

            {/* Main content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Filters */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
                    {/* Search */}
                    <div className="relative w-full sm:w-64 md:w-96">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <SearchIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search accounts..."
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Project filter */}
                    <div className="w-full sm:w-auto">
                        <select
                            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
                            value={selectedProject}
                            onChange={(e) => setSelectedProject(e.target.value)}
                        >
                            <option value="">All Projects</option>
                            {projects.map((project) => (
                                <option key={project.id} value={project.id}>{project.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Loading state */}
                {isLoading && (
                    <div className="flex justify-center items-center h-64">
                        <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="text-lg font-medium text-gray-500">Loading accounts...</span>
                    </div>
                )}

                {/* No accounts state */}
                {!isLoading && filteredAccounts.length === 0 && (
                    <div className="bg-white shadow rounded-lg p-6 text-center">
                        <div className="mx-auto h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center">
                            <svg className="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                            </svg>
                        </div>
                        <h3 className="mt-4 text-lg font-medium text-gray-900">No social accounts found</h3>
                        <p className="mt-2 text-sm text-gray-500">
                            {searchQuery || selectedProject ? 'Try different search criteria or' : 'Get started by'} connecting a social media account.
                        </p>
                        <div className="mt-6">
                            <button
                                onClick={() => setIsCreateModalOpen(true)}
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                            >
                                <PlusIcon className="h-5 w-5 mr-2" />
                                Connect Account
                            </button>
                        </div>
                    </div>
                )}

                {/* Accounts List */}
                {!isLoading && filteredAccounts.length > 0 && (
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        <ul className="divide-y divide-gray-200">
                            {filteredAccounts.map((account) => {
                                const platform = getPlatform(account.platform);
                                const daysUntilExpiry = getDaysUntilExpiration(account.expiresAt);

                                return (
                                    <li key={account.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center min-w-0 flex-1">
                                                <div className={`flex-shrink-0 h-10 w-10 rounded-full ${platform.color} flex items-center justify-center text-white`}>
                                                    <img src={platform.logo} alt={platform.name} className="h-6 w-6" />
                                                </div>

                                                <div className="ml-4 min-w-0 flex-1">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <div className="flex items-center">
                                                            <h3 className="text-sm font-medium text-gray-900 truncate mr-2">{account.accountName}</h3>
                                                            {renderStatusBadge(account)}
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <span className="truncate">{platform.name} • {getProjectName(account.projectId)}</span>
                                                    </div>

                                                    <div className="mt-1 flex items-center text-xs text-gray-500">
                                                        {daysUntilExpiry <= 0 ? (
                                                            <span className="text-red-600">Expired</span>
                                                        ) : (
                                                            <span>Expires in {daysUntilExpiry} days</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="ml-6 flex-shrink-0 flex">
                                                <button
                                                    className="p-1 rounded-full text-gray-400 hover:text-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                                                    title="Refresh token"
                                                >
                                                    <RefreshCwIcon className="h-5 w-5" />
                                                </button>
                                                <button
                                                    className="ml-2 p-1 rounded-full text-gray-400 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                    title="View details"
                                                >
                                                    <ExternalLinkIcon className="h-5 w-5" />
                                                </button>
                                                <button
                                                    className="ml-2 p-1 rounded-full text-gray-400 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                                    title="Delete account"
                                                >
                                                    <TrashIcon className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="mt-2 sm:flex sm:justify-between">
                                            <div className="sm:flex">
                                                <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                                    <div className="flex flex-col space-y-1">
                                                        <div className="flex items-center">
                                                            <span className="text-xs font-medium text-gray-500 w-24">Access Token:</span>
                                                            <span className="text-xs font-mono bg-gray-100 px-2 py-0.5 rounded">{maskToken(account.accessToken)}</span>
                                                        </div>
                                                        {account.bearerToken && (
                                                            <div className="flex items-center">
                                                                <span className="text-xs font-medium text-gray-500 w-24">Bearer Token:</span>
                                                                <span className="text-xs font-mono bg-gray-100 px-2 py-0.5 rounded">{maskToken(account.bearerToken)}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}
            </main>

            {/* Create Account Modal */}
            {isCreateModalOpen && (
                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        {/* Background overlay */}
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setIsCreateModalOpen(false)}></div>

                        {/* Modal panel */}
                        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                            <div className="absolute top-0 right-0 pt-4 pr-4">
                                <button
                                    type="button"
                                    className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                                    onClick={() => setIsCreateModalOpen(false)}
                                >
                                    <span className="sr-only">Close</span>
                                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="sm:flex sm:items-start">
                                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 sm:mx-0 sm:h-10 sm:w-10">
                                    <PlusIcon className="h-6 w-6 text-purple-600" />
                                </div>
                                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">Connect Social Media Account</h3>
                                    <div className="mt-4">
                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            {/* Project Selection */}
                                            <div>
                                                <label htmlFor="projectId" className="block text-sm font-medium text-gray-700">Project</label>
                                                <select
                                                    name="projectId"
                                                    id="projectId"
                                                    required
                                                    value={formData.projectId}
                                                    onChange={handleInputChange}
                                                    className={`mt-1 block w-full bg-white border ${formErrors.projectId ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm`}
                                                >
                                                    <option value="" disabled>Select a project</option>
                                                    {projects.map((project) => (
                                                        <option key={project.id} value={project.id}>{project.name}</option>
                                                    ))}
                                                </select>
                                                {formErrors.projectId && (
                                                    <p className="mt-1 text-sm text-red-600">{formErrors.projectId}</p>
                                                )}
                                            </div>

                                            {/* Platform Selection */}
                                            <div>
                                                <label htmlFor="platform" className="block text-sm font-medium text-gray-700">Platform</label>
                                                <select
                                                    name="platform"
                                                    id="platform"
                                                    required
                                                    value={formData.platform}
                                                    onChange={handleInputChange}
                                                    className={`mt-1 block w-full bg-white border ${formErrors.platform ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm`}
                                                >
                                                    <option value="" disabled>Select a platform</option>
                                                    {platforms.map((platform) => (
                                                        <option key={platform.id} value={platform.id}>{platform.name}</option>
                                                    ))}
                                                </select>
                                                {formErrors.platform && (
                                                    <p className="mt-1 text-sm text-red-600">{formErrors.platform}</p>
                                                )}
                                            </div>

                                            {/* Account Name */}
                                            <div>
                                                <label htmlFor="accountName" className="block text-sm font-medium text-gray-700">Account Name</label>
                                                <input
                                                    type="text"
                                                    name="accountName"
                                                    id="accountName"
                                                    required
                                                    value={formData.accountName}
                                                    onChange={handleInputChange}
                                                    placeholder="@username"
                                                    className={`mt-1 block w-full border ${formErrors.accountName ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm`}
                                                />
                                                {formErrors.accountName && (
                                                    <p className="mt-1 text-sm text-red-600">{formErrors.accountName}</p>
                                                )}
                                            </div>

                                            {/* Access Token */}
                                            <div>
                                                <label htmlFor="accessToken" className="block text-sm font-medium text-gray-700">Access Token</label>
                                                <textarea
                                                    name="accessToken"
                                                    id="accessToken"
                                                    rows="2"
                                                    required
                                                    value={formData.accessToken}
                                                    onChange={handleInputChange}
                                                    className={`mt-1 block w-full border ${formErrors.accessToken ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm font-mono`}
                                                ></textarea>
                                                {formErrors.accessToken && (
                                                    <p className="mt-1 text-sm text-red-600">{formErrors.accessToken}</p>
                                                )}
                                            </div>

                                            {/* Bearer Token (Optional) */}
                                            <div>
                                                <label htmlFor="bearerToken" className="block text-sm font-medium text-gray-700">
                                                    Bearer Token <span className="text-gray-500">(Optional)</span>
                                                </label>
                                                <textarea
                                                    name="bearerToken"
                                                    id="bearerToken"
                                                    rows="2"
                                                    value={formData.bearerToken}
                                                    onChange={handleInputChange}
                                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm font-mono"
                                                ></textarea>
                                            </div>

                                            {/* Refresh Token */}
                                            <div>
                                                <label htmlFor="refreshToken" className="block text-sm font-medium text-gray-700">
                                                    Refresh Token <span className="text-gray-500">(Optional)</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="refreshToken"
                                                    id="refreshToken"
                                                    value={formData.refreshToken}
                                                    onChange={handleInputChange}
                                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm font-mono"
                                                />
                                            </div>

                                            {/* Expires At */}
                                            <div>
                                                <label htmlFor="expiresAt" className="block text-sm font-medium text-gray-700">Expiration Date</label>
                                                <input
                                                    type="date"
                                                    name="expiresAt"
                                                    id="expiresAt"
                                                    required
                                                    value={formData.expiresAt ? new Date(formData.expiresAt).toISOString().split('T')[0] : ''}
                                                    onChange={handleInputChange}
                                                    className={`mt-1 block w-full border ${formErrors.expiresAt ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm`}
                                                />
                                                {formErrors.expiresAt && (
                                                    <p className="mt-1 text-sm text-red-600">{formErrors.expiresAt}</p>
                                                )}
                                            </div>

                                            {/* Submit buttons */}
                                            <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => setIsCreateModalOpen(false)}
                                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:mt-0 sm:text-sm"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:text-sm"
                                                >
                                                    Create
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div></div></div>
            )
            }
        </div>
    )
}
