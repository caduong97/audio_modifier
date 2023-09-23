import { ChangeEvent } from "react";
import { DropdownItem, InputGroup, Input, InputGroupText } from "reactstrap";

interface SettingItemProps {
  name: string,
  type: 'text' | 'number' // Add more if needed
  min?: any,
  max?: any
  unit?: string;
  placeholder?: any,
  value: any
  onValueChange: (e: ChangeEvent<HTMLInputElement>) => void,
  display: 'block' | 'flex',
  truncateName?: boolean,
  itemPaddingX?: string,
  itemPaddingY?: string,

}

export default function SettingItem({ 
  name, type, min, max, unit, placeholder, 
  value, onValueChange, 
  display, truncateName, itemPaddingX, itemPaddingY }: SettingItemProps) {

  // const nameFullStyle = nameAdditionalStyle
  //   ? "w-100 mb-0 flex-grow-1 ".concat(nameAdditionalStyle)
  //   : "w-100 mb-0 flex-grow-1"

  let itemStyle = display === 'flex'
    ? 'd-flex align-items-center'
    : 'd-block'

    if (itemPaddingX) {
      itemStyle = itemStyle.concat(` ${itemPaddingX}`)
    }
    if (itemPaddingY) {
      itemStyle = itemStyle.concat(` ${itemPaddingY}`)
    }

  let nameStyle = display === 'flex'
    ? 'w-100 mb-0 flex-grow-1'
    : 'w-100'

  //   return style
  // }

  return (
    <DropdownItem 
      text 
      className={itemStyle}
    >
      <p 
        className={nameStyle}
        style={truncateName ? {
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }: {}}  
      >{name}</p>
      <InputGroup className={display === 'flex' ? "w-50" : "w-100"}>
        <Input type={type} min={min} max={max} step={.01} placeholder={placeholder} value={value} onChange={onValueChange} />
        { 
          unit != null &&
          <InputGroupText>
            {unit}
          </InputGroupText>
        }
        
      </InputGroup>
    </DropdownItem>
  )
}