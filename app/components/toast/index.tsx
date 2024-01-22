import React, { useState, useEffect } from "react";

type YourToastProps = {
  message: string;
  description?: string;
  type: string;
  onClose: () => void;
};

export const ToastComponent: React.FC<YourToastProps> = ({
  message,
  description,
  type,
  onClose,
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    visible && (
      <div
        className={`fixed -right-5 -top-72 z-10 flex flex-col rounded-xl border border-gray-200 bg-white p-5 text-[#03091D] shadow-xl transition-all ${type}`}
      >
        <div className="flex items-center gap-4 text-2xl">
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.2166 37.9154C7.5166 37.9154 6.8666 37.7487 6.28327 37.4154C4.99993 36.6654 4.2666 35.1487 4.2666 33.2654V9.76537C4.2666 5.53203 7.7166 2.08203 11.9499 2.08203H28.0333C32.2666 2.08203 35.7166 5.53203 35.7166 9.76537V33.2487C35.7166 35.132 34.9833 36.6487 33.6999 37.3987C32.4166 38.1487 30.7333 38.0654 29.0833 37.1487L20.9499 32.632C20.4666 32.3654 19.5166 32.3654 19.0333 32.632L10.8999 37.1487C9.99993 37.6487 9.08327 37.9154 8.2166 37.9154ZM11.9666 4.58203C9.1166 4.58203 6.78327 6.91536 6.78327 9.76537V33.2487C6.78327 34.232 7.0666 34.9654 7.5666 35.2487C8.0666 35.532 8.84994 35.4487 9.69993 34.9654L17.8333 30.4487C19.0666 29.7654 20.9333 29.7654 22.1666 30.4487L30.2999 34.9654C31.1499 35.4487 31.9333 35.5487 32.4333 35.2487C32.9333 34.9487 33.2166 34.2154 33.2166 33.2487V9.76537C33.2166 6.91536 30.8833 4.58203 28.0333 4.58203H11.9666Z"
              fill="#292D32"
            />
            <path
              d="M18.4831 22.0844C18.1665 22.0844 17.8498 21.9677 17.5998 21.7177L15.0998 19.2177C14.6165 18.7344 14.6165 17.9344 15.0998 17.451C15.5831 16.9677 16.3831 16.9677 16.8665 17.451L18.4831 19.0677L24.2665 13.2844C24.7498 12.801 25.5498 12.801 26.0331 13.2844C26.5165 13.7677 26.5165 14.5677 26.0331 15.051L19.3665 21.7177C19.1165 21.9677 18.7998 22.0844 18.4831 22.0844Z"
              fill="#292D32"
            />
          </svg>
          {message}
        </div>
        <div className="mt-2 text-sm text-[#747682]">{description}</div>
      </div>
    )
  );
};
