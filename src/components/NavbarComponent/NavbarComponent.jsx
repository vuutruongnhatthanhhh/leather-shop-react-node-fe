import React, { useEffect, useState } from "react";
import { WrapperContent, WrapperLabelText, WrapperTextPrice, WrapperTextValue } from "./style";
import { Checkbox, Col, Rate, Row } from "antd";
import * as ProductService from '../../services/ProductService'
import TypeProduct from "../TypeProduct/TypeProduct";
// Thanh danh muc
const NavbarComponent = () => {
    const [typeProducts, setTypeProducts] = useState([])
    const onChange = () => { }
    const renderContent = (type, options) => {
        switch (type) {
            // Nếu là text thì hiển thị kiểu h1
            case 'text':
                return options.map((option) => {
                    
                    return (
                            <WrapperTextValue>{option}</WrapperTextValue>
                    )
                    
                })
            case 'checkbox':
               return (
                <Checkbox.Group style={{ width: '100%', display:'flex', flexDirection:'column', gap: '12px' }} onChange={onChange}>
                    {options.map((option) =>{
                        return (
                            <Checkbox style={{marginLeft:0}} value={option.value}>{option.label}</Checkbox>
                        )
                    })}
              </Checkbox.Group>
               )
               
               case 'star':
                return options.map((option) =>{
                    return (
                        <div style={{display:'flex', gap:'10px'}}>
                        <Rate style={{fontSize: '12px'}} disabled defaultValue={option} />
                        <span style={{fontSize:'12px'}}>{`từ ${option} sao`}</span>
                        </div>
                    )
                }) 

                case 'price':
                return options.map((option) =>{
                    return (
                        <WrapperTextPrice>{option}</WrapperTextPrice>
                    )
                }) 
            default:
                return {}
        }
    }


    const fetchAllTypeProduct = async () =>{
        const  res = await ProductService.getAllTypeProduct()
        // console.log('res', res)
        if(res?.status === 'OK'){
            setTypeProducts(res?.data)
        }
      
     }

     useEffect(()=>{
        fetchAllTypeProduct()
     },[])
    return (
        <div>
            {/* <WrapperLabelText>label</WrapperLabelText> */}
            <WrapperContent>
            {typeProducts.map((item) => {
            return (
                <TypeProduct name={item} key={item}/>
            )
           })}
            </WrapperContent>
{/* checkbox tỉnh thành */}
            {/* <WrapperContent>
            {renderContent('checkbox', [
             { value:'a',label: 'A'},
             { value:'b',label: 'B'}
             ])}
            </WrapperContent> */}

{/*  số sao */}
            {/* <WrapperContent>
            {renderContent('star', [3,4,5])}
            </WrapperContent> */}
{/* Khoảng giá */}
            {/* <WrapperContent>
            {renderContent('price', ['dưới 1tr', 'trên 10tr'])}
            </WrapperContent> */}

          
        </div>
    )
}

export default NavbarComponent