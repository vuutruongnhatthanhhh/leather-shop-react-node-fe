import React, {useEffect, useState} from "react";
import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLight } from "./style";
import InputForm from "../../components/InputForm/InputForm";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { Image, message } from "antd";
import imageLogo  from '../../assets/image/logo_login.png'
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons'
import { useNavigate } from "react-router-dom";
import * as UserService from '../../services/UserService'
import { useMutationHooks } from "../../hooks/useMutationHook";
import Loading from "../../components/LoadingComponent/Loading";


const SignUpPage = () => {
  
    const [isShowPassword, setIsShowPassword] = useState(false)
    const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [otp, setOtp] = useState(0);

        // gọi qua bên api
const mutation = useMutationHooks(
  data => UserService.signupUser(data)
)

// data là dữ liệu đăng nhập, isPending (mutation đang xử lý) là thuộc tính load bên Loading components
// isSuccess mutation thực hiện thành công
const { data, isPending, isSuccess, isError } = mutation


useEffect(()=>{
  if(isSuccess && data?.status !== 'ERR' ) {
    // Khi đăng ký thành công hiển thị thông báo (Message components), chuyển đến trang SignIn
    const idUser = data?.data?._id
    message.success('Đăng ký tài khoản thành công')
    navigateSignIn(idUser)
  } else if (isError){
    message.error()
  }
},[isSuccess, isError])


    const handleOnchangeEmail=(value) =>{
         // Lấy tất cả ký tự từ bàn phím nhận vào bên InputForm truyền vào đây
        setEmail(value)
    } 

    const handleOnchangePassword=(value) =>{
      setPassword(value)
  } 

  const handleOnchangeConfirmPassword=(value) =>{
    setConfirmPassword(value)
} 



const handleSignUp=()=>{
  
  
// console.log('otp',otp); // In ra mã OTP gồm 4 số ngẫu nhiên 
  mutation.mutate({email, password, confirmPassword})
}




  
   
    const navigate = useNavigate()
    const navigateSignIn = (idUser) => {
      navigate('/otp', { state: { idUser } });
    }


    

    return (
        <div style={{display:'flex', alignItems:'center', justifyContent:'center',background:'#ccc' , height:'100vh'}}>
        <div style={{width: '800px', height:'445px', borderRadius: '6px', background:'#fff', display:'flex'}}>
           <WrapperContainerLeft>
           <h1>Đăng ký</h1>
           <p>Tạo tài khoản để trải nghiệm mua sắm tốt hơn</p>
           <InputForm style={{ marginBottom: '10px'}} placeholder="abc@gmail.com" value={email} onChange={handleOnchangeEmail}/>
           <div style={{ position: 'relative' }}>
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
          </div>
          <div style={{ position: 'relative' }}>
            <span
              onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)}
              style={{
                zIndex: 10,
                position: 'absolute',
                top: '4px',
                right: '8px'
              }}
            >{
                isShowConfirmPassword ? (
                  <EyeFilled />
                ) : (
                  <EyeInvisibleFilled />
                )
              }
            </span>
            <InputForm placeholder="comfirm password" type={isShowConfirmPassword ? "text" : "password"}
               value={confirmPassword} onChange={handleOnchangeConfirmPassword}
            />
          </div>
          {data?.status === 'ERR' && <span style={{color:'red'}}>{data?.message}</span>}
          <Loading isPending={isPending}>
           <ButtonComponent
                    onClick={handleSignUp}
                    // Không bấm được vào nút đăng ký khi các đối tượng này trống
                    disabled ={!email.length || !password.length || !confirmPassword.length}
                   bordered={false}
                   size={40}
                   styleButton={{
                       background: '#444',
                       height: '48px',
                       width: '100%',
                       border: 'none',
                       borderRadius:'4px',
                       color: '#fff',
                       fontWeight: '700',
                       margin: '26px 0 10px'
                   }}
                   textButton={'Đăng ký'}
                 
               >

               </ButtonComponent>
               </Loading>
               <p>Bạn đã có tài khoản? <WrapperTextLight onClick={navigateSignIn}>Đăng nhập</WrapperTextLight></p>
           </WrapperContainerLeft>
           <WrapperContainerRight>
               <Image src={imageLogo} preview={false} alt="image-logo" height="180" width="180"/>
           </WrapperContainerRight>
       </div>
      </div>
    )
}

export default SignUpPage