import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/hooks/AuthContext';
import { Button } from '@/components/Common';

function navLinkClass({ isActive }: { isActive: boolean }) {
  return [
    'rounded-md px-3 py-2 text-sm font-medium transition-colors',
    isActive
      ? 'bg-primary text-primary-foreground'
      : 'text-muted-foreground hover:text-foreground hover:bg-muted',
  ].join(' ');
}

export function SiteHeader() {
  const navigate = useNavigate();
  const { user, logout } = useAuthContext();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className='border-b bg-card/80 backdrop-blur'>
      <div className='mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3'>
        <NavLink to='/' className='text-base font-semibold tracking-tight'>
          Library Center
        </NavLink>

        <nav className='flex items-center gap-2'>
          <NavLink to='/catalog' className={navLinkClass}>
            Каталог
          </NavLink>

          {user?.role === 'admin' && (
            <>
              <NavLink to='/admin/books' className={navLinkClass}>
                Книги
              </NavLink>
              <NavLink to='/admin/categories' className={navLinkClass}>
                Категорії
              </NavLink>
            </>
          )}
        </nav>

        <div className='flex items-center gap-2'>
          {user ? (
            <>
              <span className='hidden text-sm text-muted-foreground md:inline'>
                {user.firstName} {user.lastName}
              </span>
              <Button variant='secondary' onClick={handleLogout}>
                Вихід
              </Button>
            </>
          ) : (
            <>
              <Button variant='secondary' onClick={() => navigate('/login')}>
                Вхід
              </Button>
              <Button onClick={() => navigate('/register')}>Реєстрація</Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
