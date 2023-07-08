import '../css/material-dashboard.css';
import '../css/nucleo-icons.css';
import '../css/nucleo-svg.css';
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as SolidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as RegularStar } from '@fortawesome/free-regular-svg-icons';
import Modal from 'react-modal';

import axios from 'axios';

const BarberShop = () => {
  const [ratings, setRatings] = useState([]);
  const [selectedRating, setSelectedRating] = useState(null);

  useEffect(() => {
    // Call API to get ratings data
    fetch('http://127.0.0.1:8000/api/get-ratings')
      .then(response => response.json())
      .then(data => setRatings(data));
  }, []);

  const renderStars = numStars => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= numStars) {
        stars.push(<FontAwesomeIcon icon={SolidStar} className="rating-star solid-star" />);
      } else {
        stars.push(<FontAwesomeIcon icon={RegularStar} className="rating-star regular-star" />);
      }
    }
    return stars;
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Bạn có muốn xóa ${name}`)) {
      try {
        await axios.get(`http://127.0.0.1:8000/api/delete-ratings/${id}`, {});
        alert('Xóa thành công');
        fetch('http://127.0.0.1:8000/api/get-ratings')
          .then(response => response.json())
          .then(data => {
            setRatings(data);
          })
          .catch(error => {
            console.error('Error:', error);
          });
      } catch (error) {
        console.log(error);
        alert('Xóa không thành công');
      }
    } else {
      alert('Xóa không thành công');
    }
  };

  const handleDetail = rating => {
    setSelectedRating(rating);
  };

  const closeModal = () => {
    setSelectedRating(null);
  };

  return (
    <div className="g-sidenav-show bg-gray-200">
      <main className="main-content position-relative max-height-vh-100 h-100 border-radius-lg">
        <div className="container-fluid py-4">
          <div className="row justify-content-center" id="barberrow">
            {ratings.map(rating => (
              <div key={rating.rating_id} className="col-lg-4">
                <div className="card" >
                  <div className="card-body">
                    <h5 className="card-title">{rating.shop_name}</h5>
                    <img src={rating.shop_image} alt="ShopImage" className="card-img" />
                    <div className="rating-stars">{renderStars(rating.rating_star)}</div>
                    <div className="button-group">
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(rating.rating_id, rating.shop_name)}
                      >
                        Xóa
                      </button>
                      <button className="btn btn-detail" onClick={() => handleDetail(rating)}>
                        Detail
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Modal
        style={{
          content: {
            display: 'flex',
            // flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: '22%',
            marginRight: 'auto',
            width: '70%',
            height:'200px',
            marginTop: '-20%',
            zIndex: 9999, // Higher z-index to make the modal appear on top
          },
      
        }}
        isOpen={selectedRating !== null}
        onRequestClose={closeModal}
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        {selectedRating && (
          <div className="modal-content" style={{ width:"100%"}}>
            <h2>{selectedRating.shop_name}</h2>
            <img src={selectedRating.shop_image} alt="ShopImage" />
            <br></br><br></br>
                  <table>
                    <thead>
                      <th>User Name</th>
                      <th>Email</th>
                      <th>Shop Phone</th>
                      <th>Address Shop</th>

                    </thead>
                    <tbody>
                  <td>{selectedRating.user_name}</td>
                  <td>{selectedRating.user_email}</td>
                  <td>{selectedRating.shop_phone}</td>
                  <td>{selectedRating.user_address}</td>
                  </tbody>
                  </table>
            <button style={{ marginTop:"10%" }} className="btn btn-primary" onClick={closeModal}>Close</button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BarberShop;
