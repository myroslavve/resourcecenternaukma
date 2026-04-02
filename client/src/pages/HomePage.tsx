export function HomePage() {
  return (
    <div className='max-w-6xl mx-auto py-12 px-4'>
      <h1 className='text-4xl font-bold text-gray-800 mb-4'>
        Ресурсний центр - Бібліотека
      </h1>

      <div className='bg-white rounded-lg shadow p-6 mb-8'>
        <p className='text-lg text-gray-700'>
          Єдина платформа для пошуку, перегляду та адміністрування бібліотечних
          ресурсів.
        </p>
        <p className='text-sm text-gray-500 mt-2'>
          Для доступу до персональних функцій увійдіть або зареєструйтесь через
          верхнє меню.
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        <div className='bg-blue-50 rounded-lg p-6'>
          <h2 className='text-xl font-semibold text-blue-900 mb-2'>
            📚 Електронна бібліотека
          </h2>
          <p className='text-blue-700'>
            Доступ до великої колекції книг та наукових матеріалів
          </p>
        </div>

        <div className='bg-green-50 rounded-lg p-6'>
          <h2 className='text-xl font-semibold text-green-900 mb-2'>
            🔍 Пошук та фільтрація
          </h2>
          <p className='text-green-700'>
            Легко знайдіть потрібну книгу за назвою, автором або жанром
          </p>
        </div>

        <div className='bg-purple-50 rounded-lg p-6'>
          <h2 className='text-xl font-semibold text-purple-900 mb-2'>
            👤 Особистий кабінет
          </h2>
          <p className='text-purple-700'>
            Керуйте своїм профілем та історією позичень
          </p>
        </div>
      </div>
    </div>
  );
}
