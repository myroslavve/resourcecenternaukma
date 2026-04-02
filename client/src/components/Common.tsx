import React from 'react';
import { Button as UIButton } from '@/components/ui/button';
import { Input as UIInput } from '@/components/ui/input';
import { Label as UILabel } from '@/components/ui/label';
import { Card as UICard } from '@/components/ui/card';
import { Alert as UIAlert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

export function Button({
  children,
  variant = 'primary',
  disabled = false,
  type = 'button',
  onClick,
  className = '',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger';
}) {
  const variantMap = {
    primary: 'default',
    secondary: 'secondary',
    danger: 'destructive',
  } as const;

  const sizeClass = 'h-9 px-4 text-sm';

  return (
    <UIButton
      type={type}
      disabled={disabled}
      onClick={onClick}
      variant={variantMap[variant]}
      className={cn(sizeClass, className)}
      {...props}
    >
      {children}
    </UIButton>
  );
}

export function Input({
  label,
  error,
  className = '',
  id,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
}) {
  const generatedId = React.useId();
  const inputId = id || props.name || generatedId;

  return (
    <div className='mb-4'>
      {label && (
        <UILabel htmlFor={inputId} className='mb-1.5'>
          {label}
        </UILabel>
      )}
      <UIInput
        id={inputId}
        className={cn(error ? 'border-destructive' : '', className)}
        {...props}
      />
      {error && <p className='text-red-500 text-sm mt-1'>{error}</p>}
    </div>
  );
}

export function Card({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <UICard className={cn('border px-6 py-6 shadow-sm', className)}>
      {children}
    </UICard>
  );
}

export function Alert({
  type = 'info',
  children,
  className = '',
}: {
  type?: 'info' | 'success' | 'error' | 'warning';
  children: React.ReactNode;
  className?: string;
}) {
  const toneClass = {
    info: 'border-blue-200 bg-blue-50 text-blue-800',
    success: 'border-green-200 bg-green-50 text-green-800',
    error: 'border-red-200 bg-red-50 text-red-800',
    warning: 'border-yellow-200 bg-yellow-50 text-yellow-800',
  };

  return (
    <UIAlert
      variant={type === 'error' ? 'destructive' : 'default'}
      className={cn(toneClass[type], className)}
    >
      <AlertDescription className='text-inherit'>{children}</AlertDescription>
    </UIAlert>
  );
}

export function Loading() {
  return (
    <div className='flex justify-center items-center py-8'>
      <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
    </div>
  );
}

export function Modal({
  isOpen,
  title,
  children,
  onClose,
}: {
  isOpen: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4'
      onClick={onClose}
    >
      <div
        className='w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='mb-4 flex items-center justify-between'>
          <h3 className='text-xl font-semibold text-gray-900'>{title}</h3>
          <button
            type='button'
            className='rounded-md px-2 py-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700'
            onClick={onClose}
            aria-label='Закрити'
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
