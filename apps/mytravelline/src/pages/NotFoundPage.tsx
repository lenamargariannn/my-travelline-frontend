import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-8xl font-bold text-primary-200">404</h1>
        <h2 className="text-2xl font-heading font-bold text-secondary-800 mt-4">{t('notFound.title')}</h2>
        <p className="text-secondary-600 mt-2 max-w-md mx-auto">{t('notFound.subtitle')}</p>
        <Link to="/" className="btn-primary mt-8 inline-block">{t('notFound.backHome')}</Link>
      </div>
    </div>
  );
}
