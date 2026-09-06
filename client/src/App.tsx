import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { AppFrame, Layout, PhoneFrame } from '@/components/chrome';
import type { RootState } from '@/store';
import { persistor, store } from '@/store';

import WelcomeScreen from '@/screens/WelcomeScreen';
import LanguageSelectionScreen from '@/screens/LanguageSelectionScreen';
import {
  DepartmentsScreen, DepartmentScreen, DoctorScreen, DoctorsScreen, OpdScreen,
} from '@/screens/medical';
import {
  AppointmentScreen, EmergencyScreen, MapScreen, NavigationScreen, TestDetailScreen, TestsScreen,
} from '@/screens/services';
import {
  AcademicCalendarScreen, AcademicsScreen, AdmissionsScreen, LibraryScreen, NotificationsScreen, StudentScreen,
} from '@/screens/academic';
import {
  HomeScreen, HospitalScreen, NoticesScreen, ProfileScreen, SearchScreen,
} from '@/screens/home';
import { AdminScreen } from '@/screens/admin';

function AppRoutes() {
  const onboarded = useSelector((s: RootState) => s.prefs.onboarded);
  const location = useLocation();
  const onOnboarding = location.pathname === '/welcome' || location.pathname === '/language';

  if (!onboarded && !onOnboarding) return <Navigate to="/welcome" replace />;
  if (onboarded && onOnboarding) return <Navigate to="/" replace />;

  return (
    <Routes>
      {/* onboarding (no phone chrome) */}
      <Route path="/welcome" element={<WelcomeScreen />} />
      <Route path="/language" element={<LanguageSelectionScreen />} />

      {/* five root tabs with bottom nav + FABs */}
      <Route element={<Layout />}>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/hospital" element={<HospitalScreen />} />
        <Route path="/search" element={<SearchScreen />} />
        <Route path="/notices" element={<NoticesScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
      </Route>

      {/* standalone pages */}
      <Route element={<StandalonePage />}>
        <Route path="/emergency" element={<EmergencyScreen />} />
        <Route path="/departments" element={<DepartmentsScreen />} />
        <Route path="/department" element={<DepartmentScreen />} />
        <Route path="/doctors" element={<DoctorsScreen />} />
        <Route path="/doctor" element={<DoctorScreen />} />
        <Route path="/opd" element={<OpdScreen />} />
        <Route path="/appointment" element={<AppointmentScreen />} />
        <Route path="/navigation" element={<NavigationScreen />} />
        <Route path="/map" element={<MapScreen />} />
        <Route path="/tests" element={<TestsScreen />} />
        <Route path="/test" element={<TestDetailScreen />} />
        <Route path="/admissions" element={<AdmissionsScreen />} />
        <Route path="/academics" element={<AcademicsScreen />} />
        <Route path="/academic-calendar" element={<AcademicCalendarScreen />} />
        <Route path="/library" element={<LibraryScreen />} />
        <Route path="/student" element={<StudentScreen />} />
        <Route path="/notifications" element={<NotificationsScreen />} />
        <Route path="/admin" element={<AdminScreen />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function StandalonePage() {
  return (
    <AppFrame>
      <PhoneFrame>
        <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </PhoneFrame>
    </AppFrame>
  );
}

function AppShell() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <div className="h-[100dvh]">
            <AppRoutes />
          </div>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
}

export default AppShell;