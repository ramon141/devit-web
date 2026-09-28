import { useState } from 'react'

export type DraftParticipant = { personId: string; personName: string }
export type DraftProperty = { propertyId: string; code: string; title: string }

export function useCalendarEventDraft() {
  const [participants, setParticipants] = useState<DraftParticipant[]>([])
  const [properties, setProperties] = useState<DraftProperty[]>([])
  const [outcomes, setOutcomes] = useState<string[]>([])
  const [attachmentFiles, setAttachmentFiles] = useState<File[]>([])

  function addParticipant(participant: DraftParticipant) {
    setParticipants((prev) => [...prev, participant])
  }

  function removeParticipant(personId: string) {
    setParticipants((prev) => prev.filter((item) => item.personId !== personId))
  }

  function addProperty(property: DraftProperty) {
    setProperties((prev) => [...prev, property])
  }

  function removeProperty(propertyId: string) {
    setProperties((prev) => prev.filter((item) => item.propertyId !== propertyId))
  }

  function addOutcome(outcome: string) {
    setOutcomes((prev) => [...prev, outcome])
  }

  function removeOutcome(index: number) {
    setOutcomes((prev) => prev.filter((_, i) => i !== index))
  }

  function reset() {
    setParticipants([])
    setProperties([])
    setOutcomes([])
    setAttachmentFiles([])
  }

  return {
    participants,
    addParticipant,
    removeParticipant,
    properties,
    addProperty,
    removeProperty,
    outcomes,
    addOutcome,
    removeOutcome,
    attachmentFiles,
    setAttachmentFiles,
    reset,
  }
}

export type CalendarEventDraft = ReturnType<typeof useCalendarEventDraft>
