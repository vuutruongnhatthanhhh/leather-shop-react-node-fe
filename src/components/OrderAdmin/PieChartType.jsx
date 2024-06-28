import React from 'react';
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { convertPrice } from '../../utils';

const PieChartType = ({ orders, selectedYear, selectedMonth }) => {
    const processData = () => {
        if (!orders || !orders.data) return [];

        const filteredOrders = orders && orders?.data.filter(order => {
            const orderDate = new Date(order.createdAt);
            return orderDate.getFullYear() === selectedYear && (orderDate.getMonth() + 1) === selectedMonth &&(order.status==='Đã giao' || order.paymentMethod==='paypal');
        });

        const revenueByProductType = filteredOrders.reduce((acc, order) => {
            order.orderItems.forEach(item => {
                if (!acc[item.type]) {
                    acc[item.type] = 0;
                }
                const discount = item.discount ? item.discount : 0;
                const discountedPrice = item.price * (1 - discount / 100);
                acc[item.type] += discountedPrice * item.amount;
            });
            return acc;
        }, {});

        return Object.keys(revenueByProductType).map(type => ({
            name: type,
            value: revenueByProductType[type]
        }));
    };

    const data = processData();
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28BFE', '#82ca9d', '#D0ED57', '#a4de6c'];
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip">
                    <p className="label">{`${payload[0].name} : ${convertPrice(payload[0].value)}`}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <ResponsiveContainer width="100%" height={400}>
            <PieChart>
                <Pie 
                    data={data} 
                    dataKey="value" 
                    nameKey="name" 
                    cx="50%" 
                    cy="50%" 
                    outerRadius={150} 
                    // label
                >
                    {
                        data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))
                    }
                </Pie>
                <Tooltip content={<CustomTooltip />} />
            </PieChart>
        </ResponsiveContainer>
    );
};

export default PieChartType;
