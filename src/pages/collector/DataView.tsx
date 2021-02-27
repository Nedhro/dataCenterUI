import React from "react";
import CollectorService from "../../service/CollectorService";
import "../../static/scss/Custom.scss";
import "../../static/scss/Table.scss";
import ReactFlexyTable from "react-flexy-table";
import "react-flexy-table/dist/index.css";
import CoordinateChart from "../charts/CoordinateChart";
import Select from "react-select";

class DataView extends React.Component<any, any> {
  dataConfig: any = {};
  timerID: any;
  dataToExport: any;
  changeHandler = (event: any) => {
    let nam = event.target.name;
    let facilityId = null;
    let startDate = "";
    let endDate = "";
    if (nam === "facilityId") {
      facilityId = event.target.value;
      this.dataConfig.facilityId = facilityId;
    }
    if (nam === "startDate") {
      startDate = event.target.value;
      console.log(startDate);
      this.dataConfig.startDate = this.formateDate(startDate);
    }
    if (nam === "endDate") {
      endDate = event.target.value;
      this.dataConfig.endDate = this.formateDate(endDate);
    }
    console.log(this.dataConfig);
  };

  formateNowDate = (data: any) => {
    let formattedNowDate = "";
    let date = ("0" + data.getDate()).slice(-2);
    let month = ("0" + (data.getMonth() + 1)).slice(-2);
    let year = data.getFullYear();
    formattedNowDate = month + "-" + date + "-" + year;
    return formattedNowDate;
  };
  formateDefaultDate = (data: any) => {
    //2021-02-17
    let formattedNowDate = "";
    let date = ("0" + data.getDate()).slice(-2);
    let month = ("0" + (data.getMonth() + 1)).slice(-2);
    let year = data.getFullYear();
    formattedNowDate = year + "-" + month + "-" + date;
    return formattedNowDate;
  };

  formateDate = (data: any) => {
    let formattedDate = "";
    let dateArray = data.split("-");
    formattedDate = dateArray[1] + "-" + dateArray[2] + "-" + dateArray[0];
    return formattedDate;
  };

  mySubmitHandler = (event: any) => {
    event.preventDefault();
    console.log(event.target.value);
    let facilityId = this.dataConfig.facilityId;
    let startDate = this.dataConfig.startDate;
    let endDate = this.dataConfig.endDate;

    let date_ob = new Date();
    let dateNow = this.formateNowDate(date_ob);

    if (facilityId === null || facilityId === "") {
      this.dataConfig = {
        facilityId: null,
        startDate: startDate || dateNow,
        endDate: endDate || dateNow,
      };
      this.getRegData(this.dataConfig);
      this.getSumData(this.dataConfig);
    }
    if (facilityId !== null && startDate !== "" && endDate !== "") {
      this.dataConfig = {
        facilityId: facilityId,
        startDate: startDate,
        endDate: endDate,
      };
      this.getRegData(this.dataConfig);
      this.getSumData(this.dataConfig);
    }

    if (facilityId !== null && startDate === "" && endDate === "") {
      this.dataConfig = {
        facilityId: facilityId,
        startDate: dateNow,
        endDate: dateNow,
      };
      this.getRegData(this.dataConfig);
      this.getSumData(this.dataConfig);
    }
  };

