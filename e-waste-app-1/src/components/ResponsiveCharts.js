// import React from 'react';
// import { 
//   PieChart, 
//   Pie, 
//   Cell, 
//   ResponsiveContainer, 
//   BarChart, 
//   Bar, 
//   XAxis, 
//   YAxis, 
//   CartesianGrid, 
//   Tooltip, 
//   Legend 
// } from 'recharts';

// // Responsive Status Distribution Chart using Recharts
// const StatusDistributionChart = ({ data }) => {
//   // Transform data for Recharts
//   const chartData = Object.entries(data).map(([status, count]) => ({
//     name: status,
//     value: count,
//     percentage: Object.values(data).reduce((sum, c) => sum + c, 0) > 0 
//       ? ((count / Object.values(data).reduce((sum, c) => sum + c, 0)) * 100).toFixed(1)
//       : 0
//   }));

//   // Colors for different statuses
//   const COLORS = {
//     PENDING: '#ffc107',
//     APPROVED: '#28a745', 
//     REJECTED: '#dc3545',
//     SCHEDULED: '#007bff',
//     COMPLETED: '#6c757d'
//   };

//   const renderLabel = ({ name, percentage }) => {
//     return percentage > 5 ? `${percentage}%` : ''; // Only show label if slice is big enough
//   };

//   return (
//     <div className="chart-container">
//       <h3 className="chart-title">Request Status Distribution</h3>
//       <div style={{ width: '100%', height: 350 }}>
//         <ResponsiveContainer>
//           <PieChart>
//             <Pie
//               data={chartData}
//               cx="50%"
//               cy="50%"
//               labelLine={false}
//               label={renderLabel}
//               outerRadius="70%"
//               fill="#8884d8"
//               dataKey="value"
//             >
//               {chartData.map((entry, index) => (
//                 <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
//               ))}
//             </Pie>
//             <Tooltip 
//               formatter={(value, name) => [
//                 `${value} requests`,
//                 name
//               ]}
//               labelFormatter={() => ''}
//             />
//             <Legend 
//               wrapperStyle={{ paddingTop: '20px' }}
//               formatter={(value, entry) => (
//                 <span style={{ color: entry.color }}>
//                   {value}: {entry.payload.value} ({entry.payload.percentage}%)
//                 </span>
//               )}
//             />
//           </PieChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };

// // Responsive Time Series Chart using Recharts
// const TimeSeriesChart = ({ data, period }) => {
//   // Transform data for Recharts
//   const chartData = Object.entries(data).map(([key, value]) => ({
//     period: key,
//     count: value
//   }));

//   return (
//     <div className="chart-container">
//       <h3 className="chart-title">{period} Request Submissions</h3>
//       <div style={{ width: '100%', height: 350 }}>
//         <ResponsiveContainer>
//           <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
//             <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//             <XAxis 
//               dataKey="period" 
//               tick={{ fontSize: 12 }}
//               interval={0}
//             />
//             <YAxis 
//               tick={{ fontSize: 12 }}
//               label={{ value: 'Requests', angle: -90, position: 'insideLeft' }}
//             />
//             <Tooltip 
//               formatter={(value) => [`${value}`, 'Requests']}
//               labelStyle={{ color: '#333' }}
//               contentStyle={{ 
//                 backgroundColor: '#fff',
//                 border: '1px solid #ccc',
//                 borderRadius: '4px'
//               }}
//             />
//             <Bar 
//               dataKey="count" 
//               fill="#007bff"
//               radius={[4, 4, 0, 0]}
//             />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };

// // Responsive Device Type Chart using Recharts
// const DeviceTypeChart = ({ data }) => {
//   // Transform and sort data for Recharts
//   const chartData = Object.entries(data)
//     .map(([device, count]) => ({
//       device: device,
//       count: count
//     }))
//     .sort((a, b) => b.count - a.count)
//     .slice(0, 10); // Show top 10 devices

//   return (
//     <div className="chart-container">
//       <h3 className="chart-title">Popular Device Types</h3>
//       <div style={{ width: '100%', height: 350 }}>
//         <ResponsiveContainer>
//           <BarChart 
//             data={chartData} 
//             layout="horizontal"
//             margin={{ top: 20, right: 30, left: 80, bottom: 5 }}
//           >
//             <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//             <XAxis 
//               type="number"
//               tick={{ fontSize: 12 }}
//               label={{ value: 'Count', position: 'insideBottom', offset: -10 }}
//             />
//             <YAxis 
//               dataKey="device"
//               type="category"
//               width={70}
//               tick={{ fontSize: 12 }}
//             />
//             <Tooltip 
//               formatter={(value) => [`${value}`, 'Count']}
//               labelStyle={{ color: '#333' }}
//               contentStyle={{ 
//                 backgroundColor: '#fff',
//                 border: '1px solid #ccc',
//                 borderRadius: '4px'
//               }}
//             />
//             <Bar 
//               dataKey="count" 
//               fill="#28a745"
//               radius={[0, 4, 4, 0]}
//             />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };

