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
import VerifyOTPPage from './pages/VerifyOTPPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ProfilePage from './pages/ProfilePage';
import PersonalInfoPage from './pages/PersonalInfoPage';
import ProductList from './pages/ProductList';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderPage from './pages/OrderPage';
import AddressPage from './pages/AddressPage';
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

// Thú y thông minh
import PetCareLayout from './features/pet-care/components/PetCareLayout';
import CareDashboardPage from './features/pet-care/pages/CareDashboardPage';
import AiConsultationPage from './features/pet-care/pages/AiConsultationPage';
import PetProfilesPage from './features/pet-care/pages/PetProfilesPage';
import HealthRecordsPage from './features/pet-care/pages/HealthRecordsPage';
import BookAppointmentPage from './features/pet-care/pages/BookAppointmentPage';
import HealthArticlesPage from './features/pet-care/pages/HealthArticlesPage';
import VetCasesPage from './features/pet-care/pages/VetCasesPage';



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
import AdminNotificationsPage from './pages/admin/NotificationsPage';
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
import { LanguageProvider } from './i18n/LanguageContext';

// AdminRoute bảo vệ các route của admin
import AdminRoute from './components/common/AdminRoute';
// ProtectedRoute bảo vệ các route yêu cầu đăng nhập
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  const [user, setUser] = useState(null);

  const clientId = 'YOUR_GOOGLE_CLIENT_ID';

  const ShowHeader = () => {
    const location = useLocation();

    const isAuthPage = ['/login', '/signup' , '/aboutus'].includes(location.pathname);

    return isAuthPage && <Header />;
  };

  const ShowContactButtons = () => {
    const location = useLocation();
    // Widget hỗ trợ khách hàng (Zalo/Facebook/Hotline) không cần thiết trong khu vực
    // admin - admin không cần tự liên hệ hỗ trợ khi đang quản lý chính cửa hàng của họ,
    // và widget neo góc dưới trái dễ đè lên các form/card trong trang admin.
    const isAuthPage = ['/login', '/signup'].includes(location.pathname);
    const isAdminPage = location.pathname.startsWith('/admin');

    return !isAuthPage && !isAdminPage ? <ContactButtons /> : null;
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LanguageProvider>
      <GoogleOAuthProvider clientId={clientId}>
        <Router>
          <AutoLogout />
          <CartProvider>
            <ShowContactButtons />
          <ShowHeader />
          <Routes>
          <Route path="/login" element={<LoginPage setUser={setUser} />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/verify-otp" element={<VerifyOTPPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/aboutus" element={<AboutUs />} />
            {/* Routes dành cho khách hàng */}
            <Route element={<LayoutPage />}>
              {/* Public Routes - Không cần đăng nhập */}
              <Route path="/" element={<HomePage />} />
              <Route path="/nhanpet" element={<HomePage />} />
              <Route path="/homepage" element={<HomePage />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/productlist" element={<ProductList />} />
              <Route path="/petsupplies" element={<ProductList initialCategory="Phụ kiện" />} />
              <Route path="/catlitter" element={<ProductList initialCategory="Vệ sinh" />} />
              <Route path="/others" element={<ProductList initialCategory="Khác" />} />
              <Route path="/otherpets" element={<ProductList />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/" element={<ProductsGrid title="Danh Sách Sản Phẩm" />} />
              <Route path="/productdetail/:id" element={<ProductDetail />} />
              <Route path="/cats" element={<Cats />} />
              <Route path="/dogs" element={<Dogs />} />
              <Route path="/petdetails" element={<PetDetails />} />
              <Route path="/search" element={<SearchResults />} />

              {/* Thú y thông minh */}
              <Route path="/pet-care" element={<PetCareLayout />}>
                <Route index element={<CareDashboardPage />} />
                <Route path="ai-consultation" element={<AiConsultationPage />} />
                <Route path="pets" element={<PetProfilesPage />} />
                <Route path="health" element={<HealthRecordsPage />} />
                <Route path="appointments" element={<BookAppointmentPage />} />
                <Route path="articles" element={<HealthArticlesPage />} />
                <Route path="vet" element={<AdminRoute element={<VetCasesPage />} />} />
              </Route>

              {/* Protected Routes - Yêu cầu đăng nhập */}
              <Route 
                path="/profile" 
                element={<ProtectedRoute element={<ProfilePage />} />} 
              />
              <Route 
                path="/personal" 
                element={<ProtectedRoute element={<PersonalInfoPage />} />} 
              />
              <Route 
                path="/cart" 
                element={<ProtectedRoute element={<CartPage />} />} 
              />
              <Route 
                path="/checkout" 
                element={<ProtectedRoute element={<CheckoutPage />} />} 
              />
              <Route 
                path="/orders" 
                element={<ProtectedRoute element={<OrderPage />} />} 
              />
              <Route 
                path="/address" 
                element={<ProtectedRoute element={<AddressPage />} />} 
              />
              <Route 
                path="/bank" 
                element={<ProtectedRoute element={<Bank />} />} 
              />
              <Route 
                path="/notificationsetting" 
                element={<ProtectedRoute element={<NotificationSetting />} />} 
              />
              <Route 
                path="/alerts" 
                element={<ProtectedRoute element={<Alerts />} />} 
              />
              <Route 
                path="/changepassword" 
                element={<ProtectedRoute element={<ChangePassword />} />} 
              />
              <Route 
                path="/voucher" 
                element={<ProtectedRoute element={<Voucher />} />} 
              />
              <Route 
                path="/getvoucher" 
                element={<ProtectedRoute element={<GetVoucher />} />} 
              />
              
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
                    element={<AdminNotificationsPage />}
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
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
