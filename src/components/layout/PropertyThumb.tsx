import { BuildingIcon } from 'lucide-react'

const API_URL = import.meta.env.VITE_APP_BASE_API_URL

type PropertyThumbProps = {
  photoId?: string | null
}

// Foto de capa do imóvel, ou ícone de prédio quando não há foto
function PropertyThumb({ photoId }: PropertyThumbProps) {
  if (photoId) {
    return <img src={`${API_URL}/public/attachments/${photoId}`} alt="" className="size-8 rounded-md object-cover" />
  }

  return <BuildingIcon className="size-6" />
}

export default PropertyThumb