  constructor(props: any) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
      dateOfToday: "",
      totalresult: {},
      showing: true,
      selectedChart: null,
      selectedFilter: null,
      filterWithFacilityId: false,
    };
    this.changeHandler = this.changeHandler.bind(this);
    this.mySubmitHandler = this.mySubmitHandler.bind(this);
  }

  componentDidMount() {
    let date_ob = new Date();
    let dateNow = this.formateNowDate(date_ob);
    this.dataConfig = {
      facilityId: null,
      startDate: dateNow,
      endDate: dateNow,
    };
    this.getRegData(this.dataConfig);
    this.timerID = setInterval(
      () => this.getRegData(this.dataConfig),
      5 * 60 * 1000
    );
    this.getSumData(this.dataConfig);
  }
  componentWillUnmount() {
    clearInterval(this.timerID);
  }
  getRegData(data: any) {
    console.log(JSON.stringify(data));
    CollectorService.getAllRegistrationCollectionData(data).then(
      (res): any => {
        const resultObj = {
          opdTotal: 0,
          emergencyTotal: 0,
          paidSum: 0,
          freeSum: 0,
          collectionTotal: 0,
        };
        const resultData = res.data.content;
        if (data.facilityId !== null) {
          this.dataToExport = res.data.content;
          this.setState({
            filterWithFacilityId: true,
          });
        }
        let opdSum = 0;
        let emergencySum = 0;
        let freeSum = 0;
        let paidSum = 0;
        let collectionSum = 0;
        for (let i = 0; i < resultData?.length; i++) {
          const opdData = resultData[i].numberOfOpdPatient;
          opdSum += opdData;
          const emergencyData = resultData[i].numberOfEmergencyPatient;
          emergencySum += emergencyData;
          const freePatient = resultData[i].numberOfFreePatient;
          freeSum += freePatient;
          const paidPatient = resultData[i].numberOfPaidPatient;
          paidSum += paidPatient;
          const totalColData = resultData[i].totalCollection;
          collectionSum += totalColData;
        }
        resultObj.opdTotal = opdSum;
        resultObj.emergencyTotal = emergencySum;
        resultObj.paidSum = paidSum;
        resultObj.freeSum = freeSum;
        resultObj.collectionTotal = collectionSum;

        const datafinal = resultData?.map((data: any) => {
          let config = {
            "Facility Name (Id)": data.facilityId || "N/A",
            "Total Patient": data.totalPatient || 0,
            OPD: data.numberOfOpdPatient || 0,
            Emergency: data.numberOfEmergencyPatient || 0,
            Male: data.numberOfMalePatient || 0,
            Female: data.numberOfFemalePatient || 0,
            Paid: data.numberOfPaidPatient || 0,
            Free: data.numberOfFreePatient || 0,
            "Total Collection (BDT)": data.totalCollection.toFixed(2) || 0,
            Date: data.sentTime || "N/A",
          };
          return config;
        });
        var date = new Date();
        this.setState({
          isLoaded: true,
          items: datafinal,
          dateOfToday: this.formateDefaultDate(date),
          totalresult: resultObj,
        });
      },
      (error) => {
        this.setState({
          isLoaded: true,
          error,
        });
      }
    );
  }

  getSumData(data: any) {
    CollectorService.getAllDataByfIdAndDatewithsum(data).then(
      (response): any => {
        if (data.facilityId === null) {
          this.dataToExport = response.data.content;
          this.setState({
            filterWithFacilityId: false,
          });
        }
      }
    );
  }

  render() {
    const {
      error,
      isLoaded,
      items,
      dateOfToday,
      showing,
      selectedChart,
      selectedFilter,
      filterWithFacilityId,
    } = this.state;
    const tableTitle = "SHR_Dashboard_" + dateOfToday.toString();
    const downloadExcelProps = {
      type: "filtered",
      title: tableTitle,
      showLabel: true,
    };

    // Analytical View
    const chartOptions = [
      { value: "bar", label: "Bar Chart" },
      { value: "line", label: "Line Chart" },
      { value: "scatter", label: "Area Chart" },
    ];
    const filterOptions = [
      { value: "opd-emergency", label: "OPD-Emergency" },
      { value: "male-female", label: "Male-Female" },
      { value: "paid-free", label: "Paid-Free" },
    ];
    const handleChartTypeChange = (selectedChart) => {
      this.setState({ selectedChart }, () =>
        console.log(`Chart Option selected:`, this.state.selectedChart)
      );
    };
    const handleFilterTypeChange = (selectedFilter) => {
      this.setState({ selectedFilter }, () =>
        console.log(`Filter Option selected:`, this.state.selectedFilter)
      );
    };
    //end analytical view

    if (error) {
      return (
        <div className="text-center font-weight-bold">
          Error: {error.message}
        </div>
      );
    } else if (!isLoaded) {
      return <div className="text-center font-weight-bold">Loading...</div>;
    } else {
      return (
        <div className="container-fluid">
          <h4
            className="mb-0 mt-0 pb-0 pt-0"
            style={{ textAlign: "center", marginTop: 0, marginBottom: 0 }}
          >
            SHR DASHBOARD
          </h4>
          <form className="form-inline m-0 p-0" onSubmit={this.mySubmitHandler}>
            <div className="form-group col-12 ml-1 pl-0 filter">
              <input
                className="text p-1 text-info"
                onChange={this.changeHandler}
                placeholder="Facility Name"
                type="text"
                name="facilityId"
                id="facilityId"
              />
              <label className="label ml-2 p-1 mr-1 text-info font-weight-bold">
                Start Date
              </label>
              <input
                className="text m-1 p-1"
                onChange={this.changeHandler}
                pattern="MM-dd-yyyy"
                type="date"
                name="startDate"
                id="startDate"
                defaultValue={dateOfToday}
              />
              <label className="label ml-2 mr-1 p-1 text-info font-weight-bold">
                End Date
              </label>
              <input
                className="text m-1 p-1"
                onChange={this.changeHandler}
                pattern="MM-dd-yyyy"
                type="date"
                name="endDate"
                id="endDate"
                defaultValue={dateOfToday}
              />
              <button
                type="submit"
                className="btn btn-info font-weight-bold mb-1 mt-1"
              >
                Filter
              </button>
              <button
                className="btn btn-success font-weight-bold ml-2 mb-1 mt-1"
                onClick={() => this.setState({ showing: !showing })}
              >
                {showing ? "Analytical View" : "Data View"}
              </button>
            </div>
          </form>
          <div>
            <div
              className="col-12 pl-0 pr-0 pt-0"
              id="dataView"
              style={{ display: showing ? "block" : "none" }}
            >
              <ReactFlexyTable
                className="table table-stripped table-hover table-sm tableReg"
                data={items}
                sortable
                globalSearch
                showExcelButton
                pageText={"Pages #"}
                rowsText={"Rows : "}
                pageSize={10}
                pageSizeOptions={[10, 20, 50]}
                downloadExcelProps={downloadExcelProps}
                filteredDataText={"Filtered Data : "}
                totalDataText={"Total Data :"}
                downloadExcelText={"Download"}
              />
            </div>
            <div
              className="col-12 pl-0 pr-0 pt-0"
              id="analyticView"
              style={{ display: showing ? "none" : "block" }}
            >
              <div className="row">
                <div className="col-2 p-0 ml-2">
                  <Select
                    value={selectedChart || chartOptions[0]}
                    onChange={handleChartTypeChange}
                    options={chartOptions}
                    placeholder="Select Chart Type"
                  />
                </div>
                <div className="col-2 p-0 ml-2">
                  <Select
                    value={selectedFilter || filterOptions[0]}
                    onChange={handleFilterTypeChange}
                    options={filterOptions}
                    placeholder="Select Filter Type"
                  />
                </div>
              </div>
              <CoordinateChart
                data={this.dataToExport}
                chartType={selectedChart}
                filterType={selectedFilter}
                dateWiseFilter={filterWithFacilityId}
              />
            </div>
          </div>
        </div>
      );
    }
  }
}
export default DataView;
