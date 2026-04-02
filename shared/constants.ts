/**
 * Shared constants
 */

export const API_TIMEOUT = 30000; // 30 seconds
export const SESSION_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days
export const EMAIL_VERIFICATION_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

export const ITEMS_PER_PAGE = 20;
export const MAX_ITEMS_PER_PAGE = 100;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Необхідна авторизація',
  FORBIDDEN: 'Доступ заборонений',
  NOT_FOUND: 'Ресурс не знайдено',
  INVALID_EMAIL: 'Некоректна електронна адреса',
  PASSWORD_TOO_SHORT: 'Пароль має містити мінімум 8 символів',
  USER_EXISTS: 'Користувач з такою електронною адресою вже існує',
  INVALID_CREDENTIALS: 'Неправильна електронна адреса або пароль',
  INTERNAL_ERROR: 'Внутрішня помилка сервера',
  BOOK_NOT_FOUND: 'Книга не знайдена',
  CATEGORY_NOT_FOUND: 'Категорія не знайдена',
  EMAIL_NOT_VERIFIED: 'Електронна адреса не підтверджена',
  INVALID_TOKEN: 'Невалідний або закінчений токен підтвердження',
};

export const SUCCESS_MESSAGES = {
  REGISTRATION_SUCCESS:
    'Реєстрація успішна. Перевірте електронну адресу для підтвердження акаунта.',
  EMAIL_VERIFIED: 'Електронна адреса успішно підтверджена',
  LOGIN_SUCCESS: 'Вхід успішний',
  LOGOUT_SUCCESS: 'Вихід успішний',
  BOOK_CREATED: 'Книга успішно створена',
  BOOK_UPDATED: 'Книга успішно оновлена',
  BOOK_DELETED: 'Книга успішно видалена',
  BOOK_ACTIVATED: 'Книга активована',
  BOOK_DEACTIVATED: 'Книга деактивована',
};
