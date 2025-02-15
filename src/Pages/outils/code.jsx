import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import css from "./css/Location.module.css";
import 'chartjs-adapter-moment'; // Or 'chartjs-adapter-date-fns' based on your choice
ChartJS.register(TimeScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Homme = () => {
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Track loading state

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); // Set loading state to true initially

      const response = await axios.get('http://localhost:8085/location/salle');
      const data = response.data; // Assuming data is an array of location entries

      // Group client counts by date
      const groupedData = data.reduce((acc, item) => {
        const date = new Date(item.date_location); // Ensure valid datetime format
        acc[date.toISOString()] = (acc[date.toISOString()] || 0) + 1; // Group by date_location
        return acc;
      }, {});

      // Convert grouped data to desired format for Chart.js
      const xAxisData = Object.keys(groupedData).map((date) => new Date(date)); // Convert to Date objects for time scale
      const seriesData = Object.values(groupedData);

      setChartData({ xAxisData, seriesData });
      setIsLoading(false); // Set loading state to false after data is fetched
    };

    fetchData();
  }, []);

  const options = {
    scales: {
      x: {
        type: 'time',
        display: true,
        title: {
          display: true,
          text: 'Date (Location)', // Label for x-axis
        },
        // (Optional) Configure time scale formatting if needed
        // time: {
        //   unit: 'day', // Change unit to 'hour', 'minute', etc. if applicable
        //   tooltipFormat: 'YYYY-MM-DD', // Customize tooltip format for dates
        // },
      },
      y: {
        type: 'linear',
        display: true,
        title: {
          display: true,
          text: 'Client Count', // Label for y-axis
        },
      },
    },
    
    plugins: {
      legend: {
        display: true,
        labels: {
          boxWidth: 10, // Adjust legend box width if desired
        },
      },
    },
  };

  return (
    <div>
      {isLoading ? (
        <p>Loading data...</p>
      ) : (
        <Line options={options} data={{ labels: chartData.xAxisData, datasets: [{ data: chartData.seriesData }] }} />
      )}
    </div>
  );
};

export default Homme;