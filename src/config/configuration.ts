export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    mongoUrl: process.env.MONGO_URL,
  },
  log: {
    level: process.env.LOG_LEVEL ?? 'debug',
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  bcrypt: {
    secret: process.env.BCRYPT_SECRET,
  },
  sms: {
    provider: process.env.SMS_PROVIDER, // 'netgsm', 'aws'
    netGsm: {
      username: process.env.NETGSM_USERNAME,
      password: process.env.NETGSM_PASSWORD,
      originator: process.env.NETGSM_ORIGINATOR,
      url: process.env.NETGSM_URL,
    },
    aws: {
      region: process.env.AWS_REGION,
      accessKey: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
    },
  },
  swagger: {
    enabled: process.env.SWAGGER_ENABLED ?? 'true',
  },
  debug: {
    bypassSms: process.env.DEBUG_BYPASS_SMS,
    bypassCode: process.env.DEBUG_BYPASS_CODE,
  },
  http: {
    timeout: process.env.SERVICE_TIMEOUT || '10000',
  },
  optiyol: {
    baseUrl: process.env.INTEGRATION_OPTIYOL_URL || '',
    company: process.env.OPTIYOL_COMPANY_NAME || '',
    token: process.env.OPTIYOL_TOKEN || '',
  },
});
