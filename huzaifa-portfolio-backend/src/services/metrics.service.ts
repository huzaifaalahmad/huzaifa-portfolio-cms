import { prisma } from '@/config/database';

const metricKeys = {
  siteVisits: 'site_visits',
  cvDownloads: 'cv_downloads',
} as const;

export class MetricsService {
  private counters = (prisma as any).analyticsCounter;

  async recordVisit() {
    return this.increment(metricKeys.siteVisits);
  }

  async recordCvDownload() {
    return this.increment(metricKeys.cvDownloads);
  }

  async getSummary() {
    const rows = await this.counters.findMany({
      where: { key: { in: Object.values(metricKeys) } },
    });

    const values = rows.reduce((acc: Record<string, number>, row: { key: string; value: number }) => {
      acc[row.key] = row.value;
      return acc;
    }, {});

    return {
      siteVisits: values[metricKeys.siteVisits] || 0,
      cvDownloads: values[metricKeys.cvDownloads] || 0,
    };
  }

  private async increment(key: string) {
    const counter = await this.counters.upsert({
      where: { key },
      update: { value: { increment: 1 } },
      create: { key, value: 1 },
    });

    return { key, value: counter.value };
  }
}
