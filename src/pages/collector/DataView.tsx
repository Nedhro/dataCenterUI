import React from "react";
import CollectorService from "../../service/CollectorService";
import "../../static/scss/Custom.scss";
import "../../static/scss/Table.scss";
import ReactFlexyTable from "react-flexy-table";
import "react-flexy-table/dist/index.css";
import CoordinateChart from "../charts/CoordinateChart";
import Select from "react-select";
// import AsyncSelect from "react-select/async";
import totalPatient from "../../icons/totalPatient.png"
import opdPatient from "../../icons/opdPatient.png"
import emergencyPatient from "../../icons/emergencyPatient.png"
import malePatient from "../../icons/malePatient.png"
import femalePatient from "../../icons/femalePatient.png"
class DataView extends React.Component<any, any> {
  dataConfig: any = {};
  dataConfigEO: any = {};
  dataConfigMF: any = {};
  dataConfigFP: any = {};
  timerID: any;
  dataToExport: any;
  dataToExportEO: any;
  dataToExportMF: any;
  dataToExportFP: any;
  changeHandler = (event: any) => {
    let nam = event.target.name;
    let startDateInput = "";
    let endDateInput = "";

    if (nam === "startDate") {
      startDateInput = event.target.value;
      this.dataConfig.startDate = this.formateDate(startDateInput);
    }
    if (nam === "endDate") {
      endDateInput = event.target.value;
      this.dataConfig.endDate = this.formateDate(endDateInput);
    }

    let facilityId = this.dataConfig.facilityId;
    let startDate = this.dataConfig.startDate;
    let endDate = this.dataConfig.endDate;
    let district = this.state.districtData;
    let division = this.state.divisionData;
    let date_ob = new Date();
    let dateNow = this.formateNowDate(date_ob);

    if (facilityId === null || facilityId === "") {
      this.dataConfig = {
        division: division,
        district: district,
        facilityId: null,
        startDate: startDate || dateNow,
        endDate: endDate || dateNow,
      };
      this.getRegData(this.dataConfig);
      this.getSumData(this.dataConfig);
    }
    if (facilityId !== null && startDate !== "" && endDate !== "") {
      this.dataConfig = {
        division: division,
        district: district,
        facilityId: facilityId,
        startDate: startDate,
        endDate: endDate,
      };
      this.getRegData(this.dataConfig);
      this.getSumData(this.dataConfig);
    }

    if (facilityId !== null && startDate === "" && endDate === "") {
      this.dataConfig = {
        division: division,
        district: district,
        facilityId: facilityId,
        startDate: dateNow,
        endDate: dateNow,
      };
      this.getRegData(this.dataConfig);
      this.getSumData(this.dataConfig);
    }
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



  //Emergency opd
  changeHandlerEO = (event: any) => {
    let nam = event.target.name;
    let startDateEO = "";
    let endDateEO = "";

    if (nam === "startDate") {
      startDateEO = event.target.value;

      this.dataConfigEO.startDate = this.formateDate(startDateEO);
    }
    if (nam === "endDate") {
      endDateEO = event.target.value;
      this.dataConfigEO.endDate = this.formateDate(endDateEO);
    }

    let facilityId = this.dataConfigEO.facilityId;
    let startDate = this.dataConfigEO.startDate;
    let endDate = this.dataConfigEO.endDate;
    let district = this.state.districtChart;
    let division = this.state.divisionChart;
    let date_ob = new Date();
    let dateNow = this.formateNowDate(date_ob);
    if (facilityId === null || facilityId === "") {
      this.dataConfigEO = {
        division: division,
        district: district,
        facilityId: null,
        startDate: startDate || dateNow,
        endDate: endDate || dateNow,
      };
      this.getRegDataEO(this.dataConfigEO);
      this.getSumDataEO(this.dataConfigEO);
    }
    if (facilityId !== null && startDate !== "" && endDate !== "") {
      this.dataConfigEO = {
        division: division,
        district: district,
        facilityId: facilityId,
        startDate: startDate,
        endDate: endDate,
      };
      this.getRegDataEO(this.dataConfigEO);
      this.getSumDataEO(this.dataConfigEO);
    }

    if (facilityId !== null && startDate === "" && endDate === "") {
      this.dataConfigEO = {
        division: division,
        district: district,
        facilityId: facilityId,
        startDate: dateNow,
        endDate: dateNow,
      };
      this.getRegDataEO(this.dataConfigEO);
      this.getSumDataEO(this.dataConfigEO);
    }

  };

  //male female
  changeHandlerMF = (event: any) => {
    let nam = event.target.name;
    let startDateMF = "";
    let endDateMF = "";

    if (nam === "startDate") {
      startDateMF = event.target.value;

      this.dataConfigMF.startDate = this.formateDate(startDateMF);
    }
    if (nam === "endDate") {
      endDateMF = event.target.value;
      this.dataConfigMF.endDate = this.formateDate(endDateMF);
    }
    let facilityId = this.dataConfigMF.facilityId;
    let startDate = this.dataConfigMF.startDate;
    let endDate = this.dataConfigMF.endDate;
    let district = this.state.districtChart;
    let division = this.state.divisionChart;
    let date_ob = new Date();
    let dateNow = this.formateNowDate(date_ob);

    if (facilityId === null || facilityId === "") {
      this.dataConfigMF = {
        division: division,
        district: district,
        facilityId: null,
        startDate: startDate || dateNow,
        endDate: endDate || dateNow,
      };
      this.getRegDataMF(this.dataConfigMF);
      this.getSumDataMF(this.dataConfigMF);
    }
    if (facilityId !== null && startDate !== "" && endDate !== "") {
      this.dataConfigMF = {
        division: division,
        district: district,
        facilityId: facilityId,
        startDate: startDate,
        endDate: endDate,
      };
      this.getRegDataMF(this.dataConfigMF);
      this.getSumDataMF(this.dataConfigMF);
    }

    if (facilityId !== null && startDate === "" && endDate === "") {
      this.dataConfigMF = {
        division: division,
        district: district,
        facilityId: facilityId,
        startDate: dateNow,
        endDate: dateNow,
      };
      this.getRegDataMF(this.dataConfigMF);
      this.getSumDataMF(this.dataConfigMF);
    }
  };

  //free paid
  changeHandlerFP = (event: any) => {
    let nam = event.target.name;
    let startDateFP = "";
    let endDateFP = "";

    if (nam === "startDate") {
      startDateFP = event.target.value;

      this.dataConfigFP.startDate = this.formateDate(startDateFP);
    }
    if (nam === "endDate") {
      endDateFP = event.target.value;
      this.dataConfigFP.endDate = this.formateDate(endDateFP);
    }
    let facilityId = this.dataConfigFP.facilityId;
    let startDate = this.dataConfigFP.startDate;
    let endDate = this.dataConfigFP.endDate;
    let district = this.state.districtChart;
    let division = this.state.divisionChart;
    let date_ob = new Date();
    let dateNow = this.formateNowDate(date_ob);

    if (facilityId === null || facilityId === "") {
      this.dataConfigFP = {
        division: division,
        district: district,
        facilityId: null,
        startDate: startDate || dateNow,
        endDate: endDate || dateNow,
      };
      this.getRegDataFP(this.dataConfigFP);
      this.getSumDataFP(this.dataConfigFP);
    }
    if (facilityId !== null && startDate !== "" && endDate !== "") {
      this.dataConfigFP = {
        division: division,
        district: district,
        facilityId: facilityId,
        startDate: startDate,
        endDate: endDate,
      };
      this.getRegDataFP(this.dataConfigFP);
      this.getSumDataFP(this.dataConfigFP);
    }

    if (facilityId !== null && startDate === "" && endDate === "") {
      this.dataConfigFP = {
        division: division,
        district: district,
        facilityId: facilityId,
        startDate: dateNow,
        endDate: dateNow,
      };
      this.getRegDataFP(this.dataConfigFP);
      this.getSumDataFP(this.dataConfigFP);
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
      divisionNameData: '',
      // divisionNameChart: 'Select...',
      divisionNameChart: '',
      districtNameChart: '',
      facilityNameChart: '',
      divisionData: null,
      districtData: null,
      divisionChart: null,
      districtChart: null,
      card: {},

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
    this.timerID = setInterval(
      () => this.getRegData(this.dataConfig),
      5 * 60 * 1000
    );
    this.getSumData(this.dataConfig);
    CollectorService.getAllCard().then(
      (response): any => {
        if (response) {
          this.setState({
            card: response.data.content
          })
        }
      }
    );
    CollectorService.getAllRegistrationCollectionData(this.dataConfig).then(
      (res): any => {
        const resultData = res.data.content;
        const all = resultData.map(item => item.facilityInfo)

        const tempArr2 = resultData.map(item => item.facilityInfo.facilityDivision)
        const division = tempArr2.filter((item, index) => tempArr2.indexOf(item) === index);
        const tempArr = resultData.map(item => item.facilityInfo.facilityDistrict)
        const district = tempArr.filter((item, index) => tempArr.indexOf(item) === index);
        const tempArr3 = resultData.map(item => item.facilityInfo.facilityName)
        const facility = tempArr3.filter((item, index) => tempArr3.indexOf(item) === index);

        const tempArrayDis: any = [];
        if (district.length) {
          district.forEach((element: any) => {
            tempArrayDis.push({
              label: `${element}`,
              value: element,
            });
          })

          this.setState({
            districtListData: tempArrayDis,
            districtListChart: tempArrayDis,
          })
        }
        const tempArrayFacility: any = [];
        if (facility.length) {
          facility.forEach((element: any) => {
            tempArrayFacility.push({
              label: `${element}`,
              value: element,
            });
          })

          this.setState({
            facilityListData: tempArrayFacility,
            facilityListChart: tempArrayFacility,
          })
        }
        const tempArrayDiv: any = [];
        if (division.length) {
          division.forEach((element: any) => {
            tempArrayDiv.push({
              label: `${element}`,
              value: element,
            });
          })

          this.setState({
            divisionListData: tempArrayDiv,
            divisionListChart: tempArrayDiv,
          })
        }

        this.setState({
          allList: all,
        })
      }
    );
  }
  componentWillUnmount() {
    clearInterval(this.timerID);
  }
  // emergency-opd
  getRegDataEO(data: any) {
    CollectorService.getAllRegistrationCollectionData(data).then(
      (res): any => {
        if (data.facilityId !== null) {
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
          this.dataToExportEO = response.data.content;
          this.setState({
            filterWithFacilityIdEO: false,
          });
        }
      }
    );
  }

  //male female
  getRegDataMF(data: any) {
    // console.log(data);
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
          this.dataToExportMF = response.data.content;
          this.setState({
            filterWithFacilityIdMF: false,
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
          this.dataToExportFP = response.data.content;
          this.setState({
            filterWithFacilityIdFP: false,
          });
        }
      }
    );
  }


  getRegData(data: any) {
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
            "Facility Name (Id)": data.facilityInfo.facilityName || "N/A",
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



  //for data view
  onSearchFacilityData = (selectedOption: any) => {

    if (selectedOption !== null) {
      this.dataConfig.facilityId = selectedOption.value;
      this.dataConfig = {
        facilityId: selectedOption.value,
        startDate: this.dataConfig.startDate,
        endDate: this.dataConfig.endDate,
        division: this.state.divisionData,
        district: this.state.districtData,
      };
      this.getRegData(this.dataConfig);
      this.getSumData(this.dataConfig);
    }
    else if (selectedOption === null) {
      this.dataConfig.facilityId = selectedOption;
      this.dataConfig = {
        facilityId: selectedOption,
        startDate: this.dataConfig.startDate,
        endDate: this.dataConfig.endDate,
        division: this.state.divisionData,
        district: this.state.districtData,
      };
      this.getRegData(this.dataConfig);
      this.getSumData(this.dataConfig);
    }



  }

  onSearchDivisionData = (selectedOption: any) => {

    // console.log(selectedOption);
    if (selectedOption !== null) {
      this.setState({
        selectedOption,
        divisionData: selectedOption.value
      });
      this.dataConfig = {
        facilityId: this.dataConfig.facilityId,
        startDate: this.dataConfig.startDate,
        endDate: this.dataConfig.endDate,
        division: selectedOption.value,
        district: this.state.districtData,
      };
      this.getRegData(this.dataConfig);
      this.getSumData(this.dataConfig);

      const all = this.state.allList;
      let tempDis = all.filter(item => item.facilityDivision === selectedOption.value);
      const tempArr = tempDis.map(item => item.facilityDistrict);
      const district = tempArr.filter((item, index) => tempArr.indexOf(item) === index);
      const tempArr3 = tempDis.map(item => item.facilityName);
      const facility = tempArr3.filter((item, index) => tempArr3.indexOf(item) === index);

      const tempArrayDis: any = [];
      if (district.length) {
        district.forEach((element: any) => {
          tempArrayDis.push({
            label: `${element}`,
            value: element,
          });
        })

        this.setState({
          districtListData: tempArrayDis,
        })
      }
      const tempArrayFacility: any = [];
      if (facility.length) {
        facility.forEach((element: any) => {
          tempArrayFacility.push({
            label: `${element}`,
            value: element,
          });
        })

        this.setState({
          facilityListData: tempArrayFacility,
        })
      }
    } else if (selectedOption === null) {
      this.setState({
        selectedOption,
        divisionData: selectedOption
      });
      this.dataConfig = {
        facilityId: this.dataConfig.facilityId,
        startDate: this.dataConfig.startDate,
        endDate: this.dataConfig.endDate,
        division: selectedOption,
        district: this.state.districtData,
      };
      this.getRegData(this.dataConfig);
      this.getSumData(this.dataConfig);

      const all = this.state.allList;
      // let tempDis = all.filter(item => item.facilityDivision === selectedOption.value);
      const tempArr = all.map(item => item.facilityDistrict);
      const district = tempArr.filter((item, index) => tempArr.indexOf(item) === index);
      const tempArr3 = all.map(item => item.facilityName);
      const facility = tempArr3.filter((item, index) => tempArr3.indexOf(item) === index);

      const tempArrayDis: any = [];
      if (district.length) {
        district.forEach((element: any) => {
          tempArrayDis.push({
            label: `${element}`,
            value: element,
          });
        })

        this.setState({
          districtListData: tempArrayDis,
        })
      }
      const tempArrayFacility: any = [];
      if (facility.length) {
        facility.forEach((element: any) => {
          tempArrayFacility.push({
            label: `${element}`,
            value: element,
          });
        })

        this.setState({
          facilityListData: tempArrayFacility,
        })
      }


    }


  }
  onSearchDistrictData = (selectedOption: any) => {
    // console.log(selectedOption);
    if (selectedOption !== null) {
      this.setState({
        selectedOption,
        districtData: selectedOption.value
      });
      this.dataConfig = {
        facilityId: this.dataConfig.facilityId,
        startDate: this.dataConfig.startDate,
        endDate: this.dataConfig.endDate,
        division: this.state.divisionData,
        district: selectedOption.value,
      };
      this.getRegData(this.dataConfig);
      this.getSumData(this.dataConfig);

    }

    else if (selectedOption === null) {
      this.setState({
        selectedOption,
        districtData: selectedOption
      });
      this.dataConfig = {
        facilityId: this.dataConfig.facilityId,
        startDate: this.dataConfig.startDate,
        endDate: this.dataConfig.endDate,
        division: this.state.divisionData,
        district: selectedOption,
      };
      this.getRegData(this.dataConfig);
      this.getSumData(this.dataConfig);
    }

  }


  //for chart
  onSearchFacilityChart = (selectedOption: any) => {

    if (selectedOption !== null) {
      this.setState({
        districtNameChart: {
          label: selectedOption.value,
          value: selectedOption.value,
        },
      })

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
      this.getSumDataEO(this.dataConfigEO);


      this.dataConfigMF = {
        facilityId: selectedOption.value,
        startDate: this.dataConfigMF.startDate,
        endDate: this.dataConfigMF.endDate,
        division: this.dataConfigMF.divisionChart,
        district: this.dataConfigMF.districtChart,
      };
      this.getRegDataMF(this.dataConfigMF);
      this.getSumDataMF(this.dataConfigMF);


      this.dataConfigFP = {
        facilityId: selectedOption.value,
        startDate: this.dataConfigFP.startDate,
        endDate: this.dataConfigFP.endDate,
        division: this.dataConfigFP.divisionChart,
        district: this.dataConfigFP.districtChart,
      };
      this.getRegDataFP(this.dataConfigFP);
      this.getSumDataFP(this.dataConfigFP);
    }
    else if (selectedOption === null) {
      this.dataConfigEO.facilityId = selectedOption;
      this.dataConfigMF.facilityId = selectedOption;
      this.dataConfigFP.facilityId = selectedOption;
      this.setState({
        districtNameChart: '',
      })
      this.dataConfigEO = {
        facilityId: selectedOption,
        startDate: this.dataConfigEO.startDate,
        endDate: this.dataConfigEO.endDate,
        division: this.state.divisionChart,
        district: this.state.districtChart,
      };
      this.getRegDataEO(this.dataConfigEO);
      this.getSumDataEO(this.dataConfigEO);


      this.dataConfigMF = {
        facilityId: selectedOption,
        startDate: this.dataConfigMF.startDate,
        endDate: this.dataConfigMF.endDate,
        division: this.dataConfigMF.divisionChart,
        district: this.dataConfigMF.districtChart,
      };
      this.getRegDataMF(this.dataConfigMF);
      this.getSumDataMF(this.dataConfigMF);


      this.dataConfigFP = {
        facilityId: selectedOption,
        startDate: this.dataConfigFP.startDate,
        endDate: this.dataConfigFP.endDate,
        division: this.dataConfigFP.divisionChart,
        district: this.dataConfigFP.districtChart,
      };
      this.getRegDataFP(this.dataConfigFP);
      this.getSumDataFP(this.dataConfigFP);
    }




  }

  onSearchDivisionChart = (selectedOption: any) => {
    // console.log(this.state.allList)

    if (selectedOption !== null) {

      this.setState({
        selectedOption,
        divisionChart: selectedOption.value
      });
      this.setState({
        divisionNameChart: {
          label: selectedOption.value,
          value: selectedOption.value,
        },
      })
      this.setState({
        districtNameChart: ''
      })

      const all = this.state.allList
      let tempDis = all.filter(item => item.facilityDivision === selectedOption.value)
      // console.log(tempDis)
      const tempArr = tempDis.map(item => item.facilityDistrict)
      const district = tempArr.filter((item, index) => tempArr.indexOf(item) === index);
      const tempArr3 = tempDis.map(item => item.facilityName)
      const facility = tempArr3.filter((item, index) => tempArr3.indexOf(item) === index);

      const tempArrayDis: any = [];
      if (district.length) {
        district.forEach((element: any) => {
          tempArrayDis.push({
            label: `${element}`,
            value: element,
          });
        })

        this.setState({
          districtListChart: tempArrayDis,
        })
      }
      const tempArrayFacility: any = [];
      if (facility.length) {
        facility.forEach((element: any) => {
          tempArrayFacility.push({
            label: `${element}`,
            value: element,
          });
        })

        this.setState({
          facilityListChart: tempArrayFacility,
        })
      }




      this.dataConfigEO = {
        facilityId: this.dataConfigEO.facilityId,
        startDate: this.dataConfigEO.startDate,
        endDate: this.dataConfigEO.endDate,
        division: selectedOption.value,
        district: null,
      };
      this.getRegDataEO(this.dataConfigEO);
      this.getSumDataEO(this.dataConfigEO);

      this.dataConfigMF = {
        facilityId: this.dataConfigMF.facilityId,
        startDate: this.dataConfigMF.startDate,
        endDate: this.dataConfigMF.endDate,
        division: selectedOption.value,
        district: null,
      };
      this.getRegDataMF(this.dataConfigMF);
      this.getSumDataMF(this.dataConfigMF);

      this.dataConfigFP = {
        facilityId: this.dataConfigFP.facilityId,
        startDate: this.dataConfigFP.startDate,
        endDate: this.dataConfigFP.endDate,
        division: selectedOption.value,
        district: null,
      };
      this.getRegDataFP(this.dataConfigFP);
      this.getSumDataFP(this.dataConfigFP);

    }
    else if (selectedOption === null) {
      this.setState({
        selectedOption,
        divisionChart: selectedOption
      });
      this.setState({
        divisionNameChart: '',
      })
      this.setState({
        districtNameChart: '',
      })

      const all = this.state.allList
      // let tempDis = all.filter(item => item.facilityDivision === selectedOption.value)
      // console.log(tempDis)
      const tempArr3 = all.map(item => item.facilityName)
      const facility = tempArr3.filter((item, index) => tempArr3.indexOf(item) === index);
      const tempArr = all.map(item => item.facilityDistrict)
      const district = tempArr.filter((item, index) => tempArr.indexOf(item) === index);


      const tempArrayDis: any = [];
      if (district.length) {
        district.forEach((element: any) => {
          tempArrayDis.push({
            label: `${element}`,
            value: element,
          });
        })

        this.setState({
          districtListChart: tempArrayDis,
        })
      }
      const tempArrayFacility: any = [];
      if (facility.length) {
        facility.forEach((element: any) => {
          tempArrayFacility.push({
            label: `${element}`,
            value: element,
          });
        })

        this.setState({
          facilityListChart: tempArrayFacility,
        })
      }





      this.dataConfigEO = {
        facilityId: this.dataConfigEO.facilityId,
        startDate: this.dataConfigEO.startDate,
        endDate: this.dataConfigEO.endDate,
        division: selectedOption,
        district: null,
      };
      this.getRegDataEO(this.dataConfigEO);
      this.getSumDataEO(this.dataConfigEO);

      this.dataConfigMF = {
        facilityId: this.dataConfigMF.facilityId,
        startDate: this.dataConfigMF.startDate,
        endDate: this.dataConfigMF.endDate,
        division: selectedOption,
        district: null,
      };
      this.getRegDataMF(this.dataConfigMF);
      this.getSumDataMF(this.dataConfigMF);

      this.dataConfigFP = {
        facilityId: this.dataConfigFP.facilityId,
        startDate: this.dataConfigFP.startDate,
        endDate: this.dataConfigFP.endDate,
        division: selectedOption,
        district: null,
      };
      this.getRegDataFP(this.dataConfigFP);
      this.getSumDataFP(this.dataConfigFP);
    }



  }
  onSearchDistrictChart = (selectedOption: any) => {
    console.log(selectedOption);
    if (selectedOption !== null) {

      this.setState({
        selectedOption,
        districtChart: selectedOption.value
      });
      this.setState({
        districtNameChart: {
          label: selectedOption.value,
          value: selectedOption.value,
        },
      })
      const all = this.state.allList;
      console.log(all);
      let tempDis = all.filter(item => item?.facilityDistrict === selectedOption.value);
      const tempArr = tempDis.map(item => item.facilityDivision);
      const division = tempArr.filter((item, index) => tempArr.indexOf(item) === index);
      const tempArr3 = tempDis.map(item => item.facilityName);
      const facility = tempArr3.filter((item, index) => tempArr3.indexOf(item) === index);
      console.log(division[0], facility);
      // this.setState({
      //   divisionChart: division[0]
      // })
      if (division[0]) {
        this.setState({
          divisionNameChart: {
            label: division[0],
            value: division[0],
          },
        })
      }
      // this.setState({
      //   divisionNameChart: division[0],
      // })
      // console.log(tempArrayDiv[0]);

      const tempArrayFacility: any = [];
      if (facility.length) {
        facility.forEach((element: any) => {
          tempArrayFacility.push({
            label: `${element}`,
            value: element,
          });
        })

        this.setState({
          facilityListChart: tempArrayFacility,
        })
      }
      this.dataConfigEO = {
        facilityId: this.dataConfigEO.facilityId,
        startDate: this.dataConfigEO.startDate,
        endDate: this.dataConfigEO.endDate,
        division: division[0],
        district: selectedOption.value,
      };
      this.getRegDataEO(this.dataConfigEO);
      this.getSumDataEO(this.dataConfigEO);

      this.dataConfigMF = {
        facilityId: this.dataConfigMF.facilityId,
        startDate: this.dataConfigMF.startDate,
        endDate: this.dataConfigMF.endDate,
        division: division[0],
        district: selectedOption.value,
      };
      this.getRegDataMF(this.dataConfigMF);
      this.getSumDataMF(this.dataConfigMF);

      this.dataConfigFP = {
        facilityId: this.dataConfigFP.facilityId,
        startDate: this.dataConfigFP.startDate,
        endDate: this.dataConfigFP.endDate,
        division: division[0],
        district: selectedOption.value,
      };
      this.getRegDataFP(this.dataConfigFP);
      this.getSumDataFP(this.dataConfigFP);
    }
    else if (selectedOption === null) {
      this.setState({
        selectedOption,
        districtChart: selectedOption
      });
      const all = this.state.allList;
      console.log(all);
      this.setState({
        districtNameChart: ''
      })
      // let tempDis = all.filter(item => item?.facilityDistrict === selectedOption);
      const tempArr = all.map(item => item.facilityDivision);
      const division = tempArr.filter((item, index) => tempArr.indexOf(item) === index);
      const tempArr3 = all.map(item => item.facilityName);
      const facility = tempArr3.filter((item, index) => tempArr3.indexOf(item) === index);
      console.log(division[0], facility);
      // const tempArrdis = all.map(item => item.facilityDistrict)
      // const district = tempArrdis.filter((item, index) => tempArr.indexOf(item) === index);


      // const tempArrayDis: any = [];
      // if (district.length) {
      //   district.forEach((element: any) => {
      //     tempArrayDis.push({
      //       label: `${element}`,
      //       value: element,
      //     });
      //   })

      //   this.setState({
      //     districtListChart: tempArrayDis,
      //   })
      // }
      this.setState({
        divisionChart: division[0]
      })
      this.setState({
        divisionNameChart: '',
      })

      const tempArrayFacility: any = [];
      if (facility.length) {
        facility.forEach((element: any) => {
          tempArrayFacility.push({
            label: `${element}`,
            value: element,
          });
        })

        this.setState({
          facilityListChart: tempArrayFacility,
        })
      }
      this.dataConfigEO = {
        facilityId: this.dataConfigEO.facilityId,
        startDate: this.dataConfigEO.startDate,
        endDate: this.dataConfigEO.endDate,
        division: null,
        district: selectedOption,
      };
      this.getRegDataEO(this.dataConfigEO);
      this.getSumDataEO(this.dataConfigEO);

      this.dataConfigMF = {
        facilityId: this.dataConfigMF.facilityId,
        startDate: this.dataConfigMF.startDate,
        endDate: this.dataConfigMF.endDate,
        division: null,
        district: selectedOption,
      };
      this.getRegDataMF(this.dataConfigMF);
      this.getSumDataMF(this.dataConfigMF);

      this.dataConfigFP = {
        facilityId: this.dataConfigFP.facilityId,
        startDate: this.dataConfigFP.startDate,
        endDate: this.dataConfigFP.endDate,
        division: null,
        district: selectedOption,
      };
      this.getRegDataFP(this.dataConfigFP);
      this.getSumDataFP(this.dataConfigFP);
    }




  }
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
        marginTop: '2px',
        borderRadius: '0px',
        minHeight: '36px',
        height: '30px',
        boxShadow: state.isFocused ? null : null,
      }),

