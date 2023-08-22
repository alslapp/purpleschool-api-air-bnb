export const NotifyProviders = ['default', 'telegram', 'email', 'sms'];
export type TNotifyProvider = (typeof NotifyProviders)[number];
export type TNotifyTemplate = Record<TNotifyProvider, string[]>;
