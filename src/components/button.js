// src/components/ui/button.js
import 'bootstrap/dist/css/bootstrap.min.css';

export function Button({ children, onClick, className }) {
  return (
    <button
      onClick={onClick}
      className={`bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 ${className}`}
    >
      {children}
    </button>
  );
}

