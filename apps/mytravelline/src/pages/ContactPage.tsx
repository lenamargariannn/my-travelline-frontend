import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { contactApi } from '@/api/endpoints';
import type { CreateContactRequest } from '@my-travelline/shared';
import { HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi';

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

  return (
    <div className="section-padding">
      <div className="container-main">
        <div className="text-center mb-12">
          <h1 className="section-title">{t('contact.pageTitle')}</h1>
          <p className="section-subtitle mx-auto">{t('contact.pageSubtitle')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-heading font-bold text-secondary-900 mb-4">{t('contact.getInTouch')}</h2>
              <p className="text-secondary-600">{t('contact.getInTouchDesc')}</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center shrink-0">
                  <HiLocationMarker className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-medium text-secondary-800">{t('contact.addressLabel')}</h3>
                  <p className="text-sm text-secondary-600">123 Travel Street, Suite 100<br />New York, NY 10001</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center shrink-0">
                  <HiPhone className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-medium text-secondary-800">{t('contact.phoneLabel')}</h3>
                  <p className="text-sm text-secondary-600">+1 (123) 456-7890</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center shrink-0">
                  <HiMail className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-medium text-secondary-800">{t('contact.emailLabel')}</h3>
                  <p className="text-sm text-secondary-600">contact@my-travelline.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-5">
            <div>
              <label className="input-label">{t('contact.form.fullName')}</label>
              <input
                {...register('name', { required: t('contact.form.nameRequired') })}
                className="input-field"
                placeholder={t('contact.form.namePlaceholder')}
              />
              {errors.name && <p className="input-error">{errors.name.message}</p>}
            </div>

            <div>
              <label className="input-label">{t('contact.form.email')}</label>
              <input
                {...register('email', {
                  required: t('contact.form.emailRequired'),
                  pattern: { value: /^\S+@\S+$/i, message: t('contact.form.invalidEmail') },
                })}
                type="email"
                className="input-field"
                placeholder={t('contact.form.emailPlaceholder')}
              />
              {errors.email && <p className="input-error">{errors.email.message}</p>}
            </div>

            <div>
              <label className="input-label">{t('contact.form.subject')}</label>
              <input
                {...register('subject')}
                className="input-field"
                placeholder={t('contact.form.subjectPlaceholder')}
              />
            </div>

            <div>
              <label className="input-label">{t('contact.form.message')}</label>
              <textarea
                {...register('message', { required: t('contact.form.messageRequired') })}
                rows={5}
                className="input-field"
                placeholder={t('contact.form.messagePlaceholder')}
              />
              {errors.message && <p className="input-error">{errors.message.message}</p>}
            </div>

            <button type="submit" disabled={mutation.isPending} className="btn-primary w-full">
              {mutation.isPending ? t('contact.form.sending') : t('contact.form.send')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
