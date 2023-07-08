import '../css/material-dashboard.css';
import '../css/nucleo-icons.css';
import '../css/nucleo-svg.css';
import React, { useState, useEffect } from 'react';


import axios from 'axios';


const Notification = () => {
  const [shops, setShops] = useState([]);

  useEffect(() => {
    // Gọi API để lấy dữ liệu ratings
    fetch('http://127.0.0.1:8000/api/approve')
      .then(response => response.json())
      .then(data => setShops(data));
  }, []);
  const handleBecomeShop = async (shopId) => {
    try {
        const confirmed = window.confirm('Bạn có chắc chắn muốn duyệt BarBerShop này?');
if(confirmed){
      const response = await axios.post(`http://127.0.0.1:8000/api/approve/${shopId}`);
      alert('Duyệt cửa hàng thành công!');

      console.log(response.data);
      fetch('http://127.0.0.1:8000/api/approve')
      .then(response => response.json())
      .then(data => setShops(data));
}
      // Xử lý phản hồi từ server (response) tại đây (nếu cần)
    } catch (error) {
      console.error(error);
      // Xử lý lỗi tại đây (nếu cần)
    }
  };

  
  

  

  return (

    <div className="g-sidenav-show bg-gray-200">
    <main className="main-content position-relative max-height-vh-100 h-100 border-radius-lg">
      <div className="container-fluid py-4" id="container1">
        <div className="row justify-content-center">
          {shops.map(shop => (
            <div key={shop.shop_id} className="col-lg-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{shop.shop_name}</h5>
                  <img src={shop.shop_image} alt="Shop Image" className="card-img" />
                  <div>
                    <label>Phone: </label>
                     {shop.shop_phone}
                  </div>
                  <div>
                    <label>Address: </label>
                     {shop.user_address}
                  </div>
           
      <button className="btn btn-danger" onClick={() => handleBecomeShop(shop.shop_id)} >Approve</button>
     

                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  </div>
  
 

  );
};

export default Notification;
