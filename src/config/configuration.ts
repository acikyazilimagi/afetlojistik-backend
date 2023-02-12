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
  aws: {
    region: process.env.AWS_REGION,
    profile: process.env.AWS_PROFILE,
  },
  swagger: {
    enabled: process.env.SWAGGER_ENABLED ?? 'true',
  },
  debug: {
    bypassSms: process.env.DEBUG_BYPASS_SMS,
    bypassCode: process.env.DEBUG_BYPASS_CODE,
  },
  http: {
    timeout: process.env.SERVICE_TIMEOUT,
  },
  optiyol: {
    baseUrl: process.env.INTEGRATION_OPTIYOL_URL || '',
    company: process.env.OPTIYOL_COMPANY_NAME || '',
    token: process.env.OPTIYOL_TOKEN || '',
  }
});
