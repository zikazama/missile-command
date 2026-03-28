import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import './BottomSheet.css';

const BottomSheet = forwardRef(({ children, isOpen, onToggle, onCollapseChange }, ref) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [startY, setStartY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const sheetRef = useRef(null);

  // Notify parent when collapse state changes
  useEffect(() => {
    if (onCollapseChange) {
      onCollapseChange(!isExpanded);
    }
  }, [isExpanded, onCollapseChange]);

  useImperativeHandle(ref, () => ({
    collapse: () => setIsExpanded(false),
    expand: () => setIsExpanded(true)
  }));

  const handleTouchStart = (e) => {
    setStartY(e.touches[0].clientY);
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const currentClientY = e.touches[0].clientY;
    const diff = startY - currentClientY;

    if (diff > 50 && !isExpanded) {
      setIsExpanded(true);
      setIsDragging(false);
    } else if (diff < -50 && isExpanded) {
      setIsExpanded(false);
      setIsDragging(false);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const toggleSheet = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      ref={sheetRef}
      className={`bottom-sheet ${isExpanded ? 'expanded' : 'collapsed'} ${isDragging ? 'dragging' : ''}`}
    >
      <div
        className="sheet-handle"
        onClick={toggleSheet}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="handle-bar"></div>
        <div className="handle-indicator">
          {isExpanded ? '▼ Swipe down to hide' : '▲ Tap to show controls'}
        </div>
      </div>

      <div className="sheet-content">
        {children}
      </div>
    </div>
  );
});

BottomSheet.displayName = 'BottomSheet';

export default BottomSheet;
