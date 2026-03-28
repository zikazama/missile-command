import { useState } from 'react';

export default function AttackButton({ onClick, missile }) {
  const [isLaunching, setIsLaunching] = useState(false);

  const handleClick = () => {
    setIsLaunching(true);
    setTimeout(() => {
      onClick();
    }, 500);
  };

  return (
    <button
      className={`attack-button ${isLaunching ? 'launching' : ''}`}
      onClick={handleClick}
      disabled={isLaunching}
    >
      <span className="attack-icon">{isLaunching ? '🚀' : '💣'}</span>
      <span className="attack-text">
        {isLaunching ? 'LAUNCHING...' : 'LAUNCH ATTACK'}
      </span>
      <div className="attack-glow"></div>
    </button>
  );
}
