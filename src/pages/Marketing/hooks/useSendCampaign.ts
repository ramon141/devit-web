import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { AxiosError } from 'axios'
import {
  useCommunicationTemplateControllerFind,
  useLeadControllerFind,
  useMarketingCampaignControllerSend,
  usePersonControllerFind,
  usePropertyControllerFind,
} from '@/api/generated/api'
import { MarketingCampaignControllerSendBodyChannel } from '@/api/generated/models/marketingCampaignControllerSendBodyChannel'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { usePromisePopup } from '@/contexts/PromisePopupContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'
import { formatAmount } from '@/utils/formatAmount'

function toggleId(ids: string[], id: string): string[] {
  return ids.includes(id) ? ids.filter((current) => current !== id) : [...ids, id]
}

export function useSendCampaign() {
  const { t } = useTranslation('marketing')
  const { promisePopup } = usePromisePopup()

  const [channel, setChannel] = useState<MarketingCampaignControllerSendBodyChannel>(
    MarketingCampaignControllerSendBodyChannel.email,
  )
  const [personIds, setPersonIds] = useState<string[]>([])
  const [leadIds, setLeadIds] = useState<string[]>([])
  const [propertyIds, setPropertyIds] = useState<string[]>([])
  const [templateId, setTemplateId] = useState('')
  const [subject, setSubject] = useState('')
  const [content, setContent] = useState('')
  const [personSearch, setPersonSearch] = useState('')
  const [leadSearch, setLeadSearch] = useState('')
  const [propertySearch, setPropertySearch] = useState('')

  const debouncedPersonSearch = useDebouncedValue(personSearch)
  const debouncedLeadSearch = useDebouncedValue(leadSearch)
  const debouncedPropertySearch = useDebouncedValue(propertySearch)

  const { data: people, isLoading: loadingPeople } = usePersonControllerFind({
    filter: {
      where: debouncedPersonSearch ? { name: { ilike: `%${debouncedPersonSearch}%` } } : undefined,
      order: ['name ASC'],
      limit: 50,
    },
  })

  const { data: leads, isLoading: loadingLeads } = useLeadControllerFind({
    filter: {
      where: debouncedLeadSearch ? { name: { ilike: `%${debouncedLeadSearch}%` } } : undefined,
      order: ['name ASC'],
      limit: 50,
    },
  })

  const { data: properties, isLoading: loadingProperties } = usePropertyControllerFind({
    filter: {
      where: debouncedPropertySearch ? { title: { ilike: `%${debouncedPropertySearch}%` } } : undefined,
      order: ['title ASC'],
      limit: 50,
    },
  })

  const { data: templates } = useCommunicationTemplateControllerFind({
    filter: { where: { channel, active: true }, order: ['name ASC'] },
  })

  const { mutateAsync: send, isPending: sending } = useMarketingCampaignControllerSend()

  const personOptions = (people ?? []).map((person) => ({ id: person.id ?? '', label: person.name }))
  const leadOptions = (leads ?? []).map((lead) => ({ id: lead.id ?? '', label: lead.name, sublabel: lead.email ?? undefined }))
  const propertyOptions = (properties ?? []).map((property) => ({
    id: property.id ?? '',
    label: `${property.code} · ${property.title}`,
    sublabel: formatAmount(property.salePrice ?? property.rentPrice ?? 0),
  }))
  const templateOptions = (templates ?? []).map((template) => ({ value: template.id ?? '', label: template.name }))

  function onTemplateChange(id: string) {
    setTemplateId(id)
    const selected = templates?.find((template) => template.id === id)
    if (selected) {
      setSubject(selected.subject ?? '')
      setContent(selected.body)
    }
  }

  function onSend(onSent: (result: { sent: number; failed: number; skipped: number }) => void) {
    const promise = send({
      data: {
        channel,
        personIds,
        leadIds: leadIds.length ? leadIds : undefined,
        subject: subject || undefined,
        content,
        propertyIds: propertyIds.length ? propertyIds : undefined,
      },
    })

    promisePopup(promise, {
      pending: t('sendCampaign.pending'),
      success: (result) => {
        const summary = { sent: result.sent ?? 0, failed: result.failed ?? 0, skipped: result.skipped ?? 0 }
        onSent(summary)
        return t('sendCampaign.success', summary)
      },
      error: (error: AxiosError<ApiErrorResponse>) => getErrorMessageFromRequest(error, t('sendCampaign.error')),
    })
  }

  return {
    channel,
    setChannel,
    personIds,
    togglePerson: (id: string) => setPersonIds((current) => toggleId(current, id)),
    leadIds,
    toggleLead: (id: string) => setLeadIds((current) => toggleId(current, id)),
    propertyIds,
    toggleProperty: (id: string) => setPropertyIds((current) => toggleId(current, id)),
    templateId,
    onTemplateChange,
    templateOptions,
    subject,
    setSubject,
    content,
    setContent,
    personSearch,
    setPersonSearch,
    leadSearch,
    setLeadSearch,
    propertySearch,
    setPropertySearch,
    personOptions,
    leadOptions,
    propertyOptions,
    loadingPeople,
    loadingLeads,
    loadingProperties,
    onSend,
    isSending: sending,
    canSend: (personIds.length > 0 || leadIds.length > 0) && content.trim().length > 0,
  }
}
