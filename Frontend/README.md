# Luxtech
Providing a solution for Enterprise

## Cấu trúc project

```sh
Luxtech/
└── src/
    ├── api           # Chứa các tập lệnh axios tương tác với api của server
    ├── app           # Store lưu trữ các Redux reducer
    ├── assets
    ├── features      # Các màn hình của dự án
    └── general       # Các component, constant của dự án
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
