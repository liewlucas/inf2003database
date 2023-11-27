import React, { useState, useEffect } from 'react';
import BarChart from '../Components/BarChart'; // Adjust the relative path accordingly
import './Home.css';

function Home() {
  const [topCarModelsData, setTopCarModelsData] = useState([]);
  const [minavgmaxData, setMinAvgMaxData] = useState([]); // Corrected variable name
  const [topCardealerData, setTopCardealerData] = useState([]);
  const [barChartData, setBarChartData] = useState({});

  useEffect(() => {
    // Fetch data from the server for topmodels
    fetch('http://localhost:3001/api/topmodels')
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setTopCarModelsData(data.topModels);

          // Process data for the bar chart
        } else {
          console.error('Error:', data.message);
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });

    // Fetch data from the server for totalSalesByRegion
    fetch('http://localhost:3001/api/totalSalesByRegion')
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          //   // Corrected line
          const chartData = {
            labels: data.totalSalesByRegion.map(item => item.region),
            datasets: [
              {
                label: 'Amount Sold',
                data: data.totalSalesByRegion.map(item => item.totalSales),
                backgroundColor: 'rgba(75,192,192,0.2)',
                borderColor: 'rgba(75,192,192,1)',
                borderWidth: 1,
              },
            ],
          };
          setBarChartData(chartData);
          // Process data for the bar chart
        } else {
          console.error('Error:', data.message);
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });

    // Fetch data from the server for topdealers
    fetch('http://localhost:3001/api/topdealers')
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setTopCardealerData(data.topdealers);
        } else {
          console.error('Error:', data.message);
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
    fetch('http://localhost:3001/api/minavgmax')
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setMinAvgMaxData(data.minavgmax); // Corrected line
        } else {
          console.error('Error:', data.message);
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, []);

  return (
    <div className="container">
      <h1>Dashboard</h1>

      <div className="grid-container">
        <div className="grid-item">
          {/* Display Top 5 Best Selling Car table */}
          <table>
            <caption>Top 5 Best Selling Car</caption>
            <thead>
              <tr>
                <th>No.</th>
                <th>Car Model</th>
                <th>Amount Sold</th>
              </tr>
            </thead>
            <tbody>
              {topCarModelsData.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.modelName}</td>
                  <td>{item.totalSales}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid-item">
          {/* Display Top 5 Dealer Company table */}
          <table>
            <caption>Top 5 Dealer Company</caption>
            <thead>
              <tr>
                <th>No.</th>
                <th>Dealer</th>
                <th>Total Sales</th>
              </tr>
            </thead>
            <tbody>
              {topCardealerData.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.Total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid-item">
          {/* Display Price detail of car table */}
          <table>
            <caption>Price detail of car</caption>
            <thead>
              <tr>
                <th>Lowest Price</th>
                <th>Average Price</th>
                <th>Maximum Price</th>
              </tr>
            </thead>
            <tbody>
              {minavgmaxData.map((item, index) => (
                <tr key={index}>
                  <td>{item.min_price} k</td>
                  <td>{item.avg_price} k</td>
                  <td>{item.max_price} k</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid-item">
          {/* Display BarChart component with the processed data */}
          {Object.keys(barChartData).length > 0 && <BarChart chartData={barChartData} />}
        </div>
      </div>
    </div>
  );
}

export default Home;
