import { NotifyProviders } from './notify-providers';

export type TNotifyProvider = (typeof NotifyProviders)[number];
export type TNotifyTemplate = Record<TNotifyProvider, string[]>;
