import React from 'react';

type BookCallButtonProps = {
  label?: string;
  onClick?: () => void;
  className?: string;
};

export default function BookCallButton({
  label = 'Book Your Cab',
  onClick,
  className = '',
}: BookCallButtonProps) {
  return (
    <>
      <style>{`
        .gt-book-btn {
          position: relative;
          width: 130px;
          height: 32px;
          padding: 0;
          background: #101010;
          border: 1.5px solid #333333;
          border-radius: 999px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          flex-shrink: 0;
          box-shadow:
            inset 0 2px 4px rgba(0, 0, 0, 0.80),
            inset 0 1px 1px rgba(255, 255, 255, 0.15),
            0 6px 14px rgba(0, 0, 0, 0.25);
          overflow: hidden;
          -webkit-tap-highlight-color: transparent;
          font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
        }

        .gt-book-btn:focus-visible {
          outline: 2px solid #A4FF3B;
          outline-offset: 2px;
        }

        .gt-book-btn .slider {
          position: absolute;
          left: 3px;
          top: 3px;
          bottom: 3px;
          width: 34px;
          background-color: #ffca00;
          border-radius: 999px;
          transition: width 0.65s cubic-bezier(0.22, 1, 0.36, 1);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
          box-shadow:
            inset 0 2px 3px rgba(255, 255, 255, 0.60),
            inset 0 -2px 3px rgba(0, 0, 0, 0.25),
            0 2px 6px rgba(0, 0, 0, 0.30);
        }

        .gt-book-btn:hover .slider,
        .gt-book-btn:focus-visible .slider {
          width: calc(100% - 6px);
        }

        .gt-book-btn .icon-arrow {
          position: absolute;
          width: 15px;
          height: 15px;
          color: #111111;
          opacity: 1;
          transform: translateX(0);
          transition: opacity 0.40s ease, transform 0.55s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .gt-book-btn:hover .icon-arrow,
        .gt-book-btn:focus-visible .icon-arrow {
          opacity: 0;
          transform: translateX(28px);
        }

        .gt-book-btn .icon-phone {
          position: absolute;
          width: 13px;
          height: 13px;
          color: #111111;
          opacity: 0;
          transform: translateX(-28px) scale(0.7);
          transition: opacity 0.45s ease 0.10s, transform 0.60s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .gt-book-btn:hover .icon-phone,
        .gt-book-btn:focus-visible .icon-phone {
          opacity: 1;
          transform: translateX(0) scale(1);
        }

        .gt-book-btn .text {
          position: absolute;
          left: 41px;
          right: 8px;
          text-align: center;
          color: #ffffff;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: -0.2px;
          white-space: nowrap;
          transition: opacity 0.35s ease, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
          z-index: 1;
        }

        .gt-book-btn:hover .text,
        .gt-book-btn:focus-visible .text {
          opacity: 0;
          transform: translateX(-10px);
        }

        @media (min-width: 640px) {
          .gt-book-btn {
            width: 156px;
            height: 36px;
            border-width: 2px;
          }

          .gt-book-btn .slider {
            left: 3px;
            top: 3px;
            bottom: 3px;
            width: 44px;
          }

          .gt-book-btn:hover .slider,
          .gt-book-btn:focus-visible .slider {
            width: calc(100% - 6px);
          }

          .gt-book-btn .icon-arrow {
            width: 18px;
            height: 18px;
          }

          .gt-book-btn .icon-phone {
            width: 15px;
            height: 15px;
          }

          .gt-book-btn .text {
            left: 52px;
            right: 10px;
            font-size: 11.5px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .gt-book-btn *,
          .gt-book-btn .slider {
            transition: none !important;
          }
        }
      `}</style>

      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        className={`gt-book-btn ${className}`.trim()}
      >
        <span className="slider">
          <svg
            className="icon-arrow"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <circle cx="6" cy="12" r="1.5" />
            <circle cx="10" cy="12" r="1.5" />
            <circle cx="14" cy="12" r="1.5" />
            <circle cx="18" cy="12" r="1.5" />
            <circle cx="14" cy="8" r="1.5" />
            <circle cx="10" cy="4" r="1.5" />
            <circle cx="14" cy="16" r="1.5" />
            <circle cx="10" cy="20" r="1.5" />
          </svg>

          <svg
            className="icon-phone"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M15.05 5 A 5 5 0 0 1 19 8.95" />
            <path d="M15.05 1 A 9 9 0 0 1 23 8.94" />
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        </span>
        <span className="text">{label}</span>
      </button>
    </>
  );
}
