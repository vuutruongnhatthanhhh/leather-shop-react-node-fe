import {Checkbox, Form, message } from 'antd'
import React, { useEffect, useState } from 'react'
import { CustomCheckbox, WrapperCountOrder, WrapperInfo, WrapperItemOrder, WrapperLeft, WrapperListOrder, WrapperRight, WrapperStyleHeader, WrapperStyleHeaderDilivery, WrapperTotal } from './style';
import { DeleteOutlined, MinusOutlined, PlusOutlined} from '@ant-design/icons'

import { WrapperInputNumber } from '../../components/ProductDetailComponent/style'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { useDispatch, useSelector } from 'react-redux';
import { decreaseAmount, increaseAmount, removeAllOrderProduct, removeOrderProduct, selectedOrder } from '../../redux/slides/orderSlide';
import { convertPrice } from '../../utils';
import { useMemo } from 'react';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import InputComponent from '../../components/InputComponent/InputComponent';
import { useMutationHooks } from '../../hooks/useMutationHook';
import * as  UserService from '../../services/UserService'
import Loading from '../../components/LoadingComponent/Loading';
// import * as message from '../../components/Message/Message'
import { updateUser } from '../../redux/slides/userSlide';
import { useNavigate } from 'react-router-dom';
import StepComponent from '../../components/StepComponent/StepComponent';

