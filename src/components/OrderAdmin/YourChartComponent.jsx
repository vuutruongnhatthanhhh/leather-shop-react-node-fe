import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { convertPrice } from '../../utils';

const YourChartComponent = ({ orders, selectedYear }) => {
  const [data, setData] = useState([]);
   console.log('oders', orders)
  useEffect(() => {
    if (orders && orders.data) {
      updateData(selectedYear);
    }
  }, [orders, selectedYear]);

  const updateData = (year) => {
   
    // Lọc và tính tổng doanh thu cho từng tháng trong năm
    const monthlyRevenue = Array.from({ length: 12 }, (_, index) => ({
      month: index + 1,
      total:  orders?.data
        .filter(order => new Date(order.createdAt).getFullYear() === year && new Date(order.createdAt).getMonth() === index && (order.status==='Đã giao' || order.paymentMethod==='paypal'))
        .reduce((acc, order) => acc + order.totalPrice - order.shippingPrice, 0)
    }));

    // Format dữ liệu để hiển thị trong biểu đồ
    const formattedData = monthlyRevenue.map(item => ({
      month: `Tháng ${item.month}`,
      total: item.total // Làm tròn tổng tiền đến 2 chữ số sau dấu phẩy
    }));

    setData(formattedData);
   
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      // payload[0] là giá trị của cột hiện tại
      return (
        <div className="custom-tooltip">
          <p className="label">{`${label}`}</p>
          <p className="total">{`Tổng: ${convertPrice(payload[0].value)} VND`}</p> {/* Định dạng lại giá trị thành tiền VND */}
        </div>
      );
    }

    return null;
  };
  const formatYAxisTick = (value) => convertPrice(value); // Hàm định dạng giá trị trục tung

  return (
    <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis tickFormatter={formatYAxisTick} /> {/* Sử dụng tickFormatter để định dạng giá trị trục tung */}
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="total" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default YourChartComponent;
