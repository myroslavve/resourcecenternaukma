import { useNavigate, useSearchParams } from 'react-router-dom';
import { Alert, Button, Card } from '../components/Common';

export function CheckEmailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');

  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center px-4'>
      <Card className='w-full max-w-md'>
        <h1 className='text-2xl font-bold text-gray-800 mb-2'>
          Перевірте пошту
        </h1>
        <p className='text-gray-600 mb-6'>
          Ми надіслали лист підтвердження на адресу{' '}
          <strong>{email || 'вашу електронну адресу'}</strong>.
        </p>

        <Alert type='info' className='mb-4'>
          Відкрийте лист і перейдіть за посиланням для підтвердження реєстрації.
        </Alert>

        <div className='flex gap-3'>
          <Button className='w-full' onClick={() => navigate('/login')}>
            Перейти до входу
          </Button>
        </div>
      </Card>
    </div>
  );
}
