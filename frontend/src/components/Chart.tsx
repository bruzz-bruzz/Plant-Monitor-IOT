import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import type {ChartOptions} from 'chart.js'
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
const options: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  elements: {
    line: {
      tension: 0.38,
      borderWidth: 3,
      borderCapStyle: 'round',
      borderJoinStyle: 'round',
    },
    point: {
      radius: 0,
      hoverRadius: 5,
      hoverBorderWidth: 2,
    },
  },
  plugins: {
    tooltip: {
      displayColors: true,
      padding: 12,
      cornerRadius: 8,
    },
  },
};
type givenData = {
    data:{
        labels:string[],
        datasets:any[]
    }
}
export default function TypedLineGraph({data}:givenData) {
  const styledData = {
    ...data,
    datasets: data.datasets.map((dataset) => ({
      ...dataset,
      borderWidth: 3,
      pointRadius: 0,
      pointHoverRadius: 5,
      pointHoverBorderWidth: 2,
      fill: true,
      backgroundColor: `${dataset.borderColor}18`,
      spanGaps: true,
    })),
  }

  return (
    <div style={{ width: '100%', height: '400px', maxWidth: '800px', margin: '0 auto' }}>
      <Line options={options} data={styledData} />
    </div>
  );
}