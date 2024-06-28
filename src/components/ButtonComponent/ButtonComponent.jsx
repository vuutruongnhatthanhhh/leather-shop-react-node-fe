import { Button } from "antd";
import React from "react";

// ...rest có nghĩa là nhận thêm những tham số thêm không cố định nữa
const ButtonComponent = ({size, styleButton, styleTextButton, textButton, disabled, ...rest}) => {
    return (
        <Button
        style={{
            ...styleButton,
            background: disabled ? '#ccc': styleButton.background
        }}
        size={size}  
        // bordered={bordered} 
        
       
        
        {...rest}
        // icon={<SearchOutlined  />}
        // onClick={handleClick} // Thay đổi trạng thái khi button được click
        >{textButton}</Button>
    )
}

export default ButtonComponent