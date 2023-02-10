# Transportation Management System
Bu projenin temel amacı, olağan üstü hal ve doğal afet durumlarında toplanan ayni yardımların sistematik bir 
şekilde doğru miktarlar ile gideceği yere ulaştırılmasına olanak sağlayacak TMS (Transportation Management System) 
ürününün geliştirilmesidir. 

## API Documentation
Swagger dokümantasyonu: [Swagger API](1).

## Technologies
- Nest.js
- AWS-SDK (for Amazon SNS)
- Mongoose
- Eslint
- Pino 
- Jest
- Swagger 

### Local development
1. `.env` dosyası oluşturun ve aşağıdaki değerlerle doldurun:
```
PORT=3000
MONGO_URL=***
SWAGGER_ENABLED=true
LOG_LEVEL=debug
```
2. `npm ci` komutuyla paketleri indirin.
3. `npm run start` komutuyla servisi çalıştırın.
4. Servis http://localhost:3000'de ayakta olmalı. (Örneğin: http://localhost:3000/health).

## Reference
[Nest](https://github.com/nestjs/nest) is an [MIT licensed](LICENSE) open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).
- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

[1]: https://.../api
