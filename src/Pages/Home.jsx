import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2'; // Import Bar instead of Line
import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import css from "./css/Style.module.css";
import 'chartjs-adapter-moment'; // Or 'chartjs-adapter-date-fns' based on your choice
ChartJS.register(TimeScale, LinearScale, PointElement, BarElement, Title, Tooltip, Legend);

const Homme = () => {
   const [locationData, setLocationData] = useState([]);
  const [formationData, setFormationData] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Track loading state
  
   useEffect(() => {
    const fetchDataLocation = async () => {
      setIsLoading(true); // Set loading state to true initially

      const response = await axios.get('http://localhost:8085/location/salle');
      const data = response.data; // Assuming data is an array of location entries

      // Group client counts by date for location
      const groupedLocationData = data.reduce((acc, item) => {
        const date = new Date(item.date_location); // Ensure valid datetime format
        acc[date.toISOString()] = (acc[date.toISOString()] || 0) + 1; // Group by date_location
        return acc;
      }, {});

      // Convert grouped data to desired format for Chart.js (location)
      const locationXAxisData = Object.keys(groupedLocationData).map((date) => new Date(date));
      const locationSeriesData = Object.values(groupedLocationData);

      setLocationData({ locationXAxisData, locationSeriesData });
      setIsLoading(false); // Set loading state to false after location data is fetched
    };

    const fetchDataFormation = async () => {
      setIsLoading(true); // Set loading state to true initially

      const response = await axios.get('http://localhost:8085/formation');
      const data = response.data; // Assuming data is an array of formation entries

      // Group client counts by date for formation
      const groupedFormationData = data.reduce((acc, item) => {
        const date = new Date(item.date_debut); // Ensure valid datetime format
        acc[date.toISOString()] = (acc[date.toISOString()] || 0) + 1; // Group by date_debut
        return acc;
      }, {});

      // Convert grouped data to desired format for Chart.js (formation)
      const formationXAxisData = Object.keys(groupedFormationData).map((date) => new Date(date));
      const formationSeriesData = Object.values(groupedFormationData);

      setFormationData({ formationXAxisData, formationSeriesData });
      setIsLoading(false); // Set loading state to false after formation data is fetched
    };

    fetchDataLocation();
    fetchDataFormation();
  }, []);

  const locationOptions = {
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
        gridLines: {
          display: false, // Hide vertical grid lines
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

    // **Coloring Options:**
    elements: {
      bar: {
        backgroundColor: 'rgba(255, 99, 132, 0.2)', // Adjust bar color and transparency
        borderColor: 'rgb(255, 99, 132)', // Adjust bar border color
        borderWidth: 1, // Adjust bar border width
      },
    },
  };
  const formationOptions = {
    scales: {
      x: {
        type: 'time',
        display: true,
        title: {
          display: true,
          text: 'Date (formation)', // Label for x-axis
        },
        time: {
          unit: 'day', // Change unit to 'hour', 'minute', etc. if applicable
          tooltipFormat: 'YYYY-MM-DD', // Customize tooltip format for dates (only shows date)
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
        gridLines: {
          display: false, // Hide vertical grid lines
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

    // **Coloring Options:**
    elements: {
      bar: {
        backgroundColor: 'rgba(99, 224, 255, 0.2)', // Adjust bar color and transparency
        borderColor: 'rgb(99, 224, 255)', // Adjust bar border color
        borderWidth: 1, // Adjust bar border width
      },
    },
  };

  return (
    <div className={css.container}>
      <div className={`${css.dashboard} theme-container`}>
        {isLoading ? (
          <p>Loading data...</p>
        ) : (
          <>
            <div>
              <h6>Graphique des localisations</h6>
              <Bar   options={locationOptions} data={{ labels: locationData.locationXAxisData, datasets: [{ data: locationData.locationSeriesData }] }} />
            </div>
          
          </>
        )}
      </div>
      <div className={`${css.dashboard} theme-container`}>
        {isLoading ? (
          <p>Loading data...</p>
        ) : (
          <>
            
            <div>
              <h6>Graphique des formations</h6>
              <Bar  className={css.a} options={formationOptions} data={{ labels: formationData.formationXAxisData, datasets: [{ data: formationData.formationSeriesData }] }} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Homme;