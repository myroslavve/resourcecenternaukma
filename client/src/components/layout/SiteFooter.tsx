export function SiteFooter() {
  return (
    <footer className='border-t bg-card'>
      <div className='mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 text-sm text-muted-foreground'>
        <span>Resource Center - Library</span>
        <span>{new Date().getFullYear()}</span>
      </div>
    </footer>
  );
}
