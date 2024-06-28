import React from "react";
import "../TypeProduct/TypeProduct.css"
import { useNavigate } from "react-router-dom";

const TypeProduct = ({name}) => {
    const navigate = useNavigate()
    const handleNavigateType = (type) =>{
        // console.log('type',type)
        if(type==='Sản phẩm bán chạy'){
            navigate('/selling')
        }
        else if(type==='Liên hệ'){
            navigate('/contact')
        }
        else if(type==='Giới thiệu'){
            navigate('/about')
        }
        else{
        // cái sau dấu .type là để nó không bị bể phông chữ khi có dấu trên url (chuyển thành chữ không dấu, khoảng trắng là dấu _)
        // lưu chữ có dấu vào trong cái state, dùng useLocation để xem bên TypeProductPage
        navigate(`/product/${type.normalize('NFD').replace(/[\u0300-\u036f]/g,'')?.replace(/ /g,'_')}`,{state: type})
    }
    }
    return (
        <div style={{cursor: 'pointer'}} className="type-product" onClick={()=> handleNavigateType(name)}>{name}</div>
    )
}

export default TypeProduct