const OrderPage = () => {
  // Lấy ra order từ Redux
  const order = useSelector((state) => state.order)
  const user = useSelector((state) => state.user)

  const [listChecked, setListChecked] = useState([])
  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false)
 
  const [stateUserDetails, setStateUserDetails] = useState({
    name: '',
    phone: '',
    address: '',
    city: ''
  })
  const navigate = useNavigate()
  const [form] = Form.useForm();

  const dispatch = useDispatch()
  const onChange = (e) => {
    // e.target.value nó lấy giá trị từ value trong cái CustomCheck, là id
    // console.log(`checked = ${e.target.value}`)
    // Nếu nó đã được check rồi
    if(listChecked.includes(e.target.value)){
      // Tạo ra 1 biến mới lưu mấy cái check và bỏ cái dc check lại đi
      const newListChecked = listChecked.filter((item) => item !== e.target.value)
      setListChecked(newListChecked)
    }else {
      setListChecked([...listChecked, e.target.value])
    }
  };
  // console.log('listChecked', listChecked)


  const handleChangeCount = (type, idProduct, limited) => {
    if(type === 'increase') {
      if(!limited) {
        dispatch(increaseAmount({idProduct}))
      }
    }else {
      if(!limited) {
        dispatch(decreaseAmount({idProduct}))
      }
    }
  }

  const handleDeleteOrder = (idProduct) => {
    dispatch(removeOrderProduct({idProduct}))
  }

  const handleOnchangeCheckAll = (e) => {
    // nếu mà nút check tất cả được check (có giá trị true)
    if(e.target.checked) {
      const newListChecked = []
      // Đưa tất cả những thằng trong orderItem vào trong mảng mới, sau đó setListChecked
      order?.orderItems?.forEach((item) => {
        newListChecked.push(item?.product)
      })
      setListChecked(newListChecked)
      // ko check (false) thì mảng rỗng
    }else {
      setListChecked([])
    }
  }

  useEffect(() => {
    dispatch(selectedOrder({listChecked}))
  },[listChecked])

  useEffect(() => {
    form.setFieldsValue(stateUserDetails)
  }, [form, stateUserDetails])

  useEffect(() => {
    if(isOpenModalUpdateInfo) {
      setStateUserDetails({
        city: user?.city,
        name: user?.name,
        address: user?.address,
        phone: user?.phone
      })
    }
  }, [isOpenModalUpdateInfo])

  const handleChangeAddress = () => {
    setIsOpenModalUpdateInfo(true)
  }

  const priceMemo = useMemo(() => {
    const result = order?.orderItemsSlected?.reduce((total, cur) => {
      return total + ((cur.price * cur.amount))
    },0)
    return result
  },[order])

  const priceDiscountMemo = useMemo(() => {
    const result = order?.orderItemsSlected?.reduce((total, cur) => {
      // console.log(cur.discount)
      const totalDiscount = cur.discount ? cur.discount : 0
      const itemTotalPrice = cur.price * cur.amount; // Tính tổng giá của từng sản phẩm
      const itemDiscount = itemTotalPrice * totalDiscount / 100; // Tính giảm giá cho từng sản phẩm

      // Cộng dồn giảm giá của từng sản phẩm
      return total + itemDiscount;
    },0)
    if(Number(result)){
      return result
    }
    return 0
  },[order])

  // Phí giao hàng
  const diliveryPriceMemo = useMemo(() => {
   if( order?.orderItemsSlected?.length === 0) {
      return 0
      
    } else if(priceMemo>=1000000 && priceMemo<1500000){
      return 20000
    } else if(priceMemo>=1500000){  
      return 0

    }
     else {
      return 40000
    }
  },[priceMemo])

  const totalPriceMemo = useMemo(() => {
   
    
    return Number(priceMemo) - Number(priceDiscountMemo) + Number(diliveryPriceMemo)
    
  },[priceMemo,priceDiscountMemo, diliveryPriceMemo])

  const handleRemoveAllOrder = () => {
    if(listChecked?.length > 0){
      dispatch(removeAllOrderProduct({listChecked}))
    }
  }

  const handleAddCard = () => {
    if(!order?.orderItemsSlected?.length) {
      message.error('Vui lòng chọn sản phẩm')
    }else if(!user?.phone || !user.address || !user.name || !user.city) {
      setIsOpenModalUpdateInfo(true)
    }else {
      navigate('/payment')
    } 
  }

  const mutationUpdate = useMutationHooks(
    (data) => {
      const { id,
        token,
        ...rests } = data
      const res = UserService.updateUser(
        id,
        { ...rests }, token)
      return res
    },
  )

  const {isPending, data} = mutationUpdate

  const handleCancleUpdate = () => {
    setStateUserDetails({
      name: '',
      email: '',
      phone: '',
      isAdmin: false,
    })
    form.resetFields()
    setIsOpenModalUpdateInfo(false)
  }
  const handleUpdateInforUser = () => {

    const {name, address,city, phone} = stateUserDetails
    if(name && address && city && phone){
      mutationUpdate.mutate({ id: user?.id, token: user?.access_token, ...stateUserDetails }, {
        onSuccess: () => {
          
          dispatch(updateUser({name, address,city, phone, access_token: user?.access_token, email: user?.email, avatar: user?.avatar, isAdmin: user?.isAdmin, _id: user?.id}))
          setIsOpenModalUpdateInfo(false)
        }
      })
    }
  }

  const handleOnchangeDetails = (e) => {
    setStateUserDetails({
      ...stateUserDetails,
      [e.target.name]: e.target.value
    })
  }
  const itemsDelivery = [
    {
      title: '40.000 VND',
      description: 'Dưới 1.000.000 đ',
    },
    {
      title: '20.000 VND',
      description: 'Từ 1.000.000 đ đến dưới 1.500.000 đ',
    },
    {
      title: 'Free ship',
      description : 'Trên 1.500.000 đ',
    },
  ]
  return (
    <div style={{background: '#F6F1EB', with: '100%', height: '100vh', padding:'0 120px'}}>
      <div style={{height: '100%', width: '1150px', margin: '0 auto'}}>
        <h3 style={{fontWeight: 'bold'}}>Giỏ hàng</h3>
        <div style={{ display: 'flex', justifyContent: 'center'}}>
          <WrapperLeft>
            <h4>Phí giao hàng</h4>
            <WrapperStyleHeaderDilivery>
              <StepComponent items={itemsDelivery} current={diliveryPriceMemo === 20000 
                ? 1 : diliveryPriceMemo === 40000 ? 0
                : order.orderItemsSlected.length === 0 ? 0:  3}/>
            </WrapperStyleHeaderDilivery>
           
            <WrapperStyleHeader>
                <span style={{display: 'inline-block', width: '390px'}}>
                  {/*checked: chỉ check trong trường hợp đã chọn tất cả, trường hợp bỏ check 1 cái sẽ mất check */}
                  <CustomCheckbox onChange={handleOnchangeCheckAll} checked={listChecked?.length === order?.orderItems?.length}></CustomCheckbox>
                  <span> Tất cả ({order?.orderItems?.length} sản phẩm)</span>
                </span>
                <div style={{flex:1,display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                  <span>Đơn giá</span>
                  <span>Số lượng</span>
                  <span>Thành tiền</span>
                  <DeleteOutlined style={{cursor: 'pointer'}} onClick={handleRemoveAllOrder}/>
                </div>
            </WrapperStyleHeader>
            <WrapperListOrder>
              {order?.orderItems?.map((order) => {
                return (
                  <WrapperItemOrder key={order?.product}>
                <div style={{width: '390px', display: 'flex', alignItems: 'center', gap: 4}}> 
                {/* checked: nếu trong listChecked có id của nó thì đánh dấu đã check */}
                  <CustomCheckbox onChange={onChange} value={order?.product} checked={listChecked.includes(order?.product)}></CustomCheckbox>
                  <img src={order?.image} style={{width: '77px', height: '79px', objectFit: 'cover'}}/>
                  <div style={{
                    width: 260,
                    overflow: 'hidden',
                    textOverflow:'ellipsis',
                    whiteSpace:'nowrap'
                  }}>{order?.name}</div>
                </div>
                <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                  <span>
                    <span style={{ fontSize: '13px', color: '#242424' }}>{convertPrice(order?.price)}<sup> đ</sup></span>
                  </span>
                  <WrapperCountOrder>
                    <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('decrease',order?.product, order?.amount === 1)}>
                        <MinusOutlined style={{ color: '#000', fontSize: '10px' }} />
                    </button>
                    <WrapperInputNumber defaultValue={order?.amount} value={order?.amount} size="small" min={1} max={order?.countInstock} />
                    <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('increase',order?.product ,order?.amount === order.countInstock, order?.amount === 1)}>
                        <PlusOutlined style={{ color: '#000', fontSize: '10px' }}/>
                    </button>
                  </WrapperCountOrder>
                  <span style={{color: 'rgb(255, 66, 78)', fontSize: '13px', fontWeight: 500}}>{convertPrice(order?.price * order?.amount)}<sup> đ</sup></span>
                  <DeleteOutlined style={{cursor: 'pointer'}} onClick={() => handleDeleteOrder(order?.product)}/>
                </div>
              </WrapperItemOrder>
                )
              })}
            </WrapperListOrder>
          </WrapperLeft>
          <WrapperRight>
            <div style={{width: '100%'}}>
              <WrapperInfo>
                <div>
                  <span>Địa chỉ: </span>
                  <span style={{fontWeight: 'bold'}}>{ `${user?.address} ${user?.city}`} </span>
                  <span onClick={handleChangeAddress} style={{color: '#9255FD', cursor:'pointer'}}>Thay đổi</span>
                </div>
              </WrapperInfo>
              <WrapperInfo>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                  <span>Tạm tính</span>
                  <span style={{color: '#000', fontSize: '14px', fontWeight: 'bold'}}>{convertPrice(priceMemo)}<sup> đ</sup></span>
                </div>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                  <span>Giảm giá</span>
                  <span style={{color: '#000', fontSize: '14px', fontWeight: 'bold'}}>{convertPrice(priceDiscountMemo)}<sup> đ</sup></span>
                </div>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                  <span>Phí giao hàng</span>
                  <span style={{color: '#000', fontSize: '14px', fontWeight: 'bold'}}>{convertPrice(diliveryPriceMemo)}<sup> đ</sup></span>
                </div>
              </WrapperInfo>
              <WrapperTotal>
                <span>Tổng tiền</span>
                <span style={{display:'flex', flexDirection: 'column'}}>
                  <span style={{color: 'rgb(254, 56, 52)', fontSize: '24px', fontWeight: 'bold'}}> {convertPrice(totalPriceMemo < 0 ? 0 : totalPriceMemo)}<sup> đ</sup></span>
                  <span style={{color: '#000', fontSize: '11px'}}>(Đã bao gồm VAT nếu có)</span>
                </span>
              </WrapperTotal>
            </div>
            <ButtonComponent
              onClick={() => handleAddCard()}
              size={40}
              styleButton={{
                  background: 'rgb(255, 57, 69)',
                  height: '48px',
                  width: '320px',
                  border: 'none',
                  borderRadius: '4px',
                  color:'white'
              }}
              textButton={'Mua hàng'}
              styleTextButton={{ color: 'white', fontSize: '15px', fontWeight: '700' }}
          ></ButtonComponent>
          </WrapperRight>
        </div>
      </div>
      <ModalComponent title="Cập nhật thông tin giao hàng" open={isOpenModalUpdateInfo} onCancel={handleCancleUpdate} onOk={handleUpdateInforUser}>
       <Loading isPending={isPending}>
        <Form
            name="basic"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 19 }}
            // onFinish={onUpdateUser}
            autoComplete="on"
            form={form}
          >
            <Form.Item
              label="Tên người nhận"
              name="name"
              rules={[{ required: true, message: 'Please input your name!' }]}
            >
              <InputComponent value={stateUserDetails['name']} onChange={handleOnchangeDetails} name="name" />
            </Form.Item>
            <Form.Item
              label="Thành phố"
              name="city"
              rules={[{ required: true, message: 'Please input your city!' }]}
            >
              <InputComponent value={stateUserDetails['city']} onChange={handleOnchangeDetails} name="city" />
            </Form.Item>
            <Form.Item
              label="Số điện thoại"
              name="phone"
              rules={[{ required: true, message: 'Please input your  phone!' }]}
            >
              <InputComponent value={stateUserDetails.phone} onChange={handleOnchangeDetails} name="phone" />
            </Form.Item>

            <Form.Item
              label="Địa chỉ"
              name="address"
              rules={[{ required: true, message: 'Please input your  address!' }]}
            >
              <InputComponent value={stateUserDetails.address} onChange={handleOnchangeDetails} name="address" />
            </Form.Item>
          </Form>
          </Loading>
      </ModalComponent>
    </div>
  )
}

export default OrderPage