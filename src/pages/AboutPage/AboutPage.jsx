import React from "react";
import './AboutPage.css';
import { useNavigate } from "react-router-dom";

const AboutPage = () => {
    const navigate = useNavigate()
    return (
        <>
        <h5 style={{padding:'0 120px'}}>
        <span style={{ cursor: 'pointer', fontWeight: 'normal' }} onClick={() => { navigate('/') }}>
          Trang chủ
        </span> 
        {' > Giới thiệu'}
      </h5>
        <div className="about-container">
            <h2>Timeless Pelle Nook</h2>
            <p>Chào mừng đến với Timeless Pelle Nook - nơi hội tụ của nghệ thuật thủ công và chất lượng thượng hạng. Chúng tôi tự hào là shop bán đồ da uy tín, chuyên cung cấp các sản phẩm da thật được chế tác tỉ mỉ từ những đôi bàn tay tài hoa. Mỗi sản phẩm tại LeatherCraft không chỉ là một món đồ, mà còn là một tác phẩm nghệ thuật, mang đến sự sang trọng và bền bỉ vượt thời gian.</p>
            <br/>
            <p>Chất liệu da mà chúng tôi sử dụng đều được tuyển chọn kỹ lưỡng từ những nguồn cung cấp uy tín nhất. Chúng tôi chủ yếu sử dụng da bò, da cừu, và da dê, được xử lý theo quy trình thuộc da truyền thống kết hợp với công nghệ hiện đại. Điều này đảm bảo da luôn mềm mại, bền chắc và có màu sắc tự nhiên, phong phú. Bên cạnh đó, chúng tôi còn sử dụng da thuộc thảo mộc - một loại da thân thiện với môi trường, không chứa các hóa chất độc hại, mang lại cảm giác an toàn và dễ chịu cho người sử dụng.</p>
            <br/>
            <p>Timeless Pelle Nook cam kết mang đến cho khách hàng những trải nghiệm tuyệt vời với các sản phẩm đa dạng như ví da, túi xách, thắt lưng, và giày dép. Hãy đến với chúng tôi để cảm nhận sự khác biệt trong từng chi tiết và khám phá thế giới đồ da đầy mê hoặc.</p>
        </div>
        </>
    )
}

export default AboutPage;
