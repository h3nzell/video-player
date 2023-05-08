import { MutableRefObject, KeyboardEvent } from 'react'

import type { useStateType } from 'components/types'

export type TVolumeState = {
  value: number
  preValue?: number
  isActive: boolean
}

export interface IVideoPlayerProps {
  volume: number
  onVideoTimeUpdate: () => void
  onTogglePlayHandler: () => void
  setVolume: useStateType<TVolumeState>
  videoRef: MutableRefObject<HTMLVideoElement | null>
  onVideoPressHandler: (event: KeyboardEvent<HTMLVideoElement | HTMLDivElement>) => void
}
