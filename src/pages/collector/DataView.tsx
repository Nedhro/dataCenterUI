import React from "react";
import CollectorService from "../../service/CollectorService";
import "../../static/scss/Custom.scss";
import "../../static/scss/Table.scss";
import ReactFlexyTable from "react-flexy-table";
import "react-flexy-table/dist/index.css";
import CoordinateChart from "../charts/CoordinateChart";
import Select from "react-select";
import AsyncSelect from "react-select/async";
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
      opdEmergency: {
        label: "OPD-Emergency",
        value: "opd-emergency"
      },
      maleFemale: {
        label: "Male-Female",
        value: "male-female"
      },
      paidFree: {
        label: "Paid-Free",
        value: "paid-free"
      },
      divisionList: [{ value: 'Dhaka', label: 'Dhaka' },
      { value: 'Rajshahi', label: 'Rajshahi' },
      { value: 'Rangpur', label: 'Rangpur' },
      { value: 'Sylhet', label: 'Sylhet' },
      { value: 'Khulna', label: 'Khulna' },
      { value: 'Chittagong', label: 'Chittagong' },
      { value: 'Barishal', label: 'Barishal' },],
      districtList: '',
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
  //for district
  fetchDistrict = (inputValue: any, callback: any) => {
    setTimeout(() => {
      CollectorService.getAllDistrictList(inputValue)
        .then((data: any) => {
          const tempArray: any = [];
          if (data.data.content) {
            if (data.data.content.length) {
              data.data.content.forEach((element: any) => {
                tempArray.push({
                  label: `${element}`,
                  value: element,
                });

              });
            } else {
              tempArray.push({
                label: `${data.data.content}`,
                value: data.data.content,
              });
            }
          }
          callback(tempArray);
        })
        .catch((error) => {
          console.log(error, "catch the hoop");
        });
    }, 1000);
  };


  //for facility
  fetchFacility = (inputValue: any, callback: any) => {
    setTimeout(() => {
      CollectorService.getAllFacilityList(inputValue)
        .then((data: any) => {
          const tempArray: any = [];
          if (data.data.content) {
            if (data.data.content.length) {
              data.data.content.forEach((element: any) => {
                tempArray.push({
                  label: `${element}`,
                  value: element,
                });
              });
            } else {
              tempArray.push({
                label: `${data.data.content}`,
                value: data.data.content,
              });
            }
          }
          callback(tempArray);
        })
        .catch((error) => {
          console.log(error, "catch the hoop");
        });
    }, 1000);
  };
  render() {
    const {
      error,
      isLoaded,
      items,
      dateOfToday,
      showing,
      selectedChart,
      // selectedFilter,
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
    // const filterOptions = [
    //   { value: "opd-emergency", label: "OPD-Emergency" },
    //   { value: "male-female", label: "Male-Female" },
    //   { value: "paid-free", label: "Paid-Free" },
    // ];
    const handleChartTypeChange = (selectedChart) => {
      this.setState({ selectedChart }, () =>
        console.log(`Chart Option selected:`, this.state.selectedChart)
      );
    };
    // const handleFilterTypeChange = (selectedFilter) => {
    //   this.setState({ selectedFilter }, () =>
    //     console.log(`Filter Option selected:`, this.state.selectedFilter)
    //   );
    // };
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
          <div style={{ backgroundColor: '#066B86', height: '50px', marginLeft: '3px', marginTop: '-15px', }} >
            <h4
              className="mb-0 mt-0 pb-0 pt-0 text-white"
              style={{ textAlign: "center", marginTop: 0, marginBottom: 0, fontWeight: 'bold', fontSize: '30px' }}
            >
              SHR DASHBOARD
            </h4>
          </div>


          <div className="mt-4">
            <div className="row d-flex justify-content-center">
              <div style={{ padding: '0px 2px', margin: '0px 15px' }} className="col-md-2">
                <div style={{
                  border: '1px solid lightGray', borderRadius: '20px', height: '100px', boxShadow: '5px 5px 20px gray', width: '250px',
                  padding: '15px'
                }} className="d-flex justify-content-center row">
                  <div className="col-4">
                    <img src="https://img.icons8.com/external-justicon-flat-justicon/74/000000/external-medical-history-hospital-and-medical-justicon-flat-justicon.png" alt="total-patient" />

                  </div>
                  <div className="col-7">
                    <h2 className="font-weight-bold text-info">40</h2>
                    <small className="font-weight-bold">Total Patient</small>

                  </div>
                </div>
              </div>
              <div style={{ padding: '0px 2px', margin: '0px 15px' }} className="col-md-2">
                <div style={{
                  border: '1px solid lightGray', borderRadius: '20px', height: '100px', boxShadow: '5px 5px 20px gray', width: '250px',
                  padding: '15px'
                }} className="d-flex justify-content-center row">
                  <div className="col-4">
                    <img alt="total-opd" src="https://img.icons8.com/external-flatart-icons-lineal-color-flatarticons/74/000000/external-medical-doctor-health-and-medical-flatart-icons-lineal-color-flatarticons.png" />

                  </div>
                  <div className="col-7">
                    <h2 className="font-weight-bold text-info">20</h2>
                    <small className="font-weight-bold">Total OPD Patient</small>
                  </div>
                </div>
              </div>
              <div style={{ padding: '0px 2px', margin: '0px 15px' }} className="col-md-2">
                <div style={{
                  border: '1px solid lightGray', borderRadius: '20px', height: '100px', boxShadow: '5px 5px 20px gray', width: '250px',
                  padding: '15px'
                }} className="d-flex justify-content-center row">
                  <div className="col-4">
                    <img alt="total-emergency" src="https://img.icons8.com/external-konkapp-outline-color-konkapp/74/000000/external-medical-bed-medical-konkapp-outline-color-konkapp.png" />

                  </div>
                  <div className="col-8">
                    <h2 className="font-weight-bold text-info">10</h2>
                    <small className="font-weight-bold">Total Emergency Patient</small>
                  </div>
                </div>
              </div>
              <div style={{ padding: '0px 2px', margin: '0px 15px' }} className="col-md-2">
                <div style={{
                  border: '1px solid lightGray', borderRadius: '20px', height: '100px', boxShadow: '5px 5px 20px gray', width: '250px',
                  padding: '15px'
                }} className="d-flex justify-content-center row">
                  <div className="col-4">
                    <img alt="total-male" src="https://img.icons8.com/office/74/000000/protection-mask.png" />

                  </div>
                  <div className="col-7">
                    <h2 className="font-weight-bold text-info">5</h2>
                    <small className="font-weight-bold">Total Male Patient</small>
                  </div>
                </div>
              </div>
              <div style={{ padding: '0px 2px', margin: '0px 15px' }} className="col-md-2">
                <div style={{
                  border: '1px solid lightGray', borderRadius: '20px', height: '100px', boxShadow: '5px 5px 20px gray', width: '250px',
                  padding: '15px'
                }} className="d-flex justify-content-center row ">
                  <div className="col-4">
                    <img alt="total-female" src="https://img.icons8.com/external-flatart-icons-flat-flatarticons/74/000000/external-medical-mask-coronavirus-flatart-icons-flat-flatarticons.png" />

                  </div>
                  <div className="col-7">
                    <h2 className="font-weight-bold text-info">12</h2>
                    <small className="font-weight-bold">Total Female Patient</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="d-flex justify-content-start">
              <div
                className=" pl-0 pr-0 pt-0"
                id="dataView"
                style={{ display: showing ? "none" : "block" }}
              >
                <form className="form-inline m-0 p-0 " onSubmit={this.mySubmitHandler}>
                  <div className="form-group col-12 ml-1 pl-0 filter d-flex">


                    <div className="d-flex">
                      <label className="label ml-2 mr-1 p-1  text-info font-weight-bold">
                        Facility Name
                      </label>
                      <div style={{ width: '180px' }} >
                        <AsyncSelect
                          name='facilityName'
                          defaultValue={this.state.facilityList}
                          loadOptions={this.fetchFacility}
                          placeholder="Facility Name"
                          // onChange={(e: any) => {
                          //   this.onSearchFacility(e);
                          // }}
                          defaultOptions={false}
                        />
                      </div>
                      {/* <input
                          className="text p-1 text-info"
                          onChange={this.changeHandler}
                          placeholder="Facility Name"
                          type="text"
                          name="facilityId"
                          id="facilityId"
                        /> */}
                    </div>
                    <div className="d-flex">
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
                    </div>
                    <div className="d-flex">
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
                    </div>

                    <button
                      type="submit"
                      className="btn btn-info font-weight-bold mb-1 mt-1"
                    >
                      Filter
                    </button>

                  </div>
                </form>
              </div>
              <div className="mt-2 pt-2">
                <button
                  className="btn btn-success font-weight-bold ml-2 mb-1 mt-1"
                  onClick={() => this.setState({ showing: !showing })}
                >
                  {showing ? "Data View" : "Analytical View"}
                </button>
              </div>
            </div>
            <div
              className="col-12 pl-0 pr-0 pt-0"
              id="dataView"
              style={{ display: showing ? "none" : "block" }}
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
              style={{ display: showing ? "block" : "none" }}
            >
              <div className="row">

                <div className="col-2 p-0 ml-2">
                  {/* <Select
                    value={selectedFilter || filterOptions[0]}
                    onChange={handleFilterTypeChange}
                    options={filterOptions}
                    placeholder="Select Filter Type"
                  /> */}
                </div>
              </div>
              <div style={{
                border: '1px solid lightGray', borderRadius: '20px',
                padding: '15px', boxShadow: '5px 5px 20px gray'
              }}>
                <div >
                  <div className=" p-0 ml-2">
                    <form className="form-inline m-0 p-0 " onSubmit={this.mySubmitHandler}>
                      <div className="form-group col-12 ml-1 pl-0 filter d-flex">
                        <div style={{ width: '250px' }}>
                          <Select
                            value={selectedChart || chartOptions[0]}
                            onChange={handleChartTypeChange}
                            options={chartOptions}
                            placeholder="Select Chart Type"
                          />
                        </div>
                        <div className="d-flex">
                          <label className="label ml-2 mr-1 p-1 text-info font-weight-bold">
                            Division
                          </label>
                          <div style={{ width: '180px' }} >

                            < Select

                              name="division"
                              options={this.state.divisionList}
                              // onChange={this.onSearchDivision}
                              defaultInputValue={this.state.divisionName}
                              isSearchable={true}
                            />
                          </div>
                        </div>
                        <div className="d-flex">
                          <label className="label ml-2 mr-1 p-1  text-info font-weight-bold">
                            District
                          </label>
                          <div style={{ width: '180px' }} >
                            <AsyncSelect
                              name='districtName'
                              defaultValue={this.state.districtList}
                              loadOptions={this.fetchDistrict}
                              placeholder="District Name"
                              // onChange={(e: any) => {
                              //   this.onSearchDistrict(e);
                              // }}
                              defaultOptions={false}
                            />

                          </div>
                        </div>
                        <div className="d-flex">
                          <label className="label ml-2 mr-1 p-1  text-info font-weight-bold">
                            Facility Name
                          </label>
                          <div style={{ width: '180px' }} >
                            <AsyncSelect
                              name='facilityName'
                              defaultValue={this.state.facilityList}
                              loadOptions={this.fetchFacility}
                              placeholder="Facility Name"
                              // onChange={(e: any) => {
                              //   this.onSearchFacility(e);
                              // }}
                              defaultOptions={false}
                            />
                          </div>
                          {/* <input
                          className="text p-1 text-info"
                          onChange={this.changeHandler}
                          placeholder="Facility Name"
                          type="text"
                          name="facilityId"
                          id="facilityId"
                        /> */}
                        </div>
                        <div className="d-flex">
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
                        </div>
                        <div className="d-flex">
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
                        </div>

                        <button
                          type="submit"
                          className="btn btn-info font-weight-bold mb-1 mt-1"
                        >
                          Filter
                        </button>

                      </div>
                    </form>
                  </div>
                </div>
                <div className="d-flex justify-content-center">
                  <CoordinateChart
                    data={this.dataToExport}
                    chartType={selectedChart}
                    filterType={this.state.opdEmergency}
                    dateWiseFilter={filterWithFacilityId}
                  />
                </div>
              </div>
              <div style={{
                border: '1px solid lightGray', borderRadius: '20px',
                padding: '15px', boxShadow: '5px 5px 20px gray', marginTop: '20px'
              }}>
                <div >
                  <div className=" p-0 ml-2">
                    <form className="form-inline m-0 p-0 " onSubmit={this.mySubmitHandler}>
                      <div className="form-group col-12 ml-1 pl-0 filter d-flex">
                        <div style={{ width: '250px' }}>
                          <Select
                            value={selectedChart || chartOptions[0]}
                            onChange={handleChartTypeChange}
                            options={chartOptions}
                            placeholder="Select Chart Type"
                          />
                        </div>
                        <div className="d-flex">
                          <label className="label ml-2 mr-1 p-1 text-info font-weight-bold">
                            Division
                          </label>
                          <div style={{ width: '180px' }} >

                            < Select

                              name="division"
                              options={this.state.divisionList}
                              // onChange={this.onSearchDivision}
                              defaultInputValue={this.state.divisionName}
                              isSearchable={true}
                            />
                          </div>
                        </div>
                        <div className="d-flex">
                          <label className="label ml-2 mr-1 p-1  text-info font-weight-bold">
                            District
                          </label>
                          <div style={{ width: '180px' }} >
                            <AsyncSelect
                              name='districtName'
                              defaultValue={this.state.districtList}
                              loadOptions={this.fetchDistrict}
                              placeholder="District Name"
                              // onChange={(e: any) => {
                              //   this.onSearchDistrict(e);
                              // }}
                              defaultOptions={false}
                            />

                          </div>
                        </div>
                        <div className="d-flex">
                          <label className="label ml-2 mr-1 p-1  text-info font-weight-bold">
                            Facility Name
                          </label>
                          <div style={{ width: '180px' }} >
                            <AsyncSelect
                              name='facilityName'
                              defaultValue={this.state.facilityList}
                              loadOptions={this.fetchFacility}
                              placeholder="Facility Name"
                              // onChange={(e: any) => {
                              //   this.onSearchFacility(e);
                              // }}
                              defaultOptions={false}
                            />
                          </div>
                          {/* <input
                          className="text p-1 text-info"
                          onChange={this.changeHandler}
                          placeholder="Facility Name"
                          type="text"
                          name="facilityId"
                          id="facilityId"
                        /> */}
                        </div>
                        <div className="d-flex">
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
                        </div>
                        <div className="d-flex">
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
                        </div>

                        <button
                          type="submit"
                          className="btn btn-info font-weight-bold mb-1 mt-1"
                        >
                          Filter
                        </button>

                      </div>
                    </form>
                  </div>
                </div>
                <div className="d-flex justify-content-center">
                  <CoordinateChart
                    data={this.dataToExport}
                    chartType={selectedChart}
                    filterType={this.state.maleFemale}
                    dateWiseFilter={filterWithFacilityId}
                  />
                </div>
              </div>
              <div style={{
                border: '1px solid lightGray', borderRadius: '20px',
                padding: '15px', boxShadow: '5px 5px 20px gray', marginTop: '20px'
              }}>
                <div >
                  <div className=" p-0 ml-2">
                    <form className="form-inline m-0 p-0 " onSubmit={this.mySubmitHandler}>
                      <div className="form-group col-12 ml-1 pl-0 filter d-flex">
                        <div style={{ width: '250px' }}>
                          <Select
                            value={selectedChart || chartOptions[0]}
                            onChange={handleChartTypeChange}
                            options={chartOptions}
                            placeholder="Select Chart Type"
                          />
                        </div>
                        <div className="d-flex">
                          <label className="label ml-2 mr-1 p-1 text-info font-weight-bold">
                            Division
                          </label>
                          <div style={{ width: '180px' }} >

                            < Select

                              name="division"
                              options={this.state.divisionList}
                              // onChange={this.onSearchDivision}
                              defaultInputValue={this.state.divisionName}
                              isSearchable={true}
                            />
                          </div>
                        </div>
                        <div className="d-flex">
                          <label className="label ml-2 mr-1 p-1  text-info font-weight-bold">
                            District
                          </label>
                          <div style={{ width: '180px' }} >
                            <AsyncSelect
                              name='districtName'
                              defaultValue={this.state.districtList}
                              loadOptions={this.fetchDistrict}
                              placeholder="District Name"
                              // onChange={(e: any) => {
                              //   this.onSearchDistrict(e);
                              // }}
                              defaultOptions={false}
                            />

                          </div>
                        </div>
                        <div className="d-flex">
                          <label className="label ml-2 mr-1 p-1  text-info font-weight-bold">
                            Facility Name
                          </label>
                          <div style={{ width: '180px' }} >
                            <AsyncSelect
                              name='facilityName'
                              defaultValue={this.state.facilityList}
                              loadOptions={this.fetchFacility}
                              placeholder="Facility Name"
                              // onChange={(e: any) => {
                              //   this.onSearchFacility(e);
                              // }}
                              defaultOptions={false}
                            />
                          </div>
                          {/* <input
                          className="text p-1 text-info"
                          onChange={this.changeHandler}
                          placeholder="Facility Name"
                          type="text"
                          name="facilityId"
                          id="facilityId"
                        /> */}
                        </div>
                        <div className="d-flex">
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
                        </div>
                        <div className="d-flex">
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
                        </div>

                        <button
                          type="submit"
                          className="btn btn-info font-weight-bold mb-1 mt-1"
                        >
                          Filter
                        </button>

                      </div>
                    </form>
                  </div>
                </div>
                <div className="d-flex justify-content-center">
                  <CoordinateChart
                    data={this.dataToExport}
                    chartType={selectedChart}
                    filterType={this.state.paidFree}
                    dateWiseFilter={filterWithFacilityId}
                  />
                </div>
              </div>
              <div>

              </div>

              <div>

              </div>
            </div>
          </div>
        </div >
      );
    }
  }
}
export default DataView;
