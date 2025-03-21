import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 12 },
  header: { 
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f6f6f6',
    borderRadius: 5 
  },
  title: { 
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2563eb'
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20
  },
  statBox: {
    width: '20%',
    padding: 10,
    backgroundColor: '#fff',
    margin: 5
  },
  bookingItem: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5
  },
  label: { color: '#666', marginBottom: 3 },
  value: { fontWeight: 'bold', marginBottom: 5 },
  grid: { 
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  }
});

const BookingReport = ({ bookings, stats }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Custom Package Bookings Report</Text>
        <Text>Generated on: {new Date().toLocaleString()}</Text>
      </View>

      <View style={styles.statsGrid}>
        {Object.entries(stats).map(([key, value]) => (
          <View key={key} style={styles.statBox}>
            <Text style={styles.label}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
            <Text style={styles.value}>{key === 'revenue' ? `$${value}` : value}</Text>
          </View>
        ))}
      </View>

      {bookings.map((booking, i) => (
        <View key={i} style={styles.bookingItem}>
          <View style={styles.grid}>
            <View>
              <Text style={styles.value}>{booking.customerName}</Text>
              <Text>{booking.email}</Text>
            </View>
            <View>
              <Text style={{ color: booking.status === 'approved' ? '#22c55e' : 
                                  booking.status === 'rejected' ? '#ef4444' : '#f59e0b' }}>
                {booking.status.toUpperCase()}
              </Text>
              <Text>${booking.totalPrice}</Text>
            </View>
          </View>
          <Text>Travel Date: {new Date(booking.travelDate).toLocaleDateString()}</Text>
          <Text style={[styles.label, { marginTop: 5 }]}>Selected Options:</Text>
          {Object.entries(booking.selectedOptions).map(([cat, opt]) => (
            <Text key={cat}>{cat}: {opt.name} (${opt.price})</Text>
          ))}
        </View>
      ))}
    </Page>
  </Document>
);

export default BookingReport;
