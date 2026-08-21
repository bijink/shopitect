'use client'

import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import { useRouter } from 'next/navigation'

export function InputOTPDemo() {
  const router = useRouter()

  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="fieldgroup-email">OTP</FieldLabel>
        <InputOTP maxLength={6}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </Field>
      <Field orientation="horizontal">
        <Button
          type="reset"
          variant="outline"
          onClick={() => {
            router.push('/signup')
          }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          onClick={() => {
            router.push('/home')
          }}
        >
          Done
        </Button>
      </Field>
    </FieldGroup>
  )
}
