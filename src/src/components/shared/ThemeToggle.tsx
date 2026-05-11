import React, { useEffect, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { MoonIcon, SunIcon } from '@/components/shared/icons';

const ThemeToggle: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="p-2 w-9 h-9 rounded-lg bg-surface-hover border border-border">
        <div className="w-5 h-5" />
      </div>
    );
  }

  return <ThemeToggleInner />;
};

const ThemeToggleInner: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="size-11 rounded-xl bg-surface-hover border border-border hover:bg-surface-elevated transition-colors duration-200 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary inline-flex items-center justify-center"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      type="button"
    >
      {theme === 'light' ? (
        <MoonIcon className="w-5 h-5 text-text-primary" strokeWidth={2} size={24} />
      ) : (
        <SunIcon className="w-5 h-5 text-text-primary" strokeWidth={2} size={24} />
      )}
    </button>
  );
};

export default ThemeToggle;
