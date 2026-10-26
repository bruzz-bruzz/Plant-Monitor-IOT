import {getStatus} from '../constants/metrics';
import type {MetricKey} from '../constants/metrics'
interface MetricCardProps {
    metric: MetricKey;
    value: number;
    label: string;
    unit: string;
}

export default function MetricCard({ metric, value, label, unit }: MetricCardProps) {
    const status = getStatus(metric, value);
    
    const statusColors = {
        ideal: 'text-green-600',
        moderate: 'text-yellow-600',
        unhealthy: 'text-red-600'
    };

    return (
        <div className={`flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-lg w-48 h-48 ${statusColors[status]}`}>
            <h2 className='text-xl font-bold text-center'>{label}</h2>
            <p className='text-lg font-semibold'>{value} {unit}</p>
            <p className='text-sm capitalize'>Status: {status}</p>
        </div>
    );
}
