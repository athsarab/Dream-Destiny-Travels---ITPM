import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import jsPDF from 'jspdf';

const CustomBookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.getBookings();
      setBookings(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, status) => {
    try {
      await api.updateBookingStatus(bookingId, status);
      alert(`Booking ${status} successfully`);
      fetchBookings();
    } catch (error) {
      console.error('Error updating booking:', error);
      alert('Failed to update booking status');
    }
  };

  const generateReport = () => {
    const doc = new jsPDF();
    let yPos = 20;

    // Add title
    doc.setFontSize(16);
    doc.text('Custom Package Bookings Report', 20, yPos);
    doc.setFontSize(12);

    bookings.forEach((booking, index) => {
      yPos += 20;

      // Add new page if needed
      if (yPos > 280) {
        doc.addPage();
        yPos = 20;
      }

      // Booking details
      doc.text(`Booking ${index + 1}:`, 20, yPos);
      yPos += 10;
      doc.text(`Customer: ${booking.customerName}`, 30, yPos);
      yPos += 7;
      doc.text(`Email: ${booking.email}`, 30, yPos);
      yPos += 7;
      doc.text(`Phone: ${booking.phoneNumber}`, 30, yPos);
      yPos += 7;
      doc.text(`Total Price: $${booking.totalPrice}`, 30, yPos);
      yPos += 7;
      doc.text(`Travel Date: ${new Date(booking.travelDate).toLocaleDateString()}`, 30, yPos);
      yPos += 7;
      doc.text(`Status: ${booking.status}`, 30, yPos);
      yPos += 10;

      // Selected options
      doc.text('Selected Options:', 30, yPos);
      yPos += 7;
      Object.entries(booking.selectedOptions).forEach(([category, option]) => {
        if (yPos > 280) {
          doc.addPage();
          yPos = 20;
        }
        doc.text(`- ${category}: ${option.name} ($${option.price})`, 40, yPos);
        yPos += 7;
      });

      yPos += 10; // Space between bookings
    });

    // Save the PDF
    doc.save('bookings-report.pdf');
  };

  if (loading) return <div className="text-white text-center">Loading bookings...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Custom Package Bookings</h2>
        <button
          onClick={generateReport}
          className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
        >
          Generate Report
        </button>
      </div>
      {bookings.length === 0 ? (
        <p className="text-gray-400 text-center">No bookings found</p>
      ) : (
        <div className="grid gap-6">
          {bookings.map((booking) => (
            <div key={booking._id} className="bg-dark-300 rounded-lg p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-white">{booking.customerName}</h3>
                  <p className="text-gray-400">{booking.email}</p>
                  <p className="text-gray-400">{booking.phoneNumber}</p>
                </div>
                <div className="text-right">
                  <p className="text-primary-400 font-bold">Total: ${booking.totalPrice}</p>
                  <p className="text-gray-400">
                    Travel Date: {new Date(booking.travelDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="border-t border-dark-400 pt-4">
                <h4 className="text-white font-semibold mb-2">Selected Options:</h4>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(booking.selectedOptions).map(([category, option]) => (
                    <div key={category} className="text-gray-400">
                      <span className="font-medium">{category}:</span> {option.name} (${option.price})
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                {booking.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleStatusUpdate(booking._id, 'approved')}
                      className="px-4 py-2 bg-success text-white rounded-lg hover:bg-opacity-90"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(booking._id, 'rejected')}
                      className="px-4 py-2 bg-error text-white rounded-lg hover:bg-opacity-90"
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
      )}
    </div>
  );
};

export default CustomBookingList;
