
# ProjectCongNgheWeb
Providing a solution for Enterprise

## Cấu trúc project

```sh
Frontend/
└── src/
    ├── api
    ├── app
    ├── assets
    ├── features      # Các màn hình của dự án
    ├── general       # Các component, constant của dự án
    ├── types         # Chức các type, interface của các object
    ├── SVG           # Chứa các svg 
    └── utils         # Chứa các hàm tiện ích dùng cho toàn bộ project 
    
```

## Các câu lệnh

| Command               | Runs                           |
| --------------------- | ------------------------------ |
| `npm install`         | Cài đặt thư viện               |
| `npm run dev`         | Chạy chương trình              |
| `npm run build`       | Chạy build các module          |
| `npm run lint`        | Lint tất cả module             |
| `npm run prettier`    | Kiểm tra format file           |
| `npm run prettier:fix`| Format file với prettier       |

## Chạy chương trình
Tải project về máy sau đó nhập lệnh sau:
```bash
  cd ProjectCongNgheWeb
  npm install
  npm run dev
```

## Các công nghệ được sử dụng và phiên bản
| Công nghệ             | Phiên bản                      |
| --------------------- | ------------------------------ |
| `NodeJs`              | 20.0.0                         |
| `ReactJs`             | 18.2.0                         |
| `Vite`                | 4.4.9                          |
| `TypeScript`          | 5.0.2                          |
| `eslint`              | 8.47.0                         |
| `prettier`            | 3.0.0                          |

## Cấu trúc thư mục và nhiệm vụ của thư mục
- Chúng ta sẽ làm việc với các thư mục chính trong folder src. Vì project ReactJs không có bất kỳ một quy chuẩn nào quy định việc đặt tên thư mục cũng như nhiệm vụ của chúng nên chúng ta cần thống nhất một số quy chuẩn chung.

### 1. Thư mục api
- api sử dụng axios để lấy fetch dữ liệu từ backend
### 2. Thư mục general
- general chứa các component dùng chung cho toàn bộ project và các constant (hàm số sử dụng cho toàn app). Mọi component khác đều có thể sử dụng các component tiện ích ở đây để có thể sử dụng nhanhh chóng
### 3. Thư mục features
- Đây là thư mục chứa các màn hình của project (màn đăng nhập đăng ký, màn dasboarrd ...) và các tính năng của project.
- Thư mục features sẽ được phân ra thành các folder nhỏ hơn có tên trùng với tên của màn hình mà dev muốn phát triển, ví dụ như sau:
```sh
└── features/
    ├── dasboard    # màn tổng quan
    ├── register    # màn đăng ký 
    ├── login       # màn đăng nhập
    ├── createProduct      # màn tạo sản phẩm
    └── order       # Các component, constant của dự án
```
- Trong từng màn hình có thể có các thư mục khác như component ( chứa các component được phát triển cho riêng màn đó ), các hocs (hook custom), các svg riêng (chủ yếu phụ thuộc vào ý đồ của người phát triển).
### 4. Thư mục types
- Chứa các type và interface của các object
### 5. Thư mục SVG
- Chứa các file svg 
### 6. Thư mục utils
- Chứa các hàm tiện ích dùng cho toàn bộ project