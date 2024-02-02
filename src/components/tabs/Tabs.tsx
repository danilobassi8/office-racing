import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import './Tabs.css';

export function Tabs({ children, center = false }) {
  const itemList = useRef<HTMLUListElement>(undefined);
  const leftArrow = useRef(null);
  const rightArrow = useRef(null);

  const scroll = (value: number) => {
    itemList.current.scrollLeft += value;
  };

  const manageArrows = () => {
    if (!itemList.current) return;

    // left arrow
    if (itemList.current.scrollLeft > 20) {
      leftArrow.current.show();
    } else {
      leftArrow.current.hide();
    }

    // right arrow
    const maxScrollValue = itemList.current.scrollWidth - itemList.current.clientWidth - 20;
    if (itemList.current.scrollLeft >= maxScrollValue) {
      rightArrow.current.hide();
    } else {
      rightArrow.current.show();
    }
  };

  useEffect(() => {
    manageArrows();
  }, []);

  useEffect(() => {
    window.addEventListener('resize', manageArrows);
    return () => {
      window.removeEventListener('resize', manageArrows);
    };
  }, []);

  // TODO: refactor this to a custom hook

  return (
    <>
      <div className="scrollable-tabs-container">
        <Arrow ref={leftArrow} onScroll={() => scroll(-200)} direction="left" />
        <ul ref={itemList} onScroll={manageArrows} style={{ justifyContent: center ? 'center' : 'flex-start' }}>
          {children}
        </ul>
        <Arrow ref={rightArrow} onScroll={() => scroll(200)} direction="right" />
      </div>
    </>
  );
}

const Arrow = forwardRef(({ onScroll, direction }: { onScroll: () => void; direction: string }, ref) => {
  const elRef = useRef<HTMLDivElement>(null);
  useImperativeHandle(
    ref,
    () => {
      return {
        hide() {
          elRef.current.classList.remove('active');
        },
        show() {
          elRef.current.classList.add('active');
        },
      };
    },
    []
  );

  return (
    <div className={`${direction}-arrow active`} onClick={onScroll} ref={elRef} style={{ zIndex: 100 }}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d={direction === 'right' ? 'M8.25 4.5l7.5 7.5-7.5 7.5' : 'M15.75 19.5L8.25 12l7.5-7.5'}
        />
      </svg>
    </div>
  );
});
