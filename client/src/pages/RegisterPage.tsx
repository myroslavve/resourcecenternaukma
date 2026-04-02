import { Card } from '../components/Common';
import { RegisterForm } from '../components/RegisterForm';
import { useNavigate } from 'react-router-dom';

export function RegisterPage() {
  const navigate = useNavigate();

  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center px-4'>
      <Card className='w-full max-w-md'>
        <h1 className='text-3xl font-bold text-gray-800 mb-2'>Реєстрація</h1>
        <p className='text-gray-600 mb-6'>Створіть новий акаунт</p>

        <RegisterForm />

        <div className='mt-6 pt-6 border-t border-gray-200'>
          <p className='text-gray-600 text-sm'>
            Вже маєте акаунт?{' '}
            <button
              onClick={() => navigate('/login')}
              className='text-blue-600 hover:text-blue-700 font-medium'
            >
              Увійдіть
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
}
