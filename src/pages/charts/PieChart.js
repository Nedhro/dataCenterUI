import React, { Component } from 'react';
import { Pie } from 'react-chartjs-2';

class PieChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            labels: "",
            data: "",

        };
    }
    componentWillReceiveProps(props) {
        const label = Object.getOwnPropertyNames(props.diagnosis);
        const data = Object.values(props.diagnosis);
        this.setState({
            labels: label,
            data: data
        })
    }

    componentDidMount() {

    }

    render() {
        this.data = {
            labels: this.state.labels,
            datasets: [
                {
                    label: '# Diagnosis',
                    data: this.state.data,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
                        'rgba(18, 159, 64, 0.2)',
                        'rgba(134, 19, 64, 0.2)',
                        'rgba(10, 100, 64, 0.2)',
                        'rgba(105, 59, 104, 0.2)',

                        'rgba(158, 78, 64, 0.2)',
                        'rgba(54, 12, 235, 0.2)',
                        'rgba(54, 120, 205, 0.2)',
                        'rgba(200, 120, 205, 0.2)',
                        'rgba(255, 255, 102, 0.2)',
                        'rgba(200, 20, 102, 0.2)',
                        'rgba(100, 20, 102, 0.2)',
                        'rgba(18, 209, 204, 0.2)',
                        'rgba(180, 209, 204, 0.2)',
                        'rgba(255, 15, 64, 0.2)',

                        'rgba(158, 159, 204, 0.2)',
                        'rgba(158, 15, 204, 0.2)',
                        'rgba(189, 159, 64, 0.2)',
                        'rgba(158, 15, 64, 0.2)',
                        'rgba(18, 109, 104, 0.2)',
                        'rgba(18, 255, 255, 0.2)',
                        'rgba(58, 159, 255, 0.2)',
                        'rgba(255, 159, 255, 0.2)',
                        'rgba(158, 109, 64, 0.2)',
                        'rgba(15, 159, 104, 0.2)',
                        'rgba(158, 159, 64, 0.2)',
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                        'rgba(18, 159, 64, 1)',
                        'rgba(134, 19, 64, 1)',
                        'rgba(10, 100, 64, 1)',
                        'rgba(105, 59, 104, 1)',

                        'rgba(158, 78, 64, 1)',
                        'rgba(54, 12, 235, 1)',
                        'rgba(54, 120, 205, 1)',
                        'rgba(200, 120, 205, 1)',
                        'rgba(255, 255, 102, 1)',
                        'rgba(200, 20, 102, 1)',
                        'rgba(100, 20, 102, 1)',
                        'rgba(18, 209, 204, 1)',
                        'rgba(180, 209, 204, 1)',
                        'rgba(255, 15, 64, 1)',

                        'rgba(158, 159, 204, 1)',
                        'rgba(158, 15, 204, 1)',
                        'rgba(189, 159, 64, 1)',
                        'rgba(158, 15, 64, 1)',
                        'rgba(18, 109, 104, 1)',
                        'rgba(18, 255, 255, 1)',
                        'rgba(58, 159, 255, 1)',
                        'rgba(255, 159, 255, 1)',
                        'rgba(158, 109, 64, 1)',
                        'rgba(15, 159, 104, 1)',
                        'rgba(158, 159, 64, 1)',

                    ],
                    borderWidth: 1,
                },
            ],
        };
        return (
            <div style={{ width: '650px' }}>
                <Pie data={this.data} />
            </div>
        );
    }
}

export default PieChart;