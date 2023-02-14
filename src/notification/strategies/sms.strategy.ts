export interface SmsStrategy {
  sendSMS(message: string, recipient: string): Promise<boolean>;
}
