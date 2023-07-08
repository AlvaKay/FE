import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Modal from "react-modal";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import "bootstrap/dist/css/bootstrap.css";
import Swal from "sweetalert2";
import { format, parseISO } from "date-fns";

const ShowProducts = () => {
  const [data, setData] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedShop, setSelectedShop] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [selectedService, setSelectedService] = useState(null);
  const [isDataComplete, setIsDataComplete] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState("");
  const [selectedStylist, setSelectedStylist] = useState(null);
  // const [isStylistBooked, setIsStylistBooked] = useState(false);
  const [stylistAvailability, setStylistAvailability] = useState({});
  const [searchResults, setSearchResults] = useState([]);
  

  const fetchDataold = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/shops");
      setSearchResults(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDataold();
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/getservices");
      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  function handleBooking(service, shop) {
    setSelectedShop({ service, shop });
    setIsModalOpen(true);
  }

  function handleModalClose() {
    setIsModalOpen(false);
    setSelectedStylist(null);
  }

  function handleDateTimeSelection(event) {
    const selectedDateTimeValue = event.target.value;
    setSelectedDateTime(selectedDateTimeValue);
    const selectedDateTime = new Date(event.target.value);
    const currentDate = new Date();
    const selectedDateTimeObj = new Date(selectedDateTime);

    if (selectedDateTimeObj < currentDate) {
      Swal.fire("Lỗi", "Vui lòng chọn một thời gian trong tương lai.", "error");
      return;
    }

    const differenceInDays = Math.floor(
      (selectedDateTime - currentDate) / (1000 * 60 * 60 * 24)
    );

    if (differenceInDays > 3) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Ngày đặt lịch phải nhỏ hơn hoặc bằng 3 ngày từ ngày hiện tại.",
      });
    } else {
      setSelectedTime(event.target.value);
    }
  }

  useEffect(() => {
    setIsDataComplete(selectedTime !== null && selectedStylist !== null);
  }, [selectedTime, selectedStylist]);

  const handlePayment = async () => {
    
    if (!selectedTime) {
      Swal.fire("Lỗi", "Vui lòng chọn thời gian.", "error");
      return;
    }

    if (!selectedStylist) {
      Swal.fire("Lỗi", "Vui lòng chọn stylist.", "error");
      return;
    }

    const isStylistAvailable = await checkStylistAvailability(
      selectedStylist,
      selectedDateTime
    );

    if (!isStylistAvailable) {
      Swal.fire("Lỗi", "Stylist đã được đặt lịch vào thời gian này.", "error");
      return;
    }

    // Tiếp tục xử lý khi stylist khả dụng
    Swal.fire("Thành công", "Đặt lịch thành công", "success");

    handleModalClose();

    if (selectedShop && selectedShop.service) {
      const { shop, service } = selectedShop;
      const { service_name, service_price } = service;

      // Format the selectedDateTime
      const formattedDateTime = format(
        parseISO(selectedDateTime),
        "yyyy-MM-dd HH:mm:ss"
      );
      const formattedTime = format(parseISO(selectedDateTime), "HH:mm");
      const formattedDate = format(parseISO(selectedDateTime), "dd/MM");

      const productData = {
        shop_id: shop.shop_id,
        shop_name: shop.shop_name,
        service_id: service.service_id,
        service_name: service_name,
        price: service_price,
        appointment_time: formattedTime,
        appointment_date: formattedDate,
        stylist_id: selectedStylist,
        
      };
      const postData = await axios.post(
        "http://127.0.0.1:8000/api/bookingservices",productData 

        
      );

      try {
        // Get the existing product data from sessionStorage
        const existingProductData =
          JSON.parse(sessionStorage.getItem("productData")) || [];

        // Make sure existingProductData is an array
        if (!Array.isArray(existingProductData)) {
          throw new Error("Existing product data is not an array.");
        }

        // Add the new product to the existing data
        const updatedProductData = [...existingProductData, productData];

        // Store the updated product data in sessionStorage
        sessionStorage.setItem(
          "productData",
          JSON.stringify(updatedProductData)
        );
        if (selectedShop) {
          const totalPrice = selectedShop.service.service_price;
          axios.post(`http://localhost:8000/api/payment-vnpay/${totalPrice}`).then(res => {
            if (res.data.code === '00') {
              var url = res.data.data;
                  Swal.fire("Thành công", "Đặt lịch thành công", "success");
    
              window.open(url,'_blank');
            }
          });
          console.log(totalPrice);
        }
      
      } catch (error) {
        console.error("Error updating product data:", error);
      }
    }
  };

  // const handlePayment = () => {
  //   if (selectedShop) {
  //     const totalPrice = selectedShop.service.service_price;
  //     axios.post(`http://localhost:8000/api/payment-vnpay/${totalPrice}`).then(res => {
  //       if (res.data.code === '00') {
  //         var url = res.data.data;
  //             Swal.fire("Thành công", "Đặt lịch thành công", "success");

  //         window.open(url,'_blank');
  //       }
  //     });
  //     console.log(totalPrice);
  //   }
  // };

  const customModalStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      width: "50%",
      maxHeight: "80vh",
      overflow: "auto",
    },
  };

  const handleStylistSelection = (event) => {
    const selectedStylistId = event.target.value;
    setSelectedStylist(selectedStylistId);

    checkStylistAvailability(selectedStylistId, selectedDateTime)
      .then((isStylistAvailable) => {
        setStylistAvailability((prevAvailability) => ({
          ...prevAvailability,
          [selectedStylistId]: isStylistAvailable,
        }));
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const checkStylistAvailability = async (
    stylistId,
    appointmentDate,
    appointmentTime
  ) => {
    try {
      // Định dạng lại giờ và ngày
      const selectedDateTime = new Date(appointmentDate);
      const formattedTime = `${selectedDateTime.getHours()}:${selectedDateTime.getMinutes()}`;
      const formattedDate = `${selectedDateTime.getDate()}/${
        selectedDateTime.getMonth() + 1
      }`;

      console.log("stylistId:", stylistId);
      console.log("appointmentDate:", formattedDate);
      console.log("appointmentTime:", formattedTime);

      const response = await axios.post(
        "http://127.0.0.1:8000/api/getbookedstylists",
        {
          stylist_id: stylistId,
          appointment_date: formattedDate,
          appointment_time: formattedTime,
        }
      );

      // console.log(response.data); // Log dữ liệu từ response

      const isStylistAvailable = response.data.available;

      return isStylistAvailable;
    } catch (error) {
      console.error(error);
      return false;
    }
  };


  return (
    <>
      <section className="showproduct container">
        <br />
        <h2>Các shop</h2>
        <br />
        <br />
        <div
          className="row"
          style={{ marginLeft: "30px", marginRight: "30px" }}
        >
          {searchResults.map((e) => (
            <div className="col-md-4" key={e.shop_id}>
              <div className="" id="card-shop">
                <img
                  src={`../assets/img/shops/${e.shop_image}`}
                  alt=""
                  className="card-img-top img-shop"
                />{" "}
                <br></br>
                <br></br>
                <div className="card-body">
                  <h4 className="card-title">{e.shop_name}</h4>
                  <br></br>
                  <p className="card-text"> Phone: {e.shop_phone}</p>
                  <p className="card_price">{e.user}</p>
                  <div
                    className="function d-flex justify-content-center"
                    id="btn-detail"
                  >
                    <Link
                      className="button"
                      to={`/ShopDetailPage/${e.shop_id}`}
                    >
                      Chi tiết Shop
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="showproduct container">
        <br />
        <h3 className="colection">DANH SÁCH SẢN PHẨM PHỤC VỤ</h3>
        <br />
        <br />

        {Object.keys(data).length > 0 ? (
          Object.keys(data).map((shopId) => {
            const shop = data[shopId];

            const sliderSettings = {
              dots: false,
              infinite: true,
              speed: 500,
              slidesToShow: 3,
              slidesToScroll: 1,
              centerMode: true,
              centerPadding: "20px",
              prevArrow: <button className="slick-prev">Previous</button>,
              nextArrow: <button className="slick-next">Next</button>,
              responsive: [
                {
                  breakpoint: 768,
                  settings: {
                    slidesToShow: 1,
                    centerPadding: "20px",
                  },
                },
              ],
            };

            return (
              <div className="shop-row row" key={shop.shop_id}>
                <h4 className="shop-name">{shop.shop_name}</h4>
                <Slider {...sliderSettings}>
                  {shop.services.map((service) => (
                    <div className="d-flex" key={service.service_id}>
                      <div className="card">
                        <img
                          src={`../assets/img/service/${service.service_image}`}
                          alt={service.service_name}
                          className="card-img-top object-fit-cover"
                        />
                        <div className="card-body">
                          <h4 className="card-title text-dark">
                            {service.service_name}
                          </h4>
                          <p className="card-text">{service.service_price}</p>
                          <div className="function d-flex justify-content-around">
                            <Link
                              className="btn btn-primary p-3"
                              to={`/shop/${shop.shop_id}`}
                            >
                              Chi tiết Shop
                            </Link>
                            <button
                              className="btn btn-primary p-3"
                              onClick={() => handleBooking(service, shop)}
                            >
                              Đặt ngay
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </Slider>
              </div>
            );
          })
        ) : (
          <p>Loading...</p>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        contentLabel="Chọn lịch trống"
        style={customModalStyles}
      >
        <div className="d-flex justify-content-between">
          <h2>Chọn lịch trống</h2>
          <button
            className="btn btn-secondary btn-sm float-start"
            onClick={handleModalClose}
          >
            X
          </button>
        </div>
        {selectedShop && (
          <>
            <div>
              <p>Shop được chọn: {selectedShop.shop.shop_name}</p>
            </div>
            <h2>Dịch vụ:</h2>
            <div>
              {selectedShop && (
                <>
                  <p>Tên dịch vụ: {selectedShop.service.service_name}</p>
                  <p>Giá: {selectedShop.service.service_price}VNĐ</p>
                  <p>Thời gian: {selectedTime}</p>
                </>
              )}
            </div>
            {selectedShop && selectedTime && (
              <div>
                <h3>Stylist:</h3>
                <select id="stylistSelect" onChange={handleStylistSelection}>
                  <option value="">Chọn stylist</option>
                  {selectedShop.shop.stylists.map((stylist) => (
                    <option
                      key={stylist.stylist_id}
                      value={stylist.stylist_id}
                      // disabled={!stylistAvailability[stylist.stylist_id]}
                    >
                      {stylist.stylist_name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </>
        )}
        <label htmlFor="dateInput" style={{fontSize:18}}>Ngày và giờ đặt lịch:</label>
        <input
          type="datetime-local"
          id="dateInput"
          onChange={handleDateTimeSelection}
          required
          className="mt-3"
        />
        <br></br>
        <br></br>
       
        <button  className="btn btn-primary" onClick={() => handlePayment()}>Thanh toán</button>

      </Modal>
    </>
  );
};

export default ShowProducts;
