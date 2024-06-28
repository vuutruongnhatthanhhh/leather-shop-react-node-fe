import React, { useEffect, useState } from "react";
import NavbarComponent from "../../components/NavbarComponent/NavbarComponent";
import CardComponent from "../../components/CardComponent/CardComponent";
import { Col, Pagination, Row, Select } from "antd";
import { WrapperNavBar, WrapperProduct } from "./style";
import { useLocation } from "react-router-dom";
import * as ProductService from '../../services/ProductService'
import Loading from "../../components/LoadingComponent/Loading";
import { useSelector } from "react-redux";
import { useDebounce } from "../../hooks/useDebounce";
const { Option } = Select; // Destructure Option from Select

const TypeProductPage = () => {
    const { state } = useLocation();
    const searchProduct = useSelector((state) => state?.product?.search);
    const searchDebounce = useDebounce(searchProduct, 500);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sortCriteria, setSortCriteria] = useState('price'); // Default sorting criteria
    const [panigate, setPanigate]= useState({
        page: 0,
        limit: 20, 
        total: 1,
    });

    const fetchProductType = async (type, page, limit) => {
        setLoading(true);
        const res = await ProductService.getProductType(type, page, limit);
        if (res?.status === 'OK') {
            setLoading(false);
            let sortedProducts = [...res?.data];
            if (sortCriteria === 'price') {
                sortedProducts.sort((a, b) => a.price - b.price); // Sort by price ascending
            } else if (sortCriteria === '-price') {
                sortedProducts.sort((a, b) => b.price - a.price); // Sort by price descending
            } else if (sortCriteria === '-selled') {
                sortedProducts.sort((a, b) => b.selled - a.selled); // Sort by selled descending
            } else if (sortCriteria === 'selled') {
                sortedProducts.sort((a, b) => a.selled - b.selled); // Sort by selled ascending
            }
            setProducts(sortedProducts);
            setPanigate({ ...panigate, total: res?.totalPage });
        } else {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (state) {
            fetchProductType(state, panigate.page, panigate.limit);
        }
    }, [state, panigate.page, panigate.limit, sortCriteria]);

    const onChange = (current, pageSize) => {
        setPanigate({...panigate, page: current - 1, limit: pageSize});
    };

    const handleSortChange = (value) => {
        setSortCriteria(value);
    };

    return (
        <Loading isPending={loading}>
            <div style={{padding:'0 120px'}}>
                <Row style={{ flexWrap:'nowrap', paddingTop:'10px'}}>
                    <WrapperNavBar style={{background:'#F6F1EB'}} span={4}>
                        <NavbarComponent/>
                    </WrapperNavBar>
                    <Col span={20}>
                        <Select defaultValue="price" style={{ width: 180, marginBottom: 10 }} onChange={handleSortChange}>
                            <Option value="price">Giá tăng dần</Option>
                            <Option value="-price">Giá giảm dần</Option>
                            <Option value="selled">Đã bán tăng dần</Option>
                            <Option value="-selled">Đã bán giảm dần</Option>
                        </Select>
                        <WrapperProduct>
                            {products
                                .filter((pro) => {
                                    if (searchDebounce === '') {
                                        return pro;
                                    } else if (pro.name.toLowerCase().includes(searchDebounce.toLowerCase())) {
                                        return pro;
                                    }
                                })
                                .map((product) => {
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
                                            selled={product.selled}
                                            id={product._id}
                                        />
                                    );
                                })}
                        </WrapperProduct>
                        <Pagination defaultCurrent={panigate.page + 1} total={panigate?.total} onChange={onChange} style={{ textAlign:'center', marginTop:'50px', marginBottom:'10px' }} />
                    </Col>
                </Row>
            </div>
        </Loading>
    );
};

export default TypeProductPage;
