import { useEffect, useRef } from 'react';
import { Icon } from './Icon';

export interface MenuItem {
  label: string;
  icon?: string;
  checked?: boolean;
  danger?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

export function Menu({ items, onClose, align = 'right' }: { items: MenuItem[]; onClose: () => void; align?: 'left' | 'right' }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const down = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const key = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    setTimeout(() => document.addEventListener('mousedown', down), 0);
    document.addEventListener('keydown', key);
    return () => {
      document.removeEventListener('mousedown', down);
      document.removeEventListener('keydown', key);
    };
  }, [onClose]);
  return (
    <div className={'menu ' + align} ref={ref} role="menu">
      {items.map((it, i) => (
        <button
          key={i}
          role="menuitem"
          className={'menu-item' + (it.danger ? ' danger' : '') + (it.checked ? ' checked' : '')}
          disabled={it.disabled}
          onClick={() => {
            onClose();
            it.onClick();
          }}
        >
          {it.icon && <Icon name={it.icon} size={18} />}
          <span>{it.label}</span>
          {it.checked && <Icon name="check" size={18} className="menu-check" />}
        </button>
      ))}
    </div>
  );
}
