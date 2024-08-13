import React from "react";
import { useLoaderData } from "react-router-dom";

interface BillData {
  id: string;
  name: string;
  creator: string;
  total: number;
  totalPerPerson: Record<string, number>;
  calculationDate: string;
}

const BillsList: React.FC = () => {
  const bills: BillData[] = useLoaderData() as BillData[];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Danh sách hóa đơn</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {bills.length === 0 ? (
          <div className="col-span-full text-center text-gray-500">
            Không có hóa đơn nào để hiển thị.
          </div>
        ) : (
          bills.map((bill) => (
            <div
              key={bill.id}
              className="p-4 rounded-lg shadow-md bg-white border border-gray-300"
            >
              <h3 className="text-xl font-semibold mb-2">{bill.name}</h3>
              <p className="text-gray-700 font-bold">
                Tổng: {bill.total.toLocaleString()} VND
              </p>
              <p className="text-gray-500">Người tạo: {bill.creator}</p>
              <p className="text-gray-500">Ngày tạo: {bill.calculationDate}</p>
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Tổng số tiền mỗi người:</h4>
                <ul className="list-disc list-inside">
                  {Object.entries(bill.totalPerPerson).map(
                    ([personId, amount]) => (
                      <li key={personId}>
                        {personId}: {amount.toLocaleString()} VND
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BillsList;
