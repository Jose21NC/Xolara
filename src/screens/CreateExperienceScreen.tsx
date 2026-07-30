import React, { useState } from 'react';
import { ArrowLeft, Save, Loader2, ImagePlus, AlertCircle } from 'lucide-react';
import { experiencesApi, ApiError } from '../lib/api';
import { useT } from '../contexts/I18nContext';
import { experienceSchema } from '../lib/validation/schemas';
import { Experience } from '../types';

interface CreateExperienceScreenProps {
  onBack: () => void;
  onSuccess: () => void;
  editExperience?: Experience;
}

export default function CreateExperienceScreen({ onBack, onSuccess, editExperience }: CreateExperienceScreenProps) {
  const { t } = useT();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: editExperience?.title || '',
    category: editExperience?.category || 'Crafts',
    location: editExperience?.location || '',
    duration: editExperience?.duration || '2 Horas',
    pricePerPerson: editExperience?.pricePerPerson || 10,
    aboutCommunity: editExperience?.aboutCommunity || '',
    image: editExperience?.image || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...formData,
      title: formData.title,
      location: formData.location,
      duration: formData.duration,
      aboutCommunity: formData.aboutCommunity,
      image: formData.image,
    };
    const result = experienceSchema.safeParse({ ...data, pricePerPerson: Number(data.pricePerPerson) });
    if (!result.success) {
      setErrors(result.error.issues.map(i => i.message));
      return;
    }
    setErrors([]);
    setLoading(true);
    try {
      const payload = {
        title: data.title,
        category: data.category,
        location: data.location,
        duration: data.duration,
        durationHours: Number(data.duration.split(' ')[0]) || 3,
        groupSize: 'Máx 6 personas',
        pricePerPerson: Number(data.pricePerPerson),
        aboutCommunity: data.aboutCommunity,
        tags: [data.category],
      };
      if (editExperience) {
        await experiencesApi.update(editExperience.id, payload);
      } else {
        await experiencesApi.create(payload);
      }
      onSuccess();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : t('create_exp.error');
      setErrors([message]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors.length > 0) setErrors([]);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="sticky top-0 z-20 glass-chrome px-5 py-4 flex items-center justify-between">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-black/5 transition-colors">
          <ArrowLeft className="w-5 h-5 text-brand-text-dark" />
        </button>
        <span className="font-serif text-lg font-semibold text-brand-text-dark">{editExperience ? t('create_exp.edit_title') : t('create_exp.title')}</span>
        <div className="w-9" />
      </div>

      <div className="p-5 overflow-y-auto pb-24">
        {errors.length > 0 && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2" role="alert" aria-live="polite">
            <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
            <div className="flex flex-col gap-0.5">
              {errors.map((err, i) => (
                <span key={i} className="text-[11px] text-red-600 font-medium">{err}</span>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="title" className="text-[10px] font-black tracking-widest uppercase text-brand-text-muted">{t('create_exp.title_label')}</label>
            <input id="title" required name="title" value={formData.title} onChange={handleChange} placeholder={t('create_exp.title_placeholder')} minLength={3} maxLength={100}
              className="px-4 py-3 rounded-xl border border-black/10 bg-surface text-sm font-semibold focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="category" className="text-[10px] font-black tracking-widest uppercase text-brand-text-muted">{t('create_exp.category')}</label>
              <select id="category" name="category" value={formData.category} onChange={handleChange}
                className="px-4 py-3 rounded-xl border border-black/10 bg-surface text-sm font-semibold focus:outline-none focus:border-brand-primary transition-all appearance-none">
                <option value="Crafts">{t('create_exp.artcraft')}</option>
                <option value="Culinary">{t('create_exp.gastronomy')}</option>
                <option value="Agriculture">{t('create_exp.agriculture')}</option>
                <option value="Nature">{t('create_exp.nature')}</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="pricePerPerson" className="text-[10px] font-black tracking-widest uppercase text-brand-text-muted">{t('create_exp.price')}</label>
              <input id="pricePerPerson" required type="number" name="pricePerPerson" min="1" max="1000" value={formData.pricePerPerson} onChange={handleChange}
                className="px-4 py-3 rounded-xl border border-black/10 bg-surface text-sm font-semibold focus:outline-none focus:border-brand-primary transition-all" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="location" className="text-[10px] font-black tracking-widest uppercase text-brand-text-muted">{t('create_exp.location')}</label>
              <input id="location" required name="location" value={formData.location} onChange={handleChange} placeholder={t('create_exp.location_placeholder')} minLength={2} maxLength={100}
                className="px-4 py-3 rounded-xl border border-black/10 bg-surface text-sm font-semibold focus:outline-none focus:border-brand-primary transition-all" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="duration" className="text-[10px] font-black tracking-widest uppercase text-brand-text-muted">{t('create_exp.duration')}</label>
              <input id="duration" required name="duration" value={formData.duration} onChange={handleChange} placeholder={t('create_exp.duration_placeholder')}
                className="px-4 py-3 rounded-xl border border-black/10 bg-surface text-sm font-semibold focus:outline-none focus:border-brand-primary transition-all" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="aboutCommunity" className="text-[10px] font-black tracking-widest uppercase text-brand-text-muted">{t('create_exp.description')}</label>
            <textarea id="aboutCommunity" required name="aboutCommunity" value={formData.aboutCommunity} onChange={handleChange} rows={3}
              placeholder={t('create_exp.description_placeholder')} minLength={10} maxLength={500}
              className="px-4 py-3 rounded-xl border border-black/10 bg-surface text-sm font-semibold focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all resize-none" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="image" className="text-[10px] font-black tracking-widest uppercase text-brand-text-muted">{t('create_exp.image_url')}</label>
            <div className="flex items-center gap-2">
              <div className="relative flex-grow">
                <ImagePlus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-muted" />
                <input id="image" required name="image" value={formData.image} onChange={handleChange} placeholder="https://..."
                  className="pl-9 pr-4 py-3 w-full rounded-xl border border-black/10 bg-surface text-sm font-semibold focus:outline-none focus:border-brand-primary transition-all" />
              </div>
            </div>
            {formData.image && (
              <img src={formData.image} alt="Preview" className="w-full h-32 object-cover rounded-xl mt-2 border border-black/10" onError={(e) => (e.currentTarget.style.display = 'none')} onLoad={(e) => (e.currentTarget.style.display = 'block')} />
            )}
          </div>

          <button type="submit" disabled={loading}
            className="mt-4 bg-brand-primary hover:bg-brand-primary/95 text-white py-4 rounded-xl font-semibold font-serif text-sm shadow-ios transition-all active:scale-[0.98] flex items-center justify-center gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {loading ? t('create_exp.saving') : editExperience ? t('create_exp.save') : t('create_exp.create')}
          </button>
        </form>
      </div>
    </div>
  );
}
