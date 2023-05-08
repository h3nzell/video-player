import { FC,  useState } from 'react'
import { Tooltip } from '@mui/material'


import { TTooltipProps } from './types'
import styles from './Tooltip.module.scss'

const TooltipComponent: FC<TTooltipProps> = ({
  title,
  children,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const onMouseMoveHandler = () => {
    setIsOpen(prev => !prev)
  }

  return (
    <Tooltip
      arrow
      open={isOpen}
      title={title}
      placement={"top"}
      className={className}
    >
      <span className={styles.tooltip__icon} onMouseEnter={onMouseMoveHandler} onMouseLeave={onMouseMoveHandler}>
        {children}
      </span>
    </Tooltip>
  )
}

export default TooltipComponent
