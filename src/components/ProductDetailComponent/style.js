import { Col, Image, InputNumber } from "antd";
import styled from "styled-components";

export const WrapperStyleImageSmall = styled(Image)`
    height: 64px;
    width: 64px;
`

export const WrapperStyleColImage = styled(Col)`
    flex-basis: unset;
    display: flex;
`

export const WrapperStyleNameProduct = styled.h1`
    color: rgb(36,36,36);
    font-size: 24px;
    font-weight: 300;
    line-height: 32px;
    word-break: break-word;   
`
export const WrapperStyleTextSell = styled.span`
    font-size: 12px;
    line-height: 24px;
    color: rgb(120,120,120);
`

export const WrapperPriceProduct = styled.div`
    background: rgb(250,250,250);
    border-radius: 4px;
`

export const WrapperPriceTextProduct = styled.h1`
    font-size: 20px;
    background-color: #F6F1EB;
    line-height: 40px;
    color: #696969;
    font-weight: 500;
    margin-top: 10px;
`

export const WrapperQuantityProduct = styled.div`
    display: flex;
    gap: 4px;
    align-items: center;
    width: 100px;
    border: 1px solid #ccc;
    border-radius: 4px;
`

export const WrapperInputNumber = styled(InputNumber)`
  &.ant-input-number.ant-input-number-sm {
          width: 40px;
          border-top: none;
          border-bottom: none;
          .ant-input-number-handler-wrap {
            display: none;
       }
   };

   
   
`