// // Enhanced Summary Metrics with better responsive design
// const SummaryMetrics = ({ requestStats }) => {
//   const metricsData = [
//     {
//       title: 'Total Requests',
//       value: requestStats.total,
//       color: '#6c757d'
//     },
//     {
//       title: 'Completion Rate',
//       value: requestStats.total > 0 
//         ? `${((requestStats.completed / requestStats.total) * 100).toFixed(1)}%`
//         : '0%',
//       color: '#28a745'
//     },
//     {
//       title: 'Rejection Rate', 
//       value: requestStats.total > 0
//         ? `${((requestStats.rejected / requestStats.total) * 100).toFixed(1)}%`
//         : '0%',
//       color: '#dc3545'
//     },
//     {
//       title: 'Pending Requests',
//       value: requestStats.pending,
//       color: '#ffc107'
//     }
//   ];

//   return (
//     <div className="chart-container">
//       <h3 className="chart-title">Summary Metrics</h3>
//       <div className="responsive-metrics-grid">
//         {metricsData.map((metric, index) => (
//           <div key={index} className="metric-card">
//             <div className="metric-value" style={{ color: metric.color }}>
//               {metric.value}
//             </div>
//             <div className="metric-title">{metric.title}</div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export { StatusDistributionChart, TimeSeriesChart, DeviceTypeChart, SummaryMetrics };

import React from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';

// Status Distribution Chart using Recharts
const StatusDistributionChart = ({ data }) => {
  const chartData = Object.entries(data).map(([status, count]) => ({
    name: status,
    value: count,
    percentage: Object.values(data).reduce((sum, c) => sum + c, 0) > 0 
      ? ((count / Object.values(data).reduce((sum, c) => sum + c, 0)) * 100).toFixed(1)
      : 0
  }));

  const COLORS = {
    PENDING: '#ffc107',
    APPROVED: '#28a745', 
    REJECTED: '#dc3545',
    SCHEDULED: '#007bff',
    COMPLETED: '#6c757d'
  };

  const renderLabel = ({ name, percentage }) => {
    return percentage > 5 ? `${percentage}%` : '';
  };

  return (
    <div className="chart-container">
      <h3 className="chart-title">Request Status Distribution</h3>
      <div style={{ width: '100%', height: 350 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderLabel}
              outerRadius="70%"
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value, name) => [
                `${value} requests`,
                name
              ]}
              labelFormatter={() => ''}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value, entry) => (
                <span style={{ color: entry.color }}>
                  {value}: {entry.payload.value} ({entry.payload.percentage}%)
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Time Series Chart using Recharts
const TimeSeriesChart = ({ data, period }) => {
  const chartData = Object.entries(data).map(([key, value]) => ({
    period: key,
    count: value
  }));

  return (
    <div className="chart-container">
      <h3 className="chart-title">{period} Request Submissions</h3>
      <div style={{ width: '100%', height: 350 }}>
        <ResponsiveContainer>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="period" 
              tick={{ fontSize: 12 }}
              interval={0}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              label={{ value: 'Requests', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              formatter={(value) => [`${value}`, 'Requests']}
              labelStyle={{ color: '#333' }}
              contentStyle={{ 
                backgroundColor: '#fff',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
            <Bar 
              dataKey="count" 
              fill="#007bff"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Device Type Chart - HORIZONTAL BAR CHART
const DeviceTypeChart = ({ data }) => {
  // Transform and sort data for horizontal bar chart
  const chartData = Object.entries(data)
    .map(([device, count]) => ({
      device: device.length > 15 ? device.substring(0, 15) + '...' : device,
      fullDevice: device,
      count: count
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  return (
    <div className="chart-container">
      <h3 className="chart-title">Popular Device Types</h3>
      <div style={{ width: '100%', height: 350 }}>
        <ResponsiveContainer>
          <BarChart 
            data={chartData} 
            layout="horizontal"
            margin={{ top: 20, right: 30, left: 80, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              type="number"
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              dataKey="device"
              type="category"
              width={75}
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              formatter={(value, name, props) => [
                `${value} requests`, 
                props.payload.fullDevice
              ]}
              labelFormatter={() => ''}
              contentStyle={{ 
                backgroundColor: '#fff',
                border: '1px solid #ddd',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            />
            <Bar 
              dataKey="count" 
              fill="#28a745"
              radius={[0, 6, 6, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Summary Metrics
const SummaryMetrics = ({ requestStats, userStats }) => {
  const metricsData = [
    {
      title: 'Total Requests',
      value: requestStats.total,
      color: '#6c757d'
    },
    {
      title: 'Total Users', 
      value: userStats.total,
      color: '#3b82f6'
    },
    {
      title: 'Completion Rate',
      value: requestStats.total > 0 
        ? `${((requestStats.completed / requestStats.total) * 100).toFixed(1)}%`
        : '0%',
      color: '#28a745'
    },
    {
      title: 'Rejection Rate', 
      value: requestStats.total > 0
        ? `${((requestStats.rejected / requestStats.total) * 100).toFixed(1)}%`
        : '0%',
      color: '#dc3545'
    }
  ];

  return (
    <div className="chart-container">
      <h3 className="chart-title">Summary Metrics</h3>
      <div className="responsive-metrics-grid">
        {metricsData.map((metric, index) => (
          <div key={index} className="metric-card">
            <div className="metric-value" style={{ color: metric.color }}>
              {metric.value}
            </div>
            <div className="metric-title">{metric.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// export { StatusDistributionChart, TimeSeriesChart, DeviceTypeChart, SummaryMetrics };
export { StatusDistributionChart, TimeSeriesChart, SummaryMetrics };