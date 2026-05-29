import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ContactSchema, type ContactFormData } from '../../../types/onboarding'
import Input from '../../ui/Input'
import Button from '../../ui/Button'

const COUNTRY_CODES = [
  { code: '+91',  flag: '🇮🇳', name: 'India' },
  { code: '+1',   flag: '🇺🇸', name: 'USA' },
  { code: '+44',  flag: '🇬🇧', name: 'UK' },
  { code: '+971', flag: '🇦🇪', name: 'UAE' },
  { code: '+65',  flag: '🇸🇬', name: 'Singapore' },
  { code: '+61',  flag: '🇦🇺', name: 'Australia' },
  { code: '+1',   flag: '🇨🇦', name: 'Canada' },
  { code: '+64',  flag: '🇳🇿', name: 'New Zealand' },
  { code: '+60',  flag: '🇲🇾', name: 'Malaysia' },
  { code: '+974', flag: '🇶🇦', name: 'Qatar' },
]

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

  // Parse existing phone into country code + local number
  const parseDefaultPhone = (phone?: string) => {
    if (!phone) return { countryCode: '+91', localNumber: '' }
    for (const c of COUNTRY_CODES) {
      if (phone.startsWith(c.code)) {
        return { countryCode: c.code, localNumber: phone.slice(c.code.length) }
      }
    }
    return { countryCode: '+91', localNumber: phone }
  }

  const { countryCode: defaultCC, localNumber: defaultLocal } = parseDefaultPhone(defaultPhone)
  const [countryCode, setCountryCode] = useState(defaultCC)
  const [localNumber, setLocalNumber] = useState(defaultLocal)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(ContactSchema),
    defaultValues: {
      phone: defaultPhone ?? '',
      city: defaultCity ?? '',
      email: defaultEmail ?? '',
    },
  })

  // Keep form's phone value in sync whenever country code or local number changes
  const handleCountryCodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCode = e.target.value
    setCountryCode(newCode)
    setValue('phone', `${newCode}${localNumber}`, { shouldValidate: true })
  }

  const handleLocalNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = e.target.value
    setLocalNumber(num)
    setValue('phone', `${countryCode}${num}`, { shouldValidate: true })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2
          className="text-[22px] font-semibold tracking-[-0.02em] text-[#241F18] leading-[1.3]"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Almost there, {firstName}.
        </h2>
        <p className="text-[13px] text-[#6E6A5C]">
          Your trainer will reach out on WhatsApp within 24 hours.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
        {/* WhatsApp Number with country code */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-medium tracking-wide text-[#6D412A] uppercase">
            WhatsApp Number<span className="text-[#DC2626] ml-0.5">*</span>
          </label>
          {/* Hidden field for react-hook-form */}
          <input type="hidden" {...register('phone')} />
          {/* Unified pill container */}
          <div
            className={[
              'flex h-12 w-full overflow-hidden rounded-[12px] border bg-[#FBF8EE]',
              'focus-within:border-[#53603E] focus-within:ring-2 focus-within:ring-[#53603E]/10',
              'transition-colors duration-150',
              errors.phone
                ? 'border-[#DC2626] focus-within:border-[#DC2626] focus-within:ring-[#DC2626]/10'
                : 'border-[#E2DCC6]',
            ].join(' ')}
          >
            {/* Country code dropdown */}
            <select
              value={countryCode}
              onChange={handleCountryCodeChange}
              aria-label="Country code"
              style={{ width: '90px', minWidth: '90px' }}
              className={[
                'h-full shrink-0 appearance-none border-none bg-transparent',
                'pl-3 pr-1 text-[14px] text-[#241F18] cursor-pointer',
                'focus:outline-none',
              ].join(' ')}
            >
              {COUNTRY_CODES.map((c, i) => (
                <option key={`${c.code}-${c.name}-${i}`} value={c.code}>
                  {c.flag} {c.code}
                </option>
              ))}
            </select>
            {/* Divider */}
            <div className="my-2.5 w-px bg-[#E8E4D4] shrink-0" />
            {/* Local number input */}
            <input
              type="tel"
              placeholder="98765 43210"
              value={localNumber}
              onChange={handleLocalNumberChange}
              className={[
                'h-full flex-1 min-w-0 border-none bg-transparent',
                'px-3 text-[15px] text-[#241F18] placeholder:text-[#B8B3A0]',
                'focus:outline-none',
              ].join(' ')}
            />
          </div>
          {errors.phone ? (
            <p className="text-[12px] text-[#DC2626]" role="alert" aria-live="polite">
              {errors.phone.message}
            </p>
          ) : (
            <p className="text-[12px] text-[#6E6A5C]">We'll send your profile to this number</p>
          )}
        </div>

        <Input
          label="City"
          placeholder="Delhi"
          required
          error={errors.city?.message}
          {...register('city')}
        />

        <Input
          label="Email"
          placeholder="you@example.com"
          type="email"
          required
          error={errors.email?.message}
          hint="We'll send your session confirmation and calendar invite here"
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
