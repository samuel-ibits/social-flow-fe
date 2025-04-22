import { useState, useEffect } from 'react';
import { PlusIcon, SearchIcon, GridIcon, ListIcon, MoreHorizontalIcon, CalendarIcon, BriefcaseIcon, GlobeIcon } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { getProjects, createProject } from '../slices/projectSlice';
import { useNavigate } from 'react-router-dom';

export default function ProjectsPage() {
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [searchQuery, setSearchQuery] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        industry: '',
        timezone: 'America/New_York',
        logoUrl: ''
    });
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { projects: reduxProjects, loading, error } = useSelector((state) => state.projects);

    // Sample timezones
    const timezones = [
        'America/New_York',
        'America/Los_Angeles',
        'America/Chicago',
        'Europe/London',
        'Europe/Berlin',
        'Asia/Tokyo',
        'Asia/Singapore',
        'Australia/Sydney',
        'Pacific/Auckland'
    ];

    // Sample industries
    const industries = [
        'Technology',
        'Healthcare',
        'Finance',
        'Education',
        'Retail',
        'Manufacturing',
        'Media',
        'Entertainment',
        'Travel',
        'Food & Beverage'
    ];



    // Fetch projects
    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            dispatch(getProjects())
                .unwrap()
                .then((data) => {
                    setProjects(data);
                    console.log(data);
                })
                .catch((error) => {
                    console.error('Failed to fetch projects:', error);
                });
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
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        // Create new project with generated ID and timestamps
        const newProject = {
            id: (projects.length + 1).toString(),
            ...formData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // Dispatch createProject action
        dispatch(createProject(newProject))
            .unwrap()
            .then((data) => {
                setProjects([data, ...projects]);
            })
            .catch((error) => {
                console.error('Failed to create project:', error);
            });

        // Close modal and reset form
        setIsCreateModalOpen(false);
        setFormData({
            name: '',
            description: '',
            industry: '',
            timezone: 'America/New_York',
            logoUrl: ''
        });
    };

    // Filter projects based on search query
    const filteredProjects = projects.filter(project =>
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.industry.toLowerCase().includes(searchQuery.toLowerCase())
    );
    console.log('d', filteredProjects);
    // Format date to readable string
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Create Project
                    </button>
                </div>
            </header>

            {/* Main content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Search and view toggle */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
                    {/* Search */}
                    <div className="relative w-full sm:w-64 md:w-96">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <SearchIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search projects..."
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* View toggle */}
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">View:</span>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-1.5 rounded-md ${viewMode === 'grid' ? 'bg-purple-100 text-purple-700' : 'text-gray-500 hover:bg-gray-100'}`}
                        >
                            <GridIcon className="h-5 w-5" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-1.5 rounded-md ${viewMode === 'list' ? 'bg-purple-100 text-purple-700' : 'text-gray-500 hover:bg-gray-100'}`}
                        >
                            <ListIcon className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Loading state */}
                {isLoading && (
                    <div className="flex justify-center items-center h-64">
                        <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="text-lg font-medium text-gray-500">Loading projects...</span>
                    </div>
                )}

                {/* No projects state */}
                {!isLoading && filteredProjects.length === 0 && (
                    <div className="bg-white shadow rounded-lg p-6 text-center">
                        <div className="mx-auto h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center">
                            <BriefcaseIcon className="h-6 w-6 text-gray-400" />
                        </div>
                        <h3 className="mt-4 text-lg font-medium text-gray-900">No projects found</h3>
                        <p className="mt-2 text-sm text-gray-500">
                            {searchQuery ? 'Try a different search query or' : 'Get started by'} creating a new project.
                        </p>
                        <div className="mt-6">
                            <button
                                onClick={() => setIsCreateModalOpen(true)}
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                            >
                                <PlusIcon className="h-5 w-5 mr-2" />
                                Create Project
                            </button>
                        </div>
                    </div>
                )}

                {/* Grid view */}
                {!isLoading && filteredProjects.length > 0 && viewMode === 'grid' && (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredProjects.map((project) => (
                            <div
                                key={project.id}
                                className="bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:shadow-md transition-shadow duration-200"
                                onClick={() => navigate(`/posts/${project._id}`)}
                            >
                                <div className="p-5">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                                            {project.logoUrl ? (
                                                <img src={project.logoUrl} alt={project.name} className="h-10 w-10 rounded-full" />
                                            ) : (
                                                <span className="text-lg font-medium text-purple-700">{project.name.charAt(0)}</span>
                                            )}
                                        </div>
                                        <div className="ml-4 flex-1">
                                            <h3 className="text-lg font-medium text-gray-900 truncate">{project.name}</h3>
                                            <p className="text-sm text-gray-500 truncate">{project.industry}</p>
                                        </div>
                                        <div className="ml-2">
                                            <button
                                                className="text-gray-400 hover:text-gray-500"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    // Add your menu handling logic here
                                                }}
                                            >
                                                <MoreHorizontalIcon className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <p className="text-sm text-gray-500 line-clamp-2">{project.description}</p>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-5 py-3 border-t border-gray-200">
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                        <div className="flex items-center">
                                            <GlobeIcon className="h-4 w-4 mr-1" />
                                            <span>{project.timezone.split('/')[1].replace('_', ' ')}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <CalendarIcon className="h-4 w-4 mr-1" />
                                            <span>Created {formatDate(project.createdAt)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* List view */}
                {!isLoading && filteredProjects.length > 0 && viewMode === 'list' && (
                    <div className="bg-white shadow overflow-hidden sm:rounded-md">
                        <ul className="divide-y divide-gray-200">
                            {filteredProjects.map((project) => (
                                <li key={project.id}>
                                    <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center min-w-0">
                                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                                                    {project.logoUrl ? (
                                                        <img src={project.logoUrl} alt={project.name} className="h-10 w-10 rounded-full" />
                                                    ) : (
                                                        <span className="text-lg font-medium text-purple-700">{project.name.charAt(0)}</span>
                                                    )}
                                                </div>
                                                <div className="ml-4 min-w-0 flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-sm font-medium text-purple-600 truncate">{project.name}</p>
                                                        <div className="ml-2 flex-shrink-0 flex">
                                                            <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                                                                {project.industry}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="mt-2 flex">
                                                        <div className="flex items-center text-sm text-gray-500">
                                                            <GlobeIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                                            <span>{project.timezone}</span>
                                                        </div>
                                                        <div className="ml-6 flex items-center text-sm text-gray-500">
                                                            <CalendarIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                                            <span>Created on {formatDate(project.createdAt)}</span>
                                                        </div>
                                                    </div>
                                                    <p className="mt-1 text-sm text-gray-500 line-clamp-1">{project.description}</p>
                                                </div>
                                            </div>
                                            <div className="ml-6 flex-shrink-0">
                                                <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                                                    <MoreHorizontalIcon className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </main>

            {/* Create Project Modal */}
            {isCreateModalOpen && (
                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        {/* Background overlay */}
                        {/* <div
                            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                            onClick={() => setIsCreateModalOpen(false)}
                            aria-hidden="true"
                        /> */}

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
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">Create New Project</h3>
                                    <div className="mt-4">
                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            {/* Project Name */}
                                            <div>
                                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Project Name</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    id="name"
                                                    required
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                                />
                                            </div>

                                            {/* Description */}
                                            <div>
                                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                                                <textarea
                                                    name="description"
                                                    id="description"
                                                    rows="3"
                                                    value={formData.description}
                                                    onChange={handleInputChange}
                                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                                ></textarea>
                                            </div>

                                            {/* Industry */}
                                            <div>
                                                <label htmlFor="industry" className="block text-sm font-medium text-gray-700">Industry</label>
                                                <select
                                                    name="industry"
                                                    id="industry"
                                                    required
                                                    value={formData.industry}
                                                    onChange={handleInputChange}
                                                    className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                                >
                                                    <option value="" disabled>Select an industry</option>
                                                    {industries.map((industry) => (
                                                        <option key={industry} value={industry}>{industry}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* Timezone */}
                                            <div>
                                                <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">Timezone</label>
                                                <select
                                                    name="timezone"
                                                    id="timezone"
                                                    required
                                                    value={formData.timezone}
                                                    onChange={handleInputChange}
                                                    className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                                >
                                                    {timezones.map((timezone) => (
                                                        <option key={timezone} value={timezone}>{timezone.replace('_', ' ')}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* Logo URL */}
                                            <div>
                                                <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-700">Logo URL (optional)</label>
                                                <input
                                                    type="text"
                                                    name="logoUrl"
                                                    id="logoUrl"
                                                    value={formData.logoUrl}
                                                    onChange={handleInputChange}
                                                    placeholder="https://example.com/logo.png"
                                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                                />
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
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}