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
  const [imgDimensions, setImgDimensions] = useState({ width: 0, height: 0 }); // Menyimpan rasio asli gambar
  
  // State untuk teks stiker & Warna
  const [text, setText] = useState('');
  const [textColor, setTextColor] = useState('#FFFFFF'); // Default putih
  const [textPos, setTextPos] = useState({ x: 50, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const dragStartPos = useRef({ x: 0, y: 0 });

  const presetColors = ['#FFFFFF', '#000000', '#FF3B30', '#FFCC00', '#34C759', '#007AFF'];

  useEffect(() => {
    if (!isOpen) {
      setFile(null); setFileType(''); setPreviewUrl(null); setText(''); setTextColor('#FFFFFF');
      setTextPos({ x: 50, y: 50 }); setIsProcessing(false); setImgDimensions({ width: 0, height: 0 });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const isVideo = selectedFile.type.startsWith('video/');
    setFileType(isVideo ? 'video' : 'image');
    setFile(selectedFile);
    
    const objUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objUrl);

    // Dapatkan dimensi asli gambar untuk kalkulasi presisi canvas
    if (!isVideo) {
      const img = new Image();
      img.onload = () => setImgDimensions({ width: img.width, height: img.height });
      img.src = objUrl;
    }
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
    
    const rect = containerRef.current.getBoundingClientRect();
    let newX = clientX - dragStartPos.current.x;
    let newY = clientY - dragStartPos.current.y;
    
    newX = Math.max(0, Math.min(newX, rect.width - 20));
    newY = Math.max(0, Math.min(newY, rect.height - 20));

    setTextPos({ x: newX, y: newY });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleCreateSticker = async () => {
    setIsProcessing(true);
    
    if (fileType === 'image') {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.src = previewUrl;
      
      img.onload = () => {
        const MAX_SIZE = 512; 
        let newWidth = img.width;
        let newHeight = img.height;
        
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
        ctx.drawImage(img, 0, 0, newWidth, newHeight);
        
        // --- RUMUS MATEMATIKA PRESISI CANVAS VS OBJECT-CONTAIN ---
        const rect = containerRef.current.getBoundingClientRect();
        const containerRatio = rect.width / rect.height;
        const imageRatio = newWidth / newHeight;
        
        let renderedWidth, renderedHeight, offsetX = 0, offsetY = 0;

        if (imageRatio > containerRatio) {
          renderedWidth = rect.width;
          renderedHeight = rect.width / imageRatio;
          offsetY = (rect.height - renderedHeight) / 2;
        } else {
          renderedHeight = rect.height;
          renderedWidth = rect.height * imageRatio;
          offsetX = (rect.width - renderedWidth) / 2;
        }

        // KALIBRASI: CSS text-2xl = 24px, padding px-1 = 4px.
        const padding = 4;
        const relativeX = (textPos.x + padding) - offsetX;
        const relativeY = (textPos.y + padding) - offsetY;

        // Skalakan ke resolusi canvas
        const scale = newWidth / renderedWidth;
        const canvasX = relativeX * scale;
        const canvasY = relativeY * scale;
        
        // Font wajib disamakan dengan text-2xl (24px)
        ctx.font = `bold ${24 * scale}px sans-serif`;
        ctx.fillStyle = textColor; 
        ctx.strokeStyle = textColor === '#000000' ? 'white' : 'black'; 
        ctx.lineWidth = 4 * scale;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top'; 
        
        if (text) {
          ctx.strokeText(text, canvasX, canvasY);
          ctx.fillText(text, canvasX, canvasY);
        }
        
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
      
      <div className={`${colors.panel} border ${colors.border} rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden flex flex-col`} onClick={(e) => e.stopPropagation()}>
        
        <div className={`p-5 border-b ${colors.border} flex justify-between items-center bg-transparent`}>
          <h3 className={`font-bold text-lg ${colors.text}`}>Buat Stiker Kustom</h3>
          <button onClick={onClose} className={`p-1.5 rounded-full ${colors.hoverBg} text-gray-500 transition-colors`}>
            <CloseIcon />
          </button>
        </div>

        <div className={`p-6 flex-1 flex flex-col items-center justify-center gap-4 bg-transparent ${colors.text}`}>
          {!file ? (
            <div className={`w-full h-64 border-2 border-dashed ${colors.border} rounded-[1.5rem] flex flex-col items-center justify-center hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer relative transition-all`}>
              <input type="file" accept="image/*,video/mp4" onChange={handleFileSelect} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              <p className="font-bold opacity-70">Pilih Foto atau Video</p>
              <p className="text-xs opacity-50 mt-2">Maksimal 5 detik untuk Video</p>
            </div>
          ) : (
            <>
              <div ref={containerRef} className="relative w-full h-64 bg-black/20 rounded-[1.5rem] overflow-hidden shadow-inner touch-none border border-white/10">
                {fileType === 'image' ? (
                  <img src={previewUrl} className="w-full h-full object-contain pointer-events-none" alt="Preview" />
                ) : (
                  <video ref={videoRef} src={previewUrl} autoPlay loop muted className="w-full h-full object-contain pointer-events-none" />
                )}

                {text && (
                  <div 
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleMouseDown}
                    className="absolute cursor-move px-1 py-1 select-none font-bold text-2xl"
                    style={{ 
                      left: `${textPos.x}px`, 
                      top: `${textPos.y}px`, 
                      color: textColor,
                      textShadow: textColor === '#000000' 
                         ? '-1px -1px 0 #FFF, 1px -1px 0 #FFF, -1px 1px 0 #FFF, 1px 1px 0 #FFF'
                         : '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000'
                    }}
                  >
                    {text}
                  </div>
                )}
              </div>

              <div className="w-full space-y-4">
                <input 
                  type="text" 
                  value={text} 
                  onChange={(e) => setText(e.target.value)} 
                  placeholder="Ketik teks (geser teks di atas)..." 
                  className={`w-full p-4 rounded-xl ${colors.inputBg} border ${colors.border} outline-none text-sm font-medium focus:border-[#78C951] focus:ring-1 focus:ring-[#78C951] transition-all`} 
                />
                
                {/* Palet Warna Teks */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                  <span className="text-xs font-bold opacity-70 mr-2">Warna:</span>
                  {presetColors.map(c => (
                    <button 
                      key={c} 
                      onClick={() => setTextColor(c)}
                      className={`w-6 h-6 rounded-full border-2 transition-transform ${textColor === c ? 'border-[#78C951] scale-125' : 'border-white/20'}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                  {/* Pilihan Warna Kustom (Native) */}
                  <div className="relative w-6 h-6 rounded-full overflow-hidden border-2 border-white/20 ml-2">
                    <input 
                      type="color" 
                      value={textColor} 
                      onChange={(e) => setTextColor(e.target.value)} 
                      className="absolute -top-2 -left-2 w-10 h-10 cursor-pointer"
                    />
                  </div>
                </div>
                
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setFile(null)} className={`flex-1 p-3.5 rounded-xl ${colors.inputBg} border ${colors.border} font-bold text-sm transition-colors`}>Ganti</button>
                  <button onClick={handleCreateSticker} disabled={isProcessing} className={`flex-1 p-3.5 rounded-xl ${colors.primary} font-bold text-sm shadow-lg transition-all disabled:opacity-50`}>
                    {isProcessing ? '...' : 'Kirim Stiker'}
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