import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LabelList } from 'recharts';

const BarChartComponent = ({ data, chartType, q }) => (
  chartType === 'Bar' && (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={q.answers.filter((answer) => answer.label !== 'No question text')} // Filter out "No question text"
        layout="vertical"
        margin={{ top: 20, right: 50, bottom: 20, left: 400 }} // Increased left margin for better label visibility
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" /> // Light grid lines for a cleaner look
        <XAxis
          type="number"
          tick={{ fontSize: 14, fill: '#333' }} // Larger font size for better readability
          allowDecimals={false}
          axisLine={{ stroke: '#ccc' }} // Styled axis line
        />
        <YAxis
          type="category"
          dataKey="label"
          tick={{ fontSize: 14, fill: '#333' }} // Larger font size for labels
          interval={0}
          tickFormatter={(label) => label.length > 30 ? `${label.slice(0, 30)}...` : label} // Truncate long labels
          axisLine={{ stroke: '#ccc' }} // Styled axis line
        />
        <Tooltip
          formatter={(value) => `${value} responses`}
          contentStyle={{
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
          }} // Styled tooltip
        />
        <Bar
          dataKey="count"
          fill="#4CAF50" // Professional green color for bars
          barSize={20} // Slightly larger bars
          radius={[5, 5, 0, 0]} // Rounded corners for bars
        >
          <LabelList
            dataKey="percent"
            position="right"
            formatter={(v) => `${v}%`}
            style={{ fontSize: 12, fill: '#333' }} // Styled percentage labels
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
);

export default BarChartComponent;