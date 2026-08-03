import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';
import ScrollToTop from '@/components/ScrollToTop';
import { AdminAuthProvider } from '@/lib/admin-auth';

import Home from '@/pages/Home';
import Rooms from '@/pages/Rooms';
import Experiences from '@/pages/Experiences';
import ExperienceDetail from '@/pages/ExperienceDetail';
import Booking from '@/pages/Booking';
import Gallery from '@/pages/Gallery';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Restaurant from '@/pages/Restaurant';
import Wedding from '@/pages/Wedding';
import NotFound from '@/pages/NotFound';
import Privacy from '@/pages/Privacy';
import Terms from '@/pages/Terms';
import Refund from '@/pages/Refund';

import AdminLogin from '@/pages/admin/AdminLogin';
import AdminPasskey from '@/pages/admin/AdminPasskey';
import CreateHost from '@/pages/admin/CreateHost';
import AdminLayout from '@/pages/admin/AdminLayout';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminBookings from '@/pages/admin/AdminBookings';
import AdminRooms from '@/pages/admin/AdminRooms';
import AdminExperiences from '@/pages/admin/AdminExperiences';
import AdminCalendar from '@/pages/admin/AdminCalendar';
import AdminPayments from '@/pages/admin/AdminPayments';
import AdminCustomers from '@/pages/admin/AdminCustomers';
import AdminEnquiries from '@/pages/admin/AdminEnquiries';
import AdminReviews from '@/pages/admin/AdminReviews';
import AdminReports from '@/pages/admin/AdminReports';
import AdminNotifications from '@/pages/admin/AdminNotifications';
import AdminSettings from '@/pages/admin/AdminSettings';

function PageWrapper({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <FloatingButtons />
    </>
  );
}

function AdminRoutes() {
  return (
    <AdminAuthProvider>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/passkey" element={<AdminPasskey />} />
        <Route path="/admin/create-host" element={<CreateHost />} />
        <Route path="/admin/dashboard" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
        <Route path="/admin/bookings" element={<AdminLayout><AdminBookings /></AdminLayout>} />
        <Route path="/admin/rooms" element={<AdminLayout><AdminRooms /></AdminLayout>} />
        <Route path="/admin/experiences" element={<AdminLayout><AdminExperiences /></AdminLayout>} />
        <Route path="/admin/calendar" element={<AdminLayout><AdminCalendar /></AdminLayout>} />
        <Route path="/admin/payments" element={<AdminLayout><AdminPayments /></AdminLayout>} />
        <Route path="/admin/customers" element={<AdminLayout><AdminCustomers /></AdminLayout>} />
        <Route path="/admin/enquiries" element={<AdminLayout><AdminEnquiries /></AdminLayout>} />
        <Route path="/admin/reviews" element={<AdminLayout><AdminReviews /></AdminLayout>} />
        <Route path="/admin/reports" element={<AdminLayout><AdminReports /></AdminLayout>} />
        <Route path="/admin/notifications" element={<AdminLayout><AdminNotifications /></AdminLayout>} />
        <Route path="/admin/settings" element={<AdminLayout><AdminSettings /></AdminLayout>} />
      </Routes>
    </AdminAuthProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <PageWrapper>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/experiences" element={<Experiences />} />
          <Route path="/experiences/:slug" element={<ExperienceDetail />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/restaurant" element={<Restaurant />} />
          <Route path="/wedding" element={<Wedding />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/refund" element={<Refund />} />
          <Route path="/admin/*" element={<AdminRoutes />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </PageWrapper>
    </BrowserRouter>
  );
}
