import React from 'react';
import { X, Download, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ImageModalProps {
  image: any;
  onClose: () => void;
  onDownload: (url: string) => void;
  onFavorite: (image: any) => void;
  isFavorite?: boolean;
}

const ImageModal: React.FC<ImageModalProps> = ({ image, onClose, onDownload, onFavorite, isFavorite }) => {
  if (!image) return null;

  const imageUrl = image.largeImageURL || image.imageURL;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative max-w-6xl w-full max-h-full bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors"
          >
            <X size={24} />
          </button>

          <div className="flex-1 bg-black flex items-center justify-center overflow-hidden">
            <img 
              src={imageUrl} 
              alt={image.tags}
              className="max-w-full max-h-[70vh] md:max-h-[85vh] object-contain"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="w-full md:w-80 p-8 flex flex-col justify-between bg-zinc-900">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Image Details</h3>
              <div className="space-y-4 mt-6">
                <div>
                  <p className="text-zinc-500 text-xs uppercase tracking-wider font-bold">Tags</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {image.tags?.split(',').map((tag: string) => (
                      <span key={tag} className="px-3 py-1 bg-zinc-800 text-zinc-300 rounded-full text-xs">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-zinc-500 text-xs uppercase tracking-wider font-bold">Author</p>
                  <p className="text-white mt-1">{image.user || 'Unknown'}</p>
                </div>
                {image.views && (
                  <div>
                    <p className="text-zinc-500 text-xs uppercase tracking-wider font-bold">Stats</p>
                    <p className="text-zinc-300 text-sm mt-1">{image.views.toLocaleString()} views • {image.downloads?.toLocaleString()} downloads</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-8">
              <button 
                onClick={() => onFavorite(image)}
                className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold transition-all ${isFavorite ? 'bg-red-500 text-white' : 'bg-zinc-800 text-white hover:bg-zinc-700'}`}
              >
                <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
                {isFavorite ? 'Saved to Favorites' : 'Add to Favorites'}
              </button>
              <button 
                onClick={() => onDownload(imageUrl)}
                className="w-full flex items-center justify-center gap-2 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold transition-all shadow-lg shadow-emerald-500/20"
              >
                <Download size={20} />
                Download Image
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ImageModal;
