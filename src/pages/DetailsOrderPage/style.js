import styled from "styled-components";

export const WrapperHeaderUser = styled.div`
    background: #fff;
    border-radius: 8px;
    padding: 20px;
    margin-top: 20px;
    display: flex;
    gap: 20px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    border: 1px solid #ececec;
`;

export const WrapperInfoUser = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

export const WrapperLabel = styled.div`
    font-size: 15px;
    font-weight: 600;
    margin-bottom: 4px;
    color: #333;
`;

export const WrapperContentInfo = styled.div`
    font-size: 14px;
    color: #555;
    display: flex;
    flex-direction: column;
    gap: 4px;

    span {
        font-weight: 500;
        color: #333;
    }

    .status-payment span {
        color: ${props => props.isPaid ? "green" : "red"};
        font-weight: 600;
    }
`;

export const WrapperStyleContent = styled.div`
    margin-top: 20px;
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    border: 1px solid #ececec;

    display: flex;
    flex-direction: column;
    gap: 16px;
`;

export const WrapperItemLabel = styled.div`
    width: 120px;
    text-align: center;
    color: #777;
    font-size: 14px;
`;

export const WrapperProduct = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 0;
    border-bottom: 1px solid #f0f0f0;
`;

export const WrapperNameProduct = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    width: 610px;
`;

export const WrapperItem = styled.div`
    width: 120px;
    text-align: center;
    font-size: 15px;
    color: #333;
    font-weight: 500;
`;

export const WrapperAllPrice = styled.div`
    display: flex;
    justify-content: flex-end;
    padding: 8px 0;
    border-top: 1px solid #f0f0f0;
    font-size: 15px;

    ${WrapperItemLabel} {
        width: 150px;
        text-align: right;
        color: #444;
        font-weight: 600;
    }

    ${WrapperItem} {
        width: 150px;
        text-align: right;
        font-weight: 700;
        color: #111;
    }
`;
