import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { bookingsApi } from '@/api/endpoints';
import type { CreateBookingRequest } from '@my-travelline/shared';

interface BookingFormProps {
  tourId: number;
  tourTitle: string;
}

export default function BookingForm({ tourId, tourTitle }: BookingFormProps) {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Omit<CreateBookingRequest, 'tourId'>>();

  const mutation = useMutation({
    mutationFn: (data: CreateBookingRequest) => bookingsApi.create(data),
    onSuccess: () => {
      toast.success(t('booking.success'));
      reset();
    },
    onError: () => {
      toast.error(t('booking.error'));
    },
  });

  const onSubmit = (data: Omit<CreateBookingRequest, 'tourId'>) => {
    mutation.mutate({ ...data, tourId });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h3 className="font-semibold text-secondary-800 text-center">
        {t('booking.title', { tourTitle })}
      </h3>

      <div>
        <input
          {...register('customerName', { required: t('booking.nameRequired') })}
          placeholder={t('booking.fullNamePlaceholder')}
          className="input-field"
        />
        {errors.customerName && <p className="input-error">{errors.customerName.message}</p>}
      </div>

      <div>
        <input
          {...register('email', {
            required: t('booking.emailRequired'),
            pattern: { value: /^\S+@\S+$/i, message: t('booking.invalidEmail') },
          })}
          placeholder={t('booking.emailPlaceholder')}
          type="email"
          className="input-field"
        />
        {errors.email && <p className="input-error">{errors.email.message}</p>}
      </div>

      <div>
        <input
          {...register('phone')}
          placeholder={t('booking.phonePlaceholder')}
          className="input-field"
        />
      </div>

      <div>
        <input
          {...register('travelDate')}
          type="date"
          className="input-field"
        />
      </div>

      <div>
        <input
          {...register('guests', {
            required: t('booking.guestsRequired'),
            min: { value: 1, message: t('booking.minGuests') },
          })}
          placeholder={t('booking.guestsPlaceholder')}
          type="number"
          min="1"
          className="input-field"
        />
        {errors.guests && <p className="input-error">{errors.guests.message}</p>}
      </div>

      <div>
        <textarea
          {...register('message')}
          placeholder={t('booking.specialRequestsPlaceholder')}
          rows={3}
          className="input-field"
        />
      </div>

      <button type="submit" disabled={mutation.isPending} className="btn-primary w-full">
        {mutation.isPending ? t('booking.submitting') : t('booking.submit')}
      </button>
    </form>
  );
}
