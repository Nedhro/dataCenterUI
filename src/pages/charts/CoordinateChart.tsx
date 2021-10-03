import React from "react";
import PlotlyChart from "react-plotlyjs-ts";

export interface ChartProps {
  data: any;
  chartType: any;
  filterType: any;
  dateWiseFilter: any;
}

class CoordinateChart extends React.Component<ChartProps, any> {
  public handleClick = (evt: any) => alert("click");
  public handleHover = (evt: any) => alert("hover");
  chartData: any;
  chartType: any;
  filltype: any;
  name1: any;
  name2: any;
  data1: any;
  data2: any;
  filterType: any;
  areaMode: any;
  filterWithDateAndFacility: any;
  data: any;
  xAxisValue: any;
  getData() {
    setTimeout(() => {
      console.log('Our data is fetched');
      this.setState({
        chartData: [],
        chartType: [],
        filltype: '',
        name1: '',
        name2: '',
        data1: [],
        data2: [],
        filterType: '',
        areaMode: '',
        filterWithDateAndFacility: [],
        data: [],
        xAxisValue: [],
      })
    }, 1000)
  }
  constructor(props: any) {
    super(props);
    this.state = {
      chartData: [],
      chartType: undefined,
      filterType: [],
      filterWithDateAndFacility: [],
    };
  }

  componentWillReceiveProps(_nextProps: ChartProps) {
    // console.log(_nextProps?.data);
    this.chartType = _nextProps.chartType?.value;
    this.filterType = _nextProps.filterType?.value;
    this.filterWithDateAndFacility = _nextProps.dateWiseFilter;

    if (this.chartType === 'scatter') {
      this.filltype = 'tozeroy'
      this.areaMode = 'none'
    } else {
      this.filltype = ''
      this.areaMode = ''
    }

    if (this.filterType === 'opd-emergency') {
      this.name1 = 'OPD';
      this.name2 = 'Emergency'
    }
    if (this.filterType === 'male-female') {
      this.name1 = 'Male';
      this.name2 = 'Female'
    }
    if (this.filterType === 'paid-free') {
      this.name1 = 'Paid';
      this.name2 = 'Free'
    }

    this.chartData = _nextProps?.data;
    this.setState({
      chartData: _nextProps?.data,
      chartType: _nextProps.chartType?.value,
      filterType: _nextProps.filterType?.value,
      filterWithDateAndFacility: _nextProps.dateWiseFilter,
    })


  }

  componentDidMount() {
    // console.log(this.props)
    this.setState({
      chartType: this.props.chartType?.value,
      filterType: this.props.filterType?.value,
      filterWithDateAndFacility: this.props.dateWiseFilter,
      chartData: this.props.data
    })
    if (this.state.chartType === 'scatter') {
      this.filltype = 'tozeroy'
      this.areaMode = 'none'
    } else {
      this.filltype = ''
      this.areaMode = ''
    }

    if (this.state.filterType === 'opd-emergency') {
      this.setState({
        name1: 'OPD',
        name2: 'Emergency'
      })

    }
    if (this.state.filterType === 'male-female') {
      this.setState({
        name1: 'Male',
        name2: 'Female'
      })

    }
    if (this.state.filterType === 'paid-free') {
      this.setState({
        name1: 'Paid',
        name2: 'Free'
      })

    }

  };

  public render() {
    let facilityList: any = [];
    let totalPatient: any = [];
    let opdData: any = [];
    let emergencyData: any = [];
    let data1: any = [];
    let data2: any = [];
    let xAxisValue: any = [];
    this.state.chartData?.map((res, key) => {
      // console.log(res);
      facilityList.push(res.facilityId);
      if (this.state.filterType === 'opd-emergency') {
        data1?.push(res.numberOfOpdPatient);
        data2?.push(res.numberOfEmergencyPatient);
        this.data1 = data1;
        this.data2 = data2;
      }
      if (this.state.filterType === 'male-female') {
        data1?.push(res.numberOfMalePatient);
        data2?.push(res.numberOfFemalePatient);
        this.data1 = data1;
        this.data2 = data2;
      }
      if (this.state.filterType === 'paid-free') {
        data1?.push(res.numberOfPaidPatient);
        data2?.push(res.numberOfFreePatient);
        this.data1 = data1;
        this.data2 = data2;
      }
      if (this.state.filterWithDateAndFacility === true) {
        xAxisValue.push(res.sentTime);
        this.xAxisValue = xAxisValue;
      }
      opdData.push(res.numberOfOpdPatient);
      emergencyData.push(res.numberOfEmergencyPatient);
      totalPatient.push(res.totalPatient);
      return res;
    });
    if (this.state.filterWithDateAndFacility === false) {
      let trace0 = {
        x: facilityList,
        y: totalPatient,
        type: 'scatter',
        mode: 'lines+markers',
        name: "Total Patient",
        marker: {
          //  color: "rgb(49,130,189)",
        }
      };

      let trace1 = {
        x: facilityList,
        y: this.data1 || opdData,
        type: this.chartType || 'bar',
        fill: this.filltype || '',
        fillcolor: '#d4a56c',
        name: this.name1 || 'OPD',
        mode: this.areaMode || '',
        marker: {
          gradient: 'horizontal'
        },
      };

      let trace2 = {
        x: facilityList,
        y: this.data2 || emergencyData,
        type: this.chartType || 'bar',
        fill: this.filltype || '',
        name: this.name2 || 'Emergency',
        mode: this.areaMode || '',
        marker: {
          gradient: 'vertical'
        },
      };
      this.data = [trace0, trace1, trace2];
    }

    if (this.filterWithDateAndFacility === true) {
      let trace0 = {
        x: this.xAxisValue,
        y: totalPatient,
        type: 'scatter',
        mode: 'lines+markers',
        name: "Total Patient",
        marker: {
          //  color: "rgb(49,130,189)",
        }
      };

      let trace1 = {
        x: this.xAxisValue,
        y: this.data1 || opdData,
        type: this.chartType || 'bar',
        fill: this.filltype || '',
        fillcolor: '#d4a56c',
        name: this.name1 || 'OPD',
        mode: this.areaMode || '',
        marker: {
          gradient: 'horizontal'
        },
      };

      let trace2 = {
        x: this.xAxisValue,
        y: this.data2 || emergencyData,
        type: this.chartType || 'bar',
        fill: this.filltype || '',
        name: this.name2 || 'Emergency',
        mode: this.areaMode || '',
        marker: {
          gradient: 'vertical'
        },
      };
      this.data = [trace0, trace1, trace2];
    }
    let config = { responsive: true }
    let layout = {
      // title: 'Analytical View',
      autosize: false,
      width: 1350,
      height: 630,
      margin: {
        l: 50,
        r: 50,
        b: 300,
        t: 100,
        pad: 2,
      },
      //   paper_bgcolor: "#7f7f7f",
      //   plot_bgcolor: "#c7c7c7",
      xaxis: {
        // title: "Facility Name",
        tickangle: 65,
        color: "#0a89bf"
      },
      yaxis: {
        title: "No of Patients"
      },
      barmode: "stack",
      //   bargap: 0.15,
      //   bargroupgap: 0.1,
    };
    // console.log(this.filterType)
    return <PlotlyChart
      data={this.data}
      layout={layout}
      config={config}
    />;
  }
}

export default CoordinateChart;
