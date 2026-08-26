import { XIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import SelectField from '@/components/SelectField'
import type { PropertyRoomRoomType } from '@/api/generated/models'
import { roomTypeOptions } from '@/pages/Imoveis/Scheda/schemas/roomTypeOptions'
import { usePropertyRooms } from '@/pages/Imoveis/Scheda/hooks/usePropertyRooms'

function roomLabel(type: string) {
  return roomTypeOptions.find((option) => option.value === type)?.label ?? type
}

type PropertyRoomsManagerProps = {
  propertyId: string
}

function PropertyRoomsManager({ propertyId }: PropertyRoomsManagerProps) {
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

  return (
    <div className="sm:col-span-2">
      <p className="mb-2 text-sm font-medium">Ambienti e pertinenze</p>

      <div className="grid gap-2">
        {rooms.map((room) => (
          <div key={room.id} className="flex items-center justify-between rounded-lg px-3 py-2 ring-1 ring-border">
            <span className="text-sm">
              {room.quantity != null && room.quantity > 1 && `${room.quantity}x `}
              {roomLabel(room.roomType)}
              {room.areaSqm != null && ` · ${room.areaSqm} m²`}
              {room.equipment && ` · ${room.equipment}`}
            </span>
            <Button variant="ghost" size="icon-sm" onClick={() => room.id && removeRoom(room.id)}>
              <XIcon className="size-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-2 flex flex-wrap items-end gap-2">
        <div className="min-w-40">
          <SelectField
            value={roomType}
            onValueChange={(value) => setRoomType(value as PropertyRoomRoomType)}
            options={roomTypeOptions}
            placeholder="Tipo ambiente"
          />
        </div>
        <Input
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          type="number"
          placeholder="Quantità"
          className="w-24"
        />
        <Input value={widthM} onChange={(e) => setWidthM(e.target.value)} type="number" placeholder="Larghezza (m)" className="w-32" />
        <Input value={lengthM} onChange={(e) => setLengthM(e.target.value)} type="number" placeholder="Lunghezza (m)" className="w-32" />
        <Input
          value={equipment}
          onChange={(e) => setEquipment(e.target.value)}
          placeholder="Equipaggiamento"
          className="w-40"
        />
        <Button type="button" onClick={addRoom}>Aggiungi</Button>
      </div>
    </div>
  )
}

export default PropertyRoomsManager
