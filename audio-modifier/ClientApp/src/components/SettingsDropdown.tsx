import { useState } from "react";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";
import { Direction } from "reactstrap/types/lib/Dropdown"

interface SettingsDropdownProp {
  toggleButtonText: string
  title: string
  width: string
  direction?: Direction
  children?: React.ReactNode
}

export default function SettingsDropdown({ 
  toggleButtonText,
  title,
  width,
  direction = "down",
  children
}: SettingsDropdownProp) {
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false)
  const toggle = () => setDropdownOpen((prevState) => !prevState);

  return (
    <Dropdown 
      isOpen={dropdownOpen} toggle={toggle}
      direction={direction} 
      className="w-100"
      style={{
        minWidth: width
      }}  
    >
      <DropdownToggle caret color="info" outline className="mb-3 mb-sm-0 ms-auto d-block">
        {toggleButtonText}
      </DropdownToggle>
      <DropdownMenu 
        end className="w-100 pb-4"
        style={{
          maxWidth: width
        }}  
      >
        <DropdownItem header>{title}</DropdownItem>
        <DropdownItem divider />

        {children}
      </DropdownMenu>
    </Dropdown>
  )
}