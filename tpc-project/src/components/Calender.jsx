import React, { useEffect } from "react";
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const sectionStyle = {
  flexBasis: '25%',
  backgroundColor: 'rgb(234, 245, 252)',
  borderRadius: '10px',
  marginBottom: '3%',
  padding: '15px 10px',
  boxSizing: 'border-box'
};

function Calendar() {
  useEffect(() => {
    const ctx = document.getElementById('placementGraph').getContext('2d');
    
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['2019', '2020', '2021', '2022', '2023'],
        datasets: [{
          label: 'Placement Percentage',
          data: [60, 75, 80, 85, 90],
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2,
          fill: false,
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            max: 100
          }
        }
      }
    });
  }, []);

  return (
    <div className="p-6">
      <section id="placements" style={sectionStyle}>
        <h3 className="text-2xl font-bold">Past Placement Graph</h3>
        <canvas id="placementGraph" width="400" height="100"></canvas>
      </section>
    </div>
  );
}

export default Calendar;
