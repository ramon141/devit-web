import { useCommunicationLogControllerFind } from '@/api/generated/api'
import { CommunicationLogIncludeFilterItemsRelation } from '@/api/generated/models'

export function useCampaignDetail(campaignId: string | null) {
  const { data, isLoading } = useCommunicationLogControllerFind(
    {
      filter: {
        where: { campaignId: campaignId ?? '' },
        include: [
          { relation: CommunicationLogIncludeFilterItemsRelation.person },
          { relation: CommunicationLogIncludeFilterItemsRelation.lead },
        ],
        order: ['createdAt DESC'],
      },
    },
    { query: { enabled: !!campaignId } }
  )

  return { logs: data ?? [], isLoading }
}
