import React from "react";
import './ContactInfo.css';
import { useNavigate } from "react-router-dom";

const ContactPage = () => {
    const navigate = useNavigate()
    return (
        <>
        <h5 style={{padding:'0 120px'}}>
        <span style={{ cursor: 'pointer', fontWeight: 'normal' }} onClick={() => { navigate('/') }}>
          Trang chủ
        </span> 
        {' > Liên hệ'}
      </h5>
      <div className="contact-container">
            <h2>Thông tin liên hệ</h2>
            <p>Địa chỉ: 451/15 đường Phạm Văn Thuận, phường Tam Hiệp, Biên Hòa, Đồng Nai</p>
            <p>Số điện thoại: <a href="tel:0911622262">0911622262</a></p>
            <p>Email: <a href="mailto:20130404@st.hcmuaf.edu.vn">20130404@st.hcmuaf.edu.vn</a></p>
        </div>
        </>
    )
}

export default ContactPage;
