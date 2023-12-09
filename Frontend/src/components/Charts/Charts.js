import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import numeral from 'numeral';

const DailySalesChart = ({ data, nameChart }) => {
    return (
        <BarChart width={580} height={350} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis
                tickFormatter={(value) =>
                    value >= 1000000 ? `${(value / 1000000).toFixed(2)}Tr` : numeral(value).format('0,0')
                }
            />
            <Tooltip formatter={(value) => numeral(value).format('0,0')} />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" name={`Tổng ${nameChart} theo ngày`} />
        </BarChart>
    );
};

const WeeklySalesChart = ({ data, nameChart }) => {
    return (
        <BarChart width={580} height={350} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis
                tickFormatter={(value) =>
                    value >= 1000000 ? `${(value / 1000000).toFixed(2)}Tr` : numeral(value).format('0,0')
                }
            />
            <Tooltip formatter={(value) => numeral(value).format('0,0')} />
            <Legend />
            <Bar dataKey="value" fill="#82ca9d" name={`Tổng ${nameChart} theo tuần`} />
        </BarChart>
    );
};

const MonthlySalesChart = ({ data, nameChart }) => {
    const customTooltipFormatter = (value, name, props) => {
        // console.log(value, name, props)
        return numeral(value).format('0,0');
    };

    return (
        <BarChart width={580} height={350} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis
                tickFormatter={(value) =>
                    value >= 1000000 ? `${(value / 1000000).toFixed(2)}Tr` : numeral(value).format('0,0')
                }
            />
            <Tooltip formatter={(value) => numeral(value).format('0,0')} />
            <Legend />
            <Bar dataKey="value" fill="#ffc658" name={`Tổng ${nameChart} theo tháng`} />
        </BarChart>
    );
};

export { DailySalesChart, WeeklySalesChart, MonthlySalesChart };
