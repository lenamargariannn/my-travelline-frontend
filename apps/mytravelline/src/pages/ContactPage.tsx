import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { contactApi } from '@/api/endpoints';
import type { CreateContactRequest } from '@my-travelline/shared';
import { HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi';

export default function ContactPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateContactRequest>();

  const mutation = useMutation({
    mutationFn: (data: CreateContactRequest) => contactApi.send(data),
    onSuccess: () => {
      toast.success('Message sent! We will get back to you soon.');
      reset();
    },
    onError: () => {
      toast.error('Failed to send message. Please try again.');
    },
  });

  return (
    <div className="section-padding">
      <div className="container-main">
        <div className="text-center mb-12">
          <h1 className="section-title">Contact Us</h1>
          <p className="section-subtitle mx-auto">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-heading font-bold text-secondary-900 mb-4">Get In Touch</h2>
              <p className="text-secondary-600">
                Whether you're planning your dream vacation or have questions about our tours,
                our travel experts are here to help.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center shrink-0">
                  <HiLocationMarker className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-medium text-secondary-800">Address</h3>
                  <p className="text-sm text-secondary-600">123 Travel Street, Suite 100<br />New York, NY 10001</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center shrink-0">
                  <HiPhone className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-medium text-secondary-800">Phone</h3>
                  <p className="text-sm text-secondary-600">+1 (123) 456-7890</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center shrink-0">
                  <HiMail className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-medium text-secondary-800">Email</h3>
                  <p className="text-sm text-secondary-600">info@mytravelline.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-5">
            <div>
              <label className="input-label">Full Name *</label>
              <input
                {...register('name', { required: 'Name is required' })}
                className="input-field"
                placeholder="John Doe"
              />
              {errors.name && <p className="input-error">{errors.name.message}</p>}
            </div>

            <div>
              <label className="input-label">Email *</label>
              <input
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' },
                })}
                type="email"
                className="input-field"
                placeholder="john@example.com"
              />
              {errors.email && <p className="input-error">{errors.email.message}</p>}
            </div>

            <div>
              <label className="input-label">Subject</label>
              <input
                {...register('subject')}
                className="input-field"
                placeholder="How can we help?"
              />
            </div>

            <div>
              <label className="input-label">Message *</label>
              <textarea
                {...register('message', { required: 'Message is required' })}
                rows={5}
                className="input-field"
                placeholder="Tell us about your travel plans..."
              />
              {errors.message && <p className="input-error">{errors.message.message}</p>}
            </div>

            <button
              type="submit"
              disabled={mutation.isPending}
              className="btn-primary w-full"
            >
              {mutation.isPending ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
