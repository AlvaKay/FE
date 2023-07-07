

import React, { useState, useEffect } from 'react';
import { format, parse } from 'date-fns';

import Modal from 'react-modal';
const Adminshop = () => {
    const [payments, setPayments] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [ModelOpen,SetModelOpen] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedDay, setSelectedDay] = useState('');   
    useEffect(() => {
      fetch('http://127.0.0.1:8000/api/get-payments')
        .then(response => response.json())
        .then(data => setPayments(data));
    }, []);
    const [payment, setPayment] = useState([]);
  
    useEffect(() => {
      fetch('http://127.0.0.1:8000/api/get-payment')
        .then(response => response.json())
        .then(data => setPayment(data));
    }, []);
    // Model
    const openModal = (payment) => {
      setSelectedPayment(payment);
      setIsModalOpen(true);
    };
  
    const closeModal = () => {
      setIsModalOpen(false);
    };
    const openModal1 = (payment) => {
        SetModelOpen(true);
      };
    
      const closeModal1 = () => {
        SetModelOpen(false);
      };
    const filteredPayments = payments.filter((p) => {
      if (selectedPayment?.shop_id && selectedMonth && selectedYear && selectedDay) {
        const selectedDate = parse(
          `${selectedYear}-${selectedMonth}-${selectedDay}`,
          'yyyy-MM-dd',
          new Date()
        );
        const paymentDate = new Date(p.created_at);
        return (
          p.shop_id === selectedPayment.shop_id &&
          paymentDate.getDate() === selectedDate.getDate() &&
          paymentDate.getMonth() === selectedDate.getMonth() &&
          paymentDate.getFullYear() === selectedDate.getFullYear()
        );
      } else if (selectedPayment?.shop_id && selectedMonth && selectedYear) {
        const selectedDate = parse(
          `${selectedYear}-${selectedMonth}-01`,
          'yyyy-MM-dd',
          new Date()
        );
        const paymentDate = new Date(p.created_at);
        return (
          p.shop_id === selectedPayment.shop_id &&
          paymentDate.getMonth() === selectedDate.getMonth() &&
          paymentDate.getFullYear() === selectedDate.getFullYear()
        );
      } else if (selectedPayment?.shop_id && selectedDay) {
        const paymentDate = new Date(p.created_at);
        return (
          p.shop_id === selectedPayment.shop_id &&
          paymentDate.getDate() === parseInt(selectedDay)
        );
      } else if (selectedPayment?.shop_id) {
        return p.shop_id === selectedPayment.shop_id;
      } else if (selectedMonth && selectedYear && selectedDay) {
        const selectedDate = parse(
          `${selectedYear}-${selectedMonth}-${selectedDay}`,
          'yyyy-MM-dd',
          new Date()
        );
        const paymentDate = new Date(p.created_at);
        return (
          paymentDate.getDate() === selectedDate.getDate() &&
          paymentDate.getMonth() === selectedDate.getMonth() &&
          paymentDate.getFullYear() === selectedDate.getFullYear()
        );
      }
      else if (selectedMonth && selectedYear) {
        const selectedDate = parse(
          `${selectedYear}-${selectedMonth}-01`,
          'yyyy-MM-dd',
          new Date()
        );
        const paymentDate = new Date(p.created_at);
        return (
          paymentDate.getMonth() === selectedDate.getMonth() &&
          paymentDate.getFullYear() === selectedDate.getFullYear()
        );
      } else if (selectedDay) {
        const paymentDate = new Date(p.created_at);
        return paymentDate.getDate() === parseInt(selectedDay);
      }
      return true;
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
<h2  style={{ width:"10%" }} >Thống kê hóa đơn</h2>
 <button onClick={() => openModal1()} style={{ width:"10%" }}>Detail</button>

        <Modal
              style={{
                content: {
                  marginLeft: '40%',
                  marginTop:'10%',
                  transform: 'translateX(-38%)',
                  width: "30%",
                  height:"50%"
                },
              }}
              isOpen={ModelOpen}
              onRequestClose={closeModal1}
              contentLabel="Payment Detail Modal"
        >
     
        <div className="g-sidenav-show bg-gray-200">
          <main className="main-content position-relative max-height-vh-100 h-100 border-radius-lg">
            <div className="container-fluid py-4">
              <div className="row">
                <div className="col-lg-12" id="col_1">
                  <div className="card h-100"  >
                    <div className="card-header pb-0">
                      <h6>Thống kê thu nhập của BarBerShop</h6>
  
                    </div>
                    <div className="card-body p-3">
                      <table id='table'>
                        <thead>
                          <tr>

                            <th>Shop Name</th>
                            <th>Shop Image</th>
                            <th>Payment Amount</th>
                            <th> Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {payment.map(payment => (
                            <tr key={payment.payment_id}>
                              <td>{payment.shop_name}</td>
                              <td>{payment.shop_image}</td>
                              <td>{payment.total_amount}</td>
                              <button onClick={() => openModal(payment)}>Detail</button>
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
                    marginTop:'10%',
                    transform: 'translateX(-38%)',
                    width: "30%",
                    height:"50%"
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
                        <div className="cardBaber h-100" style={{ width: "100%", marginLeft: "0% " }}>
  
                          <div className="card-header pb-0" >
                            <h6>Thống kê thu nhập của {selectedPayment.shop_name} </h6>
  
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
    <select id="monthSelect" value={selectedMonth} onChange={handleMonthChange}>
      <option value="">Tất cả</option>
      {Array.from(Array(12), (_, index) => (
        <option key={index + 1} value={index + 1}>
          Tháng {index + 1}
        </option>
      ))}
    </select>
    <label htmlFor="yearSelect">Năm:</label>
    <select id="yearSelect" value={selectedYear} onChange={handleYearChange}>
      <option value="">Tất cả</option>
      {Array.from(Array(10), (_, index) => (
        <option key={index + 2023} value={index + 2023}>
          {index + 2023}
        </option>
      ))}
    </select>
  </div>
  
  
                          <table id='table' >
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
  
                          <button className="modal-close-button" onClick={closeModal}>Close</button>
                        </div>
                      </div>
                    </div>
                  </div>
  
                )}
  
              </Modal>
            </div>
          </main>
        </div>
  
  
        <button className="modal-close-button" onClick={closeModal1}>Close</button>

    
      </Modal>
</div>
    )}

export default Adminshop;