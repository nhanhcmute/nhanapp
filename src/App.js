import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './App.css';
import Header from './Header';

// Import các trang
import HomePage from './pages/client/Homepage';
import ProductPage from './pages/client/ProductPage';
import LoginPage from './pages/client/LoginPage';
import SignupPage from './pages/client/SignUp';
import ProfilePage from './pages/client/ProfilePage';
import PersonalInfoPage from './pages/client/PersonalInfoPage';
import ProductList from './pages/client/ProductList';
import CartPage from './pages/client/CartPage';
import CheckoutPage from './pages/client/CheckoutPage';
import OrderPage from './pages/client/OrderPage';
import AddressPage from './pages/client/AddressPage';
import PetSuppliesPage from './pages/client/PetSuppliesPage';
import Bank from './pages/client/Bank';
import Alerts from './pages/client/Alerts';
import NotificationSetting from './pages/client/NotificationSetting';
import AboutUs from './pages/client/AboutUs';
import Contact from './pages/client/Contact';
import Blog from './pages/client/Blog';
import Pricacy from './pages/client/Privacy';
import ChangePassword from './pages/client/ChangePassword';
import Voucher from './pages/client/Voucher';
import GetVoucher from './pages/client/GetVoucher';
import ProductDetail from './component/ProductDetail';
import ProductsGrid from './component/ProductsGrid';
import Cats from './pages/client/Cats';
import Dogs from './pages/client/Dogs';
import PetDetails from './pages/client/PetDetails';
import ErrorPage from './pages/client/ErrorPage';


// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminPage from './pages/admin/AdminPage';
import Products from './pages/admin/Products';
import Orders from './pages/admin/Orders';
import CustomerManagement from './pages/admin/CustomerManagement';
import Promotions from './pages/admin/Promotions';
import Inventory from './pages/admin/Inventory';
import Reports from './pages/admin/Reports';
import UserManagementPage from './pages/admin/UserManagementPage';
import NotificationsPage from './pages/admin/NotificationsPage';
import SettingsPage from './pages/admin/SettingsPage';
import Reviews from './pages/admin/Reviews';
import Payments from './pages/admin/Payments';
import Shipping from './pages/admin/Shipping';

// Layouts
import LayoutPage from './function/LayoutPage';
import AdminLayout from './function/AdminLayout';
// Components
import AutoLogout from './function/AutoLogout';
import ContactButtons from './component/ContactButtons';
import SearchResults from './component/SearchResults';
// Context
import { CartProvider } from './function/CartContext';

// AdminRoute bảo vệ các route của admin
import AdminRoute from './component/AdminRoute';

function App() {
  const [user, setUser] = useState(null);

  const clientId = 'YOUR_GOOGLE_CLIENT_ID';

  const ShowHeader = () => {
    const location = useLocation();

    const isAuthPage = ['/login', '/signup' , '/homepage', '/aboutus'].includes(location.pathname);

    return isAuthPage && <Header />;
  };

  const ShowContactButtons = () => {
    const location = useLocation();
    const isAuthPage = ['/login', '/signup'].includes(location.pathname);

    return !isAuthPage ? <ContactButtons /> : null;
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Router>
        <AutoLogout />
        <CartProvider>
          <ShowContactButtons />
        <ShowHeader />
          <Routes>
          <Route path="/login" element={<LoginPage setUser={setUser} />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/homepage" element={<HomePage />} />
          <Route path="/aboutus" element={<AboutUs />} />
            {/* Routes dành cho khách hàng */}
            <Route element={<LayoutPage />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/nhanpet" element={<HomePage />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/personal" element={<PersonalInfoPage />} />
              <Route path="/productlist" element={<ProductList />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/orders" element={<OrderPage />} />
              <Route path="/address" element={<AddressPage />} />
              <Route path="/bank" element={<Bank />} />
              <Route path="/notificationsetting" element={<NotificationSetting />} />
              <Route path="/petsupplies" element={<PetSuppliesPage />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/privacy" element={<Pricacy />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/changepassword" element={<ChangePassword />} />
              <Route path="/voucher" element={<Voucher />} />
              <Route path="/getvoucher" element={<GetVoucher />} />
              <Route path="/" element={<ProductsGrid title="Danh Sách Sản Phẩm" />} />
              <Route path="/productdetail/:id" element={<ProductDetail />} />
              <Route path="/cats" element={<Cats />} />
              <Route path="/dogs" element={<Dogs />} />
              <Route path="/petdetails" element={<PetDetails />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="*" element={<ErrorPage />} />
            </Route>


            {/* Routes dành cho Admin */}
            <Route element={<AdminLayout />}>
              <Route
                path="/admin"
                element={
                  <AdminRoute
                    element={<AdminPage />}
                  />
                }
              />
              <Route
                path="/admin/dashboard"
                element={
                  <AdminRoute
                    element={<AdminDashboard />}
                  />
                }
              />
              <Route
                path="/admin/products"
                element={
                  <AdminRoute
                    element={<Products />}
                  />
                }
              />
              <Route
                path="/admin/ordermanagement"
                element={
                  <AdminRoute
                    element={<Orders />}
                  />
                }
              />
              <Route
                path="/admin/customers"
                element={
                  <AdminRoute
                    element={<CustomerManagement />}
                  />
                }
              />
              <Route
                path="/admin/inventory"
                element={
                  <AdminRoute
                    element={<Inventory />}
                  />
                }
              />
              <Route
                path="/admin/promotions"
                element={
                  <AdminRoute
                    element={<Promotions />}
                  />
                }
              />
              <Route
                path="/admin/reports"
                element={
                  <AdminRoute
                    element={<Reports />}
                  />
                }
              />
              <Route
                path="/admin/usermanagement"
                element={
                  <AdminRoute
                    element={<UserManagementPage />}
                  />
                }
              />
              <Route
                path="/admin/notifications"
                element={
                  <AdminRoute
                    element={<NotificationsPage />}
                  />
                }
              />
              <Route
                path="/admin/settings"
                element={
                  <AdminRoute
                    element={<SettingsPage />}
                  />
                }
              />
              <Route
                path="/admin/reviews"
                element={
                  <AdminRoute
                    element={<Reviews />}
                  />
                }
              />
              <Route
                path="/admin/payments"
                element={
                  <AdminRoute
                    element={<Payments />}
                  />
                }
              />
              <Route
                path="/admin/shipping"
                element={
                  <AdminRoute
                    element={<Shipping />}
                  />
                }
              />
            </Route>
          </Routes>
        </CartProvider>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
