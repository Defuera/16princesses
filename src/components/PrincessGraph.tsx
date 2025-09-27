import React from 'react';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  ScatterController,
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import { Princess } from '../types/princess';
import { transformForChart, getDefaultGraphConfig } from '../data/princessData';

ChartJS.register(
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  ScatterController
);

interface PrincessGraphProps {
  princesses: Princess[];
  selectedPrincess?: Princess;
}

const PrincessGraph: React.FC<PrincessGraphProps> = ({
  princesses,
  selectedPrincess,
}) => {
  const config = getDefaultGraphConfig();
  const chartData = transformForChart(princesses);

  const data = {
    datasets: [
      {
        label: 'Princesses',
        data: chartData.map((item) => ({
          x: item.x,
          y: item.y,
          princess: item.princess,
        })),
        backgroundColor: chartData.map((item) =>
          selectedPrincess && item.princess.id === selectedPrincess.id
            ? config.styling.selectedPrincess.color
            : config.styling.unselectedPrincess.color
        ),
        borderColor: chartData.map((item) =>
          selectedPrincess && item.princess.id === selectedPrincess.id
            ? config.styling.selectedPrincess.color
            : config.styling.unselectedPrincess.color
        ),
        borderWidth: chartData.map((item) =>
          selectedPrincess && item.princess.id === selectedPrincess.id
            ? config.styling.selectedPrincess.borderWidth
            : 1
        ),
        pointRadius: chartData.map((item) =>
          selectedPrincess && item.princess.id === selectedPrincess.id
            ? config.styling.selectedPrincess.size
            : config.styling.unselectedPrincess.size
        ),
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const princess = context.raw.princess;
            return `${princess.name} (${context.parsed.x}%, ${context.parsed.y}%)`;
          },
          afterLabel: (context: any) => {
            const princess = context.raw.princess;
            return princess.source;
          },
        },
      },
    },
    scales: {
      x: {
        type: 'linear' as const,
        position: 'bottom' as const,
        title: {
          display: true,
          text: config.xAxis.label,
          font: {
            size: 14,
            weight: 'bold' as const,
          },
        },
        min: config.xAxis.min,
        max: config.xAxis.max,
        ticks: {
          stepSize: config.xAxis.tickInterval,
        },
        grid: {
          display: config.plotArea.showGrid,
          color: config.plotArea.gridLineColor,
        },
      },
      y: {
        type: 'linear' as const,
        title: {
          display: true,
          text: config.yAxis.label,
          font: {
            size: 14,
            weight: 'bold' as const,
          },
        },
        min: config.yAxis.min,
        max: config.yAxis.max,
        ticks: {
          stepSize: config.yAxis.tickInterval,
        },
        grid: {
          display: config.plotArea.showGrid,
          color: config.plotArea.gridLineColor,
        },
      },
    },
    interaction: {
      intersect: false,
    },
  };

  return (
    <div className="princess-graph-container">
      <h2 className="graph-title">{config.title}</h2>
      <div className="chart-wrapper">
        <Scatter data={data} options={options} />
      </div>
      <div className="axis-labels">
        <div className="axis-description">
          <p><strong>X-Axis:</strong> Patriarchal (left) to Feminist (right)</p>
          <p><strong>Y-Axis:</strong> Sweet (bottom) to Assertive (top)</p>
        </div>
      </div>
    </div>
  );
};

export default PrincessGraph;
