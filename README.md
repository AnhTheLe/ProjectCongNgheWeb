# ProjectCongNgheWeb

##  Cấu trúc project
        Frontend/
        └── src/
            ├── config  #cấu hình môi trường và kết nối cơ sở dũ liệu
            ├── controler 
            ├── models # tạo mô hình để truy vấn cơ sở dữ liệu sử  dụng bởi Sequelize
            ├── migrations # Định nghĩa việc tạo hoặc xóa một bảng cơ sở dữ liệu
            ├── route      # Các route của dự án
            ├── service    # chứa các dịch vụ liên quan đến cơ sở dữ liệu
            ├── server.js   #tạo một máy chủ web  
            
## Chạy chương trình
pull project về máy 
- tạo file .env ( cấu hình các biến môi trường)
- npm install
- npm start

## Công nghệ sử dụng
- Platform NodeJS
- Framework Express
- Database MySQL với thư viện Sequelize (https://sequelize.org/docs/v6/getting-started/)



