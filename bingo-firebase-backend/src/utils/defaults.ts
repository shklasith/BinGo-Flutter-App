import { AppSettings, ImpactStats } from '../types/domain';

export const defaultSettings: AppSettings = {
  darkMode: false,
  scanReminders: true,
  recyclingTips: true,
};

export const defaultImpactStats: ImpactStats = {
  treesSaved: 0,
  plasticDiverted: 0,
  co2Reduced: 0,
};

export const allowedSettingsKeys = ['darkMode', 'scanReminders', 'recyclingTips'] as const;

export const normalizeSettings = (settings?: Partial<AppSettings>): AppSettings => ({
  darkMode: settings?.darkMode ?? defaultSettings.darkMode,
  scanReminders: settings?.scanReminders ?? defaultSettings.scanReminders,
  recyclingTips: settings?.recyclingTips ?? defaultSettings.recyclingTips,
});

export const normalizeImpactStats = (stats?: Partial<ImpactStats>): ImpactStats => ({
  treesSaved: stats?.treesSaved ?? defaultImpactStats.treesSaved,
  plasticDiverted: stats?.plasticDiverted ?? defaultImpactStats.plasticDiverted,
  co2Reduced: stats?.co2Reduced ?? defaultImpactStats.co2Reduced,
});
