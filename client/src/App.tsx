import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import type { ReactElement } from 'react';
import { AuthProvider, useAuthContext } from './hooks/AuthContext';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { CheckEmailPage } from './pages/CheckEmailPage';
import { VerifyEmailPage } from './pages/VerifyEmailPage';
import { CatalogPage } from './pages/CatalogPage';
import { AdminBooksPage } from './pages/AdminBooksPage';
import { AdminCategoriesPage } from './pages/AdminCategoriesPage';
import { SiteHeader } from './components/layout/SiteHeader';
import { SiteFooter } from './components/layout/SiteFooter';

function getDefaultRouteByRole(role?: string): string {
  return role === 'admin' ? '/admin/books' : '/catalog';
}

function AdminOnlyRoute({
  userRole,
  children,
}: {
  userRole?: string;
  children: ReactElement;
}) {
  if (!userRole) {
    return <Navigate to='/login' replace />;
  }

  if (userRole !== 'admin') {
    return <Navigate to='/catalog' replace />;
  }

  return children;
}

function AppRoutes() {
  const { user, initialized } = useAuthContext();

  if (!initialized) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path='/'
        element={
          user ? (
            <Navigate to={getDefaultRouteByRole(user.role)} replace />
          ) : (
            <HomePage />
          )
        }
      />
      <Route path='/catalog' element={<CatalogPage />} />
      <Route
        path='/login'
        element={
          user ? (
            <Navigate to={getDefaultRouteByRole(user.role)} replace />
          ) : (
            <LoginPage />
          )
        }
      />
      <Route
        path='/register'
        element={
          user ? (
            <Navigate to={getDefaultRouteByRole(user.role)} replace />
          ) : (
            <RegisterPage />
          )
        }
      />
      <Route path='/check-email' element={<CheckEmailPage />} />
      <Route path='/verify-email' element={<VerifyEmailPage />} />

      <Route
        path='/admin/books'
        element={
          <AdminOnlyRoute userRole={user?.role}>
            <AdminBooksPage />
          </AdminOnlyRoute>
        }
      />
      <Route
        path='/admin/categories'
        element={
          <AdminOnlyRoute userRole={user?.role}>
            <AdminCategoriesPage />
          </AdminOnlyRoute>
        }
      />

      <Route
        path='*'
        element={
          user ? (
            <Navigate to={getDefaultRouteByRole(user.role)} replace />
          ) : (
            <Navigate to='/' replace />
          )
        }
      />
    </Routes>
  );
}

function AppLayout() {
  return (
    <div className='min-h-dvh bg-background text-foreground'>
      <div className='flex min-h-dvh flex-col'>
        <SiteHeader />
        <main className='mx-auto w-full max-w-7xl flex-1'>
          <AppRoutes />
        </main>
        <SiteFooter />
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </Router>
  );
}

export default App;
