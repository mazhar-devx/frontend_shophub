import { useState, useEffect, useRef } from "react";
import api from "../../services/api";
import { toast } from "react-hot-toast";
import { getProductImageUrl } from "../../utils/constants";

export default function AdminBanner() {
  const [loading, setLoading] = useState(true);
  const heroFileRef = useRef(null);
  const heroImagesRef = useRef(null);
  const heroVideoRef = useRef(null);
  const flashSaleFileRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    price: '',
    image: '',
    images: [],
    video: '',
    buttonText: '',
    buttonLink: '',
    productUrl: ''
  });
  const [flashSaleData, setFlashSaleData] = useState({
    title: '',
    subtitle: '',
    price: '',
    originalPrice: '',
    image: '',
    productUrl: '',
    endTime: ''
  });

  const [heroFile, setHeroFile] = useState(null);
  const [heroImages, setHeroImages] = useState([]);
  const [heroVideo, setHeroVideo] = useState(null);
  const [flashSaleFile, setFlashSaleFile] = useState(null);
  const [heroPreview, setHeroPreview] = useState(null);
  const [heroImagesPreviews, setHeroImagesPreviews] = useState([]);
  const [heroVideoPreview, setHeroVideoPreview] = useState(null);
  const [flashSalePreview, setFlashSalePreview] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await api.get('/settings');
      if (data.status === 'success' && data.data.settings?.hero) {
        setFormData(data.data.settings.hero);
        if (data.data.settings.flashSale) {
            setFlashSaleData(data.data.settings.flashSale);
        }
      }
      setLoading(false);
    } catch (error) {
      toast.error("Failed to load settings");
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFlashSaleChange = (e) => {
    const { name, value } = e.target;
    setFlashSaleData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e, type) => {
    if (e.target.files && e.target.files[0]) {
      if (type === 'heroImages') {
        const files = Array.from(e.target.files);
        setHeroImages(prev => [...prev, ...files]);
        const previews = files.map(file => URL.createObjectURL(file));
        setHeroImagesPreviews(prev => [...prev, ...previews]);
        return;
      }

      const file = e.target.files[0];
      const preview = URL.createObjectURL(file);
      
      if (type === 'hero') {
        setHeroFile(file);
        setHeroPreview(preview);
      } else if (type === 'heroVideo') {
        setHeroVideo(file);
        setHeroVideoPreview(preview);
      } else {
        setFlashSaleFile(file);
        setFlashSalePreview(preview);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      
      // Append JSON data as strings
      data.append('hero', JSON.stringify(formData));
      data.append('flashSale', JSON.stringify(flashSaleData));

      // Append files
      if (heroFile) {
        data.append('heroImage', heroFile);
      }
      if (heroImages && heroImages.length > 0) {
        heroImages.forEach(img => data.append('heroImages', img));
      }
      if (heroVideo) {
        data.append('heroVideo', heroVideo);
      }
      if (flashSaleFile) {
        data.append('flashSaleImage', flashSaleFile);
      }

      await api.patch('/settings', data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
      });
      
      toast.success("Settings Updated!");
    } catch (error) {
      toast.error("Failed to update banner");
      console.error(error);
    }
  };

  if (loading) {
    return <div className="text-primary dark:text-white">Loading...</div>;
  }

  const currentHeroImage = heroPreview || getProductImageUrl(formData.image);
  const currentFlashSaleImage = flashSalePreview || getProductImageUrl(flashSaleData.image);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold text-primary dark:text-white mb-2">Banner & Hero Settings</h1>
            <p className="text-gray-600 dark:text-gray-500 dark:text-gray-400">Customize the visual appearance of your homepage.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Main Hero Section */}
        <section className="glass p-8 rounded-2xl border border-black/5 dark:border-white/10 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
             
             <h2 className="text-xl font-bold text-primary dark:text-white mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
                Main Hero Banner
             </h2>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-gray-600 dark:text-gray-500 dark:text-gray-400 text-sm font-bold ml-1">Main Title</label>
                        <input 
                            type="text" 
                            name="title"
                            value={formData.title} 
                            onChange={handleChange}
                            className="w-full bg-black/30 border border-black/5 dark:border-white/10 rounded-xl px-4 py-3 text-primary dark:text-white focus:outline-none focus:border-purple-500 transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-gray-600 dark:text-gray-500 dark:text-gray-400 text-sm font-bold ml-1">Subtitle</label>
                        <input 
                            type="text" 
                            name="subtitle"
                            value={formData.subtitle} 
                            onChange={handleChange}
                            className="w-full bg-black/30 border border-black/5 dark:border-white/10 rounded-xl px-4 py-3 text-primary dark:text-white focus:outline-none focus:border-purple-500 transition-all"
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-gray-600 dark:text-gray-500 dark:text-gray-400 text-sm font-bold ml-1">Price Tag</label>
                            <input 
                                type="text" 
                                name="price"
                                value={formData.price} 
                                onChange={handleChange}
                                className="w-full bg-black/30 border border-black/5 dark:border-white/10 rounded-xl px-4 py-3 text-primary dark:text-white focus:outline-none focus:border-purple-500 transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-gray-600 dark:text-gray-500 dark:text-gray-400 text-sm font-bold ml-1">Button Text</label>
                            <input 
                                type="text" 
                                name="buttonText"
                                value={formData.buttonText} 
                                onChange={handleChange}
                                className="w-full bg-black/30 border border-black/5 dark:border-white/10 rounded-xl px-4 py-3 text-primary dark:text-white focus:outline-none focus:border-purple-500 transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-gray-600 dark:text-gray-500 dark:text-gray-400 text-sm font-bold ml-1">Button Link</label>
                        <input 
                            type="text" 
                            name="buttonLink"
                            value={formData.buttonLink} 
                            onChange={handleChange}
                            className="w-full bg-black/30 border border-black/5 dark:border-white/10 rounded-xl px-4 py-3 text-primary dark:text-white focus:outline-none focus:border-purple-500 transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-gray-600 dark:text-gray-500 dark:text-gray-400 text-sm font-bold ml-1">Product URL (Direct Shop)</label>
                        <input 
                            type="text" 
                            name="productUrl"
                            value={formData.productUrl || ''} 
                            onChange={handleChange}
                            placeholder="e.g. /product/645..."
                            className="w-full bg-black/30 border border-black/5 dark:border-white/10 rounded-xl px-4 py-3 text-primary dark:text-white focus:outline-none focus:border-purple-500 transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-gray-600 dark:text-gray-500 dark:text-gray-400 text-sm font-bold ml-1">Background Image</label>
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                name="image"
                                value={formData.image} 
                                onChange={handleChange}
                                placeholder="Image URL..."
                                className="flex-1 bg-black/30 border border-black/5 dark:border-white/10 rounded-xl px-4 py-3 text-primary dark:text-white focus:outline-none focus:border-purple-500 transition-all"
                            />
                            <button 
                                type="button" 
                                onClick={() => heroFileRef.current?.click()}
                                className="px-4 py-2 bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:bg-white/20 text-primary dark:text-white rounded-xl border border-black/5 dark:border-white/10 transition-colors"
                            >
                                📂 Upload
                            </button>
                            <input 
                                type="file" 
                                ref={heroFileRef} 
                                className="hidden" 
                                onChange={(e) => handleFileChange(e, 'hero')} 
                                accept="image/*"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-gray-600 dark:text-gray-500 dark:text-gray-400 text-sm font-bold ml-1">Hero Slideshow (Multiple Images)</label>
                        <div className="flex gap-2 mb-2">
                            <button 
                                type="button" 
                                onClick={() => heroImagesRef.current?.click()}
                                className="px-4 py-2 bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:bg-white/20 text-primary dark:text-white rounded-xl border border-black/5 dark:border-white/10 transition-colors"
                            >
                                📂 Add Images
                            </button>
                            <input 
                                type="file" 
                                ref={heroImagesRef} 
                                className="hidden" 
                                onChange={(e) => handleFileChange(e, 'heroImages')} 
                                accept="image/*"
                                multiple
                            />
                        </div>

                        {/* Existing Images Previews */}
                        {(formData.images?.length > 0 || heroImagesPreviews.length > 0) && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {formData.images?.map((imgUrl, idx) => (
                                    <div key={`existing-${idx}`} className="relative w-16 h-16 rounded overflow-hidden border border-black/10 dark:border-white/10 group">
                                        <img src={getProductImageUrl(imgUrl)} alt="Slider Image" className="w-full h-full object-cover" />
                                        <button 
                                            type="button"
                                            onClick={() => {
                                                const newImages = [...formData.images];
                                                newImages.splice(idx, 1);
                                                setFormData({...formData, images: newImages});
                                            }}
                                            className="absolute top-0 right-0 bg-red-500 text-white p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                    </div>
                                ))}
                                {heroImagesPreviews.map((previewUrl, idx) => (
                                    <div key={`new-${idx}`} className="relative w-16 h-16 rounded overflow-hidden border border-cyan-500 group">
                                        <img src={previewUrl} alt="New Slider Image" className="w-full h-full object-cover" />
                                        <button 
                                            type="button"
                                            onClick={() => {
                                                const newPreviews = [...heroImagesPreviews];
                                                newPreviews.splice(idx, 1);
                                                setHeroImagesPreviews(newPreviews);
                                                
                                                const newFiles = [...heroImages];
                                                newFiles.splice(idx, 1);
                                                setHeroImages(newFiles);
                                            }}
                                            className="absolute top-0 right-0 bg-red-500 text-white p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                        <span className="absolute bottom-0 inset-x-0 bg-cyan-500 text-white text-[8px] text-center font-bold">NEW</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-gray-600 dark:text-gray-500 dark:text-gray-400 text-sm font-bold ml-1">Hero Video (Optional)</label>
                        <div className="flex gap-2">
                             <input 
                                type="text" 
                                name="video"
                                value={formData.video || ''} 
                                onChange={handleChange}
                                placeholder="Video URL..."
                                className="flex-1 bg-black/30 border border-black/5 dark:border-white/10 rounded-xl px-4 py-3 text-primary dark:text-white focus:outline-none focus:border-purple-500 transition-all"
                            />
                            <button 
                                type="button" 
                                onClick={() => heroVideoRef.current?.click()}
                                className="px-4 py-2 bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:bg-white/20 text-primary dark:text-white rounded-xl border border-black/5 dark:border-white/10 transition-colors"
                            >
                                🎥 Upload
                            </button>
                            <input 
                                type="file" 
                                ref={heroVideoRef} 
                                className="hidden" 
                                onChange={(e) => handleFileChange(e, 'heroVideo')} 
                                accept="video/*"
                            />
                        </div>
                    </div>
                </div>

                {/* Preview */}
                <div className="relative rounded-2xl overflow-hidden h-96 border border-black/5 dark:border-white/10 flex items-center justify-center bg-gray-50 dark:bg-black group">
                    {heroVideoPreview || formData.video ? (
                        <video 
                            src={heroVideoPreview || getProductImageUrl(formData.video)} 
                            className="absolute inset-0 w-full h-full object-cover opacity-60"
                            autoPlay muted loop
                        />
                    ) : currentHeroImage ? (
                        <img src={currentHeroImage} className="absolute inset-0 w-full h-full object-cover opacity-50 transition-transform group-hover:scale-105 duration-700" alt="Preview"/>
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 to-black opacity-50"></div>
                    )}
                    
                    <div className="relative z-10 text-center p-6 w-full">
                        <h2 className="text-3xl font-black text-primary dark:text-white mb-2 leading-tight">{formData.title || "Title"}</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">{formData.subtitle || "Subtitle"}</p>
                        {heroImagesPreviews.length > 0 && (
                            <div className="flex justify-center gap-1 mb-4">
                                {heroImagesPreviews.map((p, i) => (
                                    <div key={i} className="w-2 h-2 rounded-full bg-white/40"></div>
                                ))}
                            </div>
                        )}
                        <div className="inline-block px-6 py-2 rounded-full border border-white/30 bg-black/10 dark:bg-white/10 backdrop-blur-md text-primary dark:text-white font-bold mb-4">
                            {formData.price || "Price"}
                        </div>
                        <div>
                             <span className="inline-block text-sm font-bold border-b border-transparent hover:border-white transition-colors cursor-pointer text-primary dark:text-white">
                                {formData.buttonText || "Button"} →
                             </span>
                        </div>
                    </div>
                    
                    <div className="absolute top-4 right-4 bg-black/10 dark:bg-black/50 backdrop-blur px-3 py-1 rounded-lg border border-black/5 dark:border-white/10 text-xs text-gray-600 dark:text-gray-500 dark:text-gray-400 font-mono">
                        HERO PREVIEW
                    </div>
                </div>
             </div>
        </section>

        {/* Flash Sale Section */}
        <section className="glass p-8 rounded-2xl border border-black/5 dark:border-white/10 relative overflow-hidden">
             <h2 className="text-xl font-bold text-primary dark:text-white mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-pink-500 rounded-full"></span>
                Flash Sale Banner
             </h2>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-gray-600 dark:text-gray-500 dark:text-gray-400 text-sm font-bold ml-1">Sale Title</label>
                        <input 
                            type="text" 
                            name="title"
                            value={flashSaleData.title} 
                            onChange={handleFlashSaleChange}
                            className="w-full bg-black/30 border border-black/5 dark:border-white/10 rounded-xl px-4 py-3 text-primary dark:text-white focus:outline-none focus:border-pink-500 transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-gray-600 dark:text-gray-500 dark:text-gray-400 text-sm font-bold ml-1">Subtitle</label>
                        <input 
                            type="text" 
                            name="subtitle"
                            value={flashSaleData.subtitle} 
                            onChange={handleFlashSaleChange}
                            className="w-full bg-black/30 border border-black/5 dark:border-white/10 rounded-xl px-4 py-3 text-primary dark:text-white focus:outline-none focus:border-pink-500 transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-gray-600 dark:text-gray-500 dark:text-gray-400 text-sm font-bold ml-1">Product URL (Direct Shop/Cart)</label>
                        <input 
                            type="text" 
                            name="productUrl"
                            value={flashSaleData.productUrl || ''} 
                            onChange={handleFlashSaleChange}
                            placeholder="e.g. /product/645..."
                            className="w-full bg-black/30 border border-black/5 dark:border-white/10 rounded-xl px-4 py-3 text-primary dark:text-white focus:outline-none focus:border-pink-500 transition-all"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-gray-600 dark:text-gray-500 dark:text-gray-400 text-sm font-bold ml-1">Sale Price</label>
                            <input 
                                type="number" 
                                name="price"
                                value={flashSaleData.price} 
                                onChange={handleFlashSaleChange}
                                className="w-full bg-black/30 border border-black/5 dark:border-white/10 rounded-xl px-4 py-3 text-primary dark:text-white focus:outline-none focus:border-pink-500 transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-gray-600 dark:text-gray-500 dark:text-gray-400 text-sm font-bold ml-1">Original Price</label>
                            <input 
                                type="number" 
                                name="originalPrice"
                                value={flashSaleData.originalPrice} 
                                onChange={handleFlashSaleChange}
                                className="w-full bg-black/30 border border-black/5 dark:border-white/10 rounded-xl px-4 py-3 text-primary dark:text-white focus:outline-none focus:border-pink-500 transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-gray-600 dark:text-gray-500 dark:text-gray-400 text-sm font-bold ml-1">Product Image</label>
                        <div className="flex gap-2">
                             <input 
                                type="text" 
                                name="image"
                                value={flashSaleData.image} 
                                onChange={handleFlashSaleChange}
                                placeholder="Image URL..."
                                className="flex-1 bg-black/30 border border-black/5 dark:border-white/10 rounded-xl px-4 py-3 text-primary dark:text-white focus:outline-none focus:border-pink-500 transition-all"
                            />
                             <button 
                                type="button" 
                                onClick={() => flashSaleFileRef.current?.click()}
                                className="px-4 py-2 bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:bg-white/20 text-primary dark:text-white rounded-xl border border-black/5 dark:border-white/10 transition-colors"
                            >
                                📂 Upload
                            </button>
                            <input 
                                type="file" 
                                ref={flashSaleFileRef} 
                                className="hidden" 
                                onChange={(e) => handleFileChange(e, 'flashSale')} 
                                accept="image/*"
                            />
                        </div>
                    </div>
                 </div>

                 {/* Preview */}
                <div className="relative rounded-2xl overflow-hidden h-80 border border-black/5 dark:border-white/10 flex items-center justify-center bg-gray-50 dark:bg-black group">
                     {currentFlashSaleImage ? (
                        <img src={currentFlashSaleImage} className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform group-hover:scale-105 duration-700" alt="Preview"/>
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-tr from-pink-900 to-black opacity-50"></div>
                    )}

                    <div className="relative z-10 p-6 w-full">
                        <span className="bg-pink-600 text-primary dark:text-white text-xs font-bold px-2 py-1 rounded mb-2 inline-block">Flash Sale</span>
                        <h2 className="text-2xl font-black text-primary dark:text-white mb-1">{flashSaleData.title || "Product"}</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">{flashSaleData.subtitle || "Offer details"}</p>
                        <div className="flex items-end gap-3">
                            <span className="text-2xl font-bold text-primary dark:text-white">${flashSaleData.price || "0"}</span>
                            <span className="text-sm text-gray-600 dark:text-gray-500 line-through mb-1">${flashSaleData.originalPrice || "0"}</span>
                        </div>
                    </div>

                    <div className="absolute top-4 right-4 bg-black/10 dark:bg-black/50 backdrop-blur px-3 py-1 rounded-lg border border-black/5 dark:border-white/10 text-xs text-gray-600 dark:text-gray-500 dark:text-gray-400 font-mono">
                        SALE PREVIEW
                    </div>
                </div>
             </div>
        </section>

        <div className="flex justify-end pt-4">
             <button 
               type="submit"
               className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-primary dark:text-white font-bold rounded-xl hover:shadow-[0_0_20px_rgba(236,72,153,0.4)] transition-all transform hover:-translate-y-1 block w-full md:w-auto text-center"
             >
               Save All Changes
             </button>
        </div>

      </form>
    </div>
  );
}
