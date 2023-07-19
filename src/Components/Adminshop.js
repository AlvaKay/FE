import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import Modal from 'react-modal';
import Swal from 'sweetalert2';

const Adminshop = () => {
  const [stylists, setStylists] = useState([]);
  const [isModalOpenAdd, setIsModalOpenAdd] = useState(false);
  const [stylistName, setStylistName] = useState('');
  const [stylistImage, setStylistImage] = useState('');

  const userID = localStorage.getItem('userID');

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/stylist/${userID}`)
      .then(response => response.json())
      .then(data => setStylists(data));
  }, [userID]);

  const openModalAdd = () => {
    setIsModalOpenAdd(true);
  };

  const closeModalAdd = () => {
    setIsModalOpenAdd(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('http://127.0.0.1:8000/api/addstylist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        stylistName,
        stylistImage,
        user_id: userID,
      }),
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);

        setStylistName('');
        setStylistImage('');
        setIsModalOpenAdd(false);
        Swal.fire('Success', 'Stylist added successfully!', 'success');
      })
      .catch(error => {
        console.error(error);
        Swal.fire('Error', 'Failed to add stylist', 'error');
      });
  };
// Xóa stylist
  const handleDelete = (stylist_id) => {
    Swal.fire({
      title: 'Xác nhận xóa stylist',
      text: `Bạn có chắc chắn muốn xóa stylist này không?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:8000/api/stylists/${userID}/${stylist_id}`, {
          method: 'DELETE',
        })
          .then(response => response.json())
          .then(data => {
            console.log(data);
            Swal.fire('Thành công', 'Stylist đã được xóa thành công', 'success');
            // Refresh stylists list
            fetch(`http://127.0.0.1:8000/api/stylist/${userID}`)
              .then(response => response.json())
              .then(data => setStylists(data));
          })
          .catch(error => {
            console.error(error);
            Swal.fire(
              'Lỗi',
              'Xóa stylist thất bại. Vui lòng liên hệ Admin Website để biết thêm chi tiết',
              'error'
            );
          });
      }
    });
  };

  return (
    <div>
      <div className='row'>
        <div className='col-lg-12'>
          <div>
            <h2 style={{ marginTop: '10%' }}>Thông tin Stylist</h2>
            <button className="add-stylist-button" style={{ width: "20%" ,background:"#212529"}} onClick={openModalAdd}>Add Stylist</button>
            <table style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Stylist Name</th>
                  <th>Stylist Image</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {stylists.map((stylist, index) => (
                  <tr key={stylist.stylist_id}>
                    <td>{index + 1}</td>
                    <td>{stylist.stylist_name}</td>
                    <td>{stylist.stylist_image}</td>
                    <td>
                      <button
                        style={{ width: "25%", backgroundColor: "#D19F68", color: "white" ,textAlign:"center"}}
                        onClick={() => handleDelete(stylist.stylist_id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Modal
  isOpen={isModalOpenAdd}
  onRequestClose={closeModalAdd}
  contentLabel="Add Stylist Modal"
  style={{
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    content: {
      width: '400px',
      margin: 'auto',
      borderRadius: '4px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    },
  }}
>
  <div>
    <h3>Thêm nhà tạo mẫu</h3>
    <form onSubmit={handleSubmit}>
      <label>
        Stylist Name:
        <input
          type="text"
          name="stylistName"
          value={stylistName}
          onChange={(e) => setStylistName(e.target.value)}
        />
      </label>
      <br />
      <label>
        Stylist Image:
        <input
          type="text"
          name="stylistImage"
          value={stylistImage}
          onChange={(e) => setStylistImage(e.target.value)}
        />
      </label>
      <br />
      <button type="submit">Submit</button>
      <button onClick={closeModalAdd}>Close</button>
    </form>
  </div>
</Modal>

        </div>
      </div>
    </div>
  );
};

export default Adminshop;
