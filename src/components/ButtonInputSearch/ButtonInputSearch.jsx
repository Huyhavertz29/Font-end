import React from 'react';
import { SearchOutlined } from '@ant-design/icons';
import InputComponent from '../InputComponent/InputComponent';
import ButtonComponent from '../ButtonComponent/ButtonComponent';

const ButtonInputSearch = (props) => {
  const {
    size,
    placeholder,
    textbutton,
    bordered,
    backgroundColorInput = '#fff',
    backgroundColorButton = 'rgb(13,92,182)',
    colorButton = '#fff',
  } = props;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: '8px',               // bo góc
        padding: '2px 6px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.15)', // shadow nhẹ
        marginRight: '20px',               // cách avatar
        height: '40px',
      }}
    >
      <InputComponent
        size={size}
        placeholder={placeholder}
        style={{
          backgroundColor: backgroundColorInput,
          border: 'none',
          outline: 'none',
          flex: 1,
          height: '100%',
        }}
        {...props}
      />
      <ButtonComponent
        size={size}
        styleButton={{
          background: backgroundColorButton,
          border: !bordered && 'none',
          borderRadius: '6px',
          height: '32px',
        }}
        icon={<SearchOutlined style={{ color: colorButton }} />}
        textbutton={textbutton}
        styletextbutton={{ color: colorButton, fontWeight: 'bold' }}
      />
    </div>
  );
};

export default ButtonInputSearch;
