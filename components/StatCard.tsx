import React from 'react';

/* 1. ĐỊNH NGHĨA KIỂU DỮ LIỆU (TypeScript) 
  Lý do: Giúp code an toàn, tự động nhắc lệnh (autocomplete) khi truyền props.
*/
interface StatCardProps {
  icon: string;
  title: string;
  value: string;
  percentage: number;
  timeframe?: string; // Dấu '?' nghĩa là tham số này không bắt buộc
  cssClass: string;   // Dùng để gắn các class cũ như 'eg', 'mth', 'cs'
}

export default function StatCard({ 
  icon, 
  title, 
  value, 
  percentage, 
  timeframe = "Last 24 Hours", // Giá trị mặc định
  cssClass 
}: StatCardProps) {
  
  return (
    // Sử dụng Style System thông qua các class CSS cũ, kết hợp cấu trúc JSX
    <div className={cssClass}>
      <span className="material-icons-sharp">{icon}</span>
      <h3>{title}</h3>
      <h2>{value}</h2>
      <div className="progress">
        {/* Vòng tròn SVG giữ nguyên, nhưng có thể điều chỉnh 
          thuộc tính stroke-dashoffset thông qua CSS dựa trên percentage sau này
        */}
        <svg><circle cx="38" cy="38" r="36"></circle></svg>
        <div className="number"><p>{percentage}%</p></div>
      </div>
      <small className="text-muted">{timeframe}</small>
    </div>
  );
}
