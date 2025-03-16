import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditPackagePage = () => {
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [image, setImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPackage = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/packages/${id}`);
                setFormData(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching package:', error);
                setLoading(false);
            }
        };
        fetchPackage();
    }, [id]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const packageData = new FormData();
            
            // Append all form data except imageUrl
            Object.keys(formData).forEach(key => {
                if (key !== 'imageUrl' && key !== '_id' && key !== '__v') {
                    packageData.append(key, formData[key]);
                }
            });
            
            // Append new image if selected
            if (image) {
                packageData.append('image', image);
            }

            await axios.put(`http://localhost:5000/api/packages/${id}`, packageData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            alert('Package updated successfully!');
            navigate('/admin');
        } catch (error) {
            console.error('Error updating package:', error);
            alert('Failed to update package. Please try again.');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!formData) return <div>Package not found</div>;

    const imageUrl = previewUrl || (formData?.imageUrl ? `http://localhost:5000${formData.imageUrl}` : null);

    return (
        <div className="min-h-screen bg-dark-100 py-12 px-4">
            <div className="max-w-3xl mx-auto bg-dark-200 rounded-xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-white mb-8 text-center">
                    Edit Travel Package
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-dark-500 font-medium mb-2">Package Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="w-full p-3 border border-dark-300 rounded-lg bg-dark-100 text-white"
                            />
                            {imageUrl && (
                                <div className="mt-4">
                                    <img
                                        src={imageUrl}
                                        alt="Package"
                                        className="w-full max-h-48 object-cover rounded-lg"
                                    />
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="block text-dark-500 font-medium mb-2">Package Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData?.name || ''}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                className="w-full p-3 border border-dark-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent bg-dark-100 text-white placeholder-dark-400"
                                required
                            />
                        </div>
                        
                        <div>
                            <label className="block text-dark-500 font-medium mb-2">Description</label>
                            <textarea
                                name="description"
                                value={formData?.description || ''}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                className="w-full p-3 border border-dark-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent bg-dark-100 text-white placeholder-dark-400 h-32"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-dark-500 font-medium mb-2">Price ($)</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData?.price || ''}
                                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                                    className="w-full p-3 border border-dark-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent bg-dark-100 text-white placeholder-dark-400"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-dark-500 font-medium mb-2">Duration</label>
                                <input
                                    type="text"
                                    name="duration"
                                    value={formData?.duration || ''}
                                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                                    className="w-full p-3 border border-dark-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent bg-dark-100 text-white placeholder-dark-400"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-dark-500 font-medium mb-2">Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData?.location || ''}
                                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                                    className="w-full p-3 border border-dark-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent bg-dark-100 text-white placeholder-dark-400"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-dark-500 font-medium mb-2">Maximum Participants</label>
                                <input
                                    type="number"
                                    name="maxPax"
                                    value={formData?.maxPax || ''}
                                    onChange={(e) => setFormData({...formData, maxPax: e.target.value})}
                                    className="w-full p-3 border border-dark-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent bg-dark-100 text-white placeholder-dark-400"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 mt-8">
                        <button 
                            type="submit"
                            className="flex-1 bg-primary-600 text-white py-3 px-6 rounded-lg hover:bg-primary-700 transition-colors duration-200 font-semibold"
                        >
                            Update Package
                        </button>
                        <button 
                            type="button" 
                            onClick={() => navigate('/admin')}
                            className="flex-1 bg-dark-300 text-white py-3 px-6 rounded-lg hover:bg-dark-400 transition-colors duration-200 font-semibold"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditPackagePage;
