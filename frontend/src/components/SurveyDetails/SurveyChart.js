// File: src/components/SurveyDetails/SurveyChart.js
import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const SurveyChart = ({ question }) => {
  if (!question || !question.answers || question.answers.length === 0) {
    return <p>No chart data available.</p>;
  }

  const answerCounts = {};
  question.answers.forEach((answer) => {
    const label = answer.text || answer.choice_id || 'Unknown';
    answerCounts[label] = (answerCounts[label] || 0) + 1;
  });

  const labels = Object.keys(answerCounts);
  const data = Object.values(answerCounts);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Responses',
        data,
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
        ]
      }
    ]
  };

  return (
    <div style={{ maxWidth: 400, margin: '20px auto' }}>
      <Pie data={chartData} />
    </div>
  );
};

export default SurveyChart;
