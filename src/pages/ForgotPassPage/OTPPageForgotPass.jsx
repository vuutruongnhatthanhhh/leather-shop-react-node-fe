import React, { useEffect, useState } from "react";
import InputForm from "../../components/InputForm/InputForm";
import {WrapperContainerLeft, WrapperContainerRight, WrapperTextLight} from './style'
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import imageLogo  from '../../assets/image/logo_login.png'
import { Divider, Image, message } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons'
import * as UserService from '../../services/UserService'
import { useMutation } from "@tanstack/react-query";
import { useMutationHooks } from "../../hooks/useMutationHook";
import Loading from "../../components/LoadingComponent/Loading";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { updateUser } from "../../redux/slides/userSlide";


const OTPPage = () => {
    const [isShowPassword, setIsShowPassword] = useState(false)
    // lấy được cái state đường dẫn chi tiết sản phẩm sau khi đăng nhập
    const [email, setEmail] = useState('');
    const location = useLocation()
    const [otp, setOTP] = useState('');
   
    const navigate = useNavigate()
    const dispatch = useDispatch();

    
    const { otp: otpForgotPass, idUser } = location.state || {};
    // console.log('iduser',idUser)
    
    // console.log('otp:', otpForgotPass);

    // gọi qua bên api
const mutation = useMutationHooks(
  data => UserService.verifyUser(data)
)

const { data, isPending, isSuccess, isError } = mutation

useEffect(()=>{

  if(isSuccess &&data?.status === 'OK'){
    message.success('Thành công')
    navigate('/sign-in')
} else if(isError){
    message.error('Sai mã OTP')
}
},[isSuccess,isError])

const handleGetDetailsUser = async(id, token) => {
  const storage = localStorage.getItem('refresh_token')
  const refreshToken = JSON.parse(storage)
  const res = await UserService.getDetailsUser(id, token)
  // Truyền tất cả thông tin người dùng vào redux/userSlide 
  //Tách từng thuộc tính của data ra, với đưa token vào trong cái biến access_token
  // Dùng redux
  dispatch(updateUser({...res?.data, access_token: token,
    refreshToken
  }))
  
  
}

// console.log('mutation',mutation)

    const handleNavigateSignUp =() =>{
        navigate('/sign-up')
    }

    const handleOnchange=(value) =>{
        // Lấy tất cả ký tự từ bàn phím nhận vào bên InputForm truyền vào đây
       setOTP(value)
   } 

//    const handleOnchangePassword=(value) =>{
//      setPassword(value)
//  }
 
const handleVerify = () => {
  if (otp === otpForgotPass) {
      message.success('Mã OTP chính xác');
      navigate('/change-pass', { state: { idUser } }); 
    
  } else {
      message.error('Sai mã OTP');
  }
};
    return (
       <div style={{display:'flex', alignItems:'center', justifyContent:'center',background:'#ccc' , height:'100vh'}}>
         <div style={{width: '800px', height:'445px', borderRadius: '6px', background:'#fff', display:'flex'}}>
            <WrapperContainerLeft>
            <h1>Xác thực OTP</h1>
            <p>Nhập mã OTP được gửi về email </p>
            <InputForm style={{ marginBottom: '10px'}} placeholder="Mã OTP" value={otp} onChange={handleOnchange}/>
          
            {/* <div style={{ position: 'relative' }}>
            <span
              onClick={() => setIsShowPassword(!isShowPassword)}
              style={{
                zIndex: 10,
                position: 'absolute',
                top: '4px',
                right: '8px'
              }}
            >{
                isShowPassword ? (
                  <EyeFilled />
                ) : (
                  <EyeInvisibleFilled />
                )
              }
            </span>
            <InputForm placeholder="password" style={{ marginBottom: '10px' }} type={isShowPassword ? "text" : "password"}
              value={password} onChange={handleOnchangePassword}
              />
          </div> */}

                {data?.status === 'ERR' && <span style={{color:'red'}}>{data?.message}</span>}
              <Loading isPending={isPending}>
            <ButtonComponent
             disabled ={!otp.length }
             onClick={handleVerify}
                    bordered={false}
                    size={40}
                    styleButton={{
                        background: '#444',
                        height: '48px',
                        width: '100%',
                        border: 'none',
                        borderRadius:'4px',
                        color: '#fff',
                        fontWeight: '700'
                        // margin: '26px 0 10px'
                    }}
                    textButton={'Xác thực'}
                  
                >

                </ButtonComponent>
                </Loading>
                {/* <p><WrapperTextLight>Quên mật khẩu</WrapperTextLight></p> */}
                {/* <p>Chưa có tài khoản? <WrapperTextLight onClick={handleNavigateSignUp}>Tạo tài khoản</WrapperTextLight></p> */}
            </WrapperContainerLeft>
            <WrapperContainerRight>
                <Image src={imageLogo} preview={false} alt="image-logo" height="180" width="180"/>
            </WrapperContainerRight>
        </div>
       </div>
    )
}

export default OTPPage