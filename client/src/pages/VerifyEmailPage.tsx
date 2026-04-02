import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/AuthContext';
import { Alert, Loading } from '../components/Common';

export function VerifyEmailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { verifyEmail, loading, error } = useAuthContext();
  const [verified, setVerified] = React.useState(false);

  useEffect(() => {
    const verify = async () => {
      const token = searchParams.get('token');
      const email = searchParams.get('email');

      if (!token || !email) {
        return;
      }

      try {
        await verifyEmail(token, email);
        setVerified(true);
        setTimeout(() => navigate('/login'), 3000);
      } catch (err) {
        console.error('Verification failed:', err);
      }
    };

    verify();
  }, [searchParams, verifyEmail, navigate]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Підтвердження електронної адреси</h1>
        
        {loading && <Loading />}
        
        {error && (
          <Alert type="error">
            {error}
            <button
              onClick={() => navigate('/login')}
              className="block mt-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              Повернутися до входу
            </button>
          </Alert>
        )}
        
        {verified && (
          <Alert type="success">
            Електронна адреса успішно підтверджена! Ви будете перенаправлені на сторінку входу...
          </Alert>
        )}
      </div>
    </div>
  );
}
