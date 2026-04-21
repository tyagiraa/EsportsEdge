import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './BackToTopButton.css';

function BackToTopButton({ showAfterPx = 450, bottomOffsetPx = 22 }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let raf = 0;

    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        setVisible(window.scrollY > showAfterPx);
      });
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [showAfterPx]);

  if (!visible) return null;

  return (
    <button
      type="button"
      className="back-to-top"
      style={{ bottom: bottomOffsetPx }}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      title="Back to top"
    >
      ↑ Top
    </button>
  );
}

BackToTopButton.propTypes = {
  showAfterPx: PropTypes.number,
  bottomOffsetPx: PropTypes.number,
};

export default BackToTopButton;
