import { ChangeEvent, KeyboardEvent } from 'react'

export type TVolumePlayerProps = {
  volume: number
  isActive: boolean
  onToggleMuteHandler: () => void
  onVolumeRangeHandler: (e: ChangeEvent<HTMLInputElement>) => void
  onVideoPressHandler: (event: KeyboardEvent<HTMLVideoElement>) => void
}
