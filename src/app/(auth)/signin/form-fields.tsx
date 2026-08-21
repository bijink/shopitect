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
      <Field orientation="vertical" className="pt-2">
        <Button
          type="submit"
          className="py-4.5 rounded-md"
          onClick={() => {
            router.push('/home')
          }}
        >
          Let&apos;s go
        </Button>
        <Button
          type="reset"
          variant="outline"
          className="py-4.5 rounded-md"
          onClick={() => {
            router.push('/')
          }}
        >
          Cancel
        </Button>
      </Field>
    </FieldGroup>
  )
}
