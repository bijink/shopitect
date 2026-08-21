'use client'

import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'

export function FormFields() {
  const router = useRouter()

  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="fieldgroup-email">Email</FieldLabel>
        <Input
          id="fieldgroup-email"
          type="email"
          placeholder="name@example.com"
        />
        {/* <FieldDescription>
          We&apos;ll send updates to this address.
        </FieldDescription> */}
      </Field>
      <Field>
        <FieldLabel htmlFor="fieldgroup-password">Password</FieldLabel>
        <Input id="fieldgroup-password" />
      </Field>
      <Field orientation="horizontal">
        <Button
          type="reset"
          variant="outline"
          onClick={() => {
            router.push('/')
          }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          onClick={() => {
            router.push('/signup/otp')
          }}
        >
          Let&apos;s go
        </Button>
      </Field>
    </FieldGroup>
  )
}
