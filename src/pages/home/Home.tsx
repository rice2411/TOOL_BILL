import { useLoaderData } from "react-router-dom";
import { IPeople } from "../../interface";
import minhImage from "../../assets/images/minh.jpg";
import hungImage from "../../assets/images/hung.jpg";
import phuocImage from "../../assets/images/phuoc.jpg";
import ducImage from "../../assets/images/duc.jpg";
import namImage from "../../assets/images/nam.jpg";
import trongImage from "../../assets/images/trong.jpg";

function Home() {
  const peoples = useLoaderData() as unknown as IPeople[];

  // Sắp xếp danh sách theo số tiền từ cao đến thấp
  const sortedPeoples = [...peoples].sort((a, b) => b.amount - a.amount);

  const getImage = (name: string) => {
    switch (name) {
      case "minh":
        return minhImage;
      case "phước":
        return phuocImage;
      case "hùng":
        return hungImage;
      case "trọng":
        return trongImage;
      case "đức":
        return ducImage;
      case "nam":
        return namImage;
      default:
        return "";
    }
  };

  const getCardClass = (index: number) => {
    switch (index) {
      case 0:
        return "bg-yellow-200 border-yellow-400"; // Màu vàng nhạt cho top 1
      case 1:
        return "bg-blue-200 border-blue-400"; // Màu xanh dương nhạt cho top 2
      case 2:
        return "bg-red-200 border-red-400"; // Màu đỏ nhạt cho top 3
      default:
        return "bg-gray-100 border-gray-300"; // Màu xám nhạt cho các vị trí còn lại
    }
  };

  const getTitle = (index: number) => {
    switch (index) {
      case 0:
        return "Cúp áp phê 3 băng";
      case 1:
        return "Trô như Ô tô";
      case 2:
        return "Tâm bi đứng cái";
      default:
        return "Điều bi đơn giản";
    }
  };

  return (
    <>
      <div className="p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Đồng Bào</h2>
        <div className="space-y-4">
          {sortedPeoples.map((person, index) => (
            <div
              key={person.id}
              className={`rounded-lg p-4 flex items-center hover:shadow-lg transition-shadow ${getCardClass(
                index
              )} border`}
            >
              <div
                className={`flex-shrink-0 w-8 h-8 flex items-center justify-center ${getCardClass(
                  index
                )} rounded-full mr-4`}
              >
                <span className="text-gray-600 font-bold text-xl">
                  {index + 1}
                </span>
              </div>
              <img
                src={getImage(person.name.toLowerCase())}
                alt={person.name}
                className="w-12 h-12 rounded-full object-cover mr-4"
              />
              <div className="flex-1 flex items-center justify-between">
                <div>
                  <h3 className="text-md font-semibold 0  py-1 rounded-md">
                    {person.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-semibold">{getTitle(index)}</span>
                  </p>
                </div>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Tổng số tiền:</span>{" "}
                  {person.amount.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Home;
