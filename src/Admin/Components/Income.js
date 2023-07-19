import '../css/material-dashboard.css';
import '../css/nucleo-icons.css';
import '../css/nucleo-svg.css';
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

import Modal from 'react-modal';




const Income = () => {

  const [payments, setPayments] = useState([]);
  const [payment, setPayment] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/get-payments')
      .then(response => response.json())
      .then(data => setPayments(data));
  }, []);

  // tổng tiền
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/get-payment')
      .then(response => response.json())
      .then(data => setPayment(data));
  }, []);

  const openModal = (payment) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const filteredPayments = payments.filter(p => p.shop_id === selectedPayment?.shop_id);


  return (
    <div>

      <div className="g-sidenav-show bg-gray-200">
        <main className="main-content position-relative max-height-vh-100 h-100 border-radius-lg">
          <div className="container-fluid py-4">
            <div className="row">
              <div className="col-lg-12">
                <div className="card h-100" id='Cardadmin1' >
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







                    {/* chi tiết hóa đơn của BarBerShop */}
                    {/* <table id='table'>
        <thead>
          <tr>
           
            <th>Shop Name</th>
            <th>Shop Image</th>
            <th>User Name</th>
            <th>Payment Amount</th>
            <th>Payment Date</th>

          </tr>
        </thead>
        <tbody>
          {payments.map(payment => (
            <tr key={payment.payment_id}>
   
              <td>{payment.shop_name}</td>
              <td>{payment.shop_image}</td>
              <td>{payment.user_name}</td>
              <td>{payment.payment_amount}</td>
              <td>{format(new Date(payment.created_at), 'dd/MM/yyyy HH:mm')}</td>

            </tr>
          ))}
        </tbody>
      </table> */}

                  </div>
                </div>
              </div>
            </div>
            <Modal
                      style={{
                        content: {
                          marginLeft: '50%',
                          transform: 'translateX(-38%)',
                          width: '50%',
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
                              <div className="cardBaber h-100" style={{ width: '100%', marginLeft: '0% ' }}>
                                <div className="card-header pb-0">
                                  <h6>Thống kê thu nhập của {selectedPayment.shop_name}</h6>
                                </div>
                                <table id="table">
                                  <thead>
                                    <tr>
                                      <th>User Name</th>
                                      <th>Payment Amount</th>
                                      <th>Service</th>
                                      <th>Stylist</th>
                                      <th>Appointment</th>
                                      <th>Payment Date</th>

                                    </tr>
                                  </thead>
                                  <tbody>
                                    {filteredPayments.map((payment) => (
                                      <tr key={payment.payment_id}>
                                        <td>{payment.user_name}</td>
                                        <td>{payment.payment_amount}</td>
                                        <td>{payment.service_name}</td>
                                        <td>{payment.stylist_name}</td>
                                        <td>{payment.appointment_date} {payment.appointment_time}</td>
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



    </div>

  );
};

export default Income;
