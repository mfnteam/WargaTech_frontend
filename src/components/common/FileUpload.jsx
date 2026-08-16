import { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';

export default function FileUpload({ onFileSelect, accept = 'image/*', maxSizeMB = 5, preview = null }) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [filePreview, setFilePreview] = useState(preview);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');

  const handleFile = (file) => {
    setError('');
    if (!file) return;

    const maxBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      setError(`Ukuran file maksimal ${maxSizeMB}MB`);
      return;
    }

    if (accept === 'image/*' && !file.type.startsWith('image/')) {
      setError('File harus berupa gambar');
      return;
    }

    setFileName(file.name);
    onFileSelect(file);

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setFilePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleClear = () => {
    setFilePreview(null);
    setFileName('');
    setError('');
    onFileSelect(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="w-full">
      <div
        className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 ${
          filePreview
            ? 'border-emerald-300 bg-emerald-50/40'
            : dragOver
            ? 'border-orange-500 bg-orange-50/80 scale-[1.01]'
            : 'border-gray-200 bg-gray-50/70 hover:border-orange-400 hover:bg-orange-50/30'
        }`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={(e) => handleFile(e.target.files[0])}
          className="hidden"
        />

        {filePreview ? (
          <div className="relative inline-block my-1">
            <img
              src={filePreview}
              alt="Preview"
              className="max-h-48 rounded-xl border border-gray-200 shadow-sm object-cover"
            />
            <button
              type="button"
              className="absolute -top-3 -right-3 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-md transition-transform hover:scale-110"
              onClick={(e) => { e.stopPropagation(); handleClear(); }}
              aria-label="Hapus file"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-4">
            <div className="w-12 h-12 rounded-full bg-orange-100/80 text-orange-600 flex items-center justify-center mb-3">
              <Upload size={22} />
            </div>
            <p className="text-sm font-semibold text-gray-700 mb-1">
              Klik atau drag & drop file di sini
            </p>
            <p className="text-xs text-gray-400">
              {accept === 'image/*' ? 'Format PNG, JPG, JPEG' : accept} • Maksimal {maxSizeMB}MB
            </p>
          </div>
        )}
      </div>

      {fileName && !error && (
        <p className="mt-2 text-xs font-medium text-emerald-600 flex items-center gap-1">
          ✓ {fileName}
        </p>
      )}

      {error && (
        <p className="mt-2 text-xs font-medium text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}
