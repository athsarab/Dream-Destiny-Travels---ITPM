import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';

const PackageBookingsList = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/packages/bookings');
            setBookings(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching bookings:', error);
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
            doc.text(`Package: ${booking.packageId.name}`, 30, yPos);
            yPos += 7;
            doc.text(`Customer: ${booking.customerName}`, 30, yPos);
            yPos += 7;
            doc.text(`People: ${booking.numberOfPeople}`, 30, yPos);
            yPos += 7;
            doc.text(`Total: $${booking.totalPrice}`, 30, yPos);
            yPos += 7;
            doc.text(`Status: ${booking.status}`, 30, yPos);
            yPos += 10;
        });

        doc.save('package-bookings-report.pdf');
    };

    if (loading) return <div>Loading bookings...</div>;

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

            <div className="grid gap-4">
                {bookings.map((booking) => (
                    <div key={booking._id} className="bg-dark-300 rounded-lg p-6 space-y-4">
                        <div className="flex justify-between">
                            <div>
                                <h3 className="text-xl font-semibold text-white">
                                    {booking.packageId.name}
                                </h3>
                                <p className="text-gray-400">Customer: {booking.customerName}</p>
                                <p className="text-gray-400">Email: {booking.email}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-primary-400 font-bold">
                                    Total: ${booking.totalPrice}
                                </p>
                                <p className="text-gray-400">
                                    People: {booking.numberOfPeople}
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
                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PackageBookingsList;
