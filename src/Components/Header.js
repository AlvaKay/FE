import React, { useState, useEffect } from "react";
import axios from "axios";

const Header = () => {
  const [userName, setUserName] = useState("");
  const [isSubMenuOpen, setSubMenuOpen] = useState(false);
  const is_admin = localStorage.getItem("is_admin");

  useEffect(() => {
    const userID = localStorage.getItem("userID");
    console.log(userID, "id");
    // localStorage.removeItem(userID);

    if (userID) {
      axios
        .get("http://127.0.0.1:8000/api/users")
        .then((response) => {
          const users = response.data;
          const user = users.find((user) => user.user_id === parseInt(userID));

          if (user) {
            setUserName(user.user_name);
          } else {
            console.log("Không tìm thấy người dùng");
          }
        })
        .catch((error) => {
          console.log("Lỗi khi lấy danh sách người dùng:", error);
        });
    }
  }, []);

  // Log out
  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");

    if (confirmLogout) {
      localStorage.removeItem("userID");
      // Thực hiện các xử lý khác sau khi logout (nếu cần)
      localStorage.setItem("setHeaderAndFooterAdmin", 0);
      localStorage.setItem("setHeaderAndFooterHomePage", 1);
      localStorage.removeItem("is_admin");

      window.location.reload();
    }
  };
  const hiddenHAF = () => {
    localStorage.setItem("setHeaderAndFooterHomePage", 0);
  };

  const hiddenheaderandfooterHomepage = () => {
    localStorage.setItem("setHeaderAndFooterAdmin", 1);
    localStorage.setItem("setHeaderAndFooterHomePage", 0);
  };

  console.log(userName, "name");
  console.log(isSubMenuOpen, "open");

  // lấy show history
  const [shop_user, setShop] = useState([]);

  const userID = localStorage.getItem("userID");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/get_history_user/${userID}`
        );
        setShop(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  console.log(shop_user);

  const handleBookingDetail = (historyId) => {
    // Thực hiện điều hướng tới trang chi tiết với historyId
    window.location.href = `/booking/${historyId}`;
  };
  

  return (
    <>
      {/* <div id="preloader-active">
                <div className="preloader d-flex align-items-center justify-content-center">
                    <div className="preloader-inner position-relative">
                        <div className="preloader-circle" />
                        <div className="preloader-img pere-text">
                            <img src="assets/img/logo/loder.png" alt="" />
                        </div>
                    </div>
                </div>
            </div> */}

      <header>
        {/*? Header Start */}
        <div className="header-area header-transparent pt-20">
          <div className="main-header header-sticky">
            <div className="container-fluid">
              <div className="row align-items-center">
                {/* Logo */}
                <div className="col-xl-2 col-lg-2 col-md-1">
                  <div className="logo">
                    <a href="index.html">
                      <img src="assets/img/logo/logo.png" alt="" />
                    </a>
                  </div>
                </div>
                <div className="col-xl-10 col-lg-10 col-md-10">
                  <div className="menu-main d-flex align-items-center justify-content-end">
                    {/* Main-menu */}
                    <div className="main-menu f-right d-none d-lg-block">
                      <nav>
                        <ul id="navigation">
                          <li className="active">
                            <a href="/">Home</a>
                          </li>
                          {/* <li>
                                                        <a href="blog.html">Blog</a>
                                                        <ul className="submenu">
                                                            <li>
                                                                <a href="blog.html">Blog</a>
                                                            </li>
                                                            <li>
                                                                <a href="blog_details.html">Blog Details</a>
                                                            </li>
                                                            <li>
                                                                <a href="elements.html">Element</a>
                                                            </li>
                                                        </ul>
                                                    </li> */}
                          {userName ? (
                            <>
                              {/* Các phần tử cho người dùng đã đăng nhập */}
                              {!is_admin && (
                                <li>
                                  <a href="contact.html">
                                    Past Haircut Bookings
                                  </a>
                                  <ul className="submenu_user">
                                    <a className="alldetail" href="#">
                                      Click to see all details
                                    </a>
                                    <h2>
                                      All your previous barber appointments
                                    </h2>
                                    {shop_user.map((shop, index) => (
                                      <li className="li_menu" key={index}>
                                        <a href="#" onClick={() => handleBookingDetail(shop.history_id)}>
                                          <h3 className="menuService_shop_name">
                                            User: {shop.user_name}
                                          </h3>
                                          <h4 className="menuService_invoice">
                                            Mã hóa đơn: {shop.billing_code}
                                          </h4>
                                        </a>
                                        <div className="kechan"></div>
                                      </li>
                                    ))}
                                  </ul>
                                </li>
                              )}
                              <li>
                                <a className="btn_user" href="#">
                                  {" "}
                                  Hi: {userName}
                                </a>
                                <ul className="submenu">
                                  {is_admin ? (
                                    <li>
                                      <a
                                        href="/BarberShop"
                                        onClick={hiddenheaderandfooterHomepage}
                                      >
                                        Admin
                                      </a>
                                    </li>
                                  ) : (
                                    <>
                                      <li>
                                        <a href="/profile">Profile</a>
                                      </li>
                                      <li>
                                        <a href="/RegisterFrom">BarBerShop</a>
                                      </li>
                                    </>
                                  )}
                                  <li>
                                    <a
                                      className="logout_user"
                                      onClick={handleLogout}
                                    >
                                      Log out
                                    </a>
                                  </li>
                                </ul>
                              </li>
                            </>
                          ) : (
                            <>
                              {/* Các phần tử cho người dùng chưa đăng nhập */}
                              <li>
                                <a href="/Login" onClick={hiddenHAF}>
                                  Đăng nhập
                                </a>
                              </li>
                              <li>
                                <a href="/Register" onClick={hiddenHAF}>
                                  Đăng Ký
                                </a>
                              </li>
                            </>
                          )}
                        </ul>
                      </nav>
                    </div>
                  </div>
                </div>
                {/* Mobile Menu */}
                <div className="col-12">
                  <div className="mobile_menu d-block d-lg-none" />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Header End */}
      </header>
    </>
  );
};

export default Header;
