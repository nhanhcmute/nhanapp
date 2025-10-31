import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './styles/theme';
import './App.css';
import './styles/global.scss';
import Header from './components/layout/Header';

// Import các trang

import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignUp';
import ProfilePage from './pages/ProfilePage';
import PersonalInfoPage from './pages/PersonalInfoPage';
import ProductList from './pages/ProductList';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderPage from './pages/OrderPage';
import AddressPage from './pages/AddressPage';
import PetSuppliesPage from './pages/PetSuppliesPage';
import Bank from './pages/Bank';
import Alerts from './pages/Alerts';
import NotificationSetting from './pages/NotificationSetting';
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import Privacy from './pages/Privacy';
import ChangePassword from './pages/ChangePassword';
import Voucher from './pages/Voucher';
import GetVoucher from './pages/GetVoucher';
import ProductDetail from './components/product/ProductDetail';
import ProductsGrid from './components/product/ProductsGrid';
import Cats from './pages/Cats';
import Dogs from './pages/Dogs';
import PetDetails from './pages/PetDetails';
import ErrorPage from './pages/ErrorPage';



// Admin pages
import AdminDashboard from './pages/admin/DashboardPage';
import AdminPage from './pages/admin/AdminPage';
import Products from './pages/admin/ManageProductsPage';
import Orders from './pages/admin/ManageOrdersPage';
import CustomerManagement from './pages/admin/ManageUsersPage';
import Promotions from './pages/admin/Promotions';
import Inventory from './pages/admin/Inventory';
import Reports from './pages/admin/ReportsPage';
import UserManagementPage from './pages/admin/UserManagementPage';
import NotificationsPage from './pages/admin/NotificationsPage';
import SettingsPage from './pages/admin/SettingsPage';
import Reviews from './pages/admin/Reviews';
import Payments from './pages/admin/Payments';
import Shipping from './pages/admin/Shipping';

// Layouts
import LayoutPage from './components/layout/LayoutPage';
import AdminLayout from './components/layout/AdminLayout';
// Components
import AutoLogout from './components/common/AutoLogout';
import ContactButtons from './components/common/ContactButtons';
import SearchResults from './components/product/SearchResults';
// Context
import { CartProvider } from './store/CartContext';

// AdminRoute bảo vệ các route của admin
import AdminRoute from './components/common/AdminRoute';

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
    <ThemeProvider theme={theme}>
      <CssBaseline />
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
              <Route path="/privacy" element={<Privacy />} />
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
    </ThemeProvider>
  );
}

export default App;
