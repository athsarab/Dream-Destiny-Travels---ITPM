import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditPackagePage = () => {
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(true);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/api/packages/${id}`, formData);
            navigate('/admin');
        } catch (error) {
            console.error('Error updating package:', error);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!formData) return <div>Package not found</div>;

    return (
        <div className="edit-package">
            <h2>Edit Package</h2>
            <form onSubmit={handleSubmit} className="package-form">
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                />
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    required
                />
                <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    required
                />
                <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    required
                />
                <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    required
                />
                <input
                    type="number"
                    name="maxPax"
                    value={formData.maxPax}
                    onChange={(e) => setFormData({...formData, maxPax: e.target.value})}
                    required
                />
                <button type="submit">Update Package</button>
                <button type="button" onClick={() => navigate('/admin')} className="cancel-btn">
                    Cancel
                </button>
            </form>
        </div>
    );
};

export default EditPackagePage;
