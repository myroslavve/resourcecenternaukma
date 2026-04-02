import { useEffect, useState } from 'react';
import { useCategories } from '../hooks/useCategories';
import {
  Alert,
  Button,
  Card,
  Input,
  Loading,
  Modal,
} from '../components/Common';
import type { Category } from '../types';

export function AdminCategoriesPage() {
  const {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    activateCategory,
    deactivateCategory,
    loading,
    error,
  } = useCategories();

  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null,
  );

  const refetch = async () => {
    const data = await getCategories();
    setCategories(data);
  };

  useEffect(() => {
    refetch().catch(() => {
      // hook error is rendered below
    });
  }, []);

  const resetForm = () => {
    setName('');
    setDescription('');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!name.trim()) {
      setLocalError("Назва категорії є обов'язковою.");
      return;
    }
    if (name.trim().length < 2) {
      setLocalError('Назва категорії має містити мінімум 2 символи.');
      return;
    }
    if (description.trim().length > 500) {
      setLocalError('Опис категорії не може бути довшим за 500 символів.');
      return;
    }

    if (editingId) {
      await updateCategory(editingId, { name, description });
    } else {
      await createCategory({ name, description });
    }

    closeFormModal();
    await refetch();
  };

  const startEdit = (category: Category) => {
    setEditingId(category._id || null);
    setName(category.name);
    setDescription(category.description || '');
    setLocalError(null);
    setIsFormModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete?._id) return;
    await deleteCategory(categoryToDelete._id);
    setCategoryToDelete(null);
    await refetch();
  };

  const toggleActive = async (category: Category) => {
    if (!category._id) return;
    if (category.isActive) {
      await deactivateCategory(category._id);
    } else {
      await activateCategory(category._id);
    }
    await refetch();
  };

  return (
    <div className='max-w-7xl mx-auto py-8 px-4'>
      <div className='mb-6 flex items-center justify-between'>
        <h1 className='text-3xl font-bold text-gray-800'>Адмін: категорії</h1>
        <Button onClick={openCreateModal}>Додати категорію</Button>
      </div>

      {(localError || error) && (
        <Alert type='error'>{localError || error}</Alert>
      )}
      {loading && <Loading />}

      <Card>
        <h2 className='text-xl font-semibold mb-4'>Список категорій</h2>
        <div className='overflow-x-auto'>
          <table className='w-full table-fixed'>
            <thead>
              <tr className='border-b'>
                <th className='w-1/4 p-3 text-center'>Назва</th>
                <th className='w-1/4 p-3 text-center'>Опис</th>
                <th className='w-1/4 p-3 text-center'>Статус</th>
                <th className='w-1/4 p-3 text-center'>Дії</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category._id} className='border-b'>
                  <td className='p-3 text-center break-words'>
                    {category.name}
                  </td>
                  <td className='p-3 text-center break-words'>
                    {category.description || '-'}
                  </td>
                  <td className='p-3 text-center'>
                    {category.isActive ? 'Активна' : 'Неактивна'}
                  </td>
                  <td className='p-3'>
                    <div className='flex items-center justify-center gap-1.5 whitespace-nowrap'>
                      <Button
                        variant='secondary'
                        className='!h-8 !px-2 text-xs whitespace-nowrap'
                        onClick={() => startEdit(category)}
                      >
                        Редагувати
                      </Button>
                      <Button
                        variant='danger'
                        className='!h-8 !px-2 text-xs whitespace-nowrap'
                        onClick={() => setCategoryToDelete(category)}
                      >
                        Видалити
                      </Button>
                      <Button
                        className='!h-8 !px-2 text-xs whitespace-nowrap'
                        onClick={() => toggleActive(category)}
                      >
                        {category.isActive ? 'Деакт.' : 'Актив.'}
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
        title={editingId ? 'Редагування категорії' : 'Нова категорія'}
        onClose={closeFormModal}
      >
        <form
          onSubmit={handleSubmit}
          className='grid grid-cols-1 md:grid-cols-2 gap-4'
        >
          <Input
            label='Назва'
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            label='Опис'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
        isOpen={Boolean(categoryToDelete)}
        title='Підтвердження видалення'
        onClose={() => setCategoryToDelete(null)}
      >
        <p className='mb-4 text-gray-700'>
          Ви дійсно хочете видалити категорію {categoryToDelete?.name}?
        </p>
        <div className='flex gap-3'>
          <Button variant='danger' onClick={confirmDelete}>
            Видалити
          </Button>
          <Button variant='secondary' onClick={() => setCategoryToDelete(null)}>
            Скасувати
          </Button>
        </div>
      </Modal>
    </div>
  );
}
