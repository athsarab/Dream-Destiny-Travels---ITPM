import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';

const PackageBookingsList = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/packages/bookings');
            // Make sure we have valid data
            if (response && response.data) {
                setBookings(response.data || []);
            } else {
                setError("No booking data received");
                setBookings([]);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching bookings:', error);
            setError("Failed to load bookings");
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (bookingId, status) => {
        try {
            await axios.put(`http://localhost:5000/api/packages/bookings/${bookingId}`, { status });
            alert(`Booking ${status} successfully`);
            fetchBookings();
        } catch (error) {
            alert('Failed to update booking status');
        }
    };

    const generateReport = () => {
        const doc = new jsPDF();
        let yPos = 20;

        doc.setFontSize(16);
        doc.text('Package Bookings Report', 20, yPos);
        doc.setFontSize(12);

        bookings.forEach((booking, index) => {
            yPos += 20;
            if (yPos > 280) {
                doc.addPage();
                yPos = 20;
            }

            doc.text(`Booking ${index + 1}:`, 20, yPos);
            yPos += 10;
            
            // Add null check for packageId
            const packageName = booking.packageId && booking.packageId.name 
                ? booking.packageId.name 
                : 'Unknown Package';
                
            doc.text(`Package: ${packageName}`, 30, yPos);
            yPos += 7;
            doc.text(`Customer: ${booking.customerName || 'N/A'}`, 30, yPos);
            yPos += 7;
            doc.text(`People: ${booking.numberOfPeople || 'N/A'}`, 30, yPos);
            yPos += 7;
            doc.text(`Total: $${booking.totalPrice || '0'}`, 30, yPos);
            yPos += 7;
            doc.text(`Status: ${booking.status || 'N/A'}`, 30, yPos);
            yPos += 10;
        });

        doc.save('package-bookings-report.pdf');
    };

    if (loading) return <div className="text-white text-center py-8">Loading bookings...</div>;

    if (error) return (
        <div className="text-center py-8">
            <p className="text-red-400 mb-4">{error}</p>
            <button 
                onClick={fetchBookings}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
                Retry
            </button>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Package Bookings</h2>
                <button
                    onClick={generateReport}
                    className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                >
                    Generate Report
                </button>
            </div>

            {bookings.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-400">No bookings found</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {bookings.map((booking) => (
                        <div key={booking._id} className="bg-dark-300 rounded-lg p-6 space-y-4">
                            <div className="flex justify-between">
                                <div>
                                    <h3 className="text-xl font-semibold text-white">
                                        {/* Add null check here */}
                                        {booking.packageId && booking.packageId.name 
                                            ? booking.packageId.name 
                                            : 'Unknown Package'}
                                    </h3>
                                    <p className="text-gray-400">Customer: {booking.customerName || 'N/A'}</p>
                                    <p className="text-gray-400">Email: {booking.email || 'N/A'}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-primary-400 font-bold">
                                        Total: ${booking.totalPrice || '0'}
                                    </p>
                                    <p className="text-gray-400">
                                        People: {booking.numberOfPeople || '0'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-4">
                                {booking.status === 'pending' && (
                                    <>
                                        <button
                                            onClick={() => handleStatusUpdate(booking._id, 'approved')}
                                            className="px-4 py-2 bg-success text-white rounded-lg"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleStatusUpdate(booking._id, 'rejected')}
                                            className="px-4 py-2 bg-error text-white rounded-lg"
                                        >
                                            Reject
                                        </button>
                                    </>
                                )}
                                <span className={`px-4 py-2 rounded-lg ${
                                    booking.status === 'approved' ? 'bg-success/20 text-success' :
                                    booking.status === 'rejected' ? 'bg-error/20 text-error' :
                                    'bg-warning/20 text-warning'
                                }`}>
                                    {(booking.status || 'pending').charAt(0).toUpperCase() + (booking.status || 'pending').slice(1)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PackageBookingsList;
