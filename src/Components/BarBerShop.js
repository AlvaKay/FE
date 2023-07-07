import React, { useState, useEffect } from "react";
import axios from "axios";
import Adminshop from "./Adminshop";

const RegisterBarbershopForm = () => {
  const [shopName, setShopName] = useState("");
  const [shopImage, setShopImage] = useState("");
  const [shopPhone, setShopPhone] = useState("");
  const [shopEmail, setShopEmail] = useState("");
  const [UserId, setUserID] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [user, setUser] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [showEnableLocation, setShowEnableLocation] = useState(false);
  const [address, setAddress] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [shouldReload, setShouldReload] = useState(false);
  const [reloadCount, setReloadCount] = useState(0);


  useEffect(() => {
  
    if (!locationEnabled && reloadCount === 0) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        


      
        },
        (error) => {
          console.error(error);
        }
      );
  

    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);


  useEffect(() => {
    const userID = localStorage.getItem("userID");

    if (userID) {
      axios
        .get(`http://127.0.0.1:8000/api/users/${userID}`)
        .then((response) => {
          const userData = response.data;
          setUser(userData.user_name);
          setUserID(userData.user_id);
        })
        .catch((error) => {
          console.log("Lỗi khi lấy thông tin người dùng:", error);
        });
    }

    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        if (result.state === "denied") {
          setShowEnableLocation(true);
        }
      });
    }
  }, []);

  const handleEnableLocationClick = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log("Latitude:", position.coords.latitude);
        console.log("Longitude:", position.coords.longitude);
        setShowEnableLocation(false);
        window.location.reload();
      },
      (error) => {
        console.error(error);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userID = localStorage.getItem("userID");

    try {
      // Đẩy dữ liệu vào API add-shop
      const shopResponse = await axios.post(
        "http://127.0.0.1:8000/api/add-shop",
        {
          shop_name: shopName,
          shop_email: shopEmail,
          shop_image: shopImage,
          shop_phone: shopPhone,
          user_id: userID,
        }
      );

      console.log(shopResponse.data);
      setSuccessMessage("Đăng ký shop thành công");
      setErrorMessage("");
      setShopName("");
      setShopEmail("");
      setShopImage("");
      setShopPhone("");

      // Đẩy dữ liệu vào API add-address
      const addressResponse = await axios.post(
        "http://127.0.0.1:8000/api/add-address",
        {
          latitude,
          longitude,
          address: address,
        }
      );
      // Xử lý sau khi đẩy dữ liệu thành công
      setIsRegistered(true);
      window.location.reload();

    } catch (error) {
      console.error(error);
      setAddress("");
      setErrorMessage("Đăng ký shop thất bại");
      setSuccessMessage("");
    }
  };

  const [shops, setShops] = useState([]);

  useEffect(() => {
    const fetchShopsByUser = async () => {
      try {
        const userId = localStorage.getItem("userID");
        const response = await axios.get(
          `http://127.0.0.1:8000/api/shops-by-users/${userId}`
        );
        setShops(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchShopsByUser();
  }, []);

  return (
    <section style={{ padding: "10%" }}>
      
      <div className="register-form" style={{ width: "100%" , marginTop:"-10%" }} >
        {shops.length < 1 ? (
          <div>  {showEnableLocation && (
            <div>
              <p>Vui lòng bật vị trí để đăng ký thành Barbershop</p>
              <p style={{ color:"red" }}>Lưu ý: Khi bạn đã mở vị trí rồi! thì  xin hãy nhấn xác nhận  </p>
              <button onClick={handleEnableLocationClick}>
               Xác nhận
              </button>
            </div>
          )}
                 {/* Hiển thị thông báo thành công */}
                 {successMessage && <p>{successMessage}</p>}
        {/* Hiển thị thông báo lỗi */}
        {errorMessage && <p>{errorMessage}</p>}
 
         {!showEnableLocation && shops.length < 1 && (
          <div>
                    <h2>Trở thành Barbershop</h2>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="shopName">Tên Barbershop:</label>
                <input
                  type="text"
                  id="shopName"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="shopImage">Ảnh Barbershop:</label>
                <input
                  type="text"
                  id="shopImage"
                  value={shopImage}
                  onChange={(e) => setShopImage(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="shopPhone">Số điện thoại:</label>
                <input
                  type="text"
                  id="shopPhone"
                  value={shopPhone}
                  onChange={(e) => setShopPhone(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="shopEmail">Email:</label>
                <input
                  type="email"
                  id="shopEmail"
                  value={shopEmail}
                  onChange={(e) => setShopEmail(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="shopEmail">Shop Address:</label>
                <input
                  type="address"
                  id="shopAddress"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="latitude">Vĩ độ:</label>
                <input
                  type="text"
                  id="latitude"
                  value={latitude || ""}
                  disabled
                />
              </div>
              <div className="form-group">
                <label htmlFor="longitude">Kinh độ:</label>
                <input
                  type="text"
                  id="longitude"
                  value={longitude || ""}
                  disabled
                />
              </div>
              <input
                hidden
                type="text"
                id="userid"
                value={UserId}
                onChange={(e) => setUserID(e.target.value)}
                disabled
              />
              <div className="form-group">
                <label htmlFor="username">Tên đăng nhập:</label>
                <input
                  type="text"
                  id="username"
                  value={user}
                  disabled
                />
              </div>
              <button type="submit">Đăng ký</button>
            </form>
            </div>
            )}
          </div>
          
       
        ) : (
          shops.map((shop) => {
            return (
              <React.Fragment key={shop.shop_id}>
                {shop.is_shop === 0 ? (
                  <div>
                    <h3>Yêu cầu đăng ký của bạn đang chờ phê duyệt.</h3>
                    <p>
                      Vui lòng chờ trong khi chúng tôi xem xét yêu cầu của bạn.
                    </p>
                  </div>
                ) : shop.is_shop === 1 ? (
                  <Adminshop />
                ) : null}
              </React.Fragment>
            );
          })
        )}
        </div>
  
    </section>
  );
  
};

export default RegisterBarbershopForm;
