# StarLoom Backend

基于 Spring Boot 3.2 的后端服务，为 StarLoom AI 占卜平台提供 API 支持。

## 技术栈

- Spring Boot 3.2
- MyBatis-Plus
- MySQL 8.0
- Redis
- JWT 认证
- OpenAI API

## 快速开始

### 1. 环境要求

- JDK 17+
- Maven 3.8+
- MySQL 8.0+
- Redis

### 2. 初始化数据库

```bash
mysql -u root -p < src/main/resources/db/init.sql
```

### 3. 修改配置

编辑 `src/main/resources/application.yml`：

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/starloom
    username: your_username
    password: your_password

  data:
    redis:
      host: localhost
      port: 6379

  mail:
    username: your-email@qq.com
    password: your-smtp-password

openai:
  api-key: your-openai-api-key
```

### 4. 运行项目

```bash
mvn spring-boot:run
```

或者打包后运行：

```bash
mvn clean package
java -jar target/starloom-backend-1.0.0.jar
```

服务启动后访问：http://localhost:8080

## API 接口

### 用户认证

| 接口 | 方法 | 说明 |
|------|------|------|
| /api/userLogin | POST | 用户登录 |
| /api/register | POST | 用户注册 |
| /api/sendEmailCode | POST | 发送验证码 |
| /api/resetPassword | POST | 重置密码 |
| /api/checkLogin | GET | 检查登录状态 |

### 聊天

| 接口 | 方法 | 说明 |
|------|------|------|
| /chat | POST | AI 对话 |
| /api/chat/getMsgGroupList | GET | 获取聊天列表 |
| /api/chat/getMessageList | GET | 获取聊天记录 |

### 星座

| 接口 | 方法 | 说明 |
|------|------|------|
| /xingzuo/yunshi | POST | 星座运势 |
| /xingzuo/chaxun | POST | 星座查询 |
| /xingzuo/shengrihua | POST | 生日花 |
| /xingzuo/shengrimima | POST | 生日密码 |

### 生肖

| 接口 | 方法 | 说明 |
|------|------|------|
| /shengxiao/query | POST | 生肖查询 |
| /shengxiao/yunshi | POST | 生肖运势 |

## 前端配置

修改前端 `.env.development` 文件：

```
VITE_APP_BASE_API=http://localhost:8080
```
