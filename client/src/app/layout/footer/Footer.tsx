import {
  FaFacebookF,
  FaFacebookMessenger,
  FaTwitterSquare,
  FaYoutubeSquare,
} from "react-icons/fa";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-800 to-gray-900 text-white py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Logo và thông tin liên hệ */}
          <div className="flex flex-col space-y-6">
            <Image
              src="https://firebasestorage.googleapis.com/v0/b/project-df4f0.appspot.com/o/%E1%BA%A2nh_ch%E1%BB%A5p_m%C3%A0n_h%C3%ACnh_2024-07-10_152831-removebg-preview.png?alt=media&token=5b582e5e-2635-4bee-9427-0eab5511dc79"
              alt="Logo"
              width={120}
              height={120}
              className="h-24 w-30"
            />
            <p className="text-sm text-gray-300 leading-relaxed">
              Tầng 2, số nhà 541 Vũ Tông Phan, Phường Khương Đình, Quận Thanh
              Xuân, Thành phố Hà Nội, Việt Nam
            </p>
            <p className="text-sm text-gray-300">Phone: 084 283 4585</p>
            <p className="text-sm text-gray-300">
              Email: vietjackteam@gmail.com
            </p>
            <div className="flex space-x-6 mt-4">
              <a href="#" aria-label="Facebook">
                <FaFacebookF className="text-2xl text-blue-400 hover:text-blue-300 transition-colors duration-300 cursor-pointer" />
              </a>
              <a href="#" aria-label="Facebook Messenger">
                <FaFacebookMessenger className="text-2xl text-fuchsia-600 hover:text-fuchsia-500 transition-colors duration-300 cursor-pointer" />
              </a>
              <a href="#" aria-label="YouTube">
                <FaYoutubeSquare className="text-2xl text-red-500 hover:text-red-400 transition-colors duration-300 cursor-pointer" />
              </a>
              <a href="#" aria-label="YouTube">
                <FaTwitterSquare className="text-2xl text-white hover:text-slate-300 transition-colors duration-300 cursor-pointer" />
              </a>
            </div>
          </div>

          {/* Liên kết */}
          <div className="flex flex-col space-y-4">
            <h4 className="font-bold text-xl mb-4 text-orange-400">LIÊN KẾT</h4>
            <ul className="space-y-3">
              {[
                "Chính sách bảo mật",
                "Điều khoản dịch vụ",
                "Thư viện câu hỏi miễn phí",
                "Khóa học - Bài giảng",
                "Hỏi đáp bài tập",
                "Tài liệu tham khảo",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-orange-400 transition-colors duration-300 text-sm"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Thi online */}
          <div className="flex flex-col space-y-4">
            <h4 className="font-bold text-xl mb-4 text-orange-400">
              THI ONLINE
            </h4>
            <ul className="grid grid-cols-2 gap-3">
              {[
                "Trắc nghiệm bằng lái",
                "Đánh giá năng lực",
                "Luyện Thi THPTQG 2022",
                "Thi thử THPT Quốc gia",
                "Lớp 12",
                "Lớp 11",
                "Lớp 10",
                "Lớp 9",
                "Lớp 8",
                "Lớp 7",
                "Lớp 6",
                "Lớp 5",
                "Lớp 4",
                "Lớp 3",
                "Lớp 2",
                "Lớp 1",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-orange-400 transition-colors duration-300 text-sm"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="text-center mt-12 pt-8 border-t border-gray-700">
          <p className="text-sm text-gray-400">
            Copyright © 2021 Vietjack. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
