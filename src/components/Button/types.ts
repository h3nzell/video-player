import type { ReactNode, MouseEvent, KeyboardEvent } from 'react'

export default interface IButtonProps {
  className?: string;
  children?: ReactNode | string
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void
  onKeyDownHandler?: (event: KeyboardEvent<HTMLVideoElement>) => void
}
