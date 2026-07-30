import React from 'react';
import { AlertCircle } from 'lucide-react';
import { useT } from '../contexts/I18nContext';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <ErrorFallback onRetry={() => this.setState({ hasError: false })} />;
    }
    return this.props.children;
  }
}

function ErrorFallback({ onRetry }: { onRetry: () => void }) {
  const { t } = useT();
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] p-6 text-center">
      <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
        <AlertCircle className="w-6 h-6 text-red-500" />
      </div>
      <h2 className="font-serif text-lg font-semibold text-brand-text-dark mb-2">{t('error.title')}</h2>
      <p className="text-xs text-brand-text-muted mb-4 max-w-xs">
        {t('error.message')}
      </p>
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-brand-primary text-white text-xs font-semibold rounded-full active:scale-95 transition-all"
      >
        {t('error.retry')}
      </button>
    </div>
  );
}
