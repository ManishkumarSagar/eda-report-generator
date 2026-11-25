import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

function ChartCard({ title, labels, values, labelName = 'Value', color = '#fb923c' }) {
  const data = {
    labels,
    datasets: [
      {
        label: labelName,
        data: values,
        backgroundColor: color,
        borderRadius: 6,
        hoverBackgroundColor: '#ea580c',
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#17191f',
        padding: 10,
        titleFont: { size: 12 },
        bodyFont: { size: 12 },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#667085', font: { size: 11 } },
      },
      y: {
        grid: { color: '#ece7e2' },
        ticks: { color: '#667085', font: { size: 11 } },
      },
    },
  }

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h3 style={styles.title}>{title}</h3>
      </div>
      <div style={styles.chartWrap}>
        <Bar data={data} options={options} />
      </div>
    </div>
  )
}

const styles = {
  card: {
    background: '#fff',
    border: '1px solid var(--line)',
    borderRadius: 14,
    padding: 20,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 15,
    fontWeight: 700,
    color: '#30343b',
    margin: 0,
  },
  chartWrap: {
    flex: 1,
    minHeight: 220,
  },
}

export default ChartCard