import React, { useEffect, useRef, useState } from "react";
import { WrapperHeader, WrapperUploadFile } from "./style";
import { Button, Form, Modal, Select, Space, message } from "antd";
import TableComponent from "../TableComponent/TableComponent";
import InputComponent from "../InputComponent/InputComponent";
import DrawerComponent from "../DrawerComponent/DrawerComponent";
import Loading from "../LoadingComponent/Loading";
import ModalComponent from "../ModalComponent/ModalComponent";
import { convertPrice, getBase64 } from "../../utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie,  } from 'recharts';
import { useSelector } from "react-redux";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as OrderService from '../../services/OrderService'
import * as UserService from '../../services/UserService'
import { useQuery } from "@tanstack/react-query";
import {PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, CloseOutlined, TruckOutlined, SmallDashOutlined} from '@ant-design/icons'
import { orderContant } from "../../contant";
import PieChartComponent from "./PieChart";
import { Option } from "antd/es/mentions";
import YourChartComponent from "./YourChartComponent";
import PieChartType from "./PieChartType";


const OrderAdmin = () =>{
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rowSelected, setRowSelected] = useState('')
    const [isOpenDrawer, setIsOpenDrawer] = useState(false)
    const [isPendingUpdate, setIsPendingUpdate] = useState(false)
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false)

    // Lấy thông tin user từ Redux
    const user = useSelector((state) => state?.user)

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [orderItems, setOrderItems] = useState([]);
    const searchInput = useRef(null);
     // Dùng trong handleCancel
     const [form] = Form.useForm()
    const [stateUser, setStateUser] = useState({
        name: '',
        email: '',
        phone: '',
        isAdmin: false,
       
    })
   
    const [stateUserDetails, setStateUserDetails] = useState({
        name: '',
        phone: '',
        address: '',
        city: '',
        shippingPrice: '',
        date:'',
        totalPrice: '',
        isDelivered: false,
        isPaid: false,
        paymentMethod: '',
        status:''
  })

  const [stateProductDetails, setStateProductDetails] = useState({
    name: '',
    price: '',
    description: '',
    rating: '',
    image:'',
    type:'',
    countInStock:'',
    discount:''
})

   

    const mutation = useMutationHooks(
      (data) => {
          const{name, email, isAdmin, phone} = data
          // Trả về dữ liệu nghĩa là mutation thành công isSuccess
         return UserService.signupUser({name, email, isAdmin : false,phone})
      }
    )

    const mutationUpdate = useMutationHooks(
      (data) => {
          const{id, token, ...rests} = data
          // Trả về dữ liệu nghĩa là mutation thành công isSuccess
         return UserService.updateUser(id,{...rests}, token)
      }
    )

    const mutationDeleted = useMutationHooks(
      (data) => {
          const{id, token} = data
          // Trả về dữ liệu nghĩa là mutation thành công isSuccess
         return UserService.deleteUser(id, token)
      }
    )

    const mutationDeletedMany = useMutationHooks(
      (data) => {
        // ... vì có nhiều id
          const{ token, ...ids} = data
          // Trả về dữ liệu nghĩa là mutation thành công isSuccess
         return UserService.deleteManyUser(ids, token)
      }
    )

    const getAllOrder = async() =>{
      const res = await OrderService.getAllOrder(user?.access_token)
      // console.log('res',res)
      return res
    }

    const fetchGetDetailsUser = async ()=>{
      const res = await OrderService.getDetailsOrder(rowSelected)
      // console.log('res', res)
      const orderItems = res?.data?.orderItems;
      setOrderItems(orderItems);
      // nếu có data thì hiển thị thông tin sản phẩm khi bấm vào chỉnh sửa
      
      if(res?.data){
        setStateUserDetails({
          name: res?.data?.shippingAddress?.fullName,
          phone: res?.data?.shippingAddress?.phone,
          address: res?.data?.shippingAddress?.address,
          city: res?.data?.shippingAddress?.city,
          shippingPrice: convertPrice(res?.data?.shippingPrice),
          totalPrice: convertPrice(res?.data?.totalPrice),
          isDelivered: res?.data?.isDelivered,
          isPaid: res?.data?.isPaid ?'Đã thanh toán':'Chưa thanh toán',
          paymentMethod: orderContant.payment[res?.data?.paymentMethod],
         date: formatDate(res?.data?.createdAt),
         status: res?.data?.status
        
        })
      }

      // if (orderItems && Array.isArray(orderItems)) {
      //   orderItems.forEach((item, index) => {
      //       console.log(`Sản phẩm ${index + 1}:`);
      //       console.log(`- Tên: ${item.name}`);
      //       console.log(`- Giá: ${item.price}`);
      //       console.log(`- Số lượng: ${item.amount}`);
      //       console.log(`- Hình ảnh: ${item.image}`);
      //       console.log(`- Giảm giá: ${item.discount || 0}`);
      //       console.log(`- Mã sản phẩm: ${item.product}`);
      //       console.log(`- ID: ${item._id}`);
      //       console.log('----------------------');
      //   });}
      // setIsPendingUpdate(false)
    }

    //Cái useEffect này để hiển thị thông tin sản phẩm trong form sau khi bấm vào chỉnh sửa
    useEffect(()=>{
      form.setFieldsValue(stateUserDetails)
    },[form, stateUserDetails])

    // Khắc phục cái lỗi khi lần đầu tiên nhấn vào chỉnh sửa sản phẩm thì không lấy được id
    useEffect(()=>{
        if(rowSelected &&  isOpenDrawer){
          setIsPendingUpdate(true)
          fetchGetDetailsUser(rowSelected)
        }

    }, [rowSelected, isOpenDrawer])

    // console.log('statePDetail', stateProductDetails)

    const handleDetailProduct = () =>{
      // Hiển thị được cái id khi click vào
      // console.log('rowSelected', rowSelected)


      
      setIsOpenDrawer(true)
    }

    const { data, isPending, isSuccess, isError } = mutation
    const { data: dataUpdated, isPending: isPendingUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdate
    const { data: dataDeleted, isPending: isPendingDeleted, isSuccess: isSuccessDeleted, isError: isErrorDeleted } = mutationDeleted
    const { data: dataDeletedMany, isPending: isPendingDeletedMany, isSuccess: isSuccessDeletedMany, isError: isErrorDeletedMany } = mutationDeletedMany
    // console.log('dataUpdated', dataUpdated)
    // const {isPending: isPendingProducts, data: products} = useQuery(['products'],getAllProduct)
    const queryOrder = useQuery({
      queryKey: ['orders'],
      queryFn: getAllOrder
    })
    // console.log('product', products)

    const { isPending: isPendingOders, data: orders } = queryOrder

    // const renderAction = () =>{
    //   return (
    //     <div>
    //       <EditOutlined style={{color:'orange', fontSize:'20px', cursor:'pointer', marginRight:'10px'}} onClick={handleDetailProduct} />
    //       <DeleteOutlined style={{color:'red', fontSize:'20px', cursor:'pointer'}} onClick={() => setIsModalOpenDelete(true)}/>
          
    //     </div>
    //   )
    // }

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
      confirm();
      // setSearchText(selectedKeys[0]);
      // setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
      clearFilters();
      // setSearchText('');
    };
    const getColumnSearchProps = (dataIndex) => ({
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
        <div
          style={{
            padding: 8,
          }}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <InputComponent
            ref={searchInput}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
            style={{
              marginBottom: 8,
              display: 'block',
            }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
              icon={<SearchOutlined />}
              size="small"
              style={{
                width: 90,
              }}
            >
              Search
            </Button>
            <Button
              onClick={() => clearFilters && handleReset(clearFilters)}
              size="small"
              style={{
                width: 90,
              }}
            >
              Reset
            </Button>
           
            <Button
              type="link"
              size="small"
              onClick={() => {
                close();
              }}
            >
              close
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined
          style={{
            color: filtered ? '#1677ff' : undefined,
          }}
        />
      ),
      onFilter: (value, record) =>
        record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
      onFilterDropdownOpenChange: (visible) => {
        if (visible) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
      // render: (text) =>
      //   searchedColumn === dataIndex ? (
        //   <Highlighter
        //     highlightStyle={{
        //       backgroundColor: '#ffc069',
        //       padding: 0,
        //     }}
        //     searchWords={[searchText]}
        //     autoEscape
        //     textToHighlight={text ? text.toString() : ''}
        //   />
        // ) : (
        //   text
        // ),
    });

    const renderAction = () =>{
      return (
        <div>
         
        <SearchOutlined style={{ color: 'orange', fontSize: '20px', cursor: 'pointer', marginRight: '10px' }} onClick={handleDetailProduct} />
    
     
        {/* <SmallDashOutlined  style={{ color: 'green', fontSize: '20px', cursor: 'pointer', marginRight: '10px' }} onClick={() => setIsModalOpen(true)} /> */}
    
      {/* <Tooltip title="Hủy đơn hàng">
        <CloseOutlined style={{ color: 'red', fontSize: '20px', cursor: 'pointer' }} onClick={() => setIsModalOpenDelete(true)} />
      </Tooltip> */}
          
        </div>
      )
    }

    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  const handleYearChange = (value) => {
    setSelectedYear(value);
  };

  const handleMonthChange = (value) => {
    setSelectedMonth(value);
};
    const formatDate = (isoDate) => {
      const date = new Date(isoDate);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    };

    const columns = [
      {
        title: 'Tên người mua',
        dataIndex: 'userName',
        // Sắp xếp theo bảng chữ cái
        sorter: (a,b) => a.userName.length - b.userName.length,
        ...getColumnSearchProps('userName')
      },
      // {
      //   title: 'Số điện thoại',
      //   dataIndex: 'phone',
      //   // Sắp xếp theo bảng chữ cái
      //   sorter: (a,b) => a.phone.length - b.phone.length,
      //   ...getColumnSearchProps('phone')
      // },
      // {
      //   title: 'Địa chỉ',
      //   dataIndex: 'address',
      //   // Sắp xếp theo bảng chữ cái
      //   sorter: (a,b) => a.address.length - b.address.length,
      //   ...getColumnSearchProps('address')
      // },
      // {
      //   title: 'Price Items',
      //   dataIndex: 'itemPrice',
      //   // Sắp xếp theo bảng chữ cái
      //   sorter: (a,b) => a.itemPrice.length - b.itemPrice.length,
      //   ...getColumnSearchProps('itemPrice')
      // },
      // {
      //   title: 'Price Ship',
      //   dataIndex: 'shippingPrice',
      //   // Sắp xếp theo bảng chữ cái
      //   sorter: (a,b) => a.shippingPrice.length - b.shippingPrice.length,
      //   ...getColumnSearchProps('shippingPrice')
      // },
      
      {
        title: 'Đã thanh toán',
        dataIndex: 'isPaid',
        // Sắp xếp theo bảng chữ cái
        // sorter: (a,b) => a.isPaid.length - b.isPaid.length,
        // ...getColumnSearchProps('isPaid')
        filters: [
          {
            text: 'Đã thanh toán',
            value: 'X',
          },
          {
            text: 'Chưa thanh toán',
            value: '',
          },
        ],
        onFilter: (value, record) => record.isPaid === value,
        // ...getColumnSearchProps('isPaid'),
      
      },
      {
        title: 'Trạng thái đơn hàng',
        dataIndex: 'status',
        filters: [
          { text: 'Đã xác nhận', value: 'Đã xác nhận' },
          { text: 'Đang giao hàng', value: 'Đang giao hàng' },
          { text: 'Đã giao', value: 'Đã giao' },
          { text: 'Đã hủy', value: 'Đã hủy' },
        ],
        onFilter: (value, record) => record?.status.includes(value), 
        render: (status) => {
          let color;
          switch (status) {
            case 'Đã xác nhận':
              color = 'blue';
              break;
            case 'Đang giao hàng':
              color = 'green';
              break;
            case 'Đã giao':
              color = 'orange';
              break;
            case 'Đã hủy':
              color = 'red';
              break;
            default:
              color = 'black';
          }
          return <span style={{ color }}>{status}</span>;
        }
      },
      // // {
      // //   title: 'Phương thức thanh toán',
      // //   dataIndex: 'paymentMethod',
      // //   // Sắp xếp theo bảng chữ cái
      // //   sorter: (a,b) => a.paymentMethod.length - b.paymentMethod.length,
      // //   ...getColumnSearchProps('paymentMethod')
      // // },

      {
        title: 'Ngày',
        dataIndex: 'date',
        // Sắp xếp theo bảng chữ cái
        render: (date) => formatDate(date),
        ...getColumnSearchProps('date')
      },
      {
        title: 'Tổng tiền',
        dataIndex: 'totalPrice',
        // Sắp xếp theo bảng chữ cái
        sorter: (a,b) => a.totalPrice.length - b.totalPrice.length,
        // ...getColumnSearchProps('totalPrice')
      },
      
      {
        title: 'Chức năng',
        dataIndex: 'action',
        render: renderAction,
      },
    ];
    // console.log('orders?.data',orders?.data)
    const dataTable =   orders?.data?.map((order) =>{
      // console.log('order', order)
      return {...order, key:order._id, userName: order?.shippingAddress?.fullName, phone: order?.shippingAddress?.phone,
        address: order?.shippingAddress?.address, paymentMethod: orderContant.payment[order?.paymentMethod],
        isPaid: order?.isPaid ? 'X' : '', isDelivered: order?.isDelivered ? 'X' : '',
        totalPrice: convertPrice(order?.totalPrice), date: order?.createdAt,
        status: order?.status
       }
    })

    const reversedDataTable = dataTable?.slice().reverse();

    // useEffect(()=>{
    //   if(isSuccess && data?.status ==='OK'){
    //     message.success('Tạo sản phẩm thành công')
    //     handleCancel()
    //   } else if(isError) {
    //     message.error('Có lỗi trong quá trình tạo sản phẩm')
    //   }
    // },[isSuccess])

    // useEffect(()=>{
    //   if(isSuccessUpdated && dataUpdated?.status ==='OK'){
    //     message.success('Chỉnh sửa thông tin thành công')
    //     handleCloseDrawer()
    //   } else if(isErrorUpdated) {
    //     message.error('Có lỗi trong quá trình chỉnh sửa')
    //   }
    // },[isSuccessUpdated])

    // useEffect(()=>{
    //   if(isSuccessDeleted && dataDeleted?.status ==='OK'){
    //     message.success('Xóa tài khoản thành công')
    //     handleCancelDelete()
    //   } else if(isErrorDeleted) {
    //     message.error('Có lỗi trong quá trình xóa tài khoản')
    //   }
    // },[isSuccessDeleted])

    // useEffect(()=>{
    //   if(isSuccessDeletedMany && dataDeletedMany?.status ==='OK'){
    //     message.success('Xóa tài khoản thành công')
    //     // handleCancel()
    //   } else if(isErrorDeletedMany) {
    //     message.error('Có lỗi trong quá trình xóa tài khoản')
    //   }
    // },[isSuccessDeletedMany])

    const showModal = () => {
        setIsModalOpen(true);
      };
    

    const handleCancel = () => {
        setIsModalOpen(false);
        setStateUser({
          name: '',
          email: '',
          phone: '',
          isAdmin: false,
         
        })
        form.resetFields()
      };

      const handleCancelDelete =()=>{
        setIsModalOpenDelete(false)
      }

      // const handleDeleteUser = () => {
      //     mutationDeleted.mutate({id: rowSelected, token: user?.access_token},{
      //       // Cập nhật lại table sau khi xóa sản phẩm
      //       onSettled:()=>{
      //         queryUser.refetch()
      //       }
      //     })
      // }

      const handleCloseDrawer = () => {
       setIsOpenDrawer(false)
        setStateUserDetails({
          name: '',
          email: '',
          phone: '',
          isAdmin: false,
         
        })
        form.resetFields()
      };

    // const onFinish=() =>{
    //     mutation.mutate(stateUser,{
    //       // Cập nhật table lại liền sau khi create
    //         onSettled:()=>{
    //           queryUser.refetch()
    //         }
    //     })
    //     // console.log('stateP', stateProduct)
    // }

    const handleOnChange =(e)=>{
        // name sẽ trùng với name của input
        // value sẽ là giá trị của bàn phím nhập vào
        // console.log('e.target.name', e.target.name, e.target.value)


        // Mỗi sản phẩm sẽ là 1 stateProduct, set từng name ứng với từng thuộc tính và giá trị nhập vào (mở console là hiểu)
        setStateUser({
            ...stateUser,
            [e.target.name]:e.target.value
        })
    }

    const handleOnChangeDetails =(e)=>{
      // name sẽ trùng với name của input
      // value sẽ là giá trị của bàn phím nhập vào
      // console.log('e.target.name', e.target.name, e.target.value)


      // Mỗi sản phẩm sẽ là 1 stateProduct, set từng name ứng với từng thuộc tính và giá trị nhập vào (mở console là hiểu)
      setStateUserDetails({
          ...stateUserDetails,
          [e.target.name]:e.target.value
      })
  }

    const handleOnChangeAvatar = async({fileList}) =>{
      const file = fileList[0]
      if(!file.url && !file.preview){
          file.preview = await getBase64(file.originFileObj);
      }
      setStateUser({
        ...stateUser,
        image: file.preview
      })
  }

  const handleOnChangeAvatarDetails = async({fileList}) =>{
    const file = fileList[0]
    if(!file.url && !file.preview){
        file.preview = await getBase64(file.originFileObj);
    }
    setStateUserDetails({
      ...stateUserDetails,
      avatar: file.preview
    })
}

// const onUpdateUser = () =>{

//   mutationUpdate.mutate({id:rowSelected, token: user.access_token, ...stateUserDetails },{
//     // Cập nhật table lại liền sau khi update
//       onSettled:()=>{
//         queryUser.refetch()
//       }
//   })

// }

// const handleDeleteManyUsers = (ids) =>{
//   // console.log('_id', {_id})

//   mutationDeletedMany.mutate({ids: ids, token: user?.access_token},{
//     // Cập nhật lại table sau khi xóa sản phẩm
//     onSettled:()=>{
//       queryUser.refetch()
//     }
//   })
// }

// const handleRowClick = (record) => {
//   if (rowSelected === record._id) {
    
//     return; // Nếu click vào hàng đang được chọn thì không cập nhật lại
//   }
//   console.log('rowSelected',rowSelected)
//   setRowSelected(record._id); // Cập nhật rowSelected với ID của hàng được chọn
// };
useEffect(() => {
  console.log(rowSelected); // Hiển thị giá trị mới của rowSelected
}, [rowSelected]); // Chỉ chạy lại useEffect khi rowSelected thay đổi

const mutationConfirm = useMutationHooks(
  data => OrderService.updateOrder(data)
)





const { data:dataConfirm, isPending: isPendingConfirm, isSuccess:isSuccessConfirm, isError:isErrorConfirm } = mutationConfirm

const handleUpdateConfirm=()=>{
  
  mutationConfirm.mutate({
    orderId: rowSelected, status:'Đã xác nhận'
  },{
    onSettled:()=>{
      queryOrder.refetch()
    }
  })
  
}

const handleUpdateShipping=()=>{
  
  mutationConfirm.mutate({
    orderId: rowSelected, status:'Đang giao hàng'
  },{
    onSettled:()=>{
      queryOrder.refetch()
    }
  })
  
}


const handleUpdateDelivered=()=>{
  
  mutationConfirm.mutate({
    orderId: rowSelected, status:'Đã giao'
  },{
    onSettled:()=>{
      queryOrder.refetch()
    }
  })
 
}


const handleUpdateCancel=()=>{
  
  mutationConfirm.mutate({
    orderId: rowSelected, status:'Đã hủy'
  },{
    onSettled:()=>{
      queryOrder.refetch()
    }
  })
  
}

useEffect(()=>{

  if(dataConfirm?.status === 'OK'){
  console.log('thanh')
    message.success('Cập nhật trạng thái thành công')
    
    handleCloseDrawer()
    setIsModalOpen(false)
} else if(isErrorConfirm){
    message.error('Đã có lỗi xảy ra')
}
},[isSuccessConfirm,isErrorConfirm])


const getStatusColor = (status) => {
  switch (status) {
    case 'Đã xác nhận':
      return 'blue';
    case 'Đang giao hàng':
      return 'green';
    case 'Đã giao':
      return 'yellow';
    case 'Đã hủy':
      return 'red';
    default:
      return 'black';
  }
};

    return (
        <div>
            <WrapperHeader>Quản lý đơn hàng</WrapperHeader>
           {/* <div style={{height:'200px', width:'200px'}}>
           <PieChartComponent data={orders?.data} />
           </div> */}
           {/* <Select
        defaultValue={selectedYear}
        style={{ width: 120 }}
        onChange={handleYearChange}
      >
        <Option value={2024}>2024</Option>
        <Option value={2025}>2025</Option>
        <Option value={2026}>2026</Option>
        <Option value={2027}>2027</Option>
        <Option value={2028}>2028</Option>
        <Option value={2029}>2029</Option>
        <Option value={2030}>2030</Option>
      
      </Select> */}

<Select
                defaultValue={selectedYear}
                style={{ width: 120, marginRight: 10 }}
                onChange={handleYearChange}
            >
                {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(year => (
                    <Option key={year} value={year}>{year}</Option>
                ))}
            </Select>
            <Select
                defaultValue={selectedMonth}
                style={{ width: 120 }}
                onChange={handleMonthChange}
            >
                {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                    <Option key={month} value={month}>{month}</Option>
                ))}
            </Select>
            <PieChartType orders={orders} selectedYear={selectedYear} selectedMonth={selectedMonth} />
           
      <YourChartComponent orders={orders} selectedYear={selectedYear} />
            {/* <div style={{marginTop:'10px'}}>
            <Button onClick={showModal}  style={{height:'50px',width:'50px', borderRadius:'6px', borderStyle:'dashed'}}><PlusOutlined /></Button>
            </div> */}
            <div style={{marginTop:'20px'}}>
              {/* Đưa tên cột và data trong table qua */}
          <TableComponent columns={columns} isPending={isPendingOders} data={reversedDataTable} onRow={(record, rowIndex) => {
    return {
      // onRow này dùng để lấy ra được cái id của sản phẩm khi click vào
      onClick: (event) => {
        setRowSelected(record._id)
        // console.log(rowSelected)
      }
      
    };
  }}/>
          </div>
     
          <DrawerComponent title="Chi tiết đơn hàng" isOpen={isOpenDrawer} onClose={()=> setIsOpenDrawer(false)} width="70%">
      {/* <Loading isPending={isPendingUpdate || isPendingUpdated}> */}
          <Form
    name="basic"
    labelCol={{ span: 10 }}
    wrapperCol={{ span: 14 }}
    style={{ maxWidth: 600 }}
    // onFinish={onUpdateUser}
    autoComplete="on"
    form={form}
  >
    <Form.Item
      label="Tên khách hàng"
      name="name"
      rules={[{ required: true, message: "Vui lòng nhập tên người dùng" }]}
    >
        {/* name phải trùng với giá trị stateProduct phía trên */}
      <InputComponent readOnly value={stateUserDetails.name} onChange={handleOnChangeDetails} name="name" />
    </Form.Item>
    

    {/* <Form.Item
      label="Email"
      name="email"
      rules={[{ required: true, message: 'Vui lòng nhập email' }]}
    >
      <InputComponent value={stateUserDetails.email} onChange={handleOnChangeDetails} name="email" />
    </Form.Item> */}

    <Form.Item
      label="Số điện thoại"
      name="phone"
      rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
    >
      <InputComponent readOnly value={stateUserDetails.phone} onChange={handleOnChangeDetails} name="phone" />
    </Form.Item>

    <Form.Item
      label="Địa chỉ"
      name="address"
      rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
    >
      <InputComponent readOnly value={stateUserDetails.address} onChange={handleOnChangeDetails} name="address" />
    </Form.Item>

    <Form.Item
      label="Thành phố"
      name="city"
      rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
    >
      <InputComponent readOnly value={stateUserDetails.city} onChange={handleOnChangeDetails} name="city" />
    </Form.Item>

    


    <Form.Item
      label="Sản phẩm"
      name="address"
      rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
    >
      <div>
                    {orderItems?.map((item, index) => (
                        <div key={item._id} className="order-item">
                            {/* <p>Sản phẩm {index + 1}:</p> */}
                            <br></br>
                            <p>- Tên sản phẩm: {item.name}</p>
                            <p>- Loại sản phẩm: {item.type}</p>
                            <p>- Số lượng: {item.amount}</p>
                            <p>- Giá: {convertPrice(item.price)} VND / 1 sản phẩm</p>
        
                            <p>- Giảm giá: {item.discount || 0} %</p>
                            <p><img src={item.image} alt={item.name} width="40" /></p>
                            {/* <p>- Mã sản phẩm: {item.product}</p>
                            <p>- ID: {item._id}</p> */}
                            <hr />
                        </div>
                    ))}
                </div>
    </Form.Item>

    <Form.Item
      label="Phí vận chuyển"
      name="shippingPrice"
      rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
    >
      <InputComponent readOnly  value={stateUserDetails.shippingPrice} onChange={handleOnChangeDetails} name="shippingPrice" />
    </Form.Item>

    <Form.Item
      label="Tổng tiền"
      name="totalPrice"
      rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
    >
      <InputComponent readOnly value={convertPrice(stateUserDetails.totalPrice)} onChange={handleOnChangeDetails} name="totalPrice" />
    </Form.Item>
    <Form.Item
      label="Ngày đặt hàng"
      name="date"
      rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
    >
      <InputComponent readOnly  value={stateUserDetails.date} onChange={handleOnChangeDetails} name="date" />
    </Form.Item>
    <Form.Item
      label="Trạng thái đơn hàng"
      name="status"
      rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
    >
      <InputComponent readOnly value={stateUserDetails.status} onChange={handleOnChangeDetails} name="status" />
     
    </Form.Item>

    <Form.Item
      label="Tình trạng thanh toán"
      name="isPaid"
      rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
    >
      <InputComponent readOnly value={stateUserDetails.isPaid} onChange={handleOnChangeDetails} name="isPaid" />
    </Form.Item>

    <Form.Item
      label="Phương thức thanh toán"
      name="paymentMethod"
      rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
    >
      <InputComponent readOnly value={stateUserDetails.paymentMethod} onChange={handleOnChangeDetails} name="paymentMethod" />
    </Form.Item>
   
    
      <Form.Item
      label="Cập nhật trạng thái đơn hàng"
      name="paymentMethod"
      rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
    >
      
        <SmallDashOutlined onClick={() => setIsModalOpen(true)}  style={{ color: 'green', fontSize: '20px', cursor: 'pointer', marginRight: '10px' }}  />
    
    </Form.Item>
    
    {/* <Form.Item
      label="Ảnh đại diện"
      name="avatar"
      rules={[{ required: true, message: 'Vui lòng chọn ảnh đại diện' }]}
    >
       <WrapperUploadFile onChange={handleOnChangeAvatarDetails} maxCount={1}>
                            <Button>Chọn ảnh</Button>
                            {stateUserDetails?.avatar &&(
                        <img src={stateUserDetails?.avatar} style={{
                            height:'30px',
                            width:'30px',
                            borderRadius:'50%',
                            objectFit:'cover',
                            outline:'none' ,
                            marginLeft:'10px'
                        }} alt='avatar'/>
                    )}
                    </WrapperUploadFile>

    </Form.Item> */}
  
    <Form.Item wrapperCol={{ offset: 18, span: 16 }}>
      {/* <Button type="primary" htmlType="submit">
        Hoàn thành
      </Button> */}
    </Form.Item>
  </Form>
  <Modal
        title="Cập nhật trạng thái đơn hàng"
        visible={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={600} 
      >
        <Button onClick={handleUpdateConfirm} type="primary" >
          Xác nhận đơn hàng
        </Button>
        <Button onClick={handleUpdateShipping} style={{marginLeft:'10px', backgroundColor:'green'}} type="primary" >
          Đang giao hàng
        </Button>
        <Button onClick={handleUpdateDelivered}  style={{marginLeft:'10px', backgroundColor:'orange'}} type="primary" >
          Đã giao
        </Button>
        <Button onClick={handleUpdateCancel} style={{marginLeft:'10px'}} type="primary" danger >
          Hủy đơn hàng
        </Button>
      </Modal>
          {/* </Loading> */}
      </DrawerComponent>
     
      {/* <ModalComponent  title="Xoá tài khoản" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteUser} >
          <Loading isPending={isPendingDeleted}>
        <div>Bạn có chắc muốn xóa tài khoản này không?</div>
          </Loading>
      </ModalComponent> */}
        </div>
    )
}

export default OrderAdmin
