import { ConfigDataType } from './config.interface';

export const DEFAULT_CONFIG: ConfigDataType = {
  env: 'development',
  port: 8011,
  logLevel: 'info',
  maxPayloadSize: '1000mb',
  responseTimeOut: 600,
  staticFilesFolder: 'files',
  database: {
    type: 'mysql',
    host: '64.227.137.119',
    port: 3306,
    username: 'xpparel_qa_user',
    password: 'Xpparel_qa@123',
    dbName: 'gatex_sq',
    poolLimit: 20,
    charset: 'utf8_general_ci'
  },
  rateLimiting: {
    ttl: 60,
    limit: 10,
    maxLoginAttempts: 3
  },
  appSepcific: {
    PANELS_GENERATION: false
  },
  logging: {
    serviceName: "SPS",
    traceExportUrl: "http://68.183.82.55:4318/v1/traces",
    logsExportUrl: "http://68.183.82.55:4318/v1/logs",
    metricsExportUrl: "http://68.183.82.55:4318/v1/metrics",
    loggingLevel: "info"
  }
};
