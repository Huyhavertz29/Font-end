import { Row } from "antd";
import { Link } from "react-router-dom";
import styled from 'styled-components'

export const WrapperHeader = styled(Row)`
    padding: 10px 120px;
    background-color: rgb(26,148,255)
    gap:16px;
    flex-wrap: nowrap;
    width:1270px;
    padding: 10px 0;
`

export const WrapperTextHeader = styled(Link)`
    font-size: 24px;            // to hơn để nổi bật
    color: #fff;
    font-weight: 800;            // đậm, chuyên nghiệp
    font-family: 'Poppins', sans-serif; 
    letter-spacing: 1px;
    text-decoration: none;
    transition: all 0.2s;

    &:hover {
        color: #ffe600;
        transform: scale(1.05);  // hover nhẹ
    }
`;


export const WrapperHeaderAccount = styled.div`
    display: flex;
    align-items: center;
    color: #fff;
    gap: 12px;
    
`

export const WrapperTextHeaderSmall = styled.span`
    font-size: 12px;
    color: #fff;
`

export const WrapperContentPopup = styled.p`
    cursor: pointer;
    &:hover{
        color: rgb(26,148,255);
    }
`
