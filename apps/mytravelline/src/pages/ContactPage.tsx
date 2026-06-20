import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { contactApi } from '@/api/endpoints';
import type { CreateContactRequest } from '@my-travelline/shared';
import PageShell from '@/components/PageShell';
import T from '@/components/ui/T';

const inputStyle: React.CSSProperties = {
  width: '100%',
  borderRadius: 8,
  border: '1px solid var(--ink-18)',
  background: 'rgba(255,255,255,0.55)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  padding: '10px 13px',
  fontFamily: "'Noto Sans', sans-serif",
  fontSize: 14,
  color: 'var(--ink)',
  outline: 'none',
  transition: 'border-color 0.15s, box-shadow 0.15s',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: "'Noto Sans', sans-serif",
  fontSize: 11,
  fontWeight: 500,
  color: 'var(--ink-35)',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  marginBottom: 5,
};

export default function ContactPage() {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateContactRequest>();

  const mutation = useMutation({
    mutationFn: (data: CreateContactRequest) => contactApi.send(data),
    onSuccess: () => {
      toast.success(t('contact.success'));
      reset();
    },
    onError: () => {
      toast.error(t('contact.error'));
    },
  });

  const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = 'var(--teal)';
    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(14,79,110,0.12)';
  };

  const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = 'var(--ink-18)';
    e.currentTarget.style.boxShadow = 'none';
  };

  return (
    <PageShell>
      <section className="section" style={{ animation: 'fadeUp 0.7s ease both', padding: '60px 40px' }}>
        <div
          className="section-inner"
          style={{
            maxWidth: 860,
            display: 'grid',
            gridTemplateColumns: '55fr 45fr',
            gap: 24,
            alignItems: 'stretch',
          }}
        >
          {/* Left — form */}
          <div className="glass" style={{ padding: '32px', borderRadius: 20 }}>
            <T as="span" className="eyebrow" style={{ display: 'inline-block', marginBottom: 10 }}>{t('contact.eyebrow')}</T>
            <T as="h2"
              style={{
                fontFamily: "'Nunito', sans-serif",
                fontSize: 24,
                fontWeight: 700,
                color: 'var(--ink)',
                marginBottom: 20,
              }}
            >
              {t('contact.formTitle')}
            </T>

            <form
              onSubmit={handleSubmit((data) => mutation.mutate(data))}
              style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
            >
              <div>
                <label style={labelStyle}><T>{t('contact.form.fullName')}</T></label>
                <input
                  {...register('name', { required: t('contact.form.nameRequired') })}
                  style={inputStyle}
                  placeholder={t('contact.form.namePlaceholder')}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
                {errors.name && (
                  <T as="p" style={{ fontFamily: "'Noto Sans', sans-serif", fontSize: 12, color: 'var(--red)', marginTop: 4 }}>
                    {errors.name.message}
                  </T>
                )}
              </div>

              <div>
                <label style={labelStyle}><T>{t('contact.form.email')}</T></label>
                <input
                  {...register('email', {
                    required: t('contact.form.emailRequired'),
                    pattern: { value: /^\S+@\S+$/i, message: t('contact.form.invalidEmail') },
                  })}
                  type="email"
                  style={inputStyle}
                  placeholder={t('contact.form.emailPlaceholder')}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
                {errors.email && (
                  <T as="p" style={{ fontFamily: "'Noto Sans', sans-serif", fontSize: 12, color: 'var(--red)', marginTop: 4 }}>
                    {errors.email.message}
                  </T>
                )}
              </div>

              <div>
                <label style={labelStyle}><T>{t('contact.form.subject')}</T></label>
                <input
                  {...register('subject')}
                  style={inputStyle}
                  placeholder={t('contact.form.subjectPlaceholder')}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
              </div>

              <div>
                <label style={labelStyle}><T>{t('contact.form.message')}</T></label>
                <textarea
                  {...register('message', { required: t('contact.form.messageRequired') })}
                  rows={4}
                  style={{ ...inputStyle, resize: 'vertical' }}
                  placeholder={t('contact.form.messagePlaceholder')}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
                {errors.message && (
                  <T as="p" style={{ fontFamily: "'Noto Sans', sans-serif", fontSize: 12, color: 'var(--red)', marginTop: 4 }}>
                    {errors.message.message}
                  </T>
                )}
              </div>

              <button
                type="submit"
                disabled={mutation.isPending}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', marginTop: 2 }}
              >
                <T>{mutation.isPending ? t('contact.form.sending') : `${t('contact.form.send')} →`}</T>
              </button>
            </form>
          </div>

          {/* Right — info panel */}
          <div className="glass" style={{ padding: '32px 28px', borderRadius: 20, display: 'flex', flexDirection: 'column' }}>
            <T as="span" className="eyebrow" style={{ display: 'inline-block', marginBottom: 10 }}>{t('contact.findUs')}</T>
            <T as="h2"
              style={{
                fontFamily: "'Nunito', sans-serif",
                fontSize: 24,
                fontWeight: 700,
                color: 'var(--ink)',
                marginBottom: 20,
              }}
            >
              {t('contact.getInTouch')}
            </T>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {[
                { label: t('contact.addressLabel'), value: t('contact.addressValue') },
                { label: t('contact.phoneLabel'), value: t('contact.phoneValue') },
                { label: t('contact.emailLabel'), value: t('contact.emailValue') },
                { label: t('contact.hoursLabel'), value: t('contact.hoursValue') },
              ].map(({ label, value }, i, arr) => (
                <div
                  key={label}
                  style={{
                    padding: '11px 0',
                    borderBottom: i < arr.length - 1 ? '1px solid var(--ink-18)' : 'none',
                  }}
                >
                  <T as="p" style={{ fontFamily: "'Noto Sans', sans-serif", fontSize: 11, fontWeight: 500, color: 'var(--ink-35)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 3 }}>
                    {label}
                  </T>
                  <T as="p" style={{ fontFamily: "'Noto Sans', sans-serif", fontSize: 13.5, color: 'var(--ink)', whiteSpace: 'pre-line', lineHeight: 1.55 }}>
                    {value}
                  </T>
                </div>
              ))}
            </div>

            {/* Logo fill */}
            <div
              style={{
                flex: 1,
                minHeight: 80,
                marginTop: 20,
                borderRadius: 12,
                background: 'rgba(14,79,110,0.05)',
                border: '1px solid rgba(14,79,110,0.10)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img src="/logo.svg" alt="MyTravelLine" style={{ width: '60%', maxWidth: 180, opacity: 0.55 }} />
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
