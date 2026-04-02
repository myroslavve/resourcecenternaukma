import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/AuthContext';
import { Button, Alert } from './Common';

export function RegisterForm() {
  const navigate = useNavigate();
  const { register, loading, error: authError } = useAuthContext();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName?.trim())
      newErrors.firstName = "Ім'я є обов'язковим";
    if (!formData.lastName?.trim())
      newErrors.lastName = "Прізвище є обов'язковим";

    if (!formData.email) newErrors.email = "Електронна адреса є обов'язковою";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Некоректна електронна адреса';
    }

    if (!formData.password) newErrors.password = "Пароль є обов'язковим";
    else if (formData.password.length < 8)
      newErrors.password = 'Пароль має містити мінімум 8 символів';

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Паролі не збігаються';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) {
      return;
    }

    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      await register(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName,
      );
      setRegisteredEmail(formData.email);
      setSuccess(true);
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className='space-y-4'>
        <Alert type='success'>
          Реєстрація успішна. Ми надіслали лист підтвердження на адресу{' '}
          <strong>{registeredEmail}</strong>.
        </Alert>
        <Alert type='info'>
          Перед входом потрібно підтвердити email. Відкрийте лист і перейдіть за
          посиланням підтвердження.
        </Alert>
        <Button
          type='button'
          variant='primary'
          className='w-full'
          onClick={() => navigate('/login')}
        >
          Перейти до входу
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      {authError && <Alert type='error'>{authError}</Alert>}

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Ім'я
          </label>
          <input
            type='text'
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
            className={`w-full px-3 py-2 border rounded-lg ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Своє ім'я"
          />
          {errors.firstName && (
            <p className='text-red-500 text-sm mt-1'>{errors.firstName}</p>
          )}
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Прізвище
          </label>
          <input
            type='text'
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
            className={`w-full px-3 py-2 border rounded-lg ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
            placeholder='Своє прізвище'
          />
          {errors.lastName && (
            <p className='text-red-500 text-sm mt-1'>{errors.lastName}</p>
          )}
        </div>
      </div>

      <div>
        <label className='block text-sm font-medium text-gray-700 mb-1'>
          Електронна адреса
        </label>
        <input
          type='email'
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className={`w-full px-3 py-2 border rounded-lg ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
          placeholder='your@email.com'
        />
        {errors.email && (
          <p className='text-red-500 text-sm mt-1'>{errors.email}</p>
        )}
      </div>

      <div>
        <label className='block text-sm font-medium text-gray-700 mb-1'>
          Пароль
        </label>
        <input
          type='password'
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          className={`w-full px-3 py-2 border rounded-lg ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
          placeholder='••••••••'
        />
        {errors.password && (
          <p className='text-red-500 text-sm mt-1'>{errors.password}</p>
        )}
      </div>

      <div>
        <label className='block text-sm font-medium text-gray-700 mb-1'>
          Повторіть пароль
        </label>
        <input
          type='password'
          value={formData.confirmPassword}
          onChange={(e) =>
            setFormData({ ...formData, confirmPassword: e.target.value })
          }
          className={`w-full px-3 py-2 border rounded-lg ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
          placeholder='••••••••'
        />
        {errors.confirmPassword && (
          <p className='text-red-500 text-sm mt-1'>{errors.confirmPassword}</p>
        )}
      </div>

      <Button
        type='submit'
        variant='primary'
        disabled={loading || isSubmitting}
        className='w-full'
      >
        {loading || isSubmitting ? 'Завантаження...' : 'Реєстрація'}
      </Button>
    </form>
  );
}
