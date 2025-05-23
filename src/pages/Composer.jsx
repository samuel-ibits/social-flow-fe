import { useState } from 'react';
import { Calendar, Image, Send, Clock, Trash, FileText, Twitter, Linkedin, Facebook, Instagram, ArrowLeft, Repeat } from 'lucide-react';
import { createPost, uploadPostContent } from '../slices/postSlice';
import { generateText } from '../slices/aiSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FILE_URL } from '../constants';


const RECURRENCE_OPTIONS = [
    { value: 'none', label: 'None' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' }
];

export default function Composer() {
    const [post, setPost] = useState({
        projectId: "680353c0f7c994b61e9e33bd",
        content: "",
        mediaUrls: [],
        platforms: [],
        status: "scheduled",
        scheduledAt: new Date().toISOString(),
        nextRunAt: null,
        recurrence: 'none'
    });
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showAIPrompt, setShowAIPrompt] = useState(false);
    const [aiPrompt, setAIPrompt] = useState("");
    const [isUploading, setIsUploading] = useState(false);

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
    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        const previousMediaUrls = [...post.mediaUrls];

        // Show loading state while uploading
        setIsUploading(true);

        try {
            // Upload each file and get the returned URLs from the server
            const uploadPromises = files.map(async (file) => {
                const uploadData = {
                    file,
                    postId: post.id, // If editing an existing post
                    // projectId: currentProject.id,
                    type: 'image' // Specify the type of media
                };

                const result = await dispatch(uploadPostContent(uploadData)).unwrap();

                // Return the URL from the server response
                // Adjust this based on how your API returns the URL
                // console.log("Upload result:", result);
                return FILE_URL + result.path || FILE_URL + result.url;
            });

            const newServerMediaUrls = await Promise.all(uploadPromises);


            // Update the post state with the new server URLs
            setPost({
                ...post,
                mediaUrls: [...previousMediaUrls, ...newServerMediaUrls]
            });
            console.log('test', FILE_URL);
            console.log("Upload post:", post);

            // If you need to show a success message
            toast.success('Images uploaded successfully');
        } catch (error) {
            // Handle any errors during upload
            console.error('Upload failed', error);

            // If you're using a toast library for notifications
            toast.error('Failed to upload images: ' + (error.message || 'Unknown error'));

            // You could optionally keep local URLs as fallback
            // const newMediaUrls = files.map(file => URL.createObjectURL(file));
            // setPost({
            //     ...post,
            //     mediaUrls: [...previousMediaUrls, ...newMediaUrls]
            // });
        } finally {
            setIsUploading(false);
        }
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

    const handleRecurrenceChange = (e) => {
        const value = e.target.value;
        setPost(prev => ({
            ...prev,
            recurrence: value,
            // If recurrence is not 'none', set nextRunAt to scheduledAt or now
            nextRunAt: value !== 'none'
                ? (post.scheduledAt || new Date().toISOString())
                : null
        }));
    };

    const handleNextRunAtChange = (e) => {
        const nextRunAt = e.target.value ? new Date(e.target.value).toISOString() : null;
        setPost(prev => ({
            ...prev,
            nextRunAt
        }));
    };

    const handleAIPromptChange = (e) => {
        setAIPrompt(e.target.value);
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
                scheduledAt: null,
                nextRunAt: null,
                recurrence: 'none'
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
            await dispatch(createPost({ ...post, status: 'scheduled' })).unwrap();

            console.log("Scheduling post:", post);
            toast.success("Post scheduled successfully!");

            // Reset form
            setPost({
                projectId: "680353c0f7c994b61e9e33bd",
                content: "",
                mediaUrls: [],
                platforms: [],
                status: "draft",
                scheduledAt: null,
                nextRunAt: null,
                recurrence: 'none'
            });
        } catch (error) {
            console.error("Error scheduling post:", error);
            toast.error("Failed to schedule post. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleAIPrompt = () => {
        setShowAIPrompt(!showAIPrompt);
    };

    const generateAIContent = async () => {
        if (!aiPrompt.trim() && showAIPrompt) {
            toast.error("Please enter a prompt for the AI");
            return;
        }

        try {
            // This would connect to your AI generation service
            // In a real app, you would make an API call here
            let aiGeneratedContent;

            if (showAIPrompt && aiPrompt) {
                // Use the custom prompt
                // aiGeneratedContent = `Generated based on: "${aiPrompt}" - Exciting updates coming soon! Stay tuned for our latest features that will transform how you work.`;
                //send dat to /generate-text
                const response = await dispatch(generateText({ prompt: aiPrompt, provider: 'openrouter' })).unwrap();
                aiGeneratedContent = response.content || "Exciting updates coming soon! Stay tuned for our latest features that will transform how you work.";


                // const response = await fetch('/generate-text', {
                //     method: 'POST',
                //     headers: {
                //         'Content-Type': 'application/json'
                //     },
                //     body: JSON.stringify({ prompt, provider })
                // });
            } else {
                // Use default content
                aiGeneratedContent = "Exciting updates coming soon! Stay tuned for our latest features that will transform how you work.";
            }

            setPost({ ...post, content: aiGeneratedContent, aiGenerated: "true" });
            setShowAIPrompt(false);
            setAIPrompt("");
            toast.success("AI content generated!");
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

                {/* AI Prompt Input - Shows only when showAIPrompt is true */}
                {showAIPrompt && (
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Enter your AI content prompt</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                className="flex-1 border rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                placeholder="E.g., Write a promotional post about our new product launch"
                                value={aiPrompt}
                                onChange={handleAIPromptChange}
                            />
                            <button
                                onClick={generateAIContent}
                                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md"
                            >
                                Generate
                            </button>
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
                    {post.recurrence === 'none' && (
                        <button
                            className="flex items-center gap-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md"
                            onClick={() => setShowDatePicker(!showDatePicker)}
                        >
                            <Clock size={18} />
                            <span>Schedule</span>
                        </button>
                    )}

                    {/* Recurrence */}
                    <div className="flex items-center gap-1 px-3 py-2 bg-gray-100 rounded-md">
                        <Repeat size={18} />
                        <label htmlFor="recurrence" className="text-sm">Repeat</label>
                        <select
                            id="recurrence"
                            className="ml-2 border rounded px-2 py-1 text-sm"
                            value={post.recurrence}
                            onChange={handleRecurrenceChange}
                        >
                            {RECURRENCE_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* If recurrence is not none, show nextRunAt input */}
                    {post.recurrence !== 'none' && (
                        <div className="flex items-center gap-1 px-3 py-2 bg-gray-100 rounded-md">
                            <Clock size={16} />
                            <label htmlFor="nextRunAt" className="text-sm">First Run</label>
                            <input
                                id="nextRunAt"
                                type="datetime-local"
                                className="ml-2 border rounded px-2 py-1 text-sm"
                                value={post.nextRunAt ? new Date(post.nextRunAt).toISOString().slice(0, 16) : ''}
                                onChange={handleNextRunAtChange}
                                min={new Date().toISOString().slice(0, 16)}
                            />
                        </div>
                    )}

                    {/* AI Generate */}
                    <button
                        className="flex items-center gap-1 px-3 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-md"
                        // onClick={generateAIContent}
                        onClick={toggleAIPrompt}
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

                        {post.recurrence !== 'none' && post.nextRunAt && (
                            <div className="text-gray-500 text-sm flex items-center gap-1 mt-2">
                                <Repeat size={14} />
                                <span>
                                    Repeats: {RECURRENCE_OPTIONS.find(opt => opt.value === post.recurrence)?.label}
                                    {post.nextRunAt && (
                                        <> (First run: {new Date(post.nextRunAt).toLocaleString()})</>
                                    )}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}