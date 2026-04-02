import { useEffect, useState } from 'react';
import { useBooks } from '../hooks/useBooks';
import { useCategories } from '../hooks/useCategories';
import { Alert, Button, Card, Input, Loading } from '../components/Common';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import type { Book, Category } from '../types';

export function CatalogPage() {
  const { searchBooks, loading, error } = useBooks();
  const { getCategories } = useCategories();
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [genre, setGenre] = useState('');

  const loadBooks = async () => {
    const result = await searchBooks(
      query || undefined,
      category || undefined,
      genre || undefined,
      1,
    );
    setBooks(result.items);
  };

  useEffect(() => {
    Promise.all([loadBooks(), getCategories()])
      .then(([, categoryData]) => {
        setCategories(categoryData);
      })
      .catch(() => {
        // Error state is handled in hook and rendered below
      });
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    await loadBooks();
  };

  return (
    <div className='max-w-6xl mx-auto py-8 px-4'>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-3xl font-bold text-gray-800'>Каталог книг</h1>
      </div>

      <Card className='mb-6'>
        <form
          onSubmit={handleSearch}
          className='grid grid-cols-1 md:grid-cols-4 gap-4 items-end'
        >
          <Input
            label='Пошук'
            placeholder='Назва, автор або ISBN'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className='mb-4'>
            <Label className='mb-1.5'>Категорія</Label>
            <Select
              value={category || '__all__'}
              onValueChange={(value) =>
                setCategory(value === '__all__' ? '' : value)
              }
            >
              <SelectTrigger className='h-9 w-full'>
                <SelectValue placeholder='Усі категорії' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='__all__'>Усі категорії</SelectItem>
                {categories.map((item) => (
                  <SelectItem key={item._id} value={item.name}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Input
            label='Жанр'
            placeholder='Наприклад: Навчальна'
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
          />
          <div className='mb-4 flex flex-col'>
            <span className='mb-1.5 block text-sm font-medium opacity-0'>
              Фільтр
            </span>
            <Button type='submit' className='h-9 w-full'>
              Застосувати фільтри
            </Button>
          </div>
        </form>
      </Card>

      {error && <Alert type='error'>{error}</Alert>}
      {loading && <Loading />}

      {!loading && (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
          {books.map((book) => (
            <Card key={book._id} className='gap-0 p-0'>
              <div className='w-full overflow-hidden'>
                <img
                  src={book.imageUrl || '/default-placeholder.png'}
                  alt={book.title}
                  className='block h-56 w-full object-cover'
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/default-placeholder.png';
                  }}
                />
              </div>
              <div className='space-y-1.5 px-4 py-4'>
                <h3 className='text-lg font-semibold text-gray-900'>
                  {book.title}
                </h3>
                <p className='text-sm text-gray-700'>Автор: {book.author}</p>
                <p className='text-sm text-gray-600'>
                  Категорія: {book.category}
                </p>
                <p className='text-sm text-gray-600'>Жанр: {book.genre}</p>
                <p className='text-sm text-gray-600'>ISBN: {book.isbn}</p>
                <p className='text-sm text-gray-600'>
                  Доступно: {book.availableCopies} / {book.totalCopies}
                </p>
                {book.description && (
                  <p className='text-sm text-gray-600 pt-1'>
                    {book.description}
                  </p>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {!loading && books.length === 0 && (
        <Alert type='info'>За вашим запитом нічого не знайдено.</Alert>
      )}
    </div>
  );
}
