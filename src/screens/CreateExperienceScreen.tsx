import React, { useState } from 'react';
import { ArrowLeft, Save, Loader2, ImagePlus } from 'lucide-react';
import { useFirebase } from '../contexts/FirebaseContext';
import { db } from '../firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

interface CreateExperienceScreenProps {
  onBack: () => void;
  onSuccess: () => void;
}

export default function CreateExperienceScreen({ onBack, onSuccess }: CreateExperienceScreenProps) {
  const { user } = useFirebase();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Crafts',
    location: '',
    duration: '2 Horas',
    pricePerPerson: 10,
    aboutCommunity: '',
    image: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809', // Random default landscape placeholder
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!user) {
      setError('Debes iniciar sesión para crear experiencias.');
      return;
    }

    setLoading(true);
    try {
      const expId = `exp_${crypto.randomUUID()}`;
      await setDoc(doc(db, 'experiences', expId), {
        id: expId,
        title: formData.title,
        category: formData.category,
        location: formData.location,
        country: 'Nicaragua',
        lat: 12.0, // fallback
        lng: -86.0, // fallback
        duration: formData.duration,
        pricePerPerson: Number(formData.pricePerPerson),
        rating: 5.0,
        reviewsCount: 0,
        aboutCommunity: formData.aboutCommunity,
        image: formData.image,
        createdBy: user.uid,
        hostName: user.displayName || 'Guía Local',
        createdAt: serverTimestamp(),
      });
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Error al guardar la experiencia.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-20 glass-chrome px-5 py-4 flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-2 -ml-2 rounded-full hover:bg-black/5 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-brand-text-dark" />
        </button>
        <span className="font-serif text-lg font-semibold text-brand-text-dark">Nueva Experiencia</span>
        <div className="w-9" />
      </div>

      <div className="p-5 overflow-y-auto pb-24">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-bold border border-red-200 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black tracking-widest uppercase text-brand-text-muted">Título de la Experiencia</label>
            <input 
              required
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ej. Taller Inmersivo de Barro"
              className="px-4 py-3 rounded-xl border border-black/10 bg-surface text-sm font-semibold focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black tracking-widest uppercase text-brand-text-muted">Categoría</label>
              <select 
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="px-4 py-3 rounded-xl border border-black/10 bg-surface text-sm font-semibold focus:outline-none focus:border-brand-primary transition-all appearance-none"
              >
                <option value="Crafts">Artesanía</option>
                <option value="Culinary">Gastronomía</option>
                <option value="Agriculture">Agricultura</option>
                <option value="Nature">Naturaleza</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black tracking-widest uppercase text-brand-text-muted">Precio (USD/Persona)</label>
              <input 
                required
                type="number"
                name="pricePerPerson"
                min="0"
                value={formData.pricePerPerson}
                onChange={handleChange}
                className="px-4 py-3 rounded-xl border border-black/10 bg-surface text-sm font-semibold focus:outline-none focus:border-brand-primary transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black tracking-widest uppercase text-brand-text-muted">Ubicación (Pueblo/Ciudad)</label>
              <input 
                required
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Ej. San Juan de Oriente"
                className="px-4 py-3 rounded-xl border border-black/10 bg-surface text-sm font-semibold focus:outline-none focus:border-brand-primary transition-all"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black tracking-widest uppercase text-brand-text-muted">Duración</label>
              <input 
                required
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="Ej. 3 Horas"
                className="px-4 py-3 rounded-xl border border-black/10 bg-surface text-sm font-semibold focus:outline-none focus:border-brand-primary transition-all"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black tracking-widest uppercase text-brand-text-muted">Impacto / Descripción</label>
            <textarea 
              required
              name="aboutCommunity"
              value={formData.aboutCommunity}
              onChange={handleChange}
              rows={3}
              placeholder="Describe lo que se hará y cómo impacta localmente..."
              className="px-4 py-3 rounded-xl border border-black/10 bg-surface text-sm font-semibold focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all resize-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black tracking-widest uppercase text-brand-text-muted">URL de Imagen</label>
            <div className="flex items-center gap-2">
              <div className="relative flex-grow">
                <ImagePlus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-muted" />
                <input 
                  required
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="pl-9 pr-4 py-3 w-full rounded-xl border border-black/10 bg-surface text-sm font-semibold focus:outline-none focus:border-brand-primary transition-all"
                />
              </div>
            </div>
            {formData.image && (
              <img src={formData.image} alt="Preview" className="w-full h-32 object-cover rounded-xl mt-2 border border-black/10" onError={(e) => (e.currentTarget.style.display = 'none')} onLoad={(e) => (e.currentTarget.style.display = 'block')} />
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 bg-brand-primary hover:bg-brand-primary/95 text-white py-4 rounded-xl font-semibold font-serif text-sm shadow-ios transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {loading ? 'Publicando...' : 'Publicar Experiencia Comunitaria'}
          </button>
        </form>
      </div>
    </div>
  );
}
