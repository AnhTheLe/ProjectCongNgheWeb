
# ProjectCongNgheWeb
Providing a solution for Enterprise

## Cấu trúc project backend

```sh
Backend/
└── src/main/java/com/projectcnw/salesmanagement
    ├── configs             # Các class cấu hình chung của dự án
    ├── controllers         # Các class api của dự án
    ├── converter           # Các class hỗ trợ convert qua lại giữa dto và model
    ├── dto                 # Data object transfer
    ├── exceptions          # Các xử lý ngoaoij lệ global của dự án
    ├── models              # Hay còn gọi là entity, đại tiện cho từng đối tượng liên kết với database
    ├── repositories        # Sử dựng Spring JPA để lấy dữ liệu từ database
    ├── utils               # Các class tiện ích
    └── services            # Xử lý những logic nghiệp vụ
    
```

## Cấu trúc thư mục và nhiệm vụ của thư mục
- Sử dụng famework của java là spring boot và spring sercurity. Cấu trúc thư mục được thiết kế theo mô hình 3-tiers gồm ba phần chính đó là:
### 1. Package entity
- Package entity đại diện cho dữ liệu , package repository chịu trách nhiệm tương tác chính với cơ sở dữ liệu ( ở đây là package entity),
### 2. Package service
- Package service có chức năng xử lý những logic nghiệp vụ để lấy kết quả trả về cho phía giao diện người dùng
### 2. Package controller
- Package controller bao gồm những API chính để tương tác với phần frontend

## Bên cạnh đó còn một số package khác như:
- Package ultils bao gồm các class tiện ích như là fomat ngày tháng năm hay lấy thông tin người dùng hiện tại từ security context holder …
- Package exception để xử lý những exception có thể xuất hiện trong quá trình xủa lý logic nghiệp vụ. 
- Package config có chức năng quản lý cấu hình ứng dụng. Package này chứa các file và các class dùng để cấu hình và tùy chỉnh các thành phần trong ứng dụng Spring Boot.. …

Ngoài ra có thư muc resource chức file cấu hình của thư mục như link đến database, server port …

Và cuối cùng là thư mục test chứa các tập tin và các lớp liên quan đến việc kiểm thử (testing) ứng dụng, ở đây chủ yếu là unit test .