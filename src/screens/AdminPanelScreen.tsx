import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Edit3, Trash2, AlertCircle, Check, ShieldCheck, ShieldX } from 'lucide-react';
import { Experience } from '../types';
import { experiencesApi, adminApi, ApiError } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { useT } from '../contexts/I18nContext';
import { useOverlayModal } from '../contexts/OverlayContext';

interface AdminPanelScreenProps {
  experiences: Experience[];
  onBack: () => void;
  onCreate: () => void;
  onEdit: (id: string) => void;
  onRefresh: () => void;
}

interface PendingGuide {
  id: string;
  display_name: string;
  email: string;
  subtitle: string | null;
  location: string | null;
  created_at: string;
}

export default function AdminPanelScreen({ experiences, onBack, onCreate, onEdit, onRefresh }: AdminPanelScreenProps) {
  const { t } = useT();
  const { user } = useAuth();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [stats, setStats] = useState<{ experiences: number; bookings: number; travelers: number; revenue: number } | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [pendingGuides, setPendingGuides] = useState<PendingGuide[]>([]);
  const [pendingLoading, setPendingLoading] = useState(true);
  const [approvingId, setApprovingId] = useState<string | null>(null);

  const isAdmin = user?.role === 'admin';
  const myExperiences = isAdmin
    ? experiences
    : experiences.filter(e => e.createdBy === user?.id);

  const loadStats = () => {
    setStatsLoading(true);
    adminApi.getStats()
      .then(setStats)
      .catch(() => setStats(null))
      .finally(() => setStatsLoading(false));
  };

  const loadPendingGuides = () => {
    if (!isAdmin) {
      setPendingLoading(false);
      return;
    }
    setPendingLoading(true);
    adminApi.listPendingGuides()
      .then((data) => setPendingGuides(data as PendingGuide[]))
      .catch(() => setPendingGuides([]))
      .finally(() => setPendingLoading(false));
  };

  useEffect(() => {
    loadStats();
    loadPendingGuides();
  }, [experiences.length, isAdmin]);

  const handleDelete = async (id: string) => {
    if (!confirm(t('admin.confirm_delete'))) return;
    setDeletingId(id);
    try {
      await experiencesApi.delete(id);
      setToast(t('admin.deleted'));
      setTimeout(() => { setToast(null); onRefresh(); }, 1500);
    } catch {
      setToast(t('admin.delete_error'));
      setTimeout(() => setToast(null), 3000);
    } finally {
      setDeletingId(null);
    }
  };

  const handleApproveGuide = async (userId: string, approve: boolean) => {
    setApprovingId(userId);
    try {
      await adminApi.approveGuide(userId, approve);
      setToast(approve ? t('admin.approved') : t('admin.rejected'));
      setTimeout(() => setToast(null), 2000);
      loadPendingGuides();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : t('admin.process_error');
      setToast(message);
      setTimeout(() => setToast(null), 3000);
    } finally {
      setApprovingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-28 min-h-screen relative font-sans">
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] glass-chrome text-brand-text-dark font-semibold text-xs px-4 py-2.5 rounded-full flex items-center gap-2 animate-slide-down">
          <Check className="w-4 h-4 text-brand-secondary" />
          <span>{toast}</span>
        </div>
      )}

      <header className="px-5 pt-4 flex items-center justify-between">
        <button onClick={onBack} className="text-brand-text-dark hover:bg-neutral-100 rounded-full p-2 active:scale-95 transition-all">
          <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
        </button>
        <h2 className="font-serif text-xl font-semibold text-brand-text-dark">{t('admin.title')}</h2>
        <button onClick={onCreate} className="bg-brand-primary text-white p-2 rounded-full active:scale-95 transition-all shadow-ios">
          <Plus className="w-5 h-5" />
        </button>
      </header>

      <section className="px-5 grid grid-cols-3 gap-3">
        <div className="p-3 surface-card flex flex-col gap-0.5">
          <span className="text-xl font-semibold text-brand-primary tabular-nums">
            {statsLoading ? '...' : stats?.experiences ?? myExperiences.length}
          </span>
          <span className="text-[9px] text-brand-text-muted font-semibold uppercase tracking-tight">{t('admin.experiences')}</span>
        </div>
        <div className="p-3 surface-card flex flex-col gap-0.5">
          <span className="text-xl font-semibold text-brand-secondary tabular-nums">{statsLoading ? '...' : stats?.travelers ?? '—'}</span>
          <span className="text-[9px] text-brand-text-muted font-semibold uppercase tracking-tight">{t('admin.travelers')}</span>
        </div>
        <div className="p-3 surface-card flex flex-col gap-0.5">
          <span className="text-xl font-semibold text-brand-text-dark tabular-nums">
            {statsLoading ? '...' : stats ? `$${stats.revenue}` : '—'}
          </span>
          <span className="text-[9px] text-brand-text-muted font-semibold uppercase tracking-tight">{t('admin.revenue')}</span>
        </div>
      </section>

      {isAdmin && (
        <section className="px-5 flex flex-col gap-3">
          <h4 className="font-serif text-sm font-semibold text-brand-text-dark flex items-center justify-between pb-1.5 border-b border-black/5">
            <span>{t('admin.pending_guides')}</span>
            <span className="text-[9px] bg-brand-secondary text-white font-semibold px-2 py-0.5 rounded-full tabular-nums">
              {pendingLoading ? '...' : pendingGuides.length}
            </span>
          </h4>

          {pendingLoading ? (
            <div className="border border-dashed border-black/10 rounded-xl p-5 text-center text-xs text-brand-text-muted">{t('admin.loading')}</div>
          ) : pendingGuides.length === 0 ? (
            <div className="border border-dashed border-black/10 rounded-xl p-5 text-center bg-surface flex flex-col items-center gap-2">
              <span className="text-xl">✅</span>
              <p className="text-xs text-brand-text-muted font-bold">{t('admin.no_pending')}</p>
            </div>
          ) : (
            pendingGuides.map(g => (
              <div key={g.id} className="surface-card p-4 flex flex-col gap-3">
                <div>
                  <h5 className="font-serif text-xs font-semibold text-brand-text-dark leading-snug">{g.display_name}</h5>
                  <p className="text-[9px] text-brand-text-muted font-bold mt-0.5">{g.email}</p>
                  {g.subtitle && <p className="text-[10px] text-brand-text-dark mt-1">{g.subtitle}</p>}
                  {g.location && <p className="text-[9px] text-brand-text-muted mt-0.5">📍 {g.location}</p>}
                  <p className="text-[8px] text-brand-text-muted mt-1 uppercase tracking-wider">
                    {t('admin.requested_on')}{new Date(g.created_at).toLocaleDateString('es')}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApproveGuide(g.id, true)}
                    disabled={approvingId === g.id}
                    className="flex-1 bg-brand-secondary text-white text-[10px] font-semibold py-2 rounded-xl flex items-center justify-center gap-1 active:scale-95 transition-all disabled:opacity-40"
                  >
                    <ShieldCheck className="w-3 h-3" />
                    {approvingId === g.id ? '...' : t('admin.approve')}
                  </button>
                  <button
                    onClick={() => handleApproveGuide(g.id, false)}
                    disabled={approvingId === g.id}
                    className="flex-1 text-red-600 border border-red-200 hover:bg-red-50 text-[10px] font-semibold py-2 rounded-xl flex items-center justify-center gap-1 active:scale-95 transition-all disabled:opacity-40"
                  >
                    <ShieldX className="w-3 h-3" />
                    {t('admin.reject')}
                  </button>
                </div>
              </div>
            ))
          )}
        </section>
      )}

      <section className="px-5 flex flex-col gap-3">
        <h4 className="font-serif text-sm font-semibold text-brand-text-dark flex items-center justify-between pb-1.5 border-b border-black/5">
          <span>{t('admin.my_experiences')}</span>
          <span className="text-[9px] bg-brand-primary text-white font-semibold px-2 py-0.5 rounded-full">{myExperiences.length}</span>
        </h4>

        {myExperiences.length === 0 ? (
          <div className="border border-dashed border-black/10 rounded-xl p-5 text-center bg-surface flex flex-col items-center gap-2">
            <span className="text-xl">📭</span>
            <p className="text-xs text-brand-text-muted font-bold">{t('admin.no_experiences')}</p>
            <button onClick={onCreate} className="text-brand-primary text-[10px] font-bold underline">{t('admin.create_first')}</button>
          </div>
        ) : (
          myExperiences.map(exp => (
            <div key={exp.id} className="surface-card p-4 flex items-start gap-3 relative">
              <img src={exp.image} alt={exp.title} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
              <div className="flex-grow min-w-0">
                <h5 className="font-serif text-xs font-semibold text-brand-text-dark leading-snug line-clamp-1">{exp.title}</h5>
                <p className="text-[9px] text-brand-text-muted font-bold mt-0.5">{exp.location} • ${exp.pricePerPerson} USD</p>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => onEdit(exp.id)}
                    className="text-[10px] font-semibold bg-surface-2 border border-black/8 px-3 py-1.5 rounded-full flex items-center gap-1 active:scale-95 transition-all"
                  >
                    <Edit3 className="w-3 h-3" />
                    {t('admin.edit')}
                  </button>
                  <button
                    onClick={() => handleDelete(exp.id)}
                    disabled={deletingId === exp.id}
                    className="text-[10px] font-semibold text-red-600 border border-red-200 px-3 py-1.5 rounded-full flex items-center gap-1 active:scale-95 transition-all disabled:opacity-40"
                  >
                    <Trash2 className="w-3 h-3" />
                    {deletingId === exp.id ? '...' : t('admin.delete')}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </section>

      {!isAdmin && myExperiences.length > 0 && (
        <div className="mx-5 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
          <p className="text-[10px] text-amber-900 font-semibold leading-relaxed">
            {t('admin.visibility_note')}
          </p>
        </div>
      )}
    </div>
  );
}
