import { Button } from 'antd'
import React from 'react'

const ButtonComponent = ({ size, styleButton, styletextbutton, textbutton, disabled, ...rests }) => {
  return (
    <Button
      style={{
        ...styleButton,
        background: disabled ? '#ccc' : styleButton.background
      }}
      size={size}
      {...rests}
    //   icon={<SearchOutlined color={colorButton} style={{color: colorButton}} />}
    >
      <span style={styletextbutton}>{textbutton}</span>
    </Button>
  )
}

export default ButtonComponent
