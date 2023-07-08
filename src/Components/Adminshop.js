import React, { useState, useEffect } from 'react';
import { format, parse } from 'date-fns';

import Modal from 'react-modal';

const Adminshop = () => {
  const [payments, setPayments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modelOpen, setModelOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Lấy dữ liệu từ localStorage
    const data = localStorage.getItem('userID');
    if (data) {
      const parsedData = JSON.parse(data);
      setUserData(parsedData);
    }
  }, []);

  useEffect(() => {
    let isMounted = true; // Biến để kiểm tra xem component đã mount hay chưa

    const fetchData = async () => {
      try {
        const url1 = new URL('http://127.0.0.1:8000/api/get-payments');
        url1.searchParams.append('userID', userData.userId);

        const response1 = await fetch(url1);
        const data1 = await response1.json();

        if (isMounted) {
          setPayments(data1);
        }

        const url2 = new URL('http://127.0.0.1:8000/api/get-payment');
        url2.searchParams.append('userID', userData.userId);

        const response2 = await fetch(url2);
        const data2 = await response2.json();

        if (isMounted) {
          setPayments(data2);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();

    // Cleanup function để kiểm tra xem component đã unmount hay chưa
    return () => {
      isMounted = false;
    };
  }, [userData]);

  const openModal = (payment) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openModel = () => {
    setModelOpen(true);
  };

  const closeModel = () => {
    setModelOpen(false);
  };

  const filteredPayments = payments.filter((p) => {
    const paymentDate = new Date(p.created_at);

    if (selectedPayment?.shop_id) {
      if (selectedDay && selectedMonth && selectedYear) {
        const selectedDate = new Date(selectedYear, selectedMonth - 1, selectedDay);
        return (
          p.shop_id === selectedPayment.shop_id &&
          paymentDate.toDateString() === selectedDate.toDateString()
        );
      } else if (selectedMonth && selectedYear) {
        const selectedDate = new Date(selectedYear, selectedMonth - 1);
        return (
          p.shop_id === selectedPayment.shop_id &&
          paymentDate.getMonth() === selectedDate.getMonth() &&
          paymentDate.getFullYear() === selectedDate.getFullYear()
        );
      } else if (selectedDay) {
        return (
          p.shop_id === selectedPayment.shop_id &&
          paymentDate.getDate() === parseInt(selectedDay)
        );
      } else {
        return p.shop_id === selectedPayment.shop_id;
      }
    } else if (selectedDay && selectedMonth && selectedYear) {
      const selectedDate = new Date(selectedYear, selectedMonth - 1, selectedDay);
      return paymentDate.toDateString() === selectedDate.toDateString();
    } else if (selectedMonth && selectedYear) {
      const selectedDate = new Date(selectedYear, selectedMonth - 1);
      return (
        paymentDate.getMonth() === selectedDate.getMonth() &&
        paymentDate.getFullYear() === selectedDate.getFullYear()
      );
    } else if (selectedDay) {
      return paymentDate.getDate() === parseInt(selectedDay);
    } else {
      return true;
    }
  });

  const handleDayChange = (e) => {
    setSelectedDay(e.target.value);
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  return (
    <div>
      <h2 style={{ width: '10%' }}>Thống kê hóa đơn</h2>
      <button onClick={openModel} style={{ width: '10%' }}>
        Detail
      </button>

      <Modal
        style={{
          content: {
            marginLeft: '40%',
            marginTop: '10%',
            transform: 'translateX(-38%)',
            width: '30%',
            height: '50%'
          },
        }}
        isOpen={modelOpen}
        onRequestClose={closeModel}
        contentLabel="Payment Detail Modal"
      >
        <div className="g-sidenav-show bg-gray-200">
          <main className="main-content position-relative max-height-vh-100 h-100 border-radius-lg">
            <div className="container-fluid py-4">
              <div className="row">
                <div className="col-lg-12" id="col_1">
                  <div className="card h-100">
                    <div className="card-header pb-0">
                      <h6>Thống kê thu nhập của BarBerShop</h6>
                    </div>
                    <div className="card-body p-3">
                      <table id="table">
                        <thead>
                          <tr>
                            <th>Shop Name</th>
                            <th>Shop Image</th>
                            <th>Payment Amount</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {payments.map((payment) => (
                            <tr key={payment.payment_id}>
                              <td>{payment.shop_name}</td>
                              <td>{payment.shop_image}</td>
                              <td>{payment.total_amount}</td>
                              <td>
                                <button onClick={() => openModal(payment)}>Detail</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <Modal
                style={{
                  content: {
                    marginLeft: '40%',
                    marginTop: '10%',
                    transform: 'translateX(-38%)',
                    width: '30%',
                    height: '50%'
                  },
                }}
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Payment Detail Modal"
              >
                {selectedPayment && (
                  <div className="container-fluid py-4">
                    <div className="row">
                      <div className="col-lg-12">
                        <div
                          className="cardBaber h-100"
                          style={{ width: '100%', marginLeft: '0%' }}
                        >
                          <div className="card-header pb-0">
                            <h6>Thống kê thu nhập của {selectedPayment.shop_name}</h6>
                          </div>
                          <div>
                            <label htmlFor="daySelect">Ngày:</label>
                            <select id="daySelect" value={selectedDay} onChange={handleDayChange}>

                              <option value="">Tất cả</option>
                              {Array.from(Array(31), (_, index) => (
                                <option key={index + 1} value={index + 1}>
                                  Mùng {index + 1}
                                </option>
                              ))}
                            </select>
                            <label htmlFor="monthSelect">Tháng:</label>
                            <select
                              id="monthSelect"
                              value={selectedMonth}
                              onChange={handleMonthChange}
                            >
                              <option value="">Tất cả</option>
                              {Array.from(Array(12), (_, index) => (
                                <option key={index + 1} value={index + 1}>
                                  Tháng {index + 1}
                                </option>
                              ))}
                            </select>
                            <label htmlFor="yearSelect">Năm:</label>
                            <select
                              id="yearSelect"
                              value={selectedYear}
                              onChange={handleYearChange}
                            >
                              <option value="">Tất cả</option>
                              {Array.from(Array(10), (_, index) => (
                                <option key={index + 2023} value={index + 2023}>
                                  {index + 2023}
                                </option>
                              ))}
                            </select>
                          </div>

                          <table id="table">
                            <thead>
                              <tr>
                                <th>User Name</th>
                                <th>Payment Amount</th>
                                <th>Payment Date</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredPayments.map((payment) => (
                                <tr key={payment.payment_id}>
                                  <td>{payment.user_name}</td>
                                  <td>{payment.payment_amount}</td>
                                  <td>{format(new Date(payment.created_at), 'dd/MM/yyyy HH:mm')}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>

                          <button className="modal-close-button" onClick={closeModal}>
                            Close
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Modal>
            </div>
          </main>
        </div>
        <button className="modal-close-button" onClick={closeModal}>
          Close
        </button>
      </Modal>
    </div>
  );
};

export default Adminshop;
