import { useState, useEffect } from 'react';
import { Calendar, Eye, Edit, Trash, Clock, CheckCircle, AlertCircle, XCircle, Twitter, Linkedin, Facebook, Instagram, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getPosts, createPost } from '../slices/postSlice';


export default function PostsList() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, scheduled, posted, draft, failed
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { posts: reduxPosts, loading: reduxLoading, error } = useSelector((state) => state.posts);
    const projectId = window.location.pathname.split('/')[2];
    console.log(projectId)
    useEffect(() => {
        fetchPosts();
    }, [filter]);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const result = await dispatch(getPosts(projectId)).unwrap();

            // Apply filtering
            const filteredPosts = filter === 'all'
                ? result
                : result.filter(post => post.status === filter);
            console.log(filteredPosts)
            setPosts(filteredPosts);
        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (postId) => {
        if (!confirm("Are you sure you want to delete this post?")) {
            return;
        }

        try {
            // In a real app, you would call your API
            // await fetch(`/api/posts/${postId}`, { method: 'DELETE' });

            // Update local state
            setPosts(posts.filter(post => post.id !== postId));
        } catch (error) {
            console.error("Error deleting post:", error);
            alert("Failed to delete post. Please try again.");
        }
    };

    const getPlatformIcon = (platform) => {
        switch (platform) {
            case 'twitter': return <Twitter size={16} className="text-blue-400" />;
            case 'linkedin': return <Linkedin size={16} className="text-blue-700" />;
            case 'facebook': return <Facebook size={16} className="text-blue-600" />;
            case 'instagram': return <Instagram size={16} className="text-pink-600" />;
            default: return null;
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'posted':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircle size={12} className="mr-1" /> Posted
                </span>;
            case 'scheduled':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <Clock size={12} className="mr-1" /> Scheduled
                </span>;
            case 'draft':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    <AlertCircle size={12} className="mr-1" /> Draft
                </span>;
            case 'failed':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <XCircle size={12} className="mr-1" /> Failed
                </span>;
            default:
                return null;
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">

            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-gray-100 rounded-full"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-2xl font-bold">Posts</h1>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => navigate(`/composer/${projectId}`)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Create New Post
                    </button>
                    <button
                        onClick={() => navigate(`/social-media/${projectId}`)}

                        className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 "
                    >
                        Attach Social media
                    </button>
                </div>
            </div>
            {/* Post Analytics Summary */}
            {
                !loading && posts.length > 0 && (
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white rounded-lg shadow p-4">
                            <h3 className="text-lg font-medium text-gray-900">Total Posts</h3>
                            <p className="text-3xl font-bold">{posts.length}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4">
                            <h3 className="text-lg font-medium text-gray-900">Posted</h3>
                            <p className="text-3xl font-bold text-green-600">
                                {posts.filter(post => post.status === 'posted').length}
                            </p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4">
                            <h3 className="text-lg font-medium text-gray-900">Completed</h3>
                            <p className="text-3xl font-bold text-green-600">
                                {posts.filter(post => post.status === 'completed').length}
                            </p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4">
                            <h3 className="text-lg font-medium text-gray-900">Scheduled</h3>
                            <p className="text-3xl font-bold text-blue-600">
                                {posts.filter(post => post.status === 'scheduled').length}
                            </p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4">
                            <h3 className="text-lg font-medium text-gray-900">Platform Usage</h3>
                            <div className="flex gap-3 mt-2">
                                {['twitter', 'linkedin', 'facebook', 'instagram'].map(platform => {
                                    const count = posts.filter(post => post.platforms.includes(platform)).length;
                                    return (
                                        <div key={platform} className="flex items-center gap-1">
                                            {getPlatformIcon(platform)}
                                            <span className="text-sm font-medium">{count}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )
            }
            {/* Filters */}
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setFilter('all')}
                    className={`px - 3 py - 1.5 rounded - md ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                    All
                </button>
                <button
                    onClick={() => setFilter('posted')}
                    className={`px-3 py-1.5 rounded-md ${filter === 'posted' ? 'bg-green-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                    Posted
                </button>
                <button
                    onClick={() => setFilter('scheduled')}
                    className={`px-3 py-1.5 rounded-md ${filter === 'scheduled' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                    Scheduled
                </button>
                <button
                    onClick={() => setFilter('draft')}
                    className={`px-3 py-1.5 rounded-md ${filter === 'draft' ? 'bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                    Drafts
                </button>
                <button
                    onClick={() => setFilter('failed')}
                    className={`px-3 py-1.5 rounded-md ${filter === 'failed' ? 'bg-red-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                    Failed
                </button>
            </div>

            {
                loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <p className="text-gray-500">No posts found. Create your first post!</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Content
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Platforms
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {posts.map((post) => (
                                    <tr key={post.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-start">
                                                {console.log(post.mediaUrls)}
                                                {post.mediaUrls && post.mediaUrls.length > 0 && (
                                                    <div className="flex-shrink-0 mr-3">
                                                        <img
                                                            src={post.mediaUrls[0]}
                                                            alt="Post media"
                                                            className="h-10 w-10 rounded-md object-cover"
                                                        />
                                                        {post.mediaUrls.length > 1 && (
                                                            <span className="text-xs text-gray-500">+{post.mediaUrls.length - 1} more</span>
                                                        )}
                                                    </div>
                                                )}
                                                <div className="max-w-md">
                                                    <p className="text-sm text-gray-900 truncate">{post.content}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex space-x-1">
                                                {post.platforms.map((platform) => (
                                                    <div key={platform} title={platform}>
                                                        {getPlatformIcon(platform)}
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(post.status)}
                                            {post.status === 'failed' && post.error && (
                                                <p className="text-xs text-red-600 mt-1">{post.error}</p>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {post.status === 'posted' && post.postedAt && (
                                                <div className="flex items-center">
                                                    <CheckCircle size={14} className="mr-1 text-green-500" />
                                                    <span>{formatDate(post.postedAt)}</span>
                                                </div>
                                            )}
                                            {post.status === 'scheduled' && post.scheduledAt && (
                                                <div className="flex items-center">
                                                    <Calendar size={14} className="mr-1 text-blue-500" />
                                                    <span>{formatDate(post.scheduledAt)}</span>
                                                </div>
                                            )}
                                            {post.status === 'draft' && (
                                                <div className="flex items-center">
                                                    <Clock size={14} className="mr-1 text-gray-500" />
                                                    <span>Updated {formatDate(post.createdAt)}</span>
                                                </div>
                                            )}
                                            {post.status === 'failed' && (
                                                <div className="flex items-center">
                                                    <XCircle size={14} className="mr-1 text-red-500" />
                                                    <span>{formatDate(post.createdAt)}</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <button
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                    onClick={() => navigate(`/posts/${post.id}`)}
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                <button
                                                    className="text-blue-600 hover:text-blue-900"
                                                    onClick={() => navigate(`/compose/${post.id}`)}
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    className="text-red-600 hover:text-red-900"
                                                    onClick={() => handleDelete(post.id)}
                                                >
                                                    <Trash size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )
            }


        </div >
    );
}