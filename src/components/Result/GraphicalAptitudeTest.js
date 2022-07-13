import React from 'react';
import {Chart as ChartJS,CategoryScale,LinearScale,BarElement,Title,Tooltip,Legend,} from 'chart.js';
  import { Bar } from 'react-chartjs-2';
//import faker from 'faker';


ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  export const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Candidate Test Result',
      },
    },
  };

  const labels = ['OOP', 'DS', 'GK', 'Other'];

export const data = {
  labels,
  datasets: [
    {
      label: 'Test View',
      //data: labels.map(() => faker.datatype.number({ min: 0, max: 25 })),
      data:[13,25,18,21],
      backgroundColor: 'rgba(0, 51, 153, 0.692)',
    }
  ],
};



export default function GraphicalAptTest() {
    return (
        <div style={{width:"50%",marginLeft:'25%'}}>
            <br/><br/>
            <Bar options={options} data={data} />
        </div>
    );
}