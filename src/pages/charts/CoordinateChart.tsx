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

  componentWillReceiveProps(_nextProps: ChartProps) {
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
  }
  public render() {
    let facilityList: any = [];
    let totalPatient: any = [];
    let opdData: any = [];
    let emergencyData: any = [];
    let data1: any = [];
    let data2: any = [];
    let xAxisValue: any = [];
    this.chartData?.map((res, key) => {
      facilityList.push(res.facilityInfo.facilityShortname);
      if (this.filterType === 'opd-emergency') {
        data1?.push(res.numberOfOpdPatient);
        data2?.push(res.numberOfEmergencyPatient);
        this.data1 = data1;
        this.data2 = data2;
      }
      if (this.filterType === 'male-female') {
        data1?.push(res.numberOfMalePatient);
        data2?.push(res.numberOfFemalePatient);
        this.data1 = data1;
        this.data2 = data2;
      }
      if (this.filterType === 'paid-free') {
        data1?.push(res.numberOfPaidPatient);
        data2?.push(res.numberOfFreePatient);
        this.data1 = data1;
        this.data2 = data2;
      }
      if (this.filterWithDateAndFacility === true) {
        xAxisValue.push(res.sentTime);
        this.xAxisValue = xAxisValue;
      }
      opdData.push(res.numberOfOpdPatient);
      emergencyData.push(res.numberOfEmergencyPatient);
      totalPatient.push(res.totalPatient);
      return res;
    });
    if (this.filterWithDateAndFacility === false) {
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
      autoSize: true,
      width: 1350,
      height: 550,
      margin: {
        l: 50,
        r: 50,
        b: 180,
        t: 50,
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

    return <PlotlyChart
      data={this.data}
      layout={layout}
      config={config}
    />;
  }
}

export default CoordinateChart;
