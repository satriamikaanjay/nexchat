import React, { useState, useRef, useEffect } from 'react';

// Ikon tambahan khusus pembuat stiker
const CloseIcon = () => (
  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export default function StickerMaker({ isOpen, onClose, onSendSticker, colors }) {
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState(''); // 'image' atau 'video'
  const [previewUrl, setPreviewUrl] = useState(null);
  
  // State untuk teks stiker
  const [text, setText] = useState('');
  const [textPos, setTextPos] = useState({ x: 50, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const dragStartPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!isOpen) {
      // Reset state saat modal ditutup
      setFile(null); setFileType(''); setPreviewUrl(null); setText('');
      setTextPos({ x: 50, y: 50 }); setIsProcessing(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const isVideo = selectedFile.type.startsWith('video/');
    setFileType(isVideo ? 'video' : 'image');
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
  };

  // Logika Drag & Drop Text
  const handleMouseDown = (e) => {
    setIsDragging(true);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    dragStartPos.current = { x: clientX - textPos.x, y: clientY - textPos.y };
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !containerRef.current) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    // Batasi area drag di dalam container
    const rect = containerRef.current.getBoundingClientRect();
    let newX = clientX - dragStartPos.current.x;
    let newY = clientY - dragStartPos.current.y;
    
    // Boundary check sederhana
    newX = Math.max(0, Math.min(newX, rect.width - 50));
    newY = Math.max(0, Math.min(newY, rect.height - 30));

    setTextPos({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Limit Video Duration & Konversi
  const handleVideoLoaded = () => {
    if (videoRef.current && videoRef.current.duration > 5) {
      alert("Video terlalu panjang! Akan dipotong menjadi 5 detik pertama untuk dijadikan GIF.");
      // Logika pemotongan video (UI-only mockup)
    }
  };

  const handleCreateSticker = async () => {
    setIsProcessing(true);
    
    if (fileType === 'image') {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.src = previewUrl;
      
      img.onload = () => {
        // --- LOGIKA KOMPRESI & RESIZE ---
        const MAX_SIZE = 512; // Standar ukuran maksimal stiker
        let newWidth = img.width;
        let newHeight = img.height;
        
        // Menjaga rasio (aspect ratio) gambar saat di-resize
        if (newWidth > MAX_SIZE || newHeight > MAX_SIZE) {
          if (newWidth > newHeight) {
            newHeight = Math.round((newHeight * MAX_SIZE) / newWidth);
            newWidth = MAX_SIZE;
          } else {
            newWidth = Math.round((newWidth * MAX_SIZE) / newHeight);
            newHeight = MAX_SIZE;
          }
        }
        
        canvas.width = newWidth;
        canvas.height = newHeight;
        
        // Gambar ulang image dengan ukuran yang sudah dikompres
        ctx.drawImage(img, 0, 0, newWidth, newHeight);
        
        // Kalkulasi posisi skala teks terhadap gambar yang sudah di-resize
        const rect = containerRef.current.getBoundingClientRect();
        const scaleX = newWidth / rect.width;
        const scaleY = newHeight / rect.height;
        
        ctx.font = `bold ${32 * scaleX}px sans-serif`;
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 4 * scaleX;
        ctx.textAlign = 'center';
        
        // Menggambar teks jika ada
        if (text) {
          ctx.strokeText(text, textPos.x * scaleX, (textPos.y + 24) * scaleY);
          ctx.fillText(text, textPos.x * scaleX, (textPos.y + 24) * scaleY);
        }
        
        // --- EXPORT KE WEBP DENGAN KUALITAS 80% ---
        // Parameter ketiga '0.8' adalah kualitas gambar (0.0 sampai 1.0)
        canvas.toBlob((blob) => {
          const finalFile = new File([blob], `sticker-${Date.now()}.webp`, { type: 'image/webp' });
          onSendSticker(finalFile, 'image');
          onClose();
        }, 'image/webp', 0.8);
      };
    } else if (fileType === 'video') {
      onSendSticker(file, 'video_to_gif', text);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200"
         onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onTouchMove={handleMouseMove} onTouchEnd={handleMouseUp}>
      
      <div className={`${colors.panel} border ${colors.border} rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col`}>
        
        {/* Header Modal */}
        <div className={`p-4 border-b ${colors.border} flex justify-between items-center ${colors.base}`}>
          <h3 className={`font-bold text-lg ${colors.text}`}>Buat Stiker Kustom</h3>
          <button onClick={onClose} className={`p-1.5 rounded-full ${colors.hoverBg} text-gray-500 transition-colors`}>
            <CloseIcon />
          </button>
        </div>

        {/* Konten */}
        <div className={`p-5 flex-1 flex flex-col items-center justify-center gap-4 ${colors.text}`}>
          {!file ? (
            <div className={`w-full h-64 border-2 border-dashed ${colors.border} rounded-xl flex flex-col items-center justify-center hover:bg-gray-50/5 cursor-pointer relative transition-all`}>
              <input type="file" accept="image/*,video/mp4" onChange={handleFileSelect} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              <p className="font-bold text-gray-400">Pilih Foto atau Video</p>
              <p className="text-xs text-gray-500 mt-2">Maksimal 5 detik untuk Video</p>
            </div>
          ) : (
            <>
              {/* Preview Container tempat drag & drop berlaku */}
              <div ref={containerRef} className="relative w-full h-64 bg-black rounded-xl overflow-hidden shadow-inner touch-none">
                {fileType === 'image' ? (
                  <img src={previewUrl} className="w-full h-full object-contain pointer-events-none" alt="Preview" />
                ) : (
                  <video ref={videoRef} src={previewUrl} onLoadedMetadata={handleVideoLoaded} autoPlay loop muted className="w-full h-full object-contain pointer-events-none" />
                )}

                {/* Teks Stiker yang bisa di-drag */}
                {text && (
                  <div 
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleMouseDown}
                    className="absolute cursor-move px-2 py-1 select-none font-bold text-white text-2xl drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]"
                    style={{ left: `${textPos.x}px`, top: `${textPos.y}px`, textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000' }}
                  >
                    {text}
                  </div>
                )}
              </div>

              {/* Input Teks & Kontrol */}
              <div className="w-full space-y-3">
                <input 
                  type="text" 
                  value={text} 
                  onChange={(e) => setText(e.target.value)} 
                  placeholder="Tambahkan teks stiker (bisa digeser)..." 
                  className={`w-full p-3 rounded-xl ${colors.inputBg} border ${colors.border} outline-none text-sm focus:ring-2 focus:ring-[#00a884] transition-all`} 
                />
                
                <div className="flex gap-2">
                  <button onClick={() => setFile(null)} className={`flex-1 p-3 rounded-xl ${colors.inputBg} border ${colors.border} font-bold text-sm transition-colors`}>Ganti Media</button>
                  <button onClick={handleCreateSticker} disabled={isProcessing} className={`flex-1 p-3 rounded-xl bg-[#00a884] text-white font-bold text-sm hover:bg-[#008f6f] transition-all disabled:opacity-50 disabled:cursor-not-allowed`}>
                    {isProcessing ? 'Memproses...' : 'Kirim Stiker'}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}