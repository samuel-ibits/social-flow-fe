import { useState } from 'react';
import { Calendar, Image, Send, Clock, Trash, FileText, Twitter, Linkedin, Facebook, Instagram, ArrowLeft } from 'lucide-react';
import { createPost } from '../slices/postSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Composer() {
    const [post, setPost] = useState({
        projectId: "680353c0f7c994b61e9e33bd",
        content: "",
        mediaUrls: [],
        platforms: [],
        status: "draft",
        scheduledAt: new Date().toISOString()
    });
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const platforms = [
        { id: "twitter", name: "Twitter", icon: Twitter },
        { id: "linkedin", name: "LinkedIn", icon: Linkedin },
        { id: "facebook", name: "Facebook", icon: Facebook },
        { id: "instagram", name: "Instagram", icon: Instagram }
    ];

    const handleContentChange = (e) => {
        setPost({ ...post, content: e.target.value });
    };

    const togglePlatform = (platform) => {
        const updatedPlatforms = post.platforms.includes(platform)
            ? post.platforms.filter(p => p !== platform)
            : [...post.platforms, platform];

        setPost({ ...post, platforms: updatedPlatforms });
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);

        // In a real app, you would upload these files to your server/CDN
        // For now, we'll use object URLs to simulate this
        const newMediaUrls = files.map(file => URL.createObjectURL(file));

        setPost({
            ...post,
            mediaUrls: [...post.mediaUrls, ...newMediaUrls]
        });
    };

    const removeMedia = (urlToRemove) => {
        setPost({
            ...post,
            mediaUrls: post.mediaUrls.filter(url => url !== urlToRemove)
        });
    };

    const handleScheduleDate = (e) => {
        const scheduledAt = e.target.value ? new Date(e.target.value).toISOString() : null;
        setPost({
            ...post,
            scheduledAt,
            status: scheduledAt ? "scheduled" : "draft"
        });
        setShowDatePicker(false);
    };

    const publishNow = async () => {
        if (!post.content.trim() || post.platforms.length === 0) {
            toast.error("Please add content and select at least one platform");
            return;
        }

        setIsSubmitting(true);

        try {
            await dispatch(createPost({ ...post, status: 'scheduled' })).unwrap();

            console.log("Publishing post:", { ...post, status: 'scheduled' });
            toast.success("Post published successfully!");
            navigate(-1);


            // Reset form
            setPost({
                projectId: "680353c0f7c994b61e9e33bd",
                content: "",
                mediaUrls: [],
                platforms: [],
                status: "draft",
                scheduledAt: null
            });
        } catch (error) {
            console.error("Error publishing post:", error);
            toast.error("Failed to publish post. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const schedulePost = async () => {
        if (!post.content.trim() || post.platforms.length === 0 || !post.scheduledAt) {
            toast.error("Please add content, select platforms, and set a schedule time");
            return;
        }

        setIsSubmitting(true);

        try {
            // Replace with your actual API call
            // await fetch('/api/posts', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify({ ...post, status: 'scheduled' })
            // });

            console.log("Scheduling post:", post);
            toast.success("Post scheduled successfully!");

            // Reset form
            setPost({
                projectId: "680353c0f7c994b61e9e33bd",
                content: "",
                mediaUrls: [],
                platforms: [],
                status: "draft",
                scheduledAt: null
            });
        } catch (error) {
            console.error("Error scheduling post:", error);
            toast.error("Failed to schedule post. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const generateAIContent = async () => {
        try {
            // This would connect to your AI generation service
            // In a real app, you would make an API call here
            const aiGeneratedContent = "Exciting updates coming soon! Stay tuned for our latest features that will transform how you work.";
            setPost({ ...post, content: aiGeneratedContent });
        } catch (error) {
            console.error("Error generating content:", error);
            toast.error("Failed to generate content. Please try again.");
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                >
                    <ArrowLeft size={20} />
                    Back
                </button>
                <h1 className="text-2xl font-bold">Compose Post</h1>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                {/* Content Editor */}
                <textarea
                    className="w-full border rounded-lg p-4 min-h-32 mb-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="What would you like to share?"
                    value={post.content}
                    onChange={handleContentChange}
                />

                {/* Media Preview */}
                {post.mediaUrls.length > 0 && (
                    <div className="mb-4">
                        <h2 className="text-sm font-medium text-gray-500 mb-2">Media</h2>
                        <div className="flex flex-wrap gap-2">
                            {post.mediaUrls.map((url, index) => (
                                <div key={index} className="relative group">
                                    <img
                                        src={url}
                                        alt={`Uploaded media ${index + 1}`}
                                        className="w-24 h-24 object-cover rounded-md"
                                    />
                                    <button
                                        onClick={() => removeMedia(url)}
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 mb-6 items-center">
                    {/* Image Upload */}
                    <label className="flex items-center gap-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md cursor-pointer">
                        <Image size={18} />
                        <span>Add Media</span>
                        <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            multiple
                            onChange={handleImageUpload}
                        />
                    </label>

                    {/* Schedule */}
                    <button
                        className="flex items-center gap-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md"
                        onClick={() => setShowDatePicker(!showDatePicker)}
                    >
                        <Clock size={18} />
                        <span>Schedule</span>
                    </button>

                    {/* AI Generate */}
                    <button
                        className="flex items-center gap-1 px-3 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-md"
                        onClick={generateAIContent}
                    >
                        <FileText size={18} />
                        <span>Generate with AI</span>
                    </button>
                </div>

                {/* Date Picker */}
                {showDatePicker && (
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Schedule for later</label>
                        <input
                            type="datetime-local"
                            className="border rounded-md px-3 py-2 w-full md:w-auto"
                            onChange={handleScheduleDate}
                            min={new Date().toISOString().slice(0, 16)}
                        />
                    </div>
                )}

                {/* Platform Selection */}
                <div className="mb-6">
                    <h2 className="text-sm font-medium text-gray-700 mb-2">Select platforms</h2>
                    <div className="flex flex-wrap gap-2">
                        {platforms.map(platform => (
                            <button
                                key={platform.id}
                                onClick={() => togglePlatform(platform.id)}
                                className={`flex items-center gap-1 px-3 py-2 rounded-md ${post.platforms.includes(platform.id)
                                    ? 'bg-blue-100 text-blue-700 border border-blue-300'
                                    : 'bg-gray-100 hover:bg-gray-200 border border-gray-300'
                                    }`}
                            >
                                <platform.icon size={18} />
                                <span>{platform.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-3 justify-end">
                    {post.scheduledAt ? (
                        <button
                            onClick={schedulePost}
                            disabled={isSubmitting}
                            className="flex items-center gap-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md disabled:bg-green-300"
                        >
                            <Calendar size={18} />
                            <span>Schedule Post</span>
                        </button>
                    ) : (
                        <button
                            onClick={publishNow}
                            disabled={isSubmitting}
                            className="flex items-center gap-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:bg-blue-300"
                        >
                            <Send size={18} />
                            <span>Publish Now</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Preview Section */}
            {post.content && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-lg font-medium mb-4">Post Preview</h2>

                    <div className="border rounded-lg p-4">
                        <p className="mb-4">{post.content}</p>

                        {post.mediaUrls.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                                {post.mediaUrls.map((url, index) => (
                                    <img
                                        key={index}
                                        src={url}
                                        alt={`Preview ${index + 1}`}
                                        className="w-24 h-24 object-cover rounded-md"
                                    />
                                ))}
                            </div>
                        )}

                        {post.platforms.length > 0 && (
                            <div className="flex gap-2 text-gray-500 text-sm">
                                <span>Posting to:</span>
                                {post.platforms.map(platformId => {
                                    const platform = platforms.find(p => p.id === platformId);
                                    return platform ? (
                                        <div key={platformId} className="flex items-center gap-1">
                                            <platform.icon size={14} />
                                            <span>{platform.name}</span>
                                        </div>
                                    ) : null;
                                })}
                            </div>
                        )}

                        {post.scheduledAt && (
                            <div className="text-gray-500 text-sm flex items-center gap-1 mt-2">
                                <Clock size={14} />
                                <span>Scheduled for {new Date(post.scheduledAt).toLocaleString()}</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}