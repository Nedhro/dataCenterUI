import React, { FunctionComponent } from 'react';
import Chart from 'react-apexcharts'
type CardProps = {
    diagnosis: any,
}
const PieChart: FunctionComponent<CardProps> = ({ diagnosis }) => {
    return (
        <div>
            <Chart
                type="pie"
                // width={350}
                height={520}
                series={Object.values(diagnosis)}
                options={{
                    labels: Object.getOwnPropertyNames(diagnosis),
                    legend: {
                        position: 'bottom',
                        height: 150,
                    },

                    stroke: {
                        width: 1,
                    },
                    theme: {
                        palette: 'palette4'
                    },
                    fill: {
                    },


                }
                }


            ></Chart>
        </div >
    );
};

export default PieChart;