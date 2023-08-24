import { useState } from 'react';
import '../App.css';

export const upEmoji = 0x1f53c;
export const downEmoji = 0x1f53d;
export const upDownEmoji = 0x1f53d;

export const noSort = '⬅';
export const ascSort = '⬆';
export const desSort = '⬇';

interface Props {
  defaultAsc: boolean;
  callback: (dir: string) => void;
}

const SortSymbol = ({ defaultAsc, callback }: Props) => {
  const [label, setLabel] = useState('');
  const [direction, setDirection] = useState(defaultAsc ? ascSort : noSort);

  const handleClick = () => {
    let newDir: string;
    if (direction === noSort || direction === desSort) {
      newDir = ascSort;
    } else {
      newDir = desSort;
    }
    callback(newDir);
    setDirection(newDir);
  };

  return (
    <span
      className='filter-emoji'
      role='img'
      aria-label={label ? label : ''}
      aria-hidden={!!label.toString()}
      onClick={handleClick}
    >
      {direction}
    </span>
  );
};

export default SortSymbol;
