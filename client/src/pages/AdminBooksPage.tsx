import { useEffect, useState } from 'react';
import { useBooks } from '../hooks/useBooks';
import { useCategories } from '../hooks/useCategories';
import {
  Alert,
  Button,
  Card,
  Input,
  Loading,
  Modal,
} from '../components/Common';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import type { Book, Category, CreateBookDTO } from '../types';

const emptyBookForm: CreateBookDTO = {
  title: '',
  author: '',
  isbn: '',
  category: '',
  genre: '',
  description: '',
  totalCopies: 1,
  imageUrl: '',
  downloadUrl: '',
};
export function AdminBooksPage() {
  const {
    getAllBooks,
    createBook,
    updateBook,
    deleteBook,
    activateBook,
    deactivateBook,
    loading,
    error,
  } = useBooks();
  const { getCategories } = useCategories();

  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<CreateBookDTO>(emptyBookForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const refetch = async () => {
    const [booksResult, categoriesResult] = await Promise.all([
      getAllBooks(1),
      getCategories(),
    ]);

    setBooks(booksResult.items);
    setCategories(categoriesResult);
  };

  useEffect(() => {
    refetch().catch(() => {
      // hook error is rendered below
    });
  }, []);

  const resetForm = () => {
    setForm(emptyBookForm);
    setEditingId(null);
    setLocalError(null);
  };

  const openCreateModal = () => {
    resetForm();
    setIsFormModalOpen(true);
  };

  const closeFormModal = () => {
    setIsFormModalOpen(false);
    resetForm();
  };

  const validateBookForm = (): string | null => {
    const currentYear = new Date().getFullYear();
    const isbnPattern = /^[0-9\-]{10,17}$/;

    if (!form.title.trim()) return "Назва є обов'язковою.";
    if (form.title.trim().length < 3)
      return 'Назва повинна містити мінімум 3 символи.';
    if (!form.author.trim()) return "Автор є обов'язковим.";
    if (form.author.trim().length < 3)
      return 'Автор повинен містити мінімум 3 символи.';
    if (!form.isbn.trim()) return "ISBN є обов'язковим.";
    if (!isbnPattern.test(form.isbn.trim()))
      return 'ISBN має містити 10-17 цифр або дефісів.';
    if (!form.category.trim()) return "Категорія є обов'язковою.";
    if (!form.genre.trim()) return "Жанр є обов'язковим.";
    if (!Number.isInteger(form.totalCopies) || form.totalCopies < 1) {
      return 'Кількість копій має бути цілим числом від 1.';
    }
    if (
      typeof form.publishedYear === 'number' &&
      (!Number.isInteger(form.publishedYear) ||
        form.publishedYear < 1000 ||
        form.publishedYear > currentYear)
    ) {
      return `Рік публікації має бути у межах 1000-${currentYear}.`;
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    const validationError = validateBookForm();
    if (validationError) {
      setLocalError(validationError);
      return;
    }

    if (editingId) {
      await updateBook(editingId, form);
    } else {
      await createBook(form);
    }

    closeFormModal();
    await refetch();
  };

  const startEdit = (book: Book) => {
    setEditingId(book._id || null);
    setForm({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      category: book.category,
      genre: book.genre,
      description: book.description,
      totalCopies: book.totalCopies,
      publishedYear: book.publishedYear,
      imageUrl: book.imageUrl || '',
      downloadUrl: book.downloadUrl || '',
    });
    setLocalError(null);
    setIsFormModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!bookToDelete?._id) return;
    await deleteBook(bookToDelete._id);
    setBookToDelete(null);
    await refetch();
  };

  const toggleActive = async (book: Book) => {
    if (!book._id) return;
    if (book.isActive) {
      await deactivateBook(book._id);
    } else {
      await activateBook(book._id);
    }
    await refetch();
  };

  return (
    <div className='max-w-7xl mx-auto py-8 px-4'>
      <div className='mb-6 flex items-center justify-between'>
        <h1 className='text-3xl font-bold text-gray-800'>Адмін: книги</h1>
        <Button onClick={openCreateModal}>Додати книгу</Button>
      </div>

      {(localError || error) && (
        <Alert type='error'>{localError || error}</Alert>
      )}
      {loading && <Loading />}

      <Card>
        <h2 className='text-xl font-semibold mb-4'>Список книг</h2>
        <div className='overflow-x-auto'>
          <table className='w-full table-fixed'>
            <thead>
              <tr className='border-b'>
                <th className='w-1/5 p-3 text-center'>Назва</th>
                <th className='w-1/5 p-3 text-center'>Автор</th>
                <th className='w-1/5 p-3 text-center'>Категорія</th>
                <th className='w-1/5 p-3 text-center'>Статус</th>
                <th className='w-1/5 p-3 text-center'>Дії</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book._id} className='border-b'>
                  <td className='p-3 text-center break-words'>{book.title}</td>
                  <td className='p-3 text-center break-words'>{book.author}</td>
                  <td className='p-3 text-center break-words'>
                    {book.category}
                  </td>
                  <td className='p-3 text-center'>
                    {book.isActive ? 'Активна' : 'Неактивна'}
                  </td>
                  <td className='p-3'>
                    <div className='flex items-center justify-center gap-1.5 whitespace-nowrap'>
                      <Button
                        variant='secondary'
                        className='!h-8 !px-2 text-xs whitespace-nowrap'
                        onClick={() => startEdit(book)}
                      >
                        Редагувати
                      </Button>
                      <Button
                        variant='danger'
                        className='!h-8 !px-2 text-xs whitespace-nowrap'
                        onClick={() => setBookToDelete(book)}
                      >
                        Видалити
                      </Button>
                      <Button
                        className='!h-8 !px-2 text-xs whitespace-nowrap'
                        onClick={() => toggleActive(book)}
                      >
                        {book.isActive ? 'Деакт.' : 'Актив.'}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        isOpen={isFormModalOpen}
        title={editingId ? 'Редагування книги' : 'Нова книга'}
        onClose={closeFormModal}
      >
        <form
          onSubmit={handleSubmit}
          className='grid grid-cols-1 md:grid-cols-2 gap-4'
        >
          <Input
            label='Назва'
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <Input
            label='Автор'
            value={form.author}
            onChange={(e) => setForm({ ...form, author: e.target.value })}
            required
          />
          <Input
            label='ISBN'
            value={form.isbn}
            onChange={(e) => setForm({ ...form, isbn: e.target.value })}
            required
          />
          <div className='mb-4'>
            <Label className='mb-1.5'>Категорія</Label>
            <Select
              value={form.category || '__empty__'}
              onValueChange={(value) =>
                setForm({
                  ...form,
                  category: value === '__empty__' ? '' : value,
                })
              }
            >
              <SelectTrigger className='h-9 w-full'>
                <SelectValue placeholder='Оберіть категорію' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='__empty__'>Оберіть категорію</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category._id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Input
            label='Жанр'
            value={form.genre}
            onChange={(e) => setForm({ ...form, genre: e.target.value })}
            required
          />
          <Input
            label='Рік публікації'
            type='number'
            value={form.publishedYear ?? ''}
            onChange={(e) =>
              setForm({
                ...form,
                publishedYear: e.target.value
                  ? Number(e.target.value)
                  : undefined,
              })
            }
          />
          <Input
            label='Кількість копій'
            type='number'
            min={1}
            value={form.totalCopies}
            onChange={(e) =>
              setForm({ ...form, totalCopies: Number(e.target.value) || 1 })
            }
            required
          />
          <Input
            label='Опис'
            value={form.description || ''}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <Input
            label='URL зображення'
            value={form.imageUrl || ''}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            placeholder='https://example.com/book-cover.jpg'
          />
          <Input
            label='URL завантаження'
            value={form.downloadUrl || ''}
            onChange={(e) => setForm({ ...form, downloadUrl: e.target.value })}
            placeholder='https://example.com/book.pdf'
          />
          <div className='md:col-span-2 flex gap-3'>
            <Button type='submit'>{editingId ? 'Оновити' : 'Створити'}</Button>
            <Button type='button' variant='secondary' onClick={closeFormModal}>
              Скасувати
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={Boolean(bookToDelete)}
        title='Підтвердження видалення'
        onClose={() => setBookToDelete(null)}
      >
        <p className='mb-4 text-gray-700'>
          Ви дійсно хочете видалити книгу {bookToDelete?.title}?
        </p>
        <div className='flex gap-3'>
          <Button variant='danger' onClick={confirmDelete}>
            Видалити
          </Button>
          <Button variant='secondary' onClick={() => setBookToDelete(null)}>
            Скасувати
          </Button>
        </div>
      </Modal>
    </div>
  );
}
