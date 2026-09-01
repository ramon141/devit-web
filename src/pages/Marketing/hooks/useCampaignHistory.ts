import { useMarketingCampaignControllerList } from '@/api/generated/api'

export function useCampaignHistory() {
  const { data, isLoading } = useMarketingCampaignControllerList()

  return { campaigns: data ?? [], isLoading }
}
