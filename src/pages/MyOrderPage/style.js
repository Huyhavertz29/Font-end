import styled from "styled-components";

export const WrapperContainer = styled.div`
    width: 100%;
    padding: 20px 0;
    background: #f5f5fa;
    min-height: 100vh;

    h4 {
        font-size: 22px;
        font-weight: 600;
        margin-bottom: 20px;
        padding-left: 12px;
        color: #333;
    }
`;

export const WrapperListOrder = styled.div`
    max-width: 900px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

export const WrapperItemOrder = styled.div`
    background: white;
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.08);
    border: 1px solid #ececec;

    display: flex;
    flex-direction: column;
    gap: 16px;
`;

export const WrapperStatus = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;

    span {
        font-size: 14px;
    }
`;

export const WrapperHeaderItem = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
`;

export const WrapperFooterItem = styled.div`
    margin-top: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    div span:first-child {
        display: block;
        font-size: 14px;
        margin-bottom: 4px;
    }
`;
