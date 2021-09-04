import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2'



class BarChart extends Component {

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
    // componentDidMount() {
    //     const diagnosis = {
    //         'covid 19': 30,
    //         'malaria': 40,
    //         'dengue': 10,
    //         'typhoid': 10,
    //         'fever': 45,
    //         'ulsar': 22,
    //         'aids': 12,
    //     };
    //     const label = Object.getOwnPropertyNames(diagnosis);
    //     const data = Object.values(diagnosis);
    //     this.setState({
    //         labels: label,
    //         data: data
    //     })
    //     console.log(label, data)
    // }
    render() {
        this.data = {
            labels: this.state.labels,
            datasets: [
                {
                    label: '# Diseases',
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
            <div>
                <div style={{ width: '1200px' }}>

                    <Bar data={this.data} />
                </div>
            </div>
        );
    }
};

export default BarChart;