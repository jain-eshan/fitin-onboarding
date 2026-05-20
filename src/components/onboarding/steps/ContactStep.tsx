import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ContactSchema, type ContactFormData } from '../../../types/onboarding'
import Input from '../../ui/Input'
import Button from '../../ui/Button'

type ContactStepProps = {
  name: string
  defaultPhone?: string
  defaultCity?: string
  defaultEmail?: string
  onSubmit: (data: ContactFormData) => Promise<void>
  isSubmitting: boolean
}

export default function ContactStep({
  name,
  defaultPhone,
  defaultCity,
  defaultEmail,
  onSubmit,
  isSubmitting,
}: ContactStepProps) {
  const firstName = name.split(' ')[0]
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(ContactSchema),
    defaultValues: {
      phone: defaultPhone ?? '',
      city: defaultCity ?? '',
      email: defaultEmail ?? '',
    },
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2
          className="text-[22px] font-semibold tracking-[-0.02em] text-[#2D2D2A] leading-[1.3]"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Almost there, {firstName}.
        </h2>
        <p className="text-[13px] text-[#8A8577]">
          Your trainer will reach out on WhatsApp within 24 hours.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <Input
          label="WhatsApp Number"
          placeholder="+91 98765 43210"
          type="tel"
          required
          error={errors.phone?.message}
          hint="We'll send your profile to this number"
          {...register('phone')}
        />
        <Input
          label="City"
          placeholder="Delhi"
          required
          error={errors.city?.message}
          {...register('city')}
        />
        <Input
          label="Email (optional)"
          placeholder="you@example.com"
          type="email"
          error={errors.email?.message}
          hint="To receive your fitness profile summary"
          {...register('email')}
        />
        <Button type="submit" className="w-full mt-2" loading={isSubmitting}>
          See my fitness profile →
        </Button>
      </form>

      <p className="text-center text-[11px] text-[#B8B3A0]">
        🔒 Your data is safe and never shared.
      </p>
    </div>
  )
}
