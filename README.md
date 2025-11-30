# FloginFE_BE

Ứng dụng quản lý sản phẩm Full-stack với Authentication, được xây dựng bằng Spring Boot (Backend) và React (Frontend).

## 📋 Mục lục

- [Tổng quan](#-tổng-quan)
- [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [Yêu cầu hệ thống](#-yêu-cầu-hệ-thống)
- [Cài đặt](#-cài-đặt)
- [Chạy ứng dụng](#-chạy-ứng-dụng)
- [Chạy Tests](#-chạy-tests)
- [Cấu trúc dự án](#-cấu-trúc-dự-án)
- [API Endpoints](#-api-endpoints)
- [CI/CD](#-cicd)

## 🎯 Tổng quan

FloginFE_BE là một ứng dụng web full-stack cung cấp các tính năng:

- **Authentication & Authorization**: Đăng nhập/đăng ký với Spring Security
- **Product Management**: CRUD operations cho quản lý sản phẩm
- **Responsive UI**: Giao diện người dùng thân thiện với React
- **Comprehensive Testing**: Unit tests, Integration tests, và E2E tests

## 🛠 Công nghệ sử dụng

### Backend
- **Framework**: Spring Boot 3.5.7
- **Language**: Java 17
- **Database**: MySQL
- **Security**: Spring Security với BCrypt password encoding
- **ORM**: Spring Data JPA
- **Build Tool**: Maven
- **Testing**: JUnit 5, Mockito, Spring Security Test
- **Code Coverage**: JaCoCo

### Frontend
- **Framework**: React 19.2.0
- **Language**: JavaScript (ES6+)
- **Routing**: React Router DOM 6.30.1
- **HTTP Client**: Axios 1.13.1
- **UI Icons**: React Icons 5.5.0
- **Build Tool**: React Scripts 5.0.1
- **Testing**: Jest, React Testing Library, Cypress
- **E2E Testing**: Cypress 15.7.0

## 💻 Yêu cầu hệ thống

- **Java**: JDK 17 hoặc cao hơn
- **Node.js**: v16.x hoặc cao hơn
- **npm**: v8.x hoặc cao hơn
- **MySQL**: v8.0 hoặc cao hơn
- **Maven**: v3.6 hoặc cao hơn

## 📦 Cài đặt

### 1. Clone repository

```bash
git clone https://github.com/xKhangg/FloginFE_BE.git
cd FloginFE_BE
```

### 2. Cấu hình Database

Tạo database MySQL:

```sql
CREATE DATABASE flogin_db;
```

Cập nhật thông tin kết nối database trong `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/flogin_db
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### 3. Cài đặt Backend

```bash
cd backend
mvn clean install
```

### 4. Cài đặt Frontend

```bash
cd frontend
npm install
```

## 🚀 Chạy ứng dụng

### Chạy Backend

```bash
cd backend
mvn spring-boot:run
```

Backend sẽ chạy tại: `http://localhost:8080`

### Chạy Frontend

```bash
cd frontend
npm start
```

Frontend sẽ chạy tại: `http://localhost:3000`

## 🧪 Chạy Tests

### Backend Tests

#### Chạy tất cả tests:
```bash
cd backend
mvn test
```

#### Chạy tests với coverage report:
```bash
cd backend
mvn clean test jacoco:report
```

Coverage report sẽ được tạo tại: `backend/target/site/jacoco/index.html`

#### Chạy specific test class:
```bash
# Login Service Unit Tests
mvn test -Dtest=AuthServiceUnitTest

# Product Service Unit Tests
mvn test -Dtest=ProductServiceUnitTest

# Auth Controller Integration Tests
mvn test -Dtest=AuthControllerIntegrationTest

# Product Controller Integration Tests
mvn test -Dtest=ProductControllerIntegrationTest
```

### Frontend Tests

#### Chạy tất cả tests:
```bash
cd frontend
npm test
```

#### Chạy tests với coverage:
```bash
cd frontend
npm test -- --coverage
```

#### Chạy specific test file:
```bash
# Login Validation Tests
npm test -- LoginValidation.test.js

# Product Validation Tests
npm test -- productValidation.test.js
```

### E2E Tests (Cypress)

#### Mở Cypress Test Runner:
```bash
cd frontend/src
npx cypress open
```

#### Chạy Cypress headless:
```bash
cd frontend/src
npx cypress run
```

## 📁 Cấu trúc dự án

```
FloginFE_BE/
├── backend/                    # Spring Boot Backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/flogin/
│   │   │   │   ├── config/           # Security & App Configuration
│   │   │   │   ├── controller/       # REST Controllers
│   │   │   │   ├── dto/              # Data Transfer Objects
│   │   │   │   ├── entity/           # JPA Entities
│   │   │   │   ├── repository/       # JPA Repositories
│   │   │   │   └── service/          # Business Logic
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       └── data.sql          # Initial data
│   │   └── test/
│   │       └── java/
│   │           ├── AuthServiceUnitTest.java
│   │           ├── AuthControllerIntegrationTest.java
│   │           ├── ProductServiceUnitTest.java
│   │           └── ProductControllerIntegrationTest.java
│   └── pom.xml
│
├── frontend/                   # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login/            # Login component
│   │   │   └── ProductManagement/ # Product CRUD component
│   │   ├── cypress/              # Cypress E2E tests
│   │   │   ├── e2e/
│   │   │   └── pages/            # Page Object Models
│   │   ├── tests/                # Jest unit tests
│   │   │   ├── LoginValidation.test.js
│   │   │   └── productValidation.test.js
│   │   ├── App.js
│   │   └── index.js
│   ├── cypress.config.js
│   └── package.json
│
├── .github/
│   └── workflows/
│       ├── ProductCI.yml         # Product CI/CD pipeline
│       └── login-tests.yml       # Login tests pipeline
│
└── README.md
```

## 🔄 CI/CD

Dự án sử dụng GitHub Actions để tự động hóa testing:

- **ProductCI.yml**: Chạy tất cả Product-related tests
- **login-tests.yml**: Chạy tất cả Login/Authentication tests

Workflows tự động chạy khi:
- Push code lên branch `master`
- Tạo Pull Request

## 👥 Đóng góp

1. Fork repository
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📄 License

Dự án này được phát triển cho mục đích học tập và nghiên cứu.

## 📧 Liên hệ

- GitHub: [@xKhangg](https://github.com/xKhangg)
- Repository: [FloginFE_BE](https://github.com/xKhangg/FloginFE_BE)

---

**Lưu ý**: Đảm bảo cấu hình đúng database connection và các environment variables trước khi chạy ứng dụng.
