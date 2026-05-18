import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ContactSchema, type ContactFormData } from '../../../types/onboarding'
import Input from '../../ui/Input'
import Button from '../../ui/Button'

type ContactStepProps = {
  onSubmit: (data: ContactFormData) => Promise<void>
  isSubmitting: boolean
}

export default function ContactStep({ onSubmit, isSubmitting }: ContactStepProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(ContactSchema),
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2
          className="text-[22px] font-semibold tracking-[-0.02em] text-[#2D2D2A] leading-[1.3]"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Last step — where do we reach you?
        </h2>
        <p className="text-[13px] text-[#8A8577]">
          Your trainer will use this to prepare before your first call.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        <Input
          label="Name"
          placeholder="Your full name"
          required
          error={errors.name?.message}
          {...register('name')}
        />
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
          label="Age"
          placeholder="28"
          type="number"
          required
          error={errors.age?.message}
          {...register('age', { valueAsNumber: true })}
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
          hint="To save your profile and get updates"
          {...register('email')}
        />

        <Button
          type="submit"
          className="w-full mt-2"
          loading={isSubmitting}
        >
          See my fitness profile
        </Button>
      </form>
    </div>
  )
}
