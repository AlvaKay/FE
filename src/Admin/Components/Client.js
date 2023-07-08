import React, { useState, useEffect } from "react";
import "../css/material-dashboard.css";
import "../css/nucleo-icons.css";
import "../css/nucleo-svg.css";
import Modal from "react-modal";

const Client = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [updatedUser, setUpdatedUser] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/is_user")
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
      });
  }, []);

  const handleEditUser = (user_id) => {
    fetch(`http://127.0.0.1:8000/api/users/${user_id}`)
      .then((response) => response.json())
      .then((data) => {
        setEditingUser(data);
        setUpdatedUser(data);
        setIsModalOpen(true);
      });
  };

  const handleUpdateUser = () => {
    fetch(`http://127.0.0.1:8000/api/users/${editingUser.user_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedUser),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        fetch("http://127.0.0.1:8000/api/is_user")
          .then((response) => response.json())
          .then((data) => setUsers(data));
        setEditingUser(null);
        setIsModalOpen(false);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  return (
    <div className="g-sidenav-show bg-gray-200">
      <main className="main-content position-relative max-height-vh-100 h-100 border-radius-lg">
        <div className="container-fluid py-4">
          <div className="row">
            <div className="col-lg-12">
              <div className="card h-100" id="Cardadmin1">
                <div className="card-header pb-0">
                  <h6>Các khách hàng đang sử dụng website</h6>
                </div>
                <div className="card-body p-3">
                  <table id="table" className="border" border={1}>
                    <thead>
                      <tr>
                        <th className="border">User ID</th>
                        <th className="border">User Name</th>
                        <th className="border">User Email</th>
                        <th className="border">User Password</th>
                        <th className="border">User Phone</th>
                        <th className="border">User Address</th>
                        <th className="border">Created At</th>
                        <th className="border">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.user_id}>
                          <td className="border">{user.user_id}</td>
                          <td className="border">{user.user_name}</td>
                          <td className="border">{user.user_email}</td>
                          <td className="border">{user.user_password}</td>
                          <td className="border">{user.user_phone}</td>
                          <td className="border">{user.user_address}</td>
                          <td className="border">{user.created_at}</td>
                          <td className="border">
                            <button
                              className="btn-detail"
                              style={{ marginRight: "10px" }}
                              onClick={() => handleEditUser(user.user_id)}
                            >
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Modal
        style={{
          content: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            marginLeft: "auto",
            marginRight: "auto",
            width: "50%",
          },
          overlay: {
            background: "rgba(0, 0, 0, 0.6)",
          },
        }}
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="User Detail Modal"
      >
        <div className="d-flex justify-content-between" style={{ position:"absolute", marginTop:"-75%" }}>
          <h2>Chọn lịch trống</h2></div>
        <form style={{ width: "100%", marginTop: "-10%" }}>
          <div className="form-group">
            <label>User Name:</label>
            <input
              type="text"
              name="user_name"
              value={updatedUser.user_name || ""}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>User Email:</label>
            <input
              type="text"
              name="user_email"
              value={updatedUser.user_email || ""}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>User Password:</label>
            <input
              type="text"
              name="user_password"
              value={updatedUser.user_password || ""}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>User Phone:</label>
            <input
              type="text"
              name="user_phone"
              value={updatedUser.user_phone || ""}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>User Address:</label>
            <input
              type="text"
              name="user_address"
              value={updatedUser.user_address || ""}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <button
            type="button"
            onClick={handleUpdateUser}
            className="btn btn-primary"
          >
            Update
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Client;
