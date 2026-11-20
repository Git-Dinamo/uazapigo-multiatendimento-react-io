import { useState } from 'react';
import { Icon } from './Icon';

export function Avatar({ src, group, size = 44 }: { src?: string; group?: boolean; size?: number }) {
  const [broken, setBroken] = useState(false);
  const style = { width: size, height: size, minWidth: size };
  if (src && !broken)
    return <img className="avatar" style={style} src={src} alt="" onError={() => setBroken(true)} />;
  return (
    <span className="avatar ph" style={style}>
      <Icon name={group ? 'group' : 'person'} size={Math.round(size * 0.62)} />
    </span>
  );
}
