import React from "react";

interface TotalPerPersonProps {
  person: string;
  total: number;
  calculationDate: string;
}

const TotalPerPersonItem: React.FC<TotalPerPersonProps> = ({
  person,
  total,
  calculationDate,
}) => {
  const formatCurrency = (amount: number): string => {
    return amount.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 mb-4 transition-transform transform hover:scale-105">
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{person}</h3>
      <p className="text-sm text-gray-600 mb-1">
        Ngày tính tổng: {calculationDate}
      </p>
      <p className="text-lg font-bold text-indigo-600">
        {formatCurrency(total)}
      </p>
      <div className="mt-4 border-t border-gray-200 pt-2 text-gray-500 text-sm">
        <p className="text-gray-700">
          Đây là số tiền bạn cần thanh toán cho khoản chi này.
        </p>
      </div>
    </div>
  );
};

export default TotalPerPersonItem;
