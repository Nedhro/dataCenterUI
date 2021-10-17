import React from "react";
import CollectorService from "../../service/CollectorService";
import "../../static/scss/Custom.scss";
import "../../static/scss/Table.scss";
import ReactFlexyTable from "react-flexy-table";
import "react-flexy-table/dist/index.css";
import CoordinateChart from "../charts/CoordinateChart";
import Select from "react-select";
import totalPatient from "../../icons/totalPatient.png";
import opdPatient from "../../icons/opdPatient.png";
import emergencyPatient from "../../icons/emergencyPatient.png";
import malePatient from "../../icons/malePatient.png";
import femalePatient from "../../icons/femalePatient.png";
class DataView extends React.Component<any, any> {
  /*
   * EO: Emergency-OPD
   * MF: Male-Female
   * FP: Free-Paid
   * */
  dataConfig: any = {};
  dataConfigEO: any = {};
  dataConfigMF: any = {};
  dataConfigFP: any = {};
  timerID: any;
  dataToExportEO: any;
  dataToExportMF: any;
  dataToExportFP: any;
  constructor(props: any) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
      dateOfToday: "",
      showing: true,
      selectedChart: null,
      selectedFilter: null,
      filterWithFacilityId: false,
      filterWithFacilityIdEO: false,
      filterWithFacilityIdMF: false,
      filterWithFacilityIdFP: false,
      selectedChartEO: null,
      selectedChartMF: null,
      selectedChartFP: null,
      divisionListData: [],
      districtListData: [],
      facilityListData: [],
      divisionListChart: [],
      districtListChart: [],
      facilityListChart: [],
      allList: [],
      EOList: [],
      MFList: [],
      FPList: [],
      dataList: [],
      selectedDivisionChart: "",
      selectedDistrictChart: "",
      selectedFacilityChart: "",
      selectedDivisionData: "",
      selectedDistrictData: "",
      selectedFacilityData: "",
      divisionData: null,
      districtData: null,
      divisionChart: null,
      districtChart: null,
      card: {},
      opdEmergency: {
        label: "OPD-Emergency",
        value: "opd-emergency",
      },
      maleFemale: {
        label: "Male-Female",
        value: "male-female",
      },
      paidFree: {
        label: "Paid-Free",
        value: "paid-free",
      },
    };
    this.changeHandler = this.changeHandler.bind(this);
  }
  componentDidMount() {
    let date_ob = new Date();
    let dateNow = this.formateNowDate(date_ob);
    this.dataConfig = {
      division: null,
      district: null,
      facilityId: null,
      startDate: dateNow,
      endDate: dateNow,
    };
    this.getRegData(this.dataConfig);
    this.dataConfigEO = {
      division: null,
      district: null,
      facilityId: null,
      startDate: dateNow,
      endDate: dateNow,
    };
    this.getRegDataEO(this.dataConfigEO);
    this.getSumDataEO(this.dataConfigEO);

    this.dataConfigMF = {
      division: null,
      district: null,
      facilityId: null,
      startDate: dateNow,
      endDate: dateNow,
    };
    this.getRegDataMF(this.dataConfigMF);
    this.getSumDataMF(this.dataConfigMF);
    this.dataConfigFP = {
      division: null,
      district: null,
      facilityId: null,
      startDate: dateNow,
      endDate: dateNow,
    };
    this.getRegDataFP(this.dataConfigFP);
    this.getSumDataFP(this.dataConfigFP);
    this.timerID = setInterval(() => {
      this.getRegData(this.dataConfig);
      CollectorService.getAllCard().then((response): any => {
        if (response) {
          this.setState({
            card: response.data.content,
          });
        }
      });
    }, 5 * 60 * 1000);
    CollectorService.getAllCard().then((response): any => {
      if (response) {
        this.setState({
          card: response.data.content,
        });
      }
    });
    CollectorService.getAllRegistrationCollectionData(this.dataConfig).then(
      (res): any => {
        const resultData = res.data.content;
        const all = resultData.map((item) => item.facilityInfo);
        const tempDistrict = resultData.map(
          (item) => item.facilityInfo.facilityDistrict
        );
        const district = tempDistrict.filter(
          (item, index) => tempDistrict.indexOf(item) === index
        );
        const tempDivision = resultData.map(
          (item) => item.facilityInfo.facilityDivision
        );
        const division = tempDivision.filter(
          (item, index) => tempDivision.indexOf(item) === index
        );
        const tempFacility = resultData.map(
          (item) => item.facilityInfo.facilityName
        );
        const facility = tempFacility.filter(
          (item, index) => tempFacility.indexOf(item) === index
        );
        const tempArrayDis: any = [];
        if (district.length) {
          district.forEach((element: any) => {
            tempArrayDis.push({
              label: `${element}`,
              value: element,
            });
          });
          this.setState({
            districtListData: tempArrayDis,
            districtListChart: tempArrayDis,
          });
        }
        const tempArrayFacility: any = [];
        if (facility.length) {
          facility.forEach((element: any) => {
            tempArrayFacility.push({
              label: `${element}`,
              value: element,
            });
          });

          this.setState({
            facilityListData: tempArrayFacility,
            facilityListChart: tempArrayFacility,
          });
        }
        const tempArrayDiv: any = [];
        if (division.length) {
          division.forEach((element: any) => {
            tempArrayDiv.push({
              label: `${element}`,
              value: element,
            });
          });
          this.setState({
            divisionListData: tempArrayDiv,
            divisionListChart: tempArrayDiv,
          });
        }
        this.setState({
          allList: all,
          chartList: res.data.content,
        });
      }
    );
  }
  componentWillUnmount() {
    clearInterval(this.timerID);
  }
  tableData = (resultData: any) => resultData?.map((data: any) => {
    let config = {
      "Facility Name (Id)": data.facilityInfo.facilityName || "N/A",
      "Total Patient": data.totalPatient || 0,
      "OPD": data.numberOfOpdPatient || 0,
      "Emergency": data.numberOfEmergencyPatient || 0,
      "Male": data.numberOfMalePatient || 0,
      "Female": data.numberOfFemalePatient || 0,
      "Paid": data.numberOfPaidPatient || 0,
      "Free": data.numberOfFreePatient || 0,
      "Total Collection (BDT)": data.totalCollection.toFixed(2) || 0,
      "Date": data.sentTime || "N/A",
    };
    return config;
  });
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

  //Emergency opd
  changeHandlerEO = (event: any) => {
    let name = event.target.name;
    let startDateEO = "";
    let endDateEO = "";
    if (name === "startDate") {
      startDateEO = event.target.value;
      this.dataConfigEO.startDate = this.formateDate(startDateEO);
    }
    if (name === "endDate") {
      endDateEO = event.target.value;
      this.dataConfigEO.endDate = this.formateDate(endDateEO);
    }
    let facilityId = this.dataConfigEO.facilityId;
    let startDate = this.dataConfigEO.startDate;
    let endDate = this.dataConfigEO.endDate;

    if (facilityId !== null) {
      this.dataConfigEO = {
        division: this.state.divisionChart,
        district: this.state.districtChart,
        facilityId: facilityId,
        startDate: startDate,
        endDate: endDate,
      };
      this.getRegDataEO(this.dataConfigEO);
    }
    if (facilityId === null) {
      this.dataConfigEO = {
        division: null,
        district: null,
        facilityId: null,
        startDate: startDate,
        endDate: endDate,
      };
      this.getSumDataEO(this.dataConfigEO);
    }
    CollectorService.getAllDataByfIdAndDatewithsum({
      division: null,
      district: null,
      facilityId: null,
      startDate: startDate,
      endDate: endDate,
    }).then(
      (response): any => {
        this.setState({
          EOList: response.data.content,
        });
      }
    );
  };
  //male female
  changeHandlerMF = (event: any) => {
    let name = event.target.name;
    let startDateMF = "";
    let endDateMF = "";

    if (name === "startDate") {
      startDateMF = event.target.value;

      this.dataConfigMF.startDate = this.formateDate(startDateMF);
    }
    if (name === "endDate") {
      endDateMF = event.target.value;
      this.dataConfigMF.endDate = this.formateDate(endDateMF);
    }
    let facilityId = this.dataConfigMF.facilityId;
    let startDate = this.dataConfigMF.startDate;
    let endDate = this.dataConfigMF.endDate;
    if (facilityId !== null) {
      this.dataConfigMF = {
        division: this.state.divisionChart,
        district: this.state.districtChart,
        facilityId: facilityId,
        startDate: startDate,
        endDate: endDate,
      };
      this.getRegDataMF(this.dataConfigMF);
    }
    if (facilityId === null) {
      this.dataConfigMF = {
        division: null,
        district: null,
        facilityId: null,
        startDate: startDate,
        endDate: endDate,
      };
      this.getSumDataMF(this.dataConfigMF);
    }
    CollectorService.getAllDataByfIdAndDatewithsum({
      division: null,
      district: null,
      facilityId: null,
      startDate: startDate,
      endDate: endDate,
    }).then(
      (response): any => {
        this.setState({
          MFList: response.data.content,
        });
      }
    );
  };
  //free paid
  changeHandlerFP = (event: any) => {
    let name = event.target.name;
    let startDateFP = "";
    let endDateFP = "";
    if (name === "startDate") {
      startDateFP = event.target.value;
      this.dataConfigFP.startDate = this.formateDate(startDateFP);
    }
    if (name === "endDate") {
      endDateFP = event.target.value;
      this.dataConfigFP.endDate = this.formateDate(endDateFP);
    }
    let facilityId = this.dataConfigFP.facilityId;
    let startDate = this.dataConfigFP.startDate;
    let endDate = this.dataConfigFP.endDate;
    if (facilityId !== null) {
      this.dataConfigFP = {
        division: this.state.divisionChart,
        district: this.state.districtChart,
        facilityId: facilityId,
        startDate: startDate,
        endDate: endDate,
      };
      this.getRegDataFP(this.dataConfigFP);
    }
    if (facilityId === null) {
      this.dataConfigFP = {
        division: null,
        district: null,
        facilityId: null,
        startDate: startDate,
        endDate: endDate,
      };
      this.getSumDataFP(this.dataConfigFP);
    }
    CollectorService.getAllDataByfIdAndDatewithsum({
      division: null,
      district: null,
      facilityId: null,
      startDate: startDate,
      endDate: endDate,
    }).then(
      (response): any => {
        this.setState({
          FPList: response.data.content,
        });
      }
    );
  };
  //data view
  changeHandler = (event: any) => {
    let name = event.target.name;
    let startDateInput = "";
    let endDateInput = "";
    if (name === "startDate") {
      startDateInput = event.target.value;
      this.dataConfig.startDate = this.formateDate(startDateInput);
    }
    if (name === "endDate") {
      endDateInput = event.target.value;
      this.dataConfig.endDate = this.formateDate(endDateInput);
    }
    let startDate = this.dataConfig.startDate;
    let endDate = this.dataConfig.endDate;
    this.dataConfig = {
      division: null,
      district: null,
      facilityId: null,
      startDate: startDate,
      endDate: endDate,
    };
    this.getRegData(this.dataConfig);
  };
  //data view
  getRegData(data: any) {
    CollectorService.getAllRegistrationCollectionData(data).then(
      (res): any => {
        if (this.state.selectedDivisionData.value === undefined) {
          const resultData = res.data.content;
          const dataFinal = this.tableData(resultData);
          this.setState({
            isLoaded: true,
            items: dataFinal,
          });
        }
        else if (this.state.selectedDivisionData.value !== undefined) {
          let allRecord = res.data.content;
          const resultData = allRecord.filter(item => item.facilityInfo.facilityDivision === this.state.selectedDivisionData.value)
          const dataFinal = this.tableData(resultData);
          this.setState({
            isLoaded: true,
            items: dataFinal,
          });
        }
        else if (this.state.selectedDistrictData.value !== undefined && this.state.selectedDistrictData.value !== undefined) {
          let allRecord = res.data.content;
          const resultData = allRecord.filter(item => item.facilityInfo.facilityDistrict === this.state.selectedDistrictData.value)
          const dataFinal = this.tableData(resultData);
          this.setState({
            isLoaded: true,
            items: dataFinal,
          });
        }
        if (this.state.selectedFacilityData.value !== undefined) {
          let allRecord = res.data.content;
          const resultData = allRecord.filter(item => item.facilityInfo.facilityName === this.state.selectedFacilityData.value)
          const dataFinal = this.tableData(resultData);
          this.setState({
            isLoaded: true,
            items: dataFinal,
          });
        }

        this.setState({
          isLoaded: true,
          dateOfToday: this.formateDefaultDate(new Date()),
          dataList: res.data.content,
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
  //emergency-opd
  getRegDataEO(data: any) {
    CollectorService.getAllRegistrationCollectionData(data).then(
      (res): any => {
        if (data.facilityId !== null) {
          console.log(res.data.content)
          this.dataToExportEO = res.data.content;
          this.setState({
            filterWithFacilityIdEO: true,
          });
        }
      },
      (error) => {
        this.setState({
          isLoaded: true,
          error,
        });
      }
    );
  }
  getSumDataEO(data: any) {
    CollectorService.getAllDataByfIdAndDatewithsum(data).then(
      (response): any => {
        if (data.facilityId === null) {
          if (this.state.selectedDivisionChart.value === undefined) {
            this.dataToExportEO = response.data.content;
          }
          else if (this.state.selectedDivisionChart.value !== undefined) {
            let allEORecord = response.data.content;
            const EOData = allEORecord.filter(item => item.facilityInfo.facilityDivision === this.state.selectedDivisionChart.value)
            this.dataToExportEO = EOData;
          }
          else if (this.state.selectedDistrictChart.value !== undefined) {
            let allEORecord = response.data.content;
            const EOData = allEORecord.filter(item => item.facilityInfo.facilityDistrict === this.state.selectedDistrictChart.value)
            this.dataToExportEO = EOData;
          }
          this.setState({
            filterWithFacilityIdEO: false,
            EOList: response.data.content,
          });
        }
      }
    );
  }
  //male female
  getRegDataMF(data: any) {
    CollectorService.getAllRegistrationCollectionData(data).then(
      (res): any => {
        if (data.facilityId !== null) {
          this.dataToExportMF = res.data.content;
          this.setState({
            filterWithFacilityIdMF: true,
          });
        }
      },
      (error) => {
        this.setState({
          isLoaded: true,
          error,
        });
      }
    );
  }
  getSumDataMF(data: any) {
    CollectorService.getAllDataByfIdAndDatewithsum(data).then(
      (response): any => {
        if (data.facilityId === null) {
          if (this.state.selectedDivisionChart.value === undefined) {
            this.dataToExportMF = response.data.content;
          }
          else if (this.state.selectedDivisionChart.value !== undefined) {
            let allMFRecord = response.data.content;
            const MFData = allMFRecord.filter(item => item.facilityInfo.facilityDivision === this.state.selectedDivisionChart.value)
            this.dataToExportMF = MFData;
          }
          else if (this.state.selectedDistrictChart.value !== undefined) {
            let allMFRecord = response.data.content;
            const MFData = allMFRecord.filter(item => item.facilityInfo.facilityDistrict === this.state.selectedDistrictChart.value)
            this.dataToExportMF = MFData;
          }
          this.setState({
            filterWithFacilityIdMF: false,
            MFList: response.data.content,
          });
        }
      }
    );
  }
  //free paid
  getRegDataFP(data: any) {
    CollectorService.getAllRegistrationCollectionData(data).then(
      (res): any => {
        if (data.facilityId !== null) {
          this.dataToExportFP = res.data.content;
          this.setState({
            filterWithFacilityIdFP: true,
          });
        }
      },
      (error) => {
        this.setState({
          isLoaded: true,
          error,
        });
      }
    );
  }
  getSumDataFP(data: any) {
    CollectorService.getAllDataByfIdAndDatewithsum(data).then(
      (response): any => {
        if (data.facilityId === null) {
          if (this.state.selectedDivisionChart.value === undefined) {
            this.dataToExportFP = response.data.content;
          }
          else if (this.state.selectedDivisionChart.value !== undefined) {
            let allFPRecord = response.data.content;
            const FPData = allFPRecord.filter(item => item.facilityInfo.facilityDivision === this.state.selectedDivisionChart.value)
            this.dataToExportFP = FPData;
          }
          else if (this.state.selectedDistrictChart.value !== undefined) {
            let allFPRecord = response.data.content;
            const FPData = allFPRecord.filter(item => item.facilityInfo.facilityDistrict === this.state.selectedDistrictChart.value)
            this.dataToExportFP = FPData;
          }
          this.setState({
            filterWithFacilityIdFP: false,
            FPList: response.data.content,
          });
        }
      }
    );
  }


  //for data view
  //facility
  onSearchFacilityData = (selectedOption: any) => {
    if (selectedOption !== null) {
      this.setState({
        selectedFacilityData: {
          label: selectedOption.value,
          value: selectedOption.value,
        },
      });
      const all = this.state.allList;
      let allList = all.filter(
        (item) => item?.facilityName === selectedOption.value
      );
      const tempDiv = allList.map((item) => item.facilityDivision);
      const division = tempDiv.filter(
        (item, index) => tempDiv.indexOf(item) === index
      );
      const tempDis = allList.map((item) => item.facilityDistrict);
      const district = tempDis.filter(
        (item, index) => tempDis.indexOf(item) === index
      );
      const facilityDistrict = all.filter(
        (item) => item?.facilityDistrict === district[0]
      );
      const tempFacility = facilityDistrict.map((item) => item.facilityName);
      const facility = tempFacility.filter(
        (item, index) => tempFacility.indexOf(item) === index
      );
      const tempDistrictList = all.filter(
        (item) => item?.facilityDivision === division[0]
      );
      const tempDistrict = tempDistrictList.map(
        (item) => item.facilityDistrict
      );
      const districtList = tempDistrict.filter(
        (item, index) => tempDistrict.indexOf(item) === index
      );
      const tempArrayDis: any = [];
      if (districtList.length) {
        districtList.forEach((element: any) => {
          tempArrayDis.push({
            label: `${element}`,
            value: element,
          });
        });
        this.setState({
          districtListData: tempArrayDis,
        });
      }
      const tempArrayFacility: any = [];
      if (facility.length) {
        facility.forEach((element: any) => {
          tempArrayFacility.push({
            label: `${element}`,
            value: element,
          });
        });
        this.setState({
          facilityListData: tempArrayFacility,
        });
      }
      if (division[0]) {
        this.setState({
          selectedDivisionData: {
            label: division[0],
            value: division[0],
          },
        });
      }
      if (district[0]) {
        this.setState({
          selectedDistrictData: {
            label: district[0],
            value: district[0],
          },
        });
      }
      let allDataRecord = this.state.dataList;
      const resultData = allDataRecord.filter(
        (item) => item.facilityId === selectedOption.value
      );
      const dataFinal = this.tableData(resultData);
      this.setState({
        isLoaded: true,
        items: dataFinal,
      });
    } else if (selectedOption === null) {
      this.setState({
        selectedDistrictData: "",
        selectedDivisionData: "",
        selectedFacilityData: "",
      });
      const all = this.state.allList;
      const tempFacility = all.map((item) => item.facilityName);
      const facility = tempFacility.filter(
        (item, index) => tempFacility.indexOf(item) === index
      );
      const tempDistrict = all.map((item) => item.facilityDistrict);
      const district = tempDistrict.filter(
        (item, index) => tempDistrict.indexOf(item) === index
      );
      const tempArrayDis: any = [];
      if (district.length) {
        district.forEach((element: any) => {
          tempArrayDis.push({
            label: `${element}`,
            value: element,
          });
        });
        this.setState({
          districtListData: tempArrayDis,
          divisionData: null,
          districtData: null,
        });
      }
      const tempArrayFacility: any = [];
      if (facility.length) {
        facility.forEach((element: any) => {
          tempArrayFacility.push({
            label: `${element}`,
            value: element,
          });
        });
        this.setState({
          facilityListData: tempArrayFacility,
        });
      }
      const resultData = this.state.dataList;
      const dataFinal = this.tableData(resultData);
      this.setState({
        isLoaded: true,
        items: dataFinal,
      });
    }
  };
  //division
  onSearchDivisionData = (selectedOption: any) => {
    if (selectedOption !== null) {
      this.setState({
        selectedOption,
        divisionData: selectedOption.value,
        selectedDivisionData: {
          label: selectedOption.value,
          value: selectedOption.value,
        },
        selectedDistrictData: "",
        selectedFacilityData: "",
      });
      const all = this.state.allList;
      let tempAll = all.filter(
        (item) => item.facilityDivision === selectedOption.value
      );
      const tempDistrict = tempAll.map((item) => item.facilityDistrict);
      const district = tempDistrict.filter(
        (item, index) => tempDistrict.indexOf(item) === index
      );
      const tempFacility = tempAll.map((item) => item.facilityName);
      const facility = tempFacility.filter(
        (item, index) => tempFacility.indexOf(item) === index
      );
      const tempArrayDis: any = [];
      if (district.length) {
        district.forEach((element: any) => {
          tempArrayDis.push({
            label: `${element}`,
            value: element,
          });
        });
        this.setState({
          districtListData: tempArrayDis,
        });
      }
      const tempArrayFacility: any = [];
      if (facility.length) {
        facility.forEach((element: any) => {
          tempArrayFacility.push({
            label: `${element}`,
            value: element,
          });
        });
        this.setState({
          facilityListData: tempArrayFacility,
        });
      }
      let allDataRecord = this.state.dataList;
      const resultData = allDataRecord.filter(
        (item) => item.facilityInfo.facilityDivision === selectedOption.value
      );
      const dataFinal = this.tableData(resultData);
      this.setState({
        isLoaded: true,
        items: dataFinal,
      });
    } else if (selectedOption === null) {
      this.setState({
        selectedOption,
        selectedDivisionData: "",
        selectedDistrictData: "",
        divisionData: null,
        districtData: null,
        selectedFacilityData: "",
      });
      const all = this.state.allList;
      const tempDistrict = all.map((item) => item.facilityDistrict);
      const district = tempDistrict.filter(
        (item, index) => tempDistrict.indexOf(item) === index
      );
      const tempFacility = all.map((item) => item.facilityName);
      const facility = tempFacility.filter(
        (item, index) => tempFacility.indexOf(item) === index
      );
      const tempArrayDis: any = [];
      if (district.length) {
        district.forEach((element: any) => {
          tempArrayDis.push({
            label: `${element}`,
            value: element,
          });
        });
        this.setState({
          districtListData: tempArrayDis,
        });
      }
      const tempArrayFacility: any = [];
      if (facility.length) {
        facility.forEach((element: any) => {
          tempArrayFacility.push({
            label: `${element}`,
            value: element,
          });
        });
        this.setState({
          facilityListData: tempArrayFacility,
        });
      }

      const resultData = this.state.dataList;
      const dataFinal = this.tableData(resultData);
      this.setState({
        isLoaded: true,
        items: dataFinal,
      });
    }
  };
  //district
  onSearchDistrictData = (selectedOption: any) => {
    if (selectedOption !== null) {
      this.setState({
        selectedOption,
        districtData: selectedOption.value,
        selectedDistrictData: {
          label: selectedOption.value,
          value: selectedOption.value,
        },
        selectedFacilityData: "",
      });
      const all = this.state.allList;
      let allList = all.filter(
        (item) => item?.facilityDistrict === selectedOption.value
      );
      const facilityDivision = allList.map((item) => item.facilityDivision);
      const division = facilityDivision.filter(
        (item, index) => facilityDivision.indexOf(item) === index
      );
      const tempFacility = allList.map((item) => item.facilityName);
      const facility = tempFacility.filter(
        (item, index) => tempFacility.indexOf(item) === index
      );
      const tempDivision = all.filter(
        (item) => item?.facilityDivision === division[0]
      );
      const tempDistrict = tempDivision.map((item) => item.facilityDistrict);
      const district = tempDistrict.filter(
        (item, index) => tempDistrict.indexOf(item) === index
      );
      const tempArrayFacility: any = [];
      if (facility.length) {
        facility.forEach((element: any) => {
          tempArrayFacility.push({
            label: `${element}`,
            value: element,
          });
        });
        this.setState({
          facilityListData: tempArrayFacility,
        });
      }
      const tempArrayDis: any = [];
      if (district.length) {
        district.forEach((element: any) => {
          tempArrayDis.push({
            label: `${element}`,
            value: element,
          });
        });
        this.setState({
          districtListData: tempArrayDis,
        });
      }
      if (division[0]) {
        this.setState({
          selectedDivisionData: {
            label: division[0],
            value: division[0],
          },
        });
      }
      let allDataRecord = this.state.dataList;
      const resultData = allDataRecord.filter(
        (item) => item.facilityInfo.facilityDistrict === selectedOption.value
      );
      const dataFinal = this.tableData(resultData);
      this.setState({
        isLoaded: true,
        items: dataFinal,
      });
    } else if (selectedOption === null) {
      this.setState({
        selectedOption,
        selectedDistrictData: "",
        divisionData: null,
        districtData: null,
        selectedDivisionData: "",
        selectedFacilityData: "",
      });
      const all = this.state.allList;
      const tempFacility = all.map((item) => item.facilityName);
      const facility = tempFacility.filter(
        (item, index) => tempFacility.indexOf(item) === index
      );
      const tempDistrict = all.map((item) => item.facilityDistrict);
      const district = tempDistrict.filter(
        (item, index) => tempDistrict.indexOf(item) === index
      );
      const tempArrayDis: any = [];
      if (district.length) {
        district.forEach((element: any) => {
          tempArrayDis.push({
            label: `${element}`,
            value: element,
          });
        });
        this.setState({
          districtListData: tempArrayDis,
        });
      }
      const tempArrayFacility: any = [];
      if (facility.length) {
        facility.forEach((element: any) => {
          tempArrayFacility.push({
            label: `${element}`,
            value: element,
          });
        });
        this.setState({
          facilityListData: tempArrayFacility,
        });
      }
      const resultData = this.state.dataList;
      const dataFinal = this.tableData(resultData);
      this.setState({
        isLoaded: true,
        items: dataFinal,
      });
    }
  };
  //for chart
  //facility
  onSearchFacilityChart = (selectedOption: any) => {
    if (selectedOption !== null) {
      this.setState({
        selectedFacilityChart: {
          label: selectedOption.value,
          value: selectedOption.value,
        },
      });
      const all = this.state.allList;
      let allList = all.filter(
        (item) => item?.facilityName === selectedOption.value
      );
      const tempDivision = allList.map((item) => item.facilityDivision);
      const division = tempDivision.filter(
        (item, index) => tempDivision.indexOf(item) === index
      );
      const facilityDistrict = allList.map((item) => item.facilityDistrict);
      const district = facilityDistrict.filter(
        (item, index) => facilityDistrict.indexOf(item) === index
      );
      const tempArr = all.filter(
        (item) => item?.facilityDistrict === district[0]
      );
      const tempFacility = tempArr.map((item) => item.facilityName);
      const facility = tempFacility.filter(
        (item, index) => tempFacility.indexOf(item) === index
      );
      const tempDistrictList = all.filter(
        (item) => item?.facilityDivision === division[0]
      );
      const tempDistrict = tempDistrictList.map(
        (item) => item.facilityDistrict
      );
      const districtList = tempDistrict.filter(
        (item, index) => tempDistrict.indexOf(item) === index
      );
      const tempArrayDis: any = [];
      if (districtList.length) {
        districtList.forEach((element: any) => {
          tempArrayDis.push({
            label: `${element}`,
            value: element,
          });
        });
        this.setState({
          districtListChart: tempArrayDis,
        });
      }
      const tempArrayFacility: any = [];
      if (facility.length) {
        facility.forEach((element: any) => {
          tempArrayFacility.push({
            label: `${element}`,
            value: element,
          });
        });
        this.setState({
          facilityListChart: tempArrayFacility,
        });
      }
      if (division[0]) {
        this.setState({
          selectedDivisionChart: {
            label: division[0],
            value: division[0],
          },
        });
      }
      if (district[0]) {
        this.setState({
          selectedDistrictChart: {
            label: district[0],
            value: district[0],
          },
        });
      }
      this.dataConfigEO.facilityId = selectedOption.value;
      this.dataConfigMF.facilityId = selectedOption.value;
      this.dataConfigFP.facilityId = selectedOption.value;
      this.dataConfigEO = {
        facilityId: selectedOption.value,
        startDate: this.dataConfigEO.startDate,
        endDate: this.dataConfigEO.endDate,
        division: this.state.divisionChart,
        district: this.state.districtChart,
      };
      this.getRegDataEO(this.dataConfigEO);
      this.dataConfigMF = {
        facilityId: selectedOption.value,
        startDate: this.dataConfigMF.startDate,
        endDate: this.dataConfigMF.endDate,
        division: this.dataConfigMF.divisionChart,
        district: this.dataConfigMF.districtChart,
      };
      this.getRegDataMF(this.dataConfigMF);
      this.dataConfigFP = {
        facilityId: selectedOption.value,
        startDate: this.dataConfigFP.startDate,
        endDate: this.dataConfigFP.endDate,
        division: this.dataConfigFP.divisionChart,
        district: this.dataConfigFP.districtChart,
      };
      this.getRegDataFP(this.dataConfigFP);
    } else if (selectedOption === null) {
      this.dataConfigEO.facilityId = selectedOption;
      this.dataConfigMF.facilityId = selectedOption;
      this.dataConfigFP.facilityId = selectedOption;
      this.setState({
        filterWithFacilityIdEO: false,
        filterWithFacilityIdMF: false,
        filterWithFacilityIdFP: false,
        selectedDistrictChart: "",
        selectedFacilityChart: "",
        selectedDivisionChart: "",
      });
      const all = this.state.allList;
      const allList = all.map((item) => item.facilityName);
      const facility = allList.filter(
        (item, index) => allList.indexOf(item) === index
      );
      const tempDistrict = all.map((item) => item.facilityDistrict);
      const district = tempDistrict.filter(
        (item, index) => tempDistrict.indexOf(item) === index
      );
      const tempArrayDis: any = [];
      if (district.length) {
        district.forEach((element: any) => {
          tempArrayDis.push({
            label: `${element}`,
            value: element,
          });
        });
        this.setState({
          districtListChart: tempArrayDis,
          divisionChart: null,
          districtChart: null,
        });
      }
      const tempArrayFacility: any = [];
      if (facility.length) {
        facility.forEach((element: any) => {
          tempArrayFacility.push({
            label: `${element}`,
            value: element,
          });
        });
        this.setState({
          facilityListChart: tempArrayFacility,
        });
      }
      let allEORecord = this.state.EOList;
      this.dataToExportEO = allEORecord;
      let allMFRecord = this.state.MFList;
      this.dataToExportMF = allMFRecord;
      let allFPRecord = this.state.FPList;
      this.dataToExportFP = allFPRecord;
    }
  };
  //division
  onSearchDivisionChart = (selectedOption: any) => {
    if (selectedOption !== null) {
      this.setState({
        selectedOption,
        divisionChart: selectedOption.value,
        selectedDivisionChart: {
          label: selectedOption.value,
          value: selectedOption.value,
        },
        selectedDistrictChart: "",
        selectedFacilityChart: "",
        filterWithFacilityIdEO: false,
        filterWithFacilityIdMF: false,
        filterWithFacilityIdFP: false,
      });
      this.dataConfigEO.facilityId = null;
      this.dataConfigMF.facilityId = null;
      this.dataConfigFP.facilityId = null;
      const all = this.state.allList;
      let allList = all.filter(
        (item) => item.facilityDivision === selectedOption.value
      );
      const tempDistrict = allList.map((item) => item.facilityDistrict);
      const district = tempDistrict.filter(
        (item, index) => tempDistrict.indexOf(item) === index
      );
      const tempFacility = allList.map((item) => item.facilityName);
      const facility = tempFacility.filter(
        (item, index) => tempFacility.indexOf(item) === index
      );
      const tempArrayDis: any = [];
      if (district.length) {
        district.forEach((element: any) => {
          tempArrayDis.push({
            label: `${element}`,
            value: element,
          });
        });

        this.setState({
          districtListChart: tempArrayDis,
        });
      }
      const tempArrayFacility: any = [];
      if (facility.length) {
        facility.forEach((element: any) => {
          tempArrayFacility.push({
            label: `${element}`,
            value: element,
          });
        });
        this.setState({
          facilityListChart: tempArrayFacility,
        });
      }
      let allEORecord = this.state.EOList;
      const EOData = allEORecord.filter(
        (item) => item.facilityInfo.facilityDivision === selectedOption.value
      );
      this.dataToExportEO = EOData;
      let allMFRecord = this.state.MFList;
      const MFData = allMFRecord.filter(
        (item) => item.facilityInfo.facilityDivision === selectedOption.value
      );
      this.dataToExportMF = MFData;
      let allFPRecord = this.state.FPList;
      const FPData = allFPRecord.filter(
        (item) => item.facilityInfo.facilityDivision === selectedOption.value
      );
      this.dataToExportFP = FPData;
    }
    else if (selectedOption === null) {
      this.setState({
        selectedOption,
        selectedDivisionChart: "",
        selectedDistrictChart: "",
        divisionChart: null,
        districtChart: null,
        selectedFacilityChart: "",
        filterWithFacilityIdEO: false,
        filterWithFacilityIdMF: false,
        filterWithFacilityIdFP: false,
      });
      this.dataConfigEO.facilityId = null;
      this.dataConfigMF.facilityId = null;
      this.dataConfigFP.facilityId = null;
      const all = this.state.allList;
      const tempFacility = all.map((item) => item.facilityName);
      const facility = tempFacility.filter(
        (item, index) => tempFacility.indexOf(item) === index
      );
      const tempDistrict = all.map((item) => item.facilityDistrict);
      const district = tempDistrict.filter(
        (item, index) => tempDistrict.indexOf(item) === index
      );
      const tempArrayDis: any = [];
      if (district.length) {
        district.forEach((element: any) => {
          tempArrayDis.push({
            label: `${element}`,
            value: element,
          });
        });

        this.setState({
          districtListChart: tempArrayDis,
        });
      }
      const tempArrayFacility: any = [];
      if (facility.length) {
        facility.forEach((element: any) => {
          tempArrayFacility.push({
            label: `${element}`,
            value: element,
          });
        });

        this.setState({
          facilityListChart: tempArrayFacility,
        });
      }
      let allEORecord = this.state.EOList;
      this.dataToExportEO = allEORecord;
      let allMFRecord = this.state.MFList;
      this.dataToExportMF = allMFRecord;
      let allFPRecord = this.state.FPList;
      this.dataToExportFP = allFPRecord;
    }
  };
  //district
  onSearchDistrictChart = (selectedOption: any) => {
    if (selectedOption !== null) {
      this.setState({
        selectedOption,
        districtChart: selectedOption.value,
        selectedDistrictChart: {
          label: selectedOption.value,
          value: selectedOption.value,
        },
        selectedFacilityChart: "",
        filterWithFacilityIdEO: false,
        filterWithFacilityIdMF: false,
        filterWithFacilityIdFP: false,
      });
      this.dataConfigEO.facilityId = null;
      this.dataConfigMF.facilityId = null;
      this.dataConfigFP.facilityId = null;
      const all = this.state.allList;
      let allList = all.filter(
        (item) => item?.facilityDistrict === selectedOption.value
      );
      const tempDivisionList = allList.map((item) => item.facilityDivision);
      const division = tempDivisionList.filter(
        (item, index) => tempDivisionList.indexOf(item) === index
      );
      const tempFacility = allList.map((item) => item.facilityName);
      const facility = tempFacility.filter(
        (item, index) => tempFacility.indexOf(item) === index
      );
      const tempDivision = all.filter(
        (item) => item?.facilityDivision === division[0]
      );
      const tempDistrict = tempDivision.map((item) => item.facilityDistrict);
      const district = tempDistrict.filter(
        (item, index) => tempDistrict.indexOf(item) === index
      );
      const tempArrayDis: any = [];
      if (district.length) {
        district.forEach((element: any) => {
          tempArrayDis.push({
            label: `${element}`,
            value: element,
          });
        });
        this.setState({
          districtListChart: tempArrayDis,
        });
      }
      const tempArrayFacility: any = [];
      if (facility.length) {
        facility.forEach((element: any) => {
          tempArrayFacility.push({
            label: `${element}`,
            value: element,
          });
        });
        this.setState({
          facilityListChart: tempArrayFacility,
        });
      }
      if (division[0]) {
        this.setState({
          selectedDivisionChart: {
            label: division[0],
            value: division[0],
          },
        });
      }
      let allEORecord = this.state.EOList;
      const EOData = allEORecord.filter(
        (item) => item.facilityInfo.facilityDistrict === selectedOption.value
      );
      this.dataToExportEO = EOData;
      let allMFRecord = this.state.MFList;
      const MFData = allMFRecord.filter(
        (item) => item.facilityInfo.facilityDistrict === selectedOption.value
      );
      this.dataToExportMF = MFData;
      let allFPRecord = this.state.FPList;
      const FPData = allFPRecord.filter(
        (item) => item.facilityInfo.facilityDistrict === selectedOption.value
      );
      this.dataToExportFP = FPData;
    } else if (selectedOption === null) {
      this.setState({
        selectedOption,
        selectedDistrictChart: "",
        divisionChart: null,
        selectedDivisionChart: "",
        selectedFacilityChart: "",
        districtChart: null,
        filterWithFacilityIdEO: false,
        filterWithFacilityIdMF: false,
        filterWithFacilityIdFP: false,
      });
      this.dataConfigEO.facilityId = null;
      this.dataConfigMF.facilityId = null;
      this.dataConfigFP.facilityId = null;
      const all = this.state.allList;
      const tempFacility = all.map((item) => item.facilityName);
      const facility = tempFacility.filter(
        (item, index) => tempFacility.indexOf(item) === index
      );
      const tempDistrict = all.map((item) => item.facilityDistrict);
      const district = tempDistrict.filter(
        (item, index) => tempDistrict.indexOf(item) === index
      );
      const tempArrayDis: any = [];
      if (district.length) {
        district.forEach((element: any) => {
          tempArrayDis.push({
            label: `${element}`,
            value: element,
          });
        });
        this.setState({
          districtListChart: tempArrayDis,
        });
      }
      const tempArrayFacility: any = [];
      if (facility.length) {
        facility.forEach((element: any) => {
          tempArrayFacility.push({
            label: `${element}`,
            value: element,
          });
        });
        this.setState({
          facilityListChart: tempArrayFacility,
        });
      }
      let allEORecord = this.state.EOList;
      this.dataToExportEO = allEORecord;
      let allMFRecord = this.state.MFList;
      this.dataToExportMF = allMFRecord;
      let allFPRecord = this.state.FPList;
      this.dataToExportFP = allFPRecord;
    }
  };

  render() {
    const {
      error,
      isLoaded,
      items,
      dateOfToday,
      showing,
      selectedChartEO,
      selectedChartMF,
      selectedChartFP,
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
    //end analytical view
    const customStyles = {
      control: (provided, state) => ({
        ...provided,
        marginTop: "2px",
        borderRadius: "0px",
        minHeight: "36px",
        height: "30px",
        boxShadow: state.isFocused ? null : null,
      }),
      valueContainer: (provided, state) => ({
        ...provided,
        height: "30px",
        padding: "0 6px",
        marginTop: "-6px",
      }),

      input: (provided, state) => ({
        ...provided,
        margin: "-20px -2px",
      }),
      indicatorSeparator: (state) => ({
        display: "none",
      }),
      indicatorsContainer: (provided, state) => ({
        ...provided,
      }),
    };
    const handleChartTypeChangeEO = (selectedChartEO) => {
      this.setState({ selectedChartEO });
    };
    const handleChartTypeChangeMF = (selectedChartMF) => {
      this.setState({ selectedChartMF });
    };
    const handleChartTypeChangeFP = (selectedChartFP) => {
      this.setState({ selectedChartFP });
    };
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
          <div
            style={{
              backgroundColor: "#066B86",
              height: "50px",
              marginLeft: "3px",
              marginTop: "-15px",
            }}
          >
            <h4
              className="mb-0 mt-0 pb-0 pt-0 text-white"
              style={{
                textAlign: "center",
                marginTop: 0,
                marginBottom: 0,
                fontWeight: "bold",
                fontSize: "30px",
              }}
            >
              {" "}
              SHR DASHBOARD
            </h4>
          </div>
          <div className="mt-1">
            <div className="text-center">
              <h5
                style={{ fontWeight: "bold", fontSize: "20px" }}
                className="text-danger"
              >
                <u>Todays Report</u>
              </h5>
            </div>
            <div className="d-flex justify-content-center">
              <div className="row ">
                <div
                  style={{ padding: "0px 2px", margin: "0px 20px" }}
                  className="col-md-2"
                >
                  <div
                    style={{
                      border: "1px solid lightGray",
                      borderRadius: "20px",
                      height: "100px",
                      boxShadow: "5px 5px 20px gray",
                      width: "240px",
                      padding: "15px",

                    }}
                    className="d-flex justify-content-center row"
                  >
                    <div className="col-4">
                      <img src={totalPatient} alt="total-patient" />
                    </div>
                    <div className="col-7">
                      <h2 className="font-weight-bold text-info">
                        {this.state.card.totalPatient || 0}
                      </h2>
                      <small className="font-weight-bold">Total Patient</small>
                    </div>
                  </div>
                </div>
                <div
                  style={{ padding: "0px 2px", margin: "0px 20px" }}
                  className="col-md-2"
                >
                  <div
                    style={{
                      border: "1px solid lightGray",
                      borderRadius: "20px",
                      height: "100px",
                      boxShadow: "5px 5px 20px gray",
                      width: "240px",
                      padding: "15px",
                    }}
                    className="d-flex justify-content-center row"
                  >
                    <div className="col-4">
                      <img alt="total-opd" src={opdPatient} />
                    </div>
                    <div className="col-7">
                      <h2 className="font-weight-bold text-info">
                        {this.state.card.totalOpdPatient || 0}
                      </h2>
                      <small className="font-weight-bold">
                        Total OPD Patient
                      </small>
                    </div>
                  </div>
                </div>
                <div
                  style={{ padding: "0px 2px", margin: "0px 20px" }}
                  className="col-md-2"
                >
                  <div
                    style={{
                      border: "1px solid lightGray",
                      borderRadius: "20px",
                      height: "100px",
                      boxShadow: "5px 5px 20px gray",
                      width: "240px",
                      padding: "15px",
                    }}
                    className="d-flex justify-content-center row"
                  >
                    <div className="col-4">
                      <img alt="total-emergency" src={emergencyPatient} />
                    </div>
                    <div className="col-8">
                      <h2 className="font-weight-bold text-info">
                        {this.state.card.totalEmergencyPatient || 0}
                      </h2>
                      <small className="font-weight-bold">
                        Total Emergency Patient
                      </small>
                    </div>
                  </div>
                </div>
                <div
                  style={{ padding: "0px 2px", margin: "0px 20px" }}
                  className="col-md-2"
                >
                  <div
                    style={{
                      border: "1px solid lightGray",
                      borderRadius: "20px",
                      height: "100px",
                      boxShadow: "5px 5px 20px gray",
                      width: "240px",
                      padding: "15px",
                    }}
                    className="d-flex justify-content-center row"
                  >
                    <div className="col-4">
                      <img alt="total-male" src={malePatient} />
                    </div>
                    <div className="col-7">
                      <h2 className="font-weight-bold text-info">
                        {this.state.card.totalMalePatient || 0}
                      </h2>
                      <small className="font-weight-bold">
                        Total Male Patient
                      </small>
                    </div>
                  </div>
                </div>
                <div
                  style={{ padding: "0px 2px", margin: "0px 20px" }}
                  className="col-md-2"
                >
                  <div
                    style={{
                      border: "1px solid lightGray",
                      borderRadius: "20px",
                      height: "100px",
                      boxShadow: "5px 5px 20px gray",
                      width: "240px",
                      padding: "15px",
                    }}
                    className="d-flex justify-content-center row "
                  >
                    <div className="col-4">
                      <img alt="total-female" src={femalePatient} />
                    </div>
                    <div className="col-7">
                      <h2 className="font-weight-bold text-info">
                        {this.state.card.totalFemalePatient || 0}
                      </h2>
                      <small className="font-weight-bold">
                        Total Female Patient
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-start ">
            <div
              className=" pl-0 pr-0 pt-1"
              id="dataView"
              style={{ display: showing ? "none" : "block", width: '1050px' }}
            >
              <form className="form-inline m-0 p-0 ">
                <div className="form-group col-12  pl-0 filter d-flex flex-wrap">
                  <div className="d-flex">
                    <label style={{ color: "#066B86" }} className="label mr-1 mt-2 p-1  font-weight-bold">
                      <b>Division</b>
                    </label>
                    <div style={{ width: "240px" }}>
                      <Select
                        styles={customStyles}
                        name="division"
                        options={this.state.divisionListData}
                        onChange={(e: any) => {
                          this.onSearchDivisionData(e);
                        }}
                        value={this.state.selectedDivisionData}
                        isSearchable={true}
                        isClearable={true}
                      />
                    </div>
                  </div>
                  <div className="d-flex">
                    <label style={{ color: "#066B86" }} className="label  mr-1 mt-2 p-1   font-weight-bold">
                      <b>District</b>
                    </label>
                    <div style={{ width: "240px" }}>
                      <Select
                        styles={customStyles}
                        name="districtName"
                        options={this.state.districtListData}
                        onChange={(e: any) => {
                          this.onSearchDistrictData(e);
                        }}
                        isSearchable={true}
                        isClearable={true}
                        value={this.state.selectedDistrictData}
                      />{" "}
                    </div>
                  </div>
                  <div className="d-flex">
                    <label style={{ color: "#066B86", width: "110px" }} className="label mr-1 p-1 mt-2 font-weight-bold">
                      <b>Facility Name</b>
                    </label>
                    <div style={{ width: "260px" }}>
                      <Select
                        styles={customStyles}
                        name="facilityId"
                        options={this.state.facilityListData}
                        onChange={(e: any) => {
                          this.onSearchFacilityData(e);
                        }}
                        isSearchable={true}
                        isClearable={true}
                        value={this.state.selectedFacilityData}
                      />{" "}
                    </div>{" "}
                  </div>
                  <div className="d-flex ">
                    <label style={{ color: "#066B86", width: "85px" }} className="label  p-1 mr-1 mt-1   font-weight-bold">
                      <b>Start Date</b>
                    </label>
                    <input
                      style={{ width: "180px" }}
                      className="text m-1 p-1"
                      onChange={this.changeHandler}
                      pattern="MM-dd-yyyy"
                      type="date"
                      name="startDate"
                      id="startDate"
                      defaultValue={dateOfToday}
                      max={dateOfToday}
                    />
                  </div>
                  <div className="d-flex">
                    <label style={{ color: "#066B86", width: "76px" }} className="label mt-1  mr-1 p-1  font-weight-bold">
                      <b>End Date</b>
                    </label>
                    <input
                      style={{ width: "180px" }}
                      className="text m-1 p-1"
                      onChange={this.changeHandler}
                      pattern="MM-dd-yyyy"
                      type="date"
                      name="endDate"
                      id="endDate"
                      defaultValue={dateOfToday}
                      max={dateOfToday}
                    />
                  </div>
                </div>
              </form>
            </div>
            <div>
              <div
                className="col-12  pt-0 "
                id="dataView"
                style={{ display: showing ? "block" : "none" }}
              >
                <div className="d-flex  ">
                  <div className="d-flex ">
                    <label style={{ color: "#066B86" }} className="label ml-2 mr-1 mt-2 p-1  font-weight-bold">
                      <b>  Division</b>
                    </label>
                    <div style={{ width: "180px" }}>
                      <Select
                        styles={customStyles}
                        name="division"
                        options={this.state.divisionListChart}
                        onChange={(e: any) => {
                          this.onSearchDivisionChart(e);
                        }}
                        value={this.state.selectedDivisionChart}
                        isSearchable={true}
                        isClearable={true}
                      />
                    </div>
                  </div>
                  <div className="d-flex">
                    <label style={{ color: "#066B86" }} className="label ml-2 mr-1 p-1 mt-2 font-weight-bold">
                      <b>    District</b>
                    </label>
                    <div style={{ width: "180px" }}>
                      <Select
                        styles={customStyles}
                        name="districtName"
                        options={this.state.districtListChart}
                        onChange={(e: any) => {
                          this.onSearchDistrictChart(e);
                        }}
                        value={this.state.selectedDistrictChart}
                        isSearchable={true}
                        isClearable={true}
                      />
                    </div>
                  </div>
                  <div className="d-flex">
                    <label style={{ color: "#066B86" }} className="label ml-2 mr-1 p-1 mt-2  font-weight-bold">
                      <b>   Facility Name</b>
                    </label>
                    <div style={{ width: "260px" }}>
                      <Select
                        styles={customStyles}
                        name="facilityId"
                        options={this.state.facilityListChart}
                        onChange={(e: any) => {
                          this.onSearchFacilityChart(e);
                        }}
                        value={this.state.selectedFacilityChart}
                        isSearchable={true}
                        isClearable={true}
                      />{" "}
                    </div>
                  </div>
                </div>{" "}
              </div>
            </div>
            <div className="mt-2 ">
              <button
                className="btn btn-success font-weight-bold ml-2 mb-1 mt-1 "
                onClick={() => this.setState({ showing: !showing })}
              >
                {showing ? "Data View" : "Analytical View"}
              </button>
            </div>
          </div>
          <div>
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
                pageSize={50}
                pageSizeOptions={[50, 100]}
                downloadExcelProps={downloadExcelProps}
                filteredDataText={"Filtered Data : "}
                totalDataText={"Total Data :"}
                downloadExcelText={"Download"}
              />
            </div>
          </div>
          <div>
            <div
              className="col-12  pt-0"
              id="dataView"
              style={{ display: showing ? "block" : "none" }}
            >
              <div
                style={{
                  borderTop: "5px solid #066B86",
                  borderBottom: "5px solid #066B86",
                  borderLeft: "2px solid #066B86",
                  borderRight: "2px solid #066B86",
                  borderRadius: "15px",
                  height: "100%",
                }}
              >
                <div className="p-3 text-dark text-center">
                  <h2>
                    <u>Emergency-OPD</u>
                  </h2>
                </div>
                <div>
                  <div className=" p-0 ml-2">
                    <form className="form-inline m-0 p-0 ">
                      <div className="form-group col-12 ml-1 pl-0 filter d-flex">
                        <div style={{ width: "250px" }}>
                          <Select
                            styles={customStyles}
                            value={selectedChartEO || chartOptions[0]}
                            onChange={handleChartTypeChangeEO}
                            options={chartOptions}
                            placeholder="Select Chart Type"
                          />
                        </div>
                        <div className="d-flex">
                          <label style={{ color: "#066B86" }} className="label ml-2 mt-1  p-1 mr-1 font-weight-bold">
                            <b>Start Date</b>
                          </label>
                          <input
                            className="text m-1 p-1"
                            onChange={this.changeHandlerEO}
                            pattern="MM-dd-yyyy"
                            type="date"
                            name="startDate"
                            id="startDate"
                            defaultValue={dateOfToday}
                            max={dateOfToday}
                          />
                        </div>
                        <div className="d-flex">
                          <label style={{ color: "#066B86" }} className="label ml-2 mt-1 mr-1 p-1 font-weight-bold">
                            <b>End Date</b>
                          </label>
                          <input
                            className="text m-1 p-1"
                            onChange={this.changeHandlerEO}
                            pattern="MM-dd-yyyy"
                            type="date"
                            name="endDate"
                            id="endDate"
                            defaultValue={dateOfToday}
                            max={dateOfToday}
                          />
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12 col-sm-12">
                    <div className="d-flex justify-content-center">
                      <CoordinateChart
                        data={this.dataToExportEO}
                        chartType={selectedChartEO}
                        filterType={this.state.opdEmergency}
                        dateWiseFilter={this.state.filterWithFacilityIdEO}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div
                style={{
                  borderTop: "5px solid #066B86",
                  borderBottom: "5px solid #066B86",
                  borderLeft: "2px solid #066B86",
                  borderRight: "2px solid #066B86",
                  borderRadius: "15px",
                  height: "100%",
                  marginTop: "20px",
                }}
              >
                <div className="p-3 text-dark text-center">
                  <h2>
                    <u>Male-Female</u>
                  </h2>
                </div>
                <div>
                  <div className=" p-0 ml-2">
                    <form className="form-inline m-0 p-0 ">
                      <div className="form-group col-12 ml-1 pl-0 filter d-flex">
                        <div style={{ width: "250px" }}>
                          <Select
                            styles={customStyles}
                            value={selectedChartMF || chartOptions[0]}
                            onChange={handleChartTypeChangeMF}
                            options={chartOptions}
                            placeholder="Select Chart Type"
                          />
                        </div>
                        <div className="d-flex">
                          <label style={{ color: "#066B86" }} className="label mt-1 ml-2 p-1 mr-1  font-weight-bold">
                            <b>Start Date</b>
                          </label>
                          <input
                            className="text m-1 p-1"
                            onChange={this.changeHandlerMF}
                            pattern="MM-dd-yyyy"
                            type="date"
                            name="startDate"
                            id="startDate"
                            defaultValue={dateOfToday}
                            max={dateOfToday}
                          />
                        </div>
                        <div className="d-flex">
                          <label style={{ color: "#066B86" }} className="label mt-1 ml-2 mr-1 p-1  font-weight-bold">
                            <b>End Date</b>
                          </label>
                          <input
                            className="text m-1 p-1"
                            onChange={this.changeHandlerMF}
                            pattern="MM-dd-yyyy"
                            type="date"
                            name="endDate"
                            id="endDate"
                            defaultValue={dateOfToday}
                            max={dateOfToday}
                          />
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="d-flex justify-content-center">
                  <CoordinateChart
                    data={this.dataToExportMF}
                    chartType={selectedChartMF}
                    filterType={this.state.maleFemale}
                    dateWiseFilter={this.state.filterWithFacilityIdMF}
                  />
                </div>
              </div>
              <div
                style={{
                  borderTop: "5px solid #066B86",
                  borderBottom: "5px solid #066B86",
                  borderLeft: "2px solid #066B86",
                  borderRight: "2px solid #066B86",
                  borderRadius: "15px",
                  height: "100%",
                  marginTop: "20px",
                  marginBottom: "20px",
                }}
              >
                <div className="p-3 text-dark text-center">
                  <h2>
                    <u>Free-Paid</u>
                  </h2>
                </div>
                <div>
                  <div className=" p-0 ml-2">
                    <form className="form-inline m-0 p-0 ">
                      <div className="form-group col-12 ml-1 pl-0 filter d-flex">
                        <div style={{ width: "250px" }}>
                          <Select
                            styles={customStyles}
                            value={selectedChartFP || chartOptions[0]}
                            onChange={handleChartTypeChangeFP}
                            options={chartOptions}
                            placeholder="Select Chart Type"
                          />
                        </div>
                        <div className="d-flex">
                          <label style={{ color: "#066B86" }} className="label mt-1 ml-2 p-1 mr-1  font-weight-bold">
                            <b>Start Date</b>
                          </label>
                          <input
                            className="text m-1 p-1"
                            onChange={this.changeHandlerFP}
                            pattern="MM-dd-yyyy"
                            type="date"
                            name="startDate"
                            id="startDate"
                            defaultValue={dateOfToday}
                            max={dateOfToday}
                          />
                        </div>
                        <div className="d-flex">
                          <label style={{ color: "#066B86" }} className="label mt-1 ml-2 mr-1 p-1  font-weight-bold">
                            <b>End Date</b>
                          </label>
                          <input
                            className="text m-1 p-1"
                            onChange={this.changeHandlerFP}
                            pattern="MM-dd-yyyy"
                            type="date"
                            name="endDate"
                            id="endDate"
                            defaultValue={dateOfToday}
                            max={dateOfToday}
                          />
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="d-flex justify-content-center">
                  <CoordinateChart
                    data={this.dataToExportFP}
                    chartType={selectedChartFP}
                    filterType={this.state.paidFree}
                    dateWiseFilter={this.state.filterWithFacilityIdFP}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}
export default DataView;