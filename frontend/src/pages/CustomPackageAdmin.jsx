import React, { useState, useEffect } from 'react';
import api from '../services/api';

const CustomPackageAdmin = () => {
    const [categories, setCategories] = useState([]);
    const [bookings, setBookings] = useState([]); // Ensure this is initialized as an empty array
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('bookings'); // Default to bookings tab
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        category: '',
        selectedItemId: '',
        price: ''
    });

    const [availableItems, setAvailableItems] = useState({
        agents: [],
        hotels: [],
        vehicles: []
    });

    const predefinedCategories = [
        {
            name: 'Travel Agents',
            model: 'Employee',
            items: 'agents'
        },
        {
            name: 'Hotels',
            model: 'Hotel',
            items: 'hotels'
        },
        {
            name: 'Vehicles',
            model: 'Vehicle',
            items: 'vehicles'
        }
    ];

    // Fetch data on component mount
    useEffect(() => {
        fetchData();
        fetchAvailableItems();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            console.log('Fetching custom package data...');

            const [bookingsRes, categoriesRes] = await Promise.all([
                api.getCustomBookings(),
                api.getCustomPackageCategories()
            ]);

            console.log('Bookings response:', bookingsRes);
            console.log('Categories response:', categoriesRes);

            if (bookingsRes?.data) {
                setBookings(Array.isArray(bookingsRes.data) ? bookingsRes.data : []);
            }

            if (categoriesRes) {
                setCategories(Array.isArray(categoriesRes) ? categoriesRes : []);
            }

        } catch (err) {
            console.error('Error fetching data:', err);
            setError(err.message || 'Failed to fetch data');
            setBookings([]);
            setCategories([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchAvailableItems = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('Fetching available items...');

            const response = await api.getAvailableItems();
            console.log('Available items response:', response);

            if (!response) {
                throw new Error('No response from server');
            }

            // Convert response to lowercase keys for consistency
            const itemsByCategory = {
                'travel agents': response.agents || [],
                hotels: response.hotels || [],
                vehicles: response.vehicles || []
            };

            console.log('Processed items by category:', itemsByCategory);
            setAvailableItems(itemsByCategory);

        } catch (error) {
            console.error('Error fetching items:', error);
            setError(error.message || 'Failed to fetch available items');
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryChange = (e) => {
        const selectedCategory = e.target.value;
        console.log('Selected category:', selectedCategory);

        setFormData({
            ...formData,
            category: selectedCategory,
            selectedItemId: '',
            price: ''
        });
    };

    const [selectedHotel, setSelectedHotel] = useState(null);
    const [selectedRoomType, setSelectedRoomType] = useState('');

    const handleItemSelect = (e) => {
        const itemId = e.target.value;
        setFormData({...formData, selectedItemId: itemId, price: ''});

        if (formData.category === 'Hotels') {
            const hotel = availableItems.hotels.find(h => h._id === itemId);
            setSelectedHotel(hotel);
            setSelectedRoomType('');
        }
    };

    const handleRoomTypeSelect = (e) => {
        const roomType = e.target.value;
        setSelectedRoomType(roomType);

        if (selectedHotel) {
            const room = selectedHotel.rooms.find(r => r.type === roomType);
            if (room) {
                setFormData(prev => ({
                    ...prev,
                    price: room.price.toString()
                }));
            }
        }
    };

    // Modify the form render to include room selection when Hotels is selected
    const renderItemOptions = () => {
        if (!formData.category) return null;

        const categoryItems = formData.category.toLowerCase();
        const items = availableItems[categoryItems] || [];

        if (formData.category === 'Hotels' && selectedHotel) {
            return (
                <>
                    <div className="mb-4">
                        <select
                            value={formData.selectedItemId}
                            onChange={handleItemSelect}
                            className="w-full p-3 rounded-lg bg-dark-300 text-white"
                            required
                        >
                            <option value="">Select Hotel</option>
                            {items.map(item => (
                                <option key={item._id} value={item._id}>
                                    {item.name} - {item.location}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <select
                            value={selectedRoomType}
                            onChange={handleRoomTypeSelect}
                            className="w-full p-3 rounded-lg bg-dark-300 text-white"
                            required
                        >
                            <option value="">Select Room Type</option>
                            {selectedHotel.rooms.map(room => (
                                <option key={room.type} value={room.type}>
                                    {room.type} - ${room.price} ({room.available} available)
                                </option>
                            ))}
                        </select>
                    </div>
                </>
            );
        }

        return (
            <select
                value={formData.selectedItemId}
                onChange={handleItemSelect}
                className="w-full p-3 rounded-lg bg-dark-300 text-white"
                required
            >
                <option value="">Select {formData.category}</option>
                {items.map(item => (
                    <option key={item._id} value={item._id}>
                        {item.name} - {item.description}
                    </option>
                ))}
            </select>
        );
    };

    // Add automatic refresh interval 
    useEffect(() => {
        fetchData(); // Initial fetch

        // Refresh data every 30 seconds
        const intervalId = setInterval(fetchData, 30000);

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
    }, []);

    // Handle booking status update
    const updateBookingStatus = async (id, newStatus) => {
        if (!id || !newStatus) {
            alert('Invalid booking ID or status');
            return;
        }

        try {
            setLoading(true);
            const response = await api.updateCustomBooking(id, newStatus);

            if (response?.data?.success) {
                const booking = response.data.data;

                if (newStatus === 'approved' && booking) {
                    // Format the selected options text
                    let selectedOptionsText = Object.entries(booking.selectedOptions || {})
                        .map(([category, option]) => `${category}: ${option.name} ($${option.price})`)
                        .join('\n');

                    // Format message with emojis
                    const message = `Dear ${booking.customerName},

🎉 *Your Custom Package Booking has been Approved!*

📅 *Booking Details:*
• Travel Date: ${new Date(booking.travelDate).toLocaleDateString()}
• Total Price: $${booking.totalPrice}

🎯  *Selected Options:*
${selectedOptionsText}

Thank you for choosing Dream Destiny Travel! ✨

Best regards,
Dream Destiny Travel Team`;

                    // Clean and format phone number for WhatsApp
                    let phoneNumber = booking.phoneNumber.replace(/[^0-9]/g, '');
                    if (phoneNumber.startsWith('0')) {
                        phoneNumber = '94' + phoneNumber.substring(1);
                    } else if (phoneNumber.startsWith('+94')) {
                        phoneNumber = phoneNumber.substring(1);
                    } else if (!phoneNumber.startsWith('94')) {
                        phoneNumber = '94' + phoneNumber;
                    }

                    // Create WhatsApp URL
                    const whatsappURL = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;

                    // Open WhatsApp
                    window.open(whatsappURL, '_blank');
                }

                await fetchData();
                alert(response.data.message || `Booking ${newStatus} successfully!`);
            } else {
                throw new Error('Failed to update booking status');
            }
        } catch (err) {
            console.error('Error updating status:', err);
            const errorMessage = err.response?.data?.message || err.message || 'Failed to update status';
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Add delete booking function
    const deleteBooking = async (id) => {
        if (!window.confirm('Are you sure you want to delete this booking?')) {
            return;
        }

        try {
            await api.deleteCustomBooking(id);
            fetchData();
            alert('Booking deleted successfully!');
        } catch (err) {
            console.error('Error deleting booking:', err);
            alert('Failed to delete booking. Please try again.');
        }
    };

    // Update the handleSubmit function
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Validate hotel room selection
            if (formData.category === 'Hotels' && !selectedRoomType) {
                throw new Error('Please select a room type');
            }

            const category = formData.category.toLowerCase();
            const itemsForCategory = availableItems[category];

            if (!itemsForCategory) {
                throw new Error('Invalid category selected');
            }

            const selectedItem = itemsForCategory.find(item => item._id === formData.selectedItemId);
            if (!selectedItem) {
                throw new Error('Selected item not found');
            }

            // Update name and description for hotel rooms
            const itemName = formData.category === 'Hotels' 
                ? `${selectedItem.name} - ${selectedRoomType}`
                : selectedItem.name;

            const itemDescription = formData.category === 'Hotels'
                ? `${selectedItem.name} - ${selectedRoomType} Room`
                : selectedItem.description;

            const optionsToSubmit = {
                name: formData.category,
                options: [{
                    name: itemName,
                    description: itemDescription,
                    price: parseFloat(formData.price),
                    itemId: selectedItem._id,
                    itemModel: predefinedCategories.find(c => c.name === formData.category)?.model
                }]
            };

            await api.addCustomPackageOption(optionsToSubmit);

            // Reset form and refresh data
            setFormData({
                category: '',
                selectedItemId: '',
                price: ''
            });

            alert('Option added successfully!');
            await fetchData();
            await fetchAvailableItems(); // Refresh available items
        } catch (error) {
            console.error('Error:', error);
            alert(error.message || 'Error adding option');
        }
    };

    // Format date for display
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Make sure to add a guard for the map function
    const renderBookings = () => {
        if (loading) {
            return <div className="text-center p-4">Loading bookings...</div>;
        }

        if (error) {
            return <div className="text-red-500 p-4">{error}</div>;
        }

        if (!Array.isArray(bookings) || bookings.length === 0) {
            return (
                <div className="text-center p-8 bg-gray-800 rounded-lg">
                    <p className="text-gray-400">No booking requests found.</p>
                    <button 
                        onClick={fetchData} 
                        className="mt-4 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
                    >
                        Refresh Data
                    </button>
                </div>
            );
        }

        return (
            <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
                    <thead className="bg-gray-700">
                        <tr>
                            <th className="px-4 py-3 text-left">Customer</th>
                            <th className="px-4 py-3 text-left">Travel Date</th>
                            <th className="px-4 py-3 text-left">Total Price</th>
                            <th className="px-4 py-3 text-left">Status</th>
                            <th className="px-4 py-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-600">
                        {bookings.map((booking) => (
                            <tr key={booking._id} className="hover:bg-gray-700">
                                <td className="px-4 py-3">
                                    <div>
                                        <div className="font-medium">{booking.customerName}</div>
                                        <div className="text-sm text-gray-400">{booking.email}</div>
                                        <div className="text-sm text-gray-400">{booking.phoneNumber}</div>
                                    </div>
                                </td>
                                <td className="px-4 py-3">{formatDate(booking.travelDate)}</td>
                                <td className="px-4 py-3">${booking.totalPrice.toFixed(2)}</td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-1 rounded text-xs font-medium 
                                        ${booking.status === 'approved' ? 'bg-green-900 text-green-300' :
                                            booking.status === 'rejected' ? 'bg-red-900 text-red-300' :
                                            'bg-yellow-900 text-yellow-300'}`}>
                                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex space-x-2">
                                        {booking.status === 'pending' && (
                                            <>
                                                <button 
                                                    onClick={() => updateBookingStatus(booking._id, 'approved')}
                                                    className="px-3 py-1 bg-green-600 rounded hover:bg-green-700">
                                                    Approve
                                                </button>
                                                <button 
                                                    onClick={() => updateBookingStatus(booking._id, 'rejected')}
                                                    className="px-3 py-1 bg-red-600 rounded hover:bg-red-700">
                                                    Reject
                                                </button>
                                            </>
                                        )}
                                        <button 
                                            onClick={() => {
                                                const details = JSON.stringify(booking.selectedOptions, null, 2);
                                                alert(`Booking Details:\n${details}`);
                                            }}
                                            className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-700">
                                            Details
                                        </button>
                                        <button 
                                            onClick={() => deleteBooking(booking._id)}
                                            className="px-3 py-1 bg-red-800 rounded hover:bg-red-900">
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}

                    </tbody>
                </table>
            </div>
        );
    };

    if (loading) return <div className="p-8 text-center text-white">Loading...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

    // Fix: Add the main return statement for the component
    return (
        <div className="p-8 pt-24 bg-dark-100 min-h-screen text-white">
            <h1 className="text-3xl font-bold mb-6">Custom Package Management</h1>

            {/* Tab Navigation */}
            <div className="flex mb-6 border-b border-gray-600">
                <button 
                    onClick={() => setActiveTab('bookings')}
                    className={`px-4 py-2 font-medium ${activeTab === 'bookings' ? 
                        'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}
                >
                    Booking Requests
                </button>
                <button 
                    onClick={() => setActiveTab('categories')}
                    className={`px-4 py-2 font-medium ${activeTab === 'categories' ? 
                        'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}
                >
                    Package Options
                </button>
            </div>

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Custom Package Booking Requests</h2>
                    {renderBookings()}
                </div>
            )}

            {/* Categories Tab */}
            {activeTab === 'categories' && (
                <form onSubmit={handleSubmit} className="space-y-6 bg-gray-800/50 p-6 rounded-xl">
                    {/* Category Selection */}
                    <div>
                        <label className="block text-white mb-2">Category</label>
                        <select
                            value={formData.category}
                            onChange={handleCategoryChange}
                            className="w-full p-3 rounded-lg bg-dark-300 text-white"
                            required
                        >
                            <option value="">Select Category</option>
                            {predefinedCategories.map(cat => (
                                <option key={cat.name} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Item Selection */}
                    {formData.category && (
                        <div>
                            <label className="block text-white mb-2">Select {formData.category}</label>
                            {renderItemOptions()}
                        </div>
                    )}

                    <div>
                        <label className="block text-white mb-2">Price</label>
                        <input
                            type="number"
                            value={formData.price}
                            onChange={(e) => setFormData({...formData, price: e.target.value})}
                            className="w-full p-3 rounded-lg bg-dark-300 text-white"
                            required
                            min="0"
                            step="0.01"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700"
                    >
                        Add Option
                    </button>
                </form>
            )}
        </div>
    );
};

export default CustomPackageAdmin;