      valueContainer: (provided, state) => ({
        ...provided,
        height: '30px',
        padding: '0 6px',
        marginTop: '-6px',
      }),

      input: (provided, state) => ({
        ...provided,
        margin: '-20px -2px',
      }),
      indicatorSeparator: state => ({
        display: 'none',
      }),
      indicatorsContainer: (provided, state) => ({
        ...provided,
        // height: '33px',
      }),
    }
    const handleChartTypeChangeEO = (selectedChartEO) => {
      this.setState({ selectedChartEO }
      );
    };
    const handleChartTypeChangeMF = (selectedChartMF) => {
      this.setState({ selectedChartMF }
      );
    };
    const handleChartTypeChangeFP = (selectedChartFP) => {
      this.setState({ selectedChartFP }
      );
    };
    // console.log(this.state.divisionNameChart)
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
          <div className="mt-1">
            <div className="text-center"><h5 style={{ fontWeight: 'bold', fontSize: '20px' }} className="text-danger"><u>Todays Report</u></h5></div>
            <div className="row d-flex justify-content-center">
              <div style={{ padding: '0px 2px', margin: '0px 15px' }} className="col-md-2">
                <div style={{
                  border: '1px solid lightGray', borderRadius: '20px', height: '100px', boxShadow: '5px 5px 20px gray', width: '250px',
                  padding: '15px'
                }} className="d-flex justify-content-center row">
                  <div className="col-4">
                    <img src={totalPatient} alt="total-patient" />

                  </div>
                  <div className="col-7">
                    <h2 className="font-weight-bold text-info">{this.state.card.totalPatient || 0}</h2>
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
                    <img alt="total-opd" src={opdPatient} />

                  </div>
                  <div className="col-7">
                    <h2 className="font-weight-bold text-info">{this.state.card.totalOpdPatient || 0}</h2>
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
                    <img alt="total-emergency" src={emergencyPatient} />

                  </div>
                  <div className="col-8">
                    <h2 className="font-weight-bold text-info">{this.state.card.totalEmergencyPatient || 0}</h2>
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
                    <img alt="total-male" src={malePatient} />

                  </div>
                  <div className="col-7">
                    <h2 className="font-weight-bold text-info">{this.state.card.totalMalePatient || 0}</h2>
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
                    <img alt="total-female" src={femalePatient} />

                  </div>
                  <div className="col-7">
                    <h2 className="font-weight-bold text-info">{this.state.card.totalFemalePatient || 0}</h2>
                    <small className="font-weight-bold">Total Female Patient</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-start mt-4">
            <div
              className=" pl-0 pr-0 pt-1"
              id="dataView"
              style={{ display: showing ? "none" : "block" }}
            >
              <form className="form-inline m-0 p-0 "
              >
                <div className="form-group col-12 ml-1 pl-0 filter d-flex">

                  <div className="d-flex">
                    <label className="label ml-2 mr-1 p-1 text-info font-weight-bold">
                      Division
                    </label>
                    <div style={{ width: '180px' }} >

                      < Select
                        styles={customStyles}
                        name="division"
                        options={this.state.divisionListData}
                        onChange={(e: any) => {
                          this.onSearchDivisionData(e);
                        }}
                        // defaultValue={{ label: "Select Dept", value: 0 }}
                        defaultValue={this.state.divisionNameData}
                        isSearchable={true}
                        isClearable={true}
                      />
                    </div>
                  </div>
                  <div className="d-flex">
                    <label className="label ml-2 mr-1 p-1  text-info font-weight-bold">
                      District
                    </label>
                    <div style={{ width: '180px' }} >
                      < Select
                        styles={customStyles}
                        name="districtName"
                        options={this.state.districtListData}
                        onChange={(e: any) => {
                          this.onSearchDistrictData(e);
                        }}
                        isSearchable={true}
                        isClearable={true}
                      />

                    </div>
                  </div>
                  <div className="d-flex">
                    <label className="label ml-2 mr-1 p-1  text-info font-weight-bold">
                      Facility Name
                    </label>
                    <div style={{ width: '180px' }} >
                      < Select
                        styles={customStyles}
                        name="facilityId"
                        options={this.state.facilityListData}
                        onChange={(e: any) => {
                          this.onSearchFacilityData(e);
                        }}
                        isSearchable={true}
                        isClearable={true}
                      />

                    </div>

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



                </div>
              </form>
            </div>
            <div >
              <div
                className="col-12  pt-0"
                id="dataView"
                style={{ display: showing ? "block" : "none" }}
              >
                <div className="d-flex  ">
                  <div className="d-flex ">
                    <label className="label ml-2 mr-1 mt-2 p-1 text-info font-weight-bold">
                      Division
                    </label>
                    <div style={{ width: '180px' }} >

                      < Select
                        styles={customStyles}
                        name="division"
                        options={this.state.divisionListChart}
                        onChange={(e: any) => {
                          this.onSearchDivisionChart(e);
                        }}
                        // placeholder={this.state.divisionNameChart}
                        value={this.state.divisionNameChart}
                        isSearchable={true}
                        isClearable={true}
                      />
                    </div>
                  </div>
                  <div className="d-flex">
                    <label className="label ml-2 mr-1 p-1 mt-2 text-info font-weight-bold">
                      District
                    </label>
                    <div style={{ width: '180px' }} >
                      < Select
                        styles={customStyles}
                        name="districtName"
                        options={this.state.districtListChart}
                        onChange={(e: any) => {
                          this.onSearchDistrictChart(e);
                        }}
                        value={this.state.districtNameChart}
                        isSearchable={true}
                        isClearable={true}
                      />


                    </div>
                  </div>
                  <div className="d-flex">
                    <label className="label ml-2 mr-1 p-1 mt-2 text-info font-weight-bold">
                      Facility Name
                    </label>
                    <div style={{ width: '180px' }} >
                      < Select
                        styles={customStyles}
                        name="facilityId"
                        options={this.state.facilityListChart}
                        onChange={(e: any) => {
                          this.onSearchFacilityChart(e);
                        }}
                        isSearchable={true}
                        isClearable={true}
                      />

                    </div>

                  </div>
                </div>

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
          <div >
            <div
              className="col-12  pt-0"
              id="dataView"
              style={{ display: showing ? "block" : "none" }}
            >
              <div style={{
                border: '1px solid lightGray', borderRadius: '20px',
                padding: '15px', boxShadow: '5px 5px 20px gray'
              }}>
                <div className='p-3 text-dark text-center'>
                  <h2><u>Emergency-OPD</u></h2>
                </div>
                <div >
                  <div className=" p-0 ml-2">
                    <form className="form-inline m-0 p-0 "

                    >
                      <div className="form-group col-12 ml-1 pl-0 filter d-flex">
                        <div style={{ width: '250px' }}>
                          <Select
                            styles={customStyles}
                            value={selectedChartEO || chartOptions[0]}
                            onChange={handleChartTypeChangeEO}
                            options={chartOptions}
                            placeholder="Select Chart Type"
                          />
                        </div>


                        <div className="d-flex">
                          <label className="label ml-2 p-1 mr-1 text-info font-weight-bold">
                            Start Date
                          </label>
                          <input
                            className="text m-1 p-1"
                            onChange={this.changeHandlerEO}
                            // onChange={this.changeHandler}
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
                            onChange={this.changeHandlerEO}
                            // onChange={this.changeHandler}
                            pattern="MM-dd-yyyy"
                            type="date"
                            name="endDate"
                            id="endDate"
                            defaultValue={dateOfToday}
                          />
                        </div>


                      </div>
                    </form>
                  </div>
                </div>
                <div className="d-flex justify-content-center">
                  <CoordinateChart
                    data={this.dataToExportEO}

                    chartType={selectedChartEO}
                    filterType={this.state.opdEmergency}
                    dateWiseFilter={this.state.filterWithFacilityIdEO}
                  />
                </div>
              </div>
              <div style={{
                border: '1px solid lightGray', borderRadius: '20px',
                padding: '15px', boxShadow: '5px 5px 20px gray', marginTop: '20px'
              }}>
                <div className='p-3 text-dark text-center'>
                  <h2><u>Male-Female</u></h2>
                </div>
                <div >
                  <div className=" p-0 ml-2">
                    <form className="form-inline m-0 p-0 "


                    >
                      <div className="form-group col-12 ml-1 pl-0 filter d-flex">
                        <div style={{ width: '250px' }}>
                          <Select
                            styles={customStyles}
                            value={selectedChartMF || chartOptions[0]}
                            onChange={handleChartTypeChangeMF}
                            options={chartOptions}
                            placeholder="Select Chart Type"
                          />
                        </div>

                        <div className="d-flex">
                          <label className="label ml-2 p-1 mr-1 text-info font-weight-bold">
                            Start Date
                          </label>
                          <input
                            className="text m-1 p-1"
                            onChange={this.changeHandlerMF}


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
                            onChange={this.changeHandlerMF}


                            pattern="MM-dd-yyyy"
                            type="date"
                            name="endDate"
                            id="endDate"
                            defaultValue={dateOfToday}
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
              <div style={{
                border: '1px solid lightGray', borderRadius: '20px',
                padding: '15px', boxShadow: '5px 5px 20px gray', marginTop: '20px'
              }}>
                <div className='p-3 text-dark text-center'>
                  <h2><u>Free-Paid</u></h2>
                </div>
                <div >
                  <div className=" p-0 ml-2">
                    <form className="form-inline m-0 p-0 "


                    >
                      <div className="form-group col-12 ml-1 pl-0 filter d-flex">
                        <div style={{ width: '250px' }}>
                          <Select
                            styles={customStyles}
                            value={selectedChartFP || chartOptions[0]}
                            onChange={handleChartTypeChangeFP}
                            options={chartOptions}
                            placeholder="Select Chart Type"
                          />
                        </div>

                        <div className="d-flex">
                          <label className="label ml-2 p-1 mr-1 text-info font-weight-bold">
                            Start Date
                          </label>
                          <input
                            className="text m-1 p-1"
                            onChange={this.changeHandlerFP}


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
                            onChange={this.changeHandlerFP}


                            pattern="MM-dd-yyyy"
                            type="date"
                            name="endDate"
                            id="endDate"
                            defaultValue={dateOfToday}
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
