import { useState, useEffect, useRef } from "react";
import api from "../../services/api";
import { toast } from "react-hot-toast";
import { getProductImageUrl } from "../../utils/constants";

export default function AdminBanner() {
  const [loading, setLoading] = useState(true);
  const heroFileRef = useRef(null);
  const flashSaleFileRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    price: '',
    image: '',
    buttonText: '',
    buttonLink: ''
  });
  const [flashSaleData, setFlashSaleData] = useState({
    title: '',
    subtitle: '',
    price: '',
    originalPrice: '',
    image: '',
    endTime: ''
  });

  const [heroFile, setHeroFile] = useState(null);
  const [flashSaleFile, setFlashSaleFile] = useState(null);
  const [heroPreview, setHeroPreview] = useState(null);
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
      const file = e.target.files[0];
      const preview = URL.createObjectURL(file);
      
      if (type === 'hero') {
        setHeroFile(file);
        setHeroPreview(preview);
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
    return <div className="text-white">Loading...</div>;
  }

  const currentHeroImage = heroPreview || getProductImageUrl(formData.image);
  const currentFlashSaleImage = flashSalePreview || getProductImageUrl(flashSaleData.image);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold text-white mb-2">Banner & Hero Settings</h1>
            <p className="text-gray-400">Customize the visual appearance of your homepage.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Main Hero Section */}
        <section className="glass p-8 rounded-2xl border border-white/10 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
             
             <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
                Main Hero Banner
             </h2>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-gray-400 text-sm font-bold ml-1">Main Title</label>
                        <input 
                            type="text" 
                            name="title"
                            value={formData.title} 
                            onChange={handleChange}
                            className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-gray-400 text-sm font-bold ml-1">Subtitle</label>
                        <input 
                            type="text" 
                            name="subtitle"
                            value={formData.subtitle} 
                            onChange={handleChange}
                            className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-all"
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-gray-400 text-sm font-bold ml-1">Price Tag</label>
                            <input 
                                type="text" 
                                name="price"
                                value={formData.price} 
                                onChange={handleChange}
                                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-gray-400 text-sm font-bold ml-1">Button Text</label>
                            <input 
                                type="text" 
                                name="buttonText"
                                value={formData.buttonText} 
                                onChange={handleChange}
                                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-gray-400 text-sm font-bold ml-1">Button Link</label>
                        <input 
                            type="text" 
                            name="buttonLink"
                            value={formData.buttonLink} 
                            onChange={handleChange}
                            className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-gray-400 text-sm font-bold ml-1">Background Image</label>
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                name="image"
                                value={formData.image} 
                                onChange={handleChange}
                                placeholder="Image URL..."
                                className="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-all"
                            />
                            <button 
                                type="button" 
                                onClick={() => heroFileRef.current?.click()}
                                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/10 transition-colors"
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
                </div>

                {/* Preview */}
                <div className="relative rounded-2xl overflow-hidden h-80 border border-white/10 flex items-center justify-center bg-black group">
                    {currentHeroImage ? (
                        <img src={currentHeroImage} className="absolute inset-0 w-full h-full object-cover opacity-50 transition-transform group-hover:scale-105 duration-700" alt="Preview"/>
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 to-black opacity-50"></div>
                    )}
                    
                    <div className="relative z-10 text-center p-6 w-full">
                        <h2 className="text-3xl font-black text-white mb-2 leading-tight">{formData.title || "Title"}</h2>
                        <p className="text-gray-300 mb-4 text-sm">{formData.subtitle || "Subtitle"}</p>
                        <div className="inline-block px-6 py-2 rounded-full border border-white/30 bg-white/10 backdrop-blur-md text-white font-bold mb-4">
                            {formData.price || "Price"}
                        </div>
                        <div>
                             <span className="inline-block text-sm font-bold border-b border-transparent hover:border-white transition-colors cursor-pointer text-white">
                                {formData.buttonText || "Button"} →
                             </span>
                        </div>
                    </div>
                    
                    <div className="absolute top-4 right-4 bg-black/50 backdrop-blur px-3 py-1 rounded-lg border border-white/10 text-xs text-gray-400 font-mono">
                        HERO PREVIEW
                    </div>
                </div>
             </div>
        </section>

        {/* Flash Sale Section */}
        <section className="glass p-8 rounded-2xl border border-white/10 relative overflow-hidden">
             <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-pink-500 rounded-full"></span>
                Flash Sale Banner
             </h2>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-gray-400 text-sm font-bold ml-1">Sale Title</label>
                        <input 
                            type="text" 
                            name="title"
                            value={flashSaleData.title} 
                            onChange={handleFlashSaleChange}
                            className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500 transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-gray-400 text-sm font-bold ml-1">Subtitle</label>
                        <input 
                            type="text" 
                            name="subtitle"
                            value={flashSaleData.subtitle} 
                            onChange={handleFlashSaleChange}
                            className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500 transition-all"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-gray-400 text-sm font-bold ml-1">Sale Price</label>
                            <input 
                                type="number" 
                                name="price"
                                value={flashSaleData.price} 
                                onChange={handleFlashSaleChange}
                                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500 transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-gray-400 text-sm font-bold ml-1">Original Price</label>
                            <input 
                                type="number" 
                                name="originalPrice"
                                value={flashSaleData.originalPrice} 
                                onChange={handleFlashSaleChange}
                                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500 transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-gray-400 text-sm font-bold ml-1">Product Image</label>
                        <div className="flex gap-2">
                             <input 
                                type="text" 
                                name="image"
                                value={flashSaleData.image} 
                                onChange={handleFlashSaleChange}
                                placeholder="Image URL..."
                                className="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500 transition-all"
                            />
                             <button 
                                type="button" 
                                onClick={() => flashSaleFileRef.current?.click()}
                                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/10 transition-colors"
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
                <div className="relative rounded-2xl overflow-hidden h-80 border border-white/10 flex items-center justify-center bg-black group">
                     {currentFlashSaleImage ? (
                        <img src={currentFlashSaleImage} className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform group-hover:scale-105 duration-700" alt="Preview"/>
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-tr from-pink-900 to-black opacity-50"></div>
                    )}

                    <div className="relative z-10 p-6 w-full">
                        <span className="bg-pink-600 text-white text-xs font-bold px-2 py-1 rounded mb-2 inline-block">Flash Sale</span>
                        <h2 className="text-2xl font-black text-white mb-1">{flashSaleData.title || "Product"}</h2>
                        <p className="text-gray-300 mb-4 text-sm">{flashSaleData.subtitle || "Offer details"}</p>
                        <div className="flex items-end gap-3">
                            <span className="text-2xl font-bold text-white">${flashSaleData.price || "0"}</span>
                            <span className="text-sm text-gray-500 line-through mb-1">${flashSaleData.originalPrice || "0"}</span>
                        </div>
                    </div>

                    <div className="absolute top-4 right-4 bg-black/50 backdrop-blur px-3 py-1 rounded-lg border border-white/10 text-xs text-gray-400 font-mono">
                        SALE PREVIEW
                    </div>
                </div>
             </div>
        </section>

        <div className="flex justify-end pt-4">
             <button 
               type="submit"
               className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-[0_0_20px_rgba(236,72,153,0.4)] transition-all transform hover:-translate-y-1 block w-full md:w-auto text-center"
             >
               Save All Changes
             </button>
        </div>

      </form>
    </div>
  );
}
