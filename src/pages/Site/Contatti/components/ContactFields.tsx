import type { FieldErrors, UseFormRegister } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type { ContattiFormValues } from '@/pages/Site/Contatti/schemas/contattiSchema'

type ContactFieldsProps = {
  register: UseFormRegister<ContattiFormValues>
  errors: FieldErrors<ContattiFormValues>
}

function ContactFields({ register, errors }: ContactFieldsProps) {
  const { t } = useTranslation('site')

  return (
    <>
      <FormFieldWrapper label={t('contatti.nameLabel')} htmlFor="name" error={errors.name?.message}>
        <Input id="name" {...register('name')} />
      </FormFieldWrapper>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormFieldWrapper label={t('contatti.emailLabel')} htmlFor="email" error={errors.email?.message}>
          <Input id="email" type="email" {...register('email')} />
        </FormFieldWrapper>

        <FormFieldWrapper label={t('contatti.phoneLabel')} htmlFor="phone" error={errors.phone?.message}>
          <Input id="phone" {...register('phone')} />
        </FormFieldWrapper>
      </div>

      <FormFieldWrapper label={t('contatti.subjectLabel')} htmlFor="subject">
        <Input id="subject" {...register('subject')} />
      </FormFieldWrapper>

      <FormFieldWrapper label={t('contatti.messageLabel')} htmlFor="message" error={errors.message?.message}>
        <Textarea id="message" rows={6} {...register('message')} />
      </FormFieldWrapper>
    </>
  )
}

export default ContactFields
