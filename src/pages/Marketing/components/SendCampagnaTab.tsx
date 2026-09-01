import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MarketingCampaignControllerSendBodyChannel } from '@/api/generated/models/marketingCampaignControllerSendBodyChannel'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import SelectField from '@/components/SelectField'
import CheckboxListPicker from '@/pages/Marketing/components/CheckboxListPicker'
import { useSendCampaign } from '@/pages/Marketing/hooks/useSendCampaign'

function SendCampagnaTab() {
  const { t } = useTranslation('marketing')
  const [lastResult, setLastResult] = useState<{ sent: number; failed: number; skipped: number } | null>(null)
  const campaign = useSendCampaign()

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>{t('sendCampaign.recipientsTitle')}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex gap-2">
            <Button
              type="button"
              variant={campaign.channel === MarketingCampaignControllerSendBodyChannel.email ? 'default' : 'outline'}
              onClick={() => campaign.setChannel(MarketingCampaignControllerSendBodyChannel.email)}
            >
              {t('templateChannelOptions.email')}
            </Button>

            <Button
              type="button"
              variant={campaign.channel === MarketingCampaignControllerSendBodyChannel.whatsapp ? 'default' : 'outline'}
              onClick={() => campaign.setChannel(MarketingCampaignControllerSendBodyChannel.whatsapp)}
            >
              {t('templateChannelOptions.whatsapp')}
            </Button>
          </div>

          <CheckboxListPicker
            items={campaign.personOptions}
            selectedIds={campaign.personIds}
            onToggle={campaign.togglePerson}
            search={campaign.personSearch}
            onSearchChange={campaign.setPersonSearch}
            searchPlaceholder={t('sendCampaign.searchPeoplePlaceholder')}
            emptyMessage={t('sendCampaign.noPeople')}
          />
          <p className="text-xs text-muted-foreground">
            {t('sendCampaign.selectedCount', { count: campaign.personIds.length })}
          </p>

          <p className="text-sm font-medium">{t('sendCampaign.leadsTitle')}</p>
          <CheckboxListPicker
            items={campaign.leadOptions}
            selectedIds={campaign.leadIds}
            onToggle={campaign.toggleLead}
            search={campaign.leadSearch}
            onSearchChange={campaign.setLeadSearch}
            searchPlaceholder={t('sendCampaign.searchLeadsPlaceholder')}
            emptyMessage={t('sendCampaign.noLeads')}
          />
          <p className="text-xs text-muted-foreground">
            {t('sendCampaign.selectedCount', { count: campaign.leadIds.length })}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('sendCampaign.propertiesTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          <CheckboxListPicker
            items={campaign.propertyOptions}
            selectedIds={campaign.propertyIds}
            onToggle={campaign.toggleProperty}
            search={campaign.propertySearch}
            onSearchChange={campaign.setPropertySearch}
            searchPlaceholder={t('sendCampaign.searchPropertiesPlaceholder')}
            emptyMessage={t('sendCampaign.noProperties')}
          />
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>{t('sendCampaign.contentTitle')}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <FormFieldWrapper label={t('sendCampaign.templateLabel')}>
            <SelectField
              value={campaign.templateId}
              onValueChange={campaign.onTemplateChange}
              options={campaign.templateOptions}
              placeholder={t('sendCampaign.templatePlaceholder')}
            />
          </FormFieldWrapper>

          <FormFieldWrapper label={t('sendCampaign.subjectLabel')}>
            <Input value={campaign.subject} onChange={(event) => campaign.setSubject(event.target.value)} />
          </FormFieldWrapper>

          <FormFieldWrapper label={t('sendCampaign.contentLabel')} required>
            <Textarea
              value={campaign.content}
              onChange={(event) => campaign.setContent(event.target.value)}
              rows={6}
            />
          </FormFieldWrapper>

          <div className="flex items-center justify-between">
            {lastResult && (
              <p className="text-sm text-muted-foreground">
                {t('sendCampaign.lastResult', lastResult)}
              </p>
            )}

            <Button
              type="button"
              disabled={!campaign.canSend || campaign.isSending}
              onClick={() => campaign.onSend(setLastResult)}
              className="ml-auto"
            >
              {t('sendCampaign.sendLabel')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default SendCampagnaTab
