import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './Components/Header';
import HomePage from './Components/HomePage';
import ShopDetailPage from './Components/ShopDetailPage';
import LoginPage from './Components/LoginPage';
import RegisterPage from './Components/RegisterPage';
import ProfilePage from './Components/ProfilePage';
import ShopAdminPage from './Components/ShopAdminPage';
import ContactPage from './Components/ContactPage';
import HistoryPage from './Components/HistoryPage';
import Footer from './Components/Footer';
import Search from './Components/Search';
import ForgotPassword from './Components/ForgotPassword';
import Income from './Admin/Components/Income';
import Sidenav from './Admin/Components/sidenav';
import HeaderAdmin from './Admin/Components/header';
import Client from './Admin/Components/Client';
import Notification from './Admin/Components/Notification';
import UpdateProfile from './Components/UpdateProfile';
import BarberShop from './Admin/Components/BarberShop';
import RegisterBarbershopForm from './Components/BarBerShop';
import BookingDetail from './Components/BookingDetail';

function App() {
  const HAFValue = localStorage.getItem('setHeaderAndFooterHomePage');
  const hideHeaderFooterHomePage = HAFValue === '0';

  const HAFValue1 = localStorage.getItem('setHeaderAndFooterAdmin');
  const hideHeaderFooterAdmin = HAFValue1 === '1';

    // localStorage.removeItem('setHeaderAndFooterHomePage');
    // localStorage.removeItem('setHeaderAndFooterAdmin');

  const abc =localStorage.getItem('setHeaderAndFooterAdmin');


  return (
    <div>
      <Router>
        {!hideHeaderFooterHomePage && <Header />}
        {hideHeaderFooterAdmin && <Sidenav/>}
        {hideHeaderFooterAdmin && <HeaderAdmin/>}
        <Routes>
       
          <Route path="/" element={<HomePage />} />
          <Route path="/ShopDetailPage/:shop_id" element={<ShopDetailPage />} />
          <Route path="/Search" element={<Search />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/update-pages/:id" element={<UpdateProfile />} />
          <Route path="/ShopAdmin" element={<ShopAdminPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/History" element={<HistoryPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/ForgotPassword" element={<ForgotPassword />} />
          <Route path="/BarberShop" element={<BarberShop />} />
          <Route path="/Income" element={<Income />} />
          <Route path="/Client" element={<Client />} />
          <Route path="/Notification" element={<Notification />} />
          <Route path="/RegisterFrom" element={<RegisterBarbershopForm />} />
          <Route path="/booking/:historyId" element={<BookingDetail/>} />

        </Routes>
        {!hideHeaderFooterHomePage && <Footer />}

      </Router>
    </div>
  );
}

export default App;