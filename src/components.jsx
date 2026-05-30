// src/components.jsx


// Modal Wrapper Minimalis (Glassmorphism)
export const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#18181b] border border-[#27272a] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        <div className="p-5 border-b border-[#27272a] flex justify-between items-center">
          <h3 className="font-semibold text-[#e4e4e7] tracking-tight">{title}</h3>
          <button onClick={onClose} className="text-[#a1a1aa] hover:text-white transition">✕</button>
        </div>
        <div className="p-5 flex-1">{children}</div>
      </div>
    </div>
  );
};

// Avatar Komponen Universal
export const Avatar = ({ url, name, size = 'w-10 h-10', className = '' }) => {
  return url ? (
    <img src={url} alt={name} className={`${size} rounded-full object-cover border border-[#27272a] shadow-sm ${className}`} />
  ) : (
    <div className={`${size} rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 flex items-center justify-center font-semibold text-white shadow-sm border border-[#27272a] ${className}`}>
      {name?.charAt(0).toUpperCase() || '?'}
    </div>
  );
};