import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { BasicsSchema, type BasicsFormData } from '../../../types/onboarding'
import Input from '../../ui/Input'
import Button from '../../ui/Button'

type BasicsStepProps = {
  defaultName?: string
  defaultAge?: number | null
  onSubmit: (data: BasicsFormData) => void
}

export default function BasicsStep({ defaultName, defaultAge, onSubmit }: BasicsStepProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BasicsFormData>({
    resolver: zodResolver(BasicsSchema),
    defaultValues: {
      name: defaultName ?? '',
      age: defaultAge ?? undefined,
    },
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2
          className="text-[24px] font-semibold tracking-[-0.02em] text-[#2D2D2A] leading-[1.25]"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Let's start with you.
        </h2>
        <p className="text-[13px] text-[#8A8577]">
          We'll use this to personalise your experience.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-4"
      >
        <Input
          label="Your name"
          placeholder="e.g. Priya"
          required
          error={errors.name?.message}
          {...register('name')}
        />
        <Input
          label="Your age"
          placeholder="e.g. 29"
          type="number"
          required
          error={errors.age?.message}
          {...register('age', { valueAsNumber: true })}
        />
        <Button type="submit" className="w-full mt-2">
          Continue →
        </Button>
      </form>
    </div>
  )
}
