import React, { useState, useEffect } from 'react';

function Home() {
  const [topCarModelsData, setTopCarModelsData] = useState([]);

  useEffect(() => {
    // Fetch data from the server
    fetch('http://localhost:3001/api/topmodels')
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setTopCarModelsData(data.topModels);
        } else {
          console.error('Error:', data.message);
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, []); // Empty dependency array means this effect runs once when the component mounts

  return (
    <div className="container">
      <h1>Dashboard</h1>
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

      {/* The second table remains unchanged */}
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
          <tr>
            <td>1</td>
            <td>Lucas</td>
            <td>10</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Zexi</td>
            <td>8</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Home;
