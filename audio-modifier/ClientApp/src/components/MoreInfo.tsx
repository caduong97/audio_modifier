import { UncontrolledTooltip } from "reactstrap";
import type { Placement } from '@popperjs/core';

type MoreInfoType = "info" | "warning" | "error"

interface MoreInfoProps {
  placement?: Placement,
  autohide?: boolean
  type?: MoreInfoType
  trigger?: string
  target: string
  children: React.ReactNode
}



export default function MoreInfo({
    placement = "top",
    autohide = false,
    type = "info",
    trigger,
    target,
    children
  } : MoreInfoProps
) {

  const args = {
    flip: false
  }

  const backgroundColor = () => {
    switch (type) {
      case "info":
        return "#495057"
      case "warning":
        return "#ffc107"
      case "error":
        return "#dc3545"
      default:
        return "#495057"
    }
  }

  const textColor = () => {
    switch (type) {
      case "info":
        return "#fff"
      case "warning":
        return "#000"
      case "error":
        return "#fff"
      default:
        return "#fff"
    }
  }

  return (
    <UncontrolledTooltip
      {...args}
      placement={placement}
      autohide={autohide}
      target={target}
      trigger={trigger ? trigger : "hover focus"}
      fade={false}
      className=""
      style={{
        maxWidth: "320px",
        backgroundColor: backgroundColor(),
        color: textColor(),
        padding: "10px"
      }}
    >
      {children}
    </UncontrolledTooltip>
  )
}