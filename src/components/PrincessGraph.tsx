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

interface UserCoordinates {
  x: number;
  y: number;
  name: string;
  isUser?: boolean;
}

interface PrincessGraphProps {
  princesses: Princess[];
  selectedPrincess?: Princess;
  userCoordinates?: UserCoordinates;
}

const PrincessGraph: React.FC<PrincessGraphProps> = ({
  princesses,
  selectedPrincess,
  userCoordinates,
}) => {
  const config = getDefaultGraphConfig();
  const chartData = transformForChart(princesses);

  const datasets = [
    {
      label: 'Princesses',
      data: chartData.map((item) => ({
        x: item.x,
        y: item.y,
        princess: item.princess,
        isUser: false,
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
  ];

  // Add user position if provided
  if (userCoordinates) {
    datasets.push({
      label: 'Your Position',
      data: [{
        x: userCoordinates.x,
        y: userCoordinates.y,
        princess: null as any,
        isUser: true,
      }],
      backgroundColor: ['#ff4757'], // Bright red for user
      borderColor: ['#ff3742'],
      borderWidth: [3],
      pointRadius: [8], // Larger point for user
    });
  }

  const data = { datasets };

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
            const { isUser, princess } = context.raw;
            
            if (isUser) {
              return `You (${context.parsed.x.toFixed(1)}%, ${context.parsed.y.toFixed(1)}%)`;
            } else if (princess) {
              return `${princess.name} (${context.parsed.x}%, ${context.parsed.y}%)`;
            }
            return `(${context.parsed.x}%, ${context.parsed.y}%)`;
          },
          afterLabel: (context: any) => {
            const { isUser, princess } = context.raw;
            
            if (isUser) {
              return 'Your calculated position from quiz';
            } else if (princess) {
              return princess.source;
            }
            return '';
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
        
        {userCoordinates && (
          <div className="user-position-legend">
            <div className="legend-item">
              <span className="legend-dot user-dot"></span>
              <span className="legend-text">
                Your position: {userCoordinates.x.toFixed(1)}% Heroine, {userCoordinates.y.toFixed(1)}% Fierce
              </span>
            </div>
            {selectedPrincess && (
              <div className="legend-item">
                <span className="legend-dot princess-dot"></span>
                <span className="legend-text">
                  Closest match: {selectedPrincess.name}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PrincessGraph;
