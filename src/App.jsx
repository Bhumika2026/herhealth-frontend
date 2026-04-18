// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { CycleProvider } from '@/context/CycleContext';
import AppLayout from '@/components/layout/AppLayout';

// Pages
import LoginPage       from '@/pages/LoginPage';
import RegisterPage    from '@/pages/RegisterPage';
import OnboardingPage  from '@/pages/OnboardingPage';
import DashboardPage   from '@/pages/DashboardPage';
import CyclePage       from '@/pages/CyclePage';
import MoodPage        from '@/pages/MoodPage';
import InsightsPage    from '@/pages/InsightsPage';
import CommunityPage   from '@/pages/CommunityPage';
import DoctorPage      from '@/pages/DoctorPage';
import DietPage        from '@/pages/DietPage';
import AyurvedaPage    from '@/pages/AyurvedaPage';
import RemediesPage    from '@/pages/RemediesPage';
import CalendarPage    from '@/pages/CalendarPage';
import ProfilePage     from '@/pages/ProfilePage';
import PricingPage     from '@/pages/PricingPage';
import SakhiPage       from '@/pages/SakhiPage';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <SplashScreen />;
  if (!user) return <Navigate to="/login" replace />;
  if (!user.onboardingComplete) return <Navigate to="/onboarding" replace />;
  return children;
};

const SplashScreen = () => (
  <div className="min-h-screen bg-cream flex items-center justify-center">
    <div className="text-center">
      <div className="text-5xl mb-4">🌸</div>
      <h1 className="font-display text-2xl text-rose">HerHealth</h1>
      <div className="mt-4 flex gap-1.5 justify-center">
        {[0,1,2].map(i => (
          <div key={i} className="w-2 h-2 bg-rose rounded-full animate-bounce"
               style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>
    </div>
  </div>
);

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) return <SplashScreen />;

  return (
    <Routes>
      <Route path="/login"       element={user ? <Navigate to="/" /> : <LoginPage />} />
      <Route path="/register"    element={user ? <Navigate to="/" /> : <RegisterPage />} />
      <Route path="/onboarding"  element={user && !user.onboardingComplete ? <OnboardingPage /> : <Navigate to="/" />} />

      <Route element={<ProtectedRoute><CycleProvider><AppLayout /></CycleProvider></ProtectedRoute>}>
        <Route path="/"          element={<DashboardPage />} />
        <Route path="/cycle"     element={<CyclePage />} />
        <Route path="/mood"      element={<MoodPage />} />
        <Route path="/insights"  element={<InsightsPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/doctors"   element={<DoctorPage />} />
        <Route path="/diet"      element={<DietPage />} />
        <Route path="/ayurveda"  element={<AyurvedaPage />} />
        <Route path="/remedies"  element={<RemediesPage />} />
        <Route path="/calendar"  element={<CalendarPage />} />
        <Route path="/profile"   element={<ProfilePage />} />
        <Route path="/pricing"   element={<PricingPage />} />
        <Route path="/sakhi"     element={<SakhiPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Toaster
        position="top-center"
        toastOptions={{
          style: { fontFamily: 'DM Sans, sans-serif', borderRadius: '1rem', fontSize: '14px' },
          success: { iconTheme: { primary: '#E8647A', secondary: '#fff' } },
        }}
      />
      <AppRoutes />
    </AuthProvider>
  );
}
