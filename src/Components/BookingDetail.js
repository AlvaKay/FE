import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import CSS của Bootstrap
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Import JS của Bootstrap

const BookingDetail = () => {
  const [bookingDetail, setBookingDetail] = useState(null);
  const bookingId = window.location.pathname.split('/').pop();

  useEffect(() => {
    // Lấy dữ liệu chi tiết đặt lịch từ API dựa trên bookingId
    const fetchBookingDetail = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/getbookingdetail/${bookingId}`);
        const data = await response.json();
        setBookingDetail(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchBookingDetail();
  }, [bookingId]);

  if (!bookingDetail) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h2>Booking Detail</h2>
      <div className="card">
        <div className="card-body">
          <p className="card-text">User Name: {bookingDetail.user_name}</p>
          <p className="card-text">User Address: {bookingDetail.user_address}</p>
          <p className="card-text">Phone Number: {bookingDetail.user_phone}</p>
          {bookingDetail.combo_name && (
            <p className="card-text">Combo Name: {bookingDetail.combo_name}</p>
          )}
          {bookingDetail.service_name && (
            <p className="card-text">Service Name: {bookingDetail.service_name}</p>
          )}
          <p className="card-text">Price: {bookingDetail.price}</p>
          <p className="card-text">Stylist Name: {bookingDetail.stylist_name}</p>
          <p className="card-text">Appointment Date: {bookingDetail.appointment_date}</p>
          <p className="card-text">Appointment Time: {bookingDetail.appointment_time}</p>
        </div>
      </div>
    </div>
  );
};

export default BookingDetail;
