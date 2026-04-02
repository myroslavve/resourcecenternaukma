import { Card } from '../components/Common';
import { LoginForm } from '../components/LoginForm';
import { useNavigate } from 'react-router-dom';

export function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center px-4'>
      <Card className='w-full max-w-md'>
        <h1 className='text-3xl font-bold text-gray-800 mb-2'>Вхід</h1>
        <p className='text-gray-600 mb-6'>Увійдіть в свій акаунт</p>

        <LoginForm />

        <div className='mt-6 pt-6 border-t border-gray-200'>
          <p className='text-gray-600 text-sm'>
            Немає акаунта?{' '}
            <button
              onClick={() => navigate('/register')}
              className='text-blue-600 hover:text-blue-700 font-medium'
            >
              Зареєструйтесь
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
}
