import { useState } from 'react';
import type { FormEvent } from 'react';
import { useAuthContext } from '../hooks/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button, Alert } from './Common';

export function LoginForm() {
  const navigate = useNavigate();
  const { login, loading, error: authError } = useAuthContext();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) newErrors.email = "Електронна адреса є обов'язковою";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Некоректна електронна адреса';
    }

    if (!formData.password) newErrors.password = "Пароль є обов'язковим";
    else if (formData.password.length < 8)
      newErrors.password = 'Пароль має містити мінімум 8 символів';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      {authError && <Alert type='error'>{authError}</Alert>}

      <div>
        <label className='block text-sm font-medium text-gray-700 mb-1'>
          Електронна адреса
        </label>
        <input
          type='email'
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          }`}
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
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.password ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder='••••••••'
        />
        {errors.password && (
          <p className='text-red-500 text-sm mt-1'>{errors.password}</p>
        )}
      </div>

      <Button
        type='submit'
        variant='primary'
        disabled={loading}
        className='w-full'
      >
        {loading ? 'Завантаження...' : 'Вхід'}
      </Button>
    </form>
  );
}
