import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { bookingsApi } from '@/api/endpoints';
import type { CreateBookingRequest } from '@my-travelline/shared';

interface BookingFormProps {
  tourId: number;
  tourTitle: string;
}

export default function BookingForm({ tourId, tourTitle }: BookingFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Omit<CreateBookingRequest, 'tourId'>>();

  const mutation = useMutation({
    mutationFn: (data: CreateBookingRequest) => bookingsApi.create(data),
    onSuccess: () => {
      toast.success('Booking submitted! We will contact you shortly.');
      reset();
    },
    onError: () => {
      toast.error('Failed to submit booking. Please try again.');
    },
  });

  const onSubmit = (data: Omit<CreateBookingRequest, 'tourId'>) => {
    mutation.mutate({ ...data, tourId });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h3 className="font-semibold text-secondary-800 text-center">Book: {tourTitle}</h3>

      <div>
        <input
          {...register('customerName', { required: 'Name is required' })}
          placeholder="Full Name *"
          className="input-field"
        />
        {errors.customerName && <p className="input-error">{errors.customerName.message}</p>}
      </div>

      <div>
        <input
          {...register('email', {
            required: 'Email is required',
            pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' },
          })}
          placeholder="Email *"
          type="email"
          className="input-field"
        />
        {errors.email && <p className="input-error">{errors.email.message}</p>}
      </div>

      <div>
        <input
          {...register('phone')}
          placeholder="Phone Number"
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
            required: 'Number of guests is required',
            min: { value: 1, message: 'At least 1 guest' },
          })}
          placeholder="Number of Guests *"
          type="number"
          min="1"
          className="input-field"
        />
        {errors.guests && <p className="input-error">{errors.guests.message}</p>}
      </div>

      <div>
        <textarea
          {...register('message')}
          placeholder="Special requests or questions..."
          rows={3}
          className="input-field"
        />
      </div>

      <button
        type="submit"
        disabled={mutation.isPending}
        className="btn-primary w-full"
      >
        {mutation.isPending ? 'Submitting...' : 'Book Now'}
      </button>
    </form>
  );
}
