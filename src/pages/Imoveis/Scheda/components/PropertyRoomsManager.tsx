import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import SelectField from '@/components/SelectField'
import RemovableRow from '@/components/RemovableRow'
import type { PropertyRoomRoomType } from '@/api/generated/models'
import { getRoomTypeOptions } from '@/pages/Imoveis/Scheda/schemas/roomTypeOptions'
import { usePropertyRooms } from '@/pages/Imoveis/Scheda/hooks/usePropertyRooms'
import { getOptionLabel } from '@/utils/getOptionLabel'

type PropertyRoomsManagerProps = {
  propertyId: string
}

function PropertyRoomsManager({ propertyId }: PropertyRoomsManagerProps) {
  const { t } = useTranslation('imoveis')
  const {
    rooms,
    roomType,
    setRoomType,
    quantity,
    setQuantity,
    widthM,
    setWidthM,
    lengthM,
    setLengthM,
    equipment,
    setEquipment,
    addRoom,
    removeRoom,
  } = usePropertyRooms(propertyId)
  const roomTypeOptions = getRoomTypeOptions(t)

  return (
    <div className="sm:col-span-2">
      <p className="mb-2 text-sm font-medium">{t('scheda.roomsManager.title')}</p>

      <div className="grid gap-2">
        {rooms.map((room) => (
          <RemovableRow key={room.id} onRemove={() => room.id && removeRoom(room.id)}>
            <span className="text-sm">
              {room.quantity != null && room.quantity > 1 && `${room.quantity}x `}
              {getOptionLabel(roomTypeOptions, room.roomType)}
              {room.areaSqm != null && ` · ${room.areaSqm} m²`}
              {room.equipment && ` · ${room.equipment}`}
            </span>
          </RemovableRow>
        ))}
      </div>

      <div className="mt-2 flex flex-wrap items-end gap-2">
        <div className="min-w-40">
          <SelectField
            value={roomType}
            onValueChange={(value) => setRoomType(value as PropertyRoomRoomType)}
            options={roomTypeOptions}
            placeholder={t('scheda.roomsManager.roomTypePlaceholder')}
          />
        </div>
        <Input
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          type="number"
          placeholder={t('scheda.roomsManager.quantityPlaceholder')}
          className="w-24"
        />
        <Input
          value={widthM}
          onChange={(e) => setWidthM(e.target.value)}
          type="number"
          placeholder={t('scheda.roomsManager.widthPlaceholder')}
          className="w-32"
        />
        <Input
          value={lengthM}
          onChange={(e) => setLengthM(e.target.value)}
          type="number"
          placeholder={t('scheda.roomsManager.lengthPlaceholder')}
          className="w-32"
        />
        <Input
          value={equipment}
          onChange={(e) => setEquipment(e.target.value)}
          placeholder={t('scheda.roomsManager.equipmentPlaceholder')}
          className="w-40"
        />
        <Button type="button" onClick={addRoom}>{t('scheda.roomsManager.add')}</Button>
      </div>
    </div>
  )
}

export default PropertyRoomsManager
