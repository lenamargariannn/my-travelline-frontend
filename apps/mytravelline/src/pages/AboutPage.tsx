import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { HiGlobe, HiHeart, HiShieldCheck, HiSparkles } from 'react-icons/hi';

export default function AboutPage() {
  const { t } = useTranslation();

  const values = [
    { icon: HiGlobe, titleKey: 'about.values.expertCurated', descKey: 'about.values.expertCuratedDesc' },
    { icon: HiHeart, titleKey: 'about.values.personalized', descKey: 'about.values.personalizedDesc' },
    { icon: HiShieldCheck, titleKey: 'about.values.safeSecure', descKey: 'about.values.safeSecureDesc' },
    { icon: HiSparkles, titleKey: 'about.values.unforgettable', descKey: 'about.values.unforgettableDesc' },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="bg-hero-gradient py-20">
        <div className="container-main text-center text-white">
          <h1 className="text-4xl md:text-5xl font-heading font-bold">{t('about.hero.title')}</h1>
          <p className="mt-4 text-xl text-primary-100 italic">{t('about.hero.subtitle')}</p>
        </div>
      </section>

      {/* Story */}
      <section className="section-padding">
        <div className="container-main max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="section-title">{t('about.story.title')}</h2>
          </div>
          <div className="text-secondary-600 space-y-4 leading-relaxed">
            <p>{t('about.story.p1')}</p>
            <p>{t('about.story.p2')}</p>
            <p>{t('about.story.p3')}</p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-secondary-50">
        <div className="container-main">
          <div className="text-center mb-12">
            <h2 className="section-title">{t('about.values.title')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((item) => (
              <div key={item.titleKey} className="text-center p-6">
                <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="h-7 w-7 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-2">{t(item.titleKey)}</h3>
                <p className="text-sm text-secondary-600">{t(item.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-primary-700 text-center text-white">
        <div className="container-main">
          <h2 className="text-3xl font-heading font-bold">{t('about.cta.title')}</h2>
          <p className="mt-4 text-primary-100 max-w-xl mx-auto">{t('about.cta.subtitle')}</p>
          <Link to="/contact" className="btn bg-white text-primary-700 hover:bg-primary-50 mt-8 font-semibold px-8 py-3 rounded-lg inline-block">
            {t('about.cta.button')}
          </Link>
        </div>
      </section>
    </div>
  );
}
