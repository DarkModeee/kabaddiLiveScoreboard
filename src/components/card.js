// src/components/ui/card.js
import 'bootstrap/dist/css/bootstrap.min.css';

export function Card({ children, className }) {
  return (
    <div className={`bg-white p-4 shadow-lg rounded-md ${className}`}>
      {children}
    </div>
  );
}
