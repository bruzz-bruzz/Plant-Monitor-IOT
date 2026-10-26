export const METRIC_CONFIG = {
    soil_moisture: { ideal: [40, 60], moderate: [30, 40], unhealthy: [0, 30] },
    humidity: { ideal: [60, 80], moderate: [50, 60], unhealthy: [0, 50] },
    light_intensity: { ideal: [10000, 20000], moderate: [5000, 10000], unhealthy: [0, 5000] },
    temperature: { ideal: [24, 28], moderate: [20, 24], unhealthy: [10, 20] },
    soil_temperature: { ideal: [22, 26], moderate: [18, 22], unhealthy: [10, 18] },
    tds: { ideal: [500, 1000], moderate: [200, 500], unhealthy: [0, 200] }
} as const;

export type MetricKey = keyof typeof METRIC_CONFIG;

export const getStatus = (metric: MetricKey, value: number) => {
    const config = METRIC_CONFIG[metric];
    if (value >= config.ideal[0] && value <= config.ideal[1]) return 'ideal';
    if (value >= config.moderate[0] && value <= config.moderate[1]) return 'moderate';
    return 'unhealthy';
};
