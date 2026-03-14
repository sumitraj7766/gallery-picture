import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { imageService, favoriteService } from '../services/api';
import SearchBar from '../components/SearchBar';
import ImageCard from '../components/ImageCard';
import Loader from '../components/Loader';
import ImageModal from '../components/ImageModal';
import { Heart, Grid, Search as SearchIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const Gallery: React.FC = () => {
  const [images, setImages] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [view, setView] = useState<'search' | 'favorites'>('search');
  const [searchQuery, setSearchQuery] = useState('nature');
  
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    if (location.state?.showFavorites) {
      setView('favorites');
    }
  }, [location]);

  useEffect(() => {
    if (view === 'search') {
      fetchImages(searchQuery);
    } else {
      fetchFavorites();
    }
  }, [view, searchQuery]);

  const fetchImages = async (query: string) => {
    setLoading(true);
    try {
      const { data } = await imageService.search(query);
      setImages(data.hits || []);
    } catch (error) {
      console.error('Error fetching images', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data } = await favoriteService.get(user.id);
      setFavorites(data);
    } catch (error) {
      console.error('Error fetching favorites', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = async (image: any) => {
    if (!user) return;

    const isFav = favorites.some(f => (f.imageURL === (image.largeImageURL || image.imageURL)));
    
    try {
      if (isFav) {
        const fav = favorites.find(f => (f.imageURL === (image.largeImageURL || image.imageURL)));
        await favoriteService.remove(fav.id);
        setFavorites(favorites.filter(f => f.id !== fav.id));
      } else {
        const payload = {
          imageURL: image.largeImageURL || image.imageURL,
          tags: image.tags
        };
        const { data } = await favoriteService.add(payload);
        setFavorites([...favorites, { ...payload, id: data.id }]);
      }
    } catch (error) {
      console.error('Error toggling favorite', error);
    }
  };

  const handleDownload = async (url: string) => {
    try {
      await imageService.trackDownload(url);
      
      // Actual download logic
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `pixabay-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Error downloading image', error);
    }
  };

  const isImageFavorite = (image: any) => {
    return favorites.some(f => f.imageURL === (image.largeImageURL || image.imageURL));
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <div className="flex bg-zinc-900 p-1 rounded-2xl border border-white/5">
          <button 
            onClick={() => setView('search')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${view === 'search' ? 'bg-emerald-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <SearchIcon size={18} />
            <span className="font-bold">Explore</span>
          </button>
          <button 
            onClick={() => setView('favorites')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${view === 'favorites' ? 'bg-emerald-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <Heart size={18} />
            <span className="font-bold">My Favorites</span>
          </button>
        </div>

        {view === 'search' && (
          <div className="w-full md:w-auto">
            <SearchBar onSearch={(q) => setSearchQuery(q)} />
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div 
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Loader />
          </motion.div>
        ) : (
          <motion.div 
            key={view}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {view === 'search' ? (
              images.length > 0 ? (
                images.map((img) => (
                  <ImageCard 
                    key={img.id} 
                    image={img} 
                    onFavorite={handleFavorite}
                    onDownload={handleDownload}
                    onPreview={setSelectedImage}
                    isFavorite={isImageFavorite(img)}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-20 text-zinc-500">
                  No images found for "{searchQuery}"
                </div>
              )
            ) : (
              favorites.length > 0 ? (
                favorites.map((fav) => (
                  <ImageCard 
                    key={fav.id} 
                    image={fav} 
                    onFavorite={handleFavorite}
                    onDownload={handleDownload}
                    onPreview={setSelectedImage}
                    isFavorite={true}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-20">
                  <Heart className="mx-auto text-zinc-800 mb-4" size={64} />
                  <p className="text-zinc-500 text-lg">You haven't saved any favorites yet.</p>
                  <button 
                    onClick={() => setView('search')}
                    className="mt-6 text-emerald-500 hover:underline font-bold"
                  >
                    Go explore some images
                  </button>
                </div>
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <ImageModal 
        image={selectedImage} 
        onClose={() => setSelectedImage(null)} 
        onDownload={handleDownload}
        onFavorite={handleFavorite}
        isFavorite={selectedImage ? isImageFavorite(selectedImage) : false}
      />
    </div>
  );
};

export default Gallery;
