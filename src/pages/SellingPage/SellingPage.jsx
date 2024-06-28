import React, { Fragment, useEffect, useState } from "react";
import NavbarComponent from "../../components/NavbarComponent/NavbarComponent";
import CardComponent from "../../components/CardComponent/CardComponent";
import {  Col, Pagination, Row } from "antd";
import { WrapperNavBar, WrapperProduct } from "./style";
import { useLocation, useNavigate } from "react-router-dom";
import * as ProductService from '../../services/ProductService'
import Loading from "../../components/LoadingComponent/Loading";
import { useSelector } from "react-redux";
import { useDebounce } from "../../hooks/useDebounce";
import { WrapperHeader } from "../Profile/style";

const SellingPage = () => {
    // useLocation hiện được đường dẫn của trang và các thông tin khác khi nhấn vào type ở home
    // Lấy ra được state chữ có dấu được lưu trong url
    const navigate = useNavigate()
    const {state} = useLocation()
    // Lấy từ khóa search từ redux ra
    const searchProduct = useSelector((state) => state?.product?.search)
    const searchDebounce = useDebounce(searchProduct, 500)
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(false)
    const [panigate, setPanigate]= useState({
        page: 0,
        limit: 20, 
        total: 1,
    })
    // console.log('location', location)
    const fetchProductType = async () =>{
        setLoading(true)
        const res = await ProductService.getAllProduct()
        // console.log('res', res)
        const filteredProducts = res?.data?.filter(product => product.selled > 3);
        setProducts(filteredProducts)
    }
    // console.log('loading', loading)

    // useEffect(()=>{
    //     // Dùng khi search trong loại sản phẩm
    //     let newProduct = []
    //     if(searchDebounce){
    //         newProduct = products?.filter((pro)=>pro?.name === searchDebounce)
    //         setProducts(newProduct)
    //     }
    // },[searchDebounce])

    useEffect(()=>{
       
            fetchProductType()
        
        
    },[])
    const onChange= (current, pageSize)=> {
        // current là cái trang hiện tại đang ở, pageSize là cái giới hạn trang ở cuối
        // console.log({current, pageSize})
        setPanigate({...panigate, page: current-1, limit: pageSize})
    }
    return (
        // <Loading isPending={loading}>
            <div style={{padding:'0 120px'}}>
             <h5>
  <span style={{ cursor: 'pointer', fontWeight: 'normal' }} onClick={() => { navigate('/') }}>
    Trang chủ
  </span> 
  {' > Sản phẩm bán chạy'}
</h5>
                    <Row style={{ flexWrap:'nowrap', paddingTop:'10px'}}>
                        <WrapperNavBar style={{background:'#F6F1EB'}} span={4}>
                        {/* <NavbarComponent /> */}
                        </WrapperNavBar>
                        <Col span={20}>
                        <WrapperProduct >
                            {/* Tìm kiếm trong trong loại sản phẩm  */}
                            {products?.filter((pro)=>{
                                if(searchDebounce===''){
                                    return pro
                                }else if(pro?.name.toLowerCase()?.includes(searchDebounce?.toLowerCase())){
                                    return pro
                                }
                            })?.map((product) =>{
                                return (
                                    <CardComponent
                                    key={product._id}
                                    countInStock={product.countInStock}
                                    description={product.description}
                                    image={product.image}
                                    name={product.name}
                                    price={product.price}
                                    rating={product.rating}
                                    type={product.type}
                                    discount={product.discount}
                                    selled= {product.selled}
                                    id={product._id}
                                    />
                                )
                            })}
                    
                    
                        </WrapperProduct>
                        <Pagination  defaultCurrent={panigate.page +1} total={panigate?.total} onChange={onChange} style={{textAlign:'center', marginTop:'50px', marginBottom:'10px'}} />
                        </Col>
                    </Row>
                    
            </div>
        // </Loading>
    )
}

export default SellingPage