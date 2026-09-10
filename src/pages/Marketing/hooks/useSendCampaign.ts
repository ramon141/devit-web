import { useRef, useState } from 'react'
import type { EditorRef } from 'react-email-editor'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import {
  getMarketingCampaignControllerListQueryKey,
  useCommunicationOptOutControllerFind,
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
import { exportEmail, loadEmailDesign } from '@/components/EmailDesignEditor'

function toggleId(ids: string[], id: string): string[] {
  return ids.includes(id) ? ids.filter((current) => current !== id) : [...ids, id]
}

export function useSendCampaign() {
  const { t } = useTranslation('marketing')
  const { promisePopup } = usePromisePopup()
  const queryClient = useQueryClient()

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
  const editorRef = useRef<EditorRef>(null)
  const isEmail = channel === MarketingCampaignControllerSendBodyChannel.email

  const debouncedPersonSearch = useDebouncedValue(personSearch)
  const debouncedLeadSearch = useDebouncedValue(leadSearch)
  const debouncedPropertySearch = useDebouncedValue(propertySearch)

  // Quem tem contato no canal vem numa query própria pra aparecer no topo da lista:
  // a busca geral é limitada e, ordenada por nome, esconderia justamente quem pode receber
  const contactField = isEmail ? 'email' : 'phone'
  const personSearchWhere = debouncedPersonSearch ? { name: { ilike: `%${debouncedPersonSearch}%` } } : {}
  const leadSearchWhere = debouncedLeadSearch ? { name: { ilike: `%${debouncedLeadSearch}%` } } : {}

  const { data: peopleWithContact } = usePersonControllerFind({
    filter: {
      where: { ...personSearchWhere, [contactField]: { neq: null } },
      order: ['name ASC'],
      limit: 50,
    },
  })

  const { data: leadsWithContact } = useLeadControllerFind({
    filter: {
      where: { ...leadSearchWhere, [contactField]: { neq: null } },
      order: ['name ASC'],
      limit: 50,
    },
  })

  const { data: people, isLoading: loadingPeople } = usePersonControllerFind({
    filter: {
      where: personSearchWhere,
      order: ['name ASC'],
      limit: 50,
    },
  })

  const { data: leads, isLoading: loadingLeads } = useLeadControllerFind({
    filter: {
      where: leadSearchWhere,
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

  const { data: optOuts } = useCommunicationOptOutControllerFind({
    filter: { where: { channel } },
  })

  const { mutateAsync: send, isPending: sending } = useMarketingCampaignControllerSend()

  // Descadastrados do canal atual nem aparecem na lista, e são tirados do envio
  const optedOutPersonIds = new Set((optOuts ?? []).map((optOut) => optOut.personId))

  // Sem contato no canal escolhido o envio só geraria falha: aparece na lista, mas travado
  function missingContactSublabel(contact?: string | null): string | undefined {
    if (contact) return undefined

    return isEmail ? t('sendCampaign.missingEmail') : t('sendCampaign.missingPhone')
  }

  const reachablePeople = peopleWithContact ?? []
  const reachablePeopleIds = new Set(reachablePeople.map((person) => person.id ?? ''))

  const personOptions = [
    ...reachablePeople.map((person) => ({
      id: person.id ?? '',
      label: person.name,
      sublabel: (isEmail ? person.email : person.phone) ?? undefined,
      disabled: false,
    })),
    ...(people ?? [])
      .filter((person) => !reachablePeopleIds.has(person.id ?? '') && !(isEmail ? person.email : person.phone))
      .map((person) => ({
        id: person.id ?? '',
        label: person.name,
        sublabel: missingContactSublabel(undefined),
        disabled: true,
      })),
  ].filter((option) => !optedOutPersonIds.has(option.id))
  const reachableLeads = leadsWithContact ?? []
  const reachableLeadIds = new Set(reachableLeads.map((lead) => lead.id ?? ''))

  const leadOptions = [
    ...reachableLeads.map((lead) => ({
      id: lead.id ?? '',
      label: lead.name,
      sublabel: (isEmail ? lead.email : lead.phone) ?? undefined,
      disabled: false,
    })),
    ...(leads ?? [])
      .filter((lead) => !reachableLeadIds.has(lead.id ?? '') && !(isEmail ? lead.email : lead.phone))
      .map((lead) => ({
        id: lead.id ?? '',
        label: lead.name,
        sublabel: missingContactSublabel(undefined),
        disabled: true,
      })),
  ]
  const propertyOptions = (properties ?? []).map((property) => ({
    id: property.id ?? '',
    label: `${property.code} · ${property.title}`,
    sublabel: formatAmount(property.salePrice ?? property.rentPrice ?? 0),
  }))
  const unreachablePersonIds = new Set(
    personOptions.filter((option) => option.disabled).map((option) => option.id),
  )
  const allowedPersonIds = personIds.filter(
    (id) => !optedOutPersonIds.has(id) && !unreachablePersonIds.has(id),
  )
  const allowedLeadIds = leadIds.filter(
    (id) => !leadOptions.some((option) => option.id === id && option.disabled),
  )

  const templateOptions = (templates ?? []).map((template) => ({ value: template.id ?? '', label: template.name }))

  function onTemplateChange(id: string) {
    setTemplateId(id)
    const selected = templates?.find((template) => template.id === id)
    if (selected) {
      setSubject(selected.subject ?? '')
      setContent(selected.body)

      if (isEmail) loadEmailDesign(editorRef, selected.design)
    }
  }

  // Email: conteúdo é o HTML exportado do editor; WhatsApp: texto puro do textarea
  async function resolveContent(): Promise<string> {
    if (!isEmail) return content

    const exported = await exportEmail(editorRef)

    return exported?.html ?? ''
  }

  async function onSend(onSent: (result: { sent: number; failed: number; skipped: number }) => void) {
    const finalContent = await resolveContent()

    const promise = send({
      data: {
        channel,
        personIds: allowedPersonIds,
        leadIds: allowedLeadIds.length ? allowedLeadIds : undefined,
        subject: subject || undefined,
        content: finalContent,
        propertyIds: propertyIds.length ? propertyIds : undefined,
      },
    })

    promisePopup(promise, {
      pending: t('sendCampaign.pending'),
      success: (result) => {
        const summary = { sent: result.sent ?? 0, failed: result.failed ?? 0, skipped: result.skipped ?? 0 }
        queryClient.invalidateQueries({ queryKey: getMarketingCampaignControllerListQueryKey() })
        onSent(summary)
        return t('sendCampaign.success', summary)
      },
      error: (error: AxiosError<ApiErrorResponse>) => getErrorMessageFromRequest(error, t('sendCampaign.error')),
    })
  }

  return {
    channel,
    setChannel,
    isEmail,
    editorRef,
    personIds: allowedPersonIds,
    togglePerson: (id: string) => setPersonIds((current) => toggleId(current, id)),
    leadIds: allowedLeadIds,
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
    canSend:
      (allowedPersonIds.length > 0 || allowedLeadIds.length > 0) && (isEmail || content.trim().length > 0),
  }
}
