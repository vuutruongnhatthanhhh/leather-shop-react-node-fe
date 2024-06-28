import {Checkbox, Form, message } from 'antd'
import React, { useEffect, useState } from 'react'
import { CustomCheckbox, WrapperContainer, WrapperCountOrder, WrapperFooterItem, WrapperHeaderItem, WrapperInfo, WrapperItemOrder, WrapperLeft, WrapperListOrder, WrapperRight, WrapperStatus, WrapperStyleHeader, WrapperStyleHeaderDilivery, WrapperTotal } from './style';
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
import { partialUpdateUser, updateUser } from '../../redux/slides/userSlide';
import {useLocation, useNavigate } from 'react-router-dom';
import StepComponent from '../../components/StepComponent/StepComponent';
import * as OrderService from '../../services/OrderService'
import { useQuery } from '@tanstack/react-query';

const MyOrder = () => {
  const location = useLocation()
  // console.log('location', location)
  const { state } = location
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const fetchMyOrder = async () => {
    const res = await OrderService.getOrderByUserId(state?.id, state?.token)
    return res.data
  }
  const user = useSelector((state) => state.user)

  const queryOrder = useQuery({
    queryKey: ['orders'],
    queryFn: fetchMyOrder
  })

  const { isPending, data } = queryOrder
// console.log('data',data)
const handleDetailsOrder = (id) => {
  navigate(`/details-order/${id}`, {
    state: {
      token: state?.token
    }
  })
}

  const mutation = useMutationHooks(
    (data) => {
      
      const res = OrderService.updateOrder(data)
      return res
    }
  )

  const mutationPoint = useMutationHooks(
    (data) => {
      
      const res = UserService.pointUser(data)
      return res
    }
  )

  const handleCanceOrder = (order) => {
    mutation.mutate({orderId: order._id, status:'Đã hủy' }, {
      onSuccess: () => {
        queryOrder.refetch()
      },
    })
  }
  
  const handleDeliveredOrder = (order) => {
    mutation.mutate({orderId: order._id, status:'Đã giao' }, {
      onSuccess: () => {
        queryOrder.refetch()
      },
    })

    mutationPoint.mutate({id: user?.id, point: 1})
    dispatch(partialUpdateUser({point: user?.point+1}))
  }
  const {isPending: isPendingCancel, isSuccess: isSuccessCancel, isError: isErrorCancle, data: dataCancel } = mutation

  useEffect(() => {
    if (isSuccessCancel && dataCancel?.status === 'OK') {
      message.success('Cập nhật đơn thành công')
    } else if(isSuccessCancel && dataCancel?.status === 'ERR') {
      message.error(dataCancel?.message)
    }else if (isErrorCancle) {
      message.error('Có lỗi trong quá trình cập nhật đơn hàng')
    }
  }, [isErrorCancle, isSuccessCancel])

  const renderProduct = (data) => {
    
    return data?.map((order) => {
      return <WrapperHeaderItem key={order?._id}> 
              <img src={order?.image} 
                style={{
                  width: '70px', 
                  height: '70px', 
                  objectFit: 'cover',
                  border: '1px solid rgb(238, 238, 238)',
                  padding: '2px'
                }}
              />
              <div style={{
                width: 260,
                overflow: 'hidden',
                textOverflow:'ellipsis',
                whiteSpace:'nowrap',
                marginLeft: '10px'
              }}>{order?.name}</div>
              <span style={{ fontSize: '13px', color: '#242424',marginLeft: 'auto' }}>{convertPrice(order?.price)}</span>
            </WrapperHeaderItem>
          })
  }

  return (
    <Loading isPending={isPending ||  isPendingCancel}>
    <WrapperContainer>
        <div style={{height: '100%', width: '1270px', margin: '0 auto'}}>
          <h4>Đơn hàng của tôi</h4>
          <WrapperListOrder>
            {Array.isArray(data) && data.slice().reverse().map((order) => {
              return (
                <WrapperItemOrder key={order?._id}>
                  <WrapperStatus>
                    <span style={{fontSize: '14px', fontWeight: 'bold'}}>Trạng thái</span>
                    <div>
                      <span style={{color: 'rgb(255, 66, 78)'}}>Tình trạng đơn hàng: </span>
                      <span style={{color: 'rgb(90, 32, 193)', fontWeight: 'bold'}}>{`${order.status}`}</span>
                    </div>
                    <div>
                      <span style={{color: 'rgb(255, 66, 78)'}}>Thanh toán: </span>
                      <span style={{color: 'rgb(90, 32, 193)', fontWeight: 'bold'}}>{`${order.isPaid ? 'Đã thanh toán': 'Chưa thanh toán'}`}</span>
                    </div>
                  </WrapperStatus>
                  {renderProduct(order?.orderItems)}
                  <WrapperFooterItem>
                    <div>
                      <span style={{color: 'rgb(255, 66, 78)'}}>Tổng tiền: </span>
                      <span 
                        style={{ fontSize: '13px', color: 'rgb(56, 56, 61)',fontWeight: 700 }}
                      >{convertPrice(order?.totalPrice)}</span>
                    </div>
                    <div style={{display: 'flex', gap: '10px'}}>
                    <ButtonComponent
                        onClick={() => handleDetailsOrder(order?._id)}
                        size={40}
                        styleButton={{
                            height: '36px',
                            border: '1px solid #9255FD',
                            borderRadius: '4px'
                        }}
                        textButton={'Xem chi tiết'}
                        styleTextButton={{ color: '#9255FD', fontSize: '14px' }}
                      >
                      </ButtonComponent>
                      {order.status ==='Đang giao hàng'   && (
                      <ButtonComponent
                        onClick={() => handleDeliveredOrder(order)}
                        size={40}
                        styleButton={{
                            height: '36px',
                            border: '1px solid #9255FD',
                            borderRadius: '4px'
                        }}
                        textButton={'Đã nhận được hàng'}
                        styleTextButton={{ color: '#9255FD', fontSize: '14px' }}
                      >
                      </ButtonComponent>
                      )}
                      {order.status !== 'Đã hủy' && order.status !== 'Đã giao'  && order.status !== 'Đang giao hàng'  && (
                    <ButtonComponent
                        onClick={() => handleCanceOrder(order)}
                        size={40}
                        styleButton={{
                            height: '36px',
                            border: '1px solid #9255FD',
                            borderRadius: '4px'
                        }}
                        textButton={'Hủy đơn hàng'}
                        styleTextButton={{ color: '#9255FD', fontSize: '14px' }}
                      >
                      </ButtonComponent>
                     )}
                    </div>
                  </WrapperFooterItem>
                </WrapperItemOrder>
              )
            })}
          </WrapperListOrder>
        </div>
      </WrapperContainer>
    </Loading>
  )
}

export default MyOrder