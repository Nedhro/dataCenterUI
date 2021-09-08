import React from 'react';
import Chart from 'react-apexcharts'
const DoughnutChart = ({ diagnosis }) => {

    return (
        <div>
            <Chart
                type="donut"
                width={600}
                height={620}
                series={Object.values(diagnosis)}
                options={{
                    labels: Object.getOwnPropertyNames(diagnosis),
                    dataLabels: {
                        dropShadow: {
                            blur: 3,
                            opacity: 0.8
                        }
                    },
                    // dropShadow: {
                    //     enabled: true,
                    //     color: '#111',
                    //     top: -1,
                    //     left: 3,
                    //     blur: 3,
                    //     opacity: 1
                    // },
                    legend: {
                        position: 'bottom',
                        height: 150,
                    },
                    // plotOptions: {
                    //     pie: {
                    //         donut: {
                    //             labels: {
                    //                 show: true,
                    //                 total: {
                    //                     showAlways: true,
                    //                     show: true,
                    //                 }
                    //             }
                    //         }
                    //     }
                    // },
                    stroke: {
                        width: 1,
                    },
                    theme: {
                        palette: 'palette1'
                    },
                    fill: {
                        type: 'gradient',
                        // type: 'pattern',
                        // opacity: 1,
                        // pattern: {
                        //     enabled: false,
                        //     style: ['verticalLines', 'squares', 'horizontalLines', 'circles', 'slantedLines', 'verticalLines', 'squares', 'horizontalLines', 'circles', 'slantedLines', 'verticalLines', 'squares', 'horizontalLines', 'circles', 'slantedLines'],
                        // },
                    },


                }
                }


            ></Chart>
        </div >
    );
};

export default DoughnutChart;