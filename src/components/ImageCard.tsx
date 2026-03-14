import React from 'react';
import { Heart, Download, Maximize2 } from 'lucide-react';
import { motion } from 'motion/react';

interface ImageCardProps {
  image: any;
  onFavorite: (image: any) => void;
  onDownload: (url: string) => void;
  onPreview: (image: any) => void;
  isFavorite?: boolean;
}

const ImageCard: React.FC<ImageCardProps> = ({ image, onFavorite, onDownload, onPreview, isFavorite }) => {
  const imageUrl = image.largeImageURL || image.imageURL;
  const tags = image.tags || '';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="relative group bg-zinc-900 rounded-2xl overflow-hidden border border-white/5 shadow-xl"
    >
      <img 
        src={image.webformatURL || image.imageURL} 
        alt={tags}
        className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-110"
        referrerPolicy="no-referrer"
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4">
        <div className="flex justify-end gap-2">
          <button 
            onClick={() => onFavorite(image)}
            className={`p-2 rounded-full backdrop-blur-md transition-colors ${isFavorite ? 'bg-red-500 text-white' : 'bg-white/10 text-white hover:bg-red-500'}`}
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
          </button>
          <button 
            onClick={() => onPreview(image)}
            className="p-2 rounded-full bg-white/10 text-white hover:bg-emerald-500 backdrop-blur-md transition-colors"
            title="Preview"
          >
            <Maximize2 size={20} />
          </button>
        </div>

        <div className="flex justify-between items-end">
          <div className="flex-1 mr-4">
            <p className="text-white text-sm font-medium line-clamp-1">{tags}</p>
            <p className="text-zinc-400 text-xs mt-1">by {image.user || 'Unknown'}</p>
          </div>
          <button 
            onClick={() => onDownload(imageUrl)}
            className="p-3 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 transition-colors shadow-lg"
            title="Download"
          >
            <Download size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ImageCard;
