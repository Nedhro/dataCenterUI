import React from "react";
import CollectorService from "../../service/CollectorService";
import "../../static/scss/Custom.scss";
import "../../static/scss/Table.scss";
import "react-flexy-table/dist/index.css";
import PieChart from "../charts/PieChart";
import BarChart from "../charts/BarChart";
import Select from "react-select";
import DoughnutChart from "../charts/DoughnutChart";
import AsyncSelect from "react-select/async";
import { toast } from 'react-toastify';
import BarChartEmpty from "../charts/BarChartEmpty";
// import './DiagnosisChart.css'
toast.configure();
class DiagnosisChart extends React.Component<any, any> {
    dataConfig: any = {};
    timerID: any;
    dataToExport: any;
    tempArray: any;
    label: any;

    changeHandler = (event: any) => {
        let nam = event.target.name;
        let startDate = "";
        let endDate = "";
        if (nam === "startDate") {
            startDate = event.target.value;
            this.dataConfig.startDate = this.formateDate(startDate);
            this.setState({
                startDate: this.formateDate(startDate)
            });
        }
        if (nam === "endDate") {
            endDate = event.target.value;
            this.dataConfig.endDate = this.formateDate(endDate);
            this.setState({
                endDate: this.formateDate(endDate)
            });
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
        let startDate = this.dataConfig.startDate;
        let endDate = this.dataConfig.endDate;


        let date_ob = new Date();
        let dateNow = this.formateNowDate(date_ob);

        if (startDate !== "" && endDate !== "") {
            this.dataConfig = {
                startDate: startDate,
                endDate: endDate,
            };
            this.setState({
                startDate: startDate,
                endDate: endDate,
            });
            this.getDiagnosisData(this.dataConfig);
        }

        if (startDate === "" && endDate === "") {
            this.dataConfig = {
                startDate: dateNow,
                endDate: dateNow,
            };
            this.setState({
                startDate: dateNow,
                endDate: dateNow,
            });
            this.getDiagnosisData(this.dataConfig);
        }
    };

    constructor(props: any) {
        super(props);
        this.state = {
            startDate: '',
            endDate: '',
            error: null,
            isLoaded: false,
            items: [],
            dateOfToday: this.formateDefaultDate(new Date()),
            totalresult: {},
            showing: true,
            selectedChart: null,
            selectedFilter: null,
            filterWithFacilityId: false,
            diagnosis: '',
            facility: '',
            district: '',
            division: '',
            message: false,
            districtList: '',
            facilityList: '',
            diagnosisListDistrict: '',
            diagnosisListDivision: '',
            divisionName: '',
            districtData: true,
            divisionData: true,
            facilityData: true,
            districtDiagnosis: '',
            districtDiagnosisData: false,
            divisionDiagnosis: '',
            divisionDiagnosisData: false,
            districtMessage: '',
            facilityDataMessage: '',
            divisionMessage: '',
            noData: 'There is No Diagnosis Info Data',
            divisionList: [{ value: 'Dhaka', label: 'Dhaka' },
            { value: 'Rajshahi', label: 'Rajshahi' },
            { value: 'Rangpur', label: 'Rangpur' },
            { value: 'Sylhet', label: 'Sylhet' },
            { value: 'Khulna', label: 'Khulna' },
            { value: 'Chittagong', label: 'Chittagong' },
            { value: 'Barishal', label: 'Barishal' },],
            districtDiagnosisInfo: true,
            divisionDiagnosisInfo: true,
            districtDiagnosisInfoMessage: '',
            divisionDiagnosisInfoMessage: '',
        };
        this.changeHandler = this.changeHandler.bind(this);
        this.mySubmitHandler = this.mySubmitHandler.bind(this);
        this.onSearchDivision = this.onSearchDivision.bind(this);
    }


    componentDidMount() {
        let date_ob = new Date();
        let dateNow = this.formateNowDate(date_ob);
        this.dataConfig = {
            startDate: dateNow,
            endDate: dateNow,
        };
        this.setState({
            startDate: dateNow,
            endDate: dateNow,
        });
        this.getDiagnosisData(this.dataConfig);
        this.timerID = setInterval(
            () => this.getDiagnosisData(this.dataConfig),
            5 * 60 * 1000
        );

    }
    componentWillUnmount() {
        clearInterval(this.timerID);
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
    onSearchDistrict = (selectedOption: any) => {
        if (selectedOption) {
            this.setState({
                selectedOption,
                districtList: selectedOption.value
            });
        }
        const data = {
            startDate: this.state.startDate,
            endDate: this.state.endDate,
            district: selectedOption.value
        };

        CollectorService.getAllDiagnosisData(data).then(
            (res): any => {
                if (res.data.statusCode === 200) {
                    this.setState({
                        districtData: true,
                        district: res.data.content,
                        districtDiagnosisData: false,

                    });
                }
                else if (res.data.statusCode === 400) {
                    this.setState({
                        districtData: false,
                        districtDiagnosisData: false,
                        districtMessage: res.data.message
                    });
                }

            },
            (error) => {
                this.setState({
                    isLoaded: true,
                    error,
                });
            }
        )
    };
    fetchDiagnosisDistrict = (inputValue: any, callback: any) => {
        setTimeout(() => {
            CollectorService.getAllDiagnosisList(inputValue)
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
    onSearchDiagnosisDistrict = (selectedOption: any) => {
        if (selectedOption) {
            this.setState({
                selectedOption,
                diagnosisListDistrict: selectedOption.value
            });
        }
        const dataWithDis = {
            startDate: this.state.startDate,
            endDate: this.state.endDate,
            district: this.state.districtList || null,
            diagnosisName: selectedOption.value
        };

        if (dataWithDis.district == null) {
            toast.error("Please Input a District", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'colored'
            });
        }
        else {
            CollectorService.getAllDiagnosisData(dataWithDis).then(
                (res): any => {
                    if (res.data.statusCode === 200) {
                        this.setState({
                            districtDiagnosis: res.data.content,
                            districtDiagnosisData: true,
                            districtDiagnosisInfo: true,
                        });
                    }
                    else if (res.data.statusCode === 400) {
                        this.setState({
                            districtDiagnosisInfo: false,
                            districtDiagnosisInfoMessage: res.data.message
                        });
                    }

                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error,
                    });
                }
            )
        }
    };

    //for division
    onSearchDivision(e: any) {
        if (e) {
            this.setState({
                divisionName: e.value
            });
        }
        const data = {
            startDate: this.state.startDate,
            endDate: this.state.endDate,
            division: e.value
        };

        CollectorService.getAllDiagnosisData(data).then(
            (res): any => {

                if (res.data.statusCode === 200) {
                    this.setState({
                        divisionData: true,
                        divisionDiagnosisData: false,
                        division: res.data.content,
                    });
                }
                else if (res.data.statusCode === 400) {
                    this.setState({
                        divisionMessage: res.data.message,
                        divisionData: false,
                        divisionDiagnosisData: false,
                    });
                }

            },
            (error) => {
                this.setState({
                    isLoaded: true,
                    error,
                });
            }
        )
    }
    fetchDiagnosisDivision = (inputValue: any, callback: any) => {
        setTimeout(() => {
            CollectorService.getAllDiagnosisList(inputValue)
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
    onSearchDiagnosisDivision = (selectedOption: any) => {
        if (selectedOption) {
            this.setState({
                selectedOption,
                diagnosisListDivision: selectedOption.value
            });
        }
        const dataWithDiv = {
            startDate: this.state.startDate,
            endDate: this.state.endDate,
            division: this.state.divisionName || null,
            diagnosisName: selectedOption.value
        };
        if (dataWithDiv.division == null) {
            toast.error("Please Input a Division", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'colored',
            });
        }
        else {
            CollectorService.getAllDiagnosisData(dataWithDiv).then(
                (res): any => {
                    if (res.data.statusCode === 200) {
                        this.setState({
                            divisionDiagnosis: res.data.content,
                            divisionDiagnosisData: true,
                            divisionDiagnosisInfo: true,
                        });
                    }
                    else if (res.data.statusCode === 400) {
                        this.setState({
                            divisionDiagnosisInfo: false,
                            divisionDiagnosisInfoMessage: res.data.message
                        });
                    }

                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error,
                    });
                }
            )
        }

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
    onSearchFacility = (selectedOption: any) => {
        if (selectedOption) {
            this.setState({
                selectedOption,
                facilityList: selectedOption.label
            });
        }
        const data = {
            startDate: this.state.startDate,
            endDate: this.state.endDate,
            facilityName: selectedOption.label
        };
        CollectorService.getAllDiagnosisData(data).then(
            (res): any => {
                if (res.data.statusCode === 200) {
                    this.setState({
                        facilityData: true,
                        facility: res.data.content
                    });
                }
                else if (res.data.statusCode === 400) {
                    this.setState({
                        facilityData: false,
                        facilityDataMessage: res.data.message,
                    });
                }

            },
            (error) => {
                this.setState({
                    isLoaded: true,
                    error,
                });
            }
        )
    };


    //for all diagnosis
    getDiagnosisData(data: any) {
        CollectorService.getAllDiagnosisData(data).then(
            (res): any => {
                if (res.data.statusCode === 200) {
                    this.setState({
                        isLoaded: true,
                        diagnosis: res.data.content,
                        message: true,
                        facility: res.data.content,
                        district: res.data.content,
                        division: res.data.content,
                        districtList: '',
                        facilityList: '',
                        divisionName: '',
                        districtDiagnosisData: false,
                        divisionDiagnosisData: false,
                    });
                }
                else if (res.data.statusCode === 400) {
                    this.setState({
                        isLoaded: true,
                        diagnosis: undefined,
                        message: res.data.message,
                        districtDiagnosisData: false,
                        divisionDiagnosisData: false,
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


    render() {
        const {
            error,
            isLoaded,
            dateOfToday,
            diagnosis,
            division
        } = this.state;


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
                            <a className="btn btn-dark font-weight-bold ml-2 mb-1 mt-1" href="/">
                                Data View
                            </a>

                        </div>
                    </form>
                    {
                        this.state.message === true ? <div className="d-flex justify-content-center mt-3">
                            <div >
                                <div className="d-flex justify-content-center mt-4">

                                    {
                                        this.state.message === true && <div className="d-flex justify-content-center ">
                                            <div>
                                                <div style={{ width: '600px' }}>
                                                    <DoughnutChart diagnosis={diagnosis}></DoughnutChart>
                                                </div>

                                                <div className="d-flex justify-content-center">
                                                    <span className="font-weight-bold text-warning">All Diagnosis</span>
                                                </div>
                                            </div>
                                        </div>
                                    }

                                </div>
                                <div className="d-flex justify-content-center " style={{ position: 'relative', top: '39px', border: '1px solid white', boxShadow: '5px 5px 20px gray', borderRadius: '10px', height: '50%' }}>

                                    {
                                        this.state.message === true && <div className="d-flex justify-content-center ">
                                            <div>
                                                <div className="d-flex justify-content-end">
                                                    <label className="label ml-2 mr-1 p-1 mt-3 text-info font-weight-bold">
                                                        Facility Name
                                                    </label>
                                                    <div style={{ width: '200px' }} >
                                                        <AsyncSelect
                                                            name='facilityName'
                                                            defaultValue={this.state.facilityList}
                                                            loadOptions={this.fetchFacility}
                                                            placeholder="Facility Name"
                                                            onChange={(e: any) => {
                                                                this.onSearchFacility(e);
                                                            }}
                                                            defaultOptions={false}
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    {
                                                        this.state.facilityData ? <div style={{ width: '500px' }}>
                                                            <PieChart diagnosis={this.state.facility} ></PieChart>
                                                        </div>
                                                            : <div style={{ height: '520px', width: '500px' }}> <h2 style={{ position: 'relative', top: '140px', border: '1px solid white', boxShadow: '5px 5px 30px gray', borderRadius: '10px', padding: '20px', color: 'red' }}>{this.state.facilityDataMessage}</h2></div>
                                                    }
                                                </div>


                                                <div style={{ width: '500px' }} className="d-flex justify-content-center">

                                                    <span className="font-weight-bold text-primary">Facility: <span className="font-weight-bold text-warning">{
                                                        this.state.facilityList !== '' ? <span>{this.state.facilityList}</span> : <span>All</span>
                                                    }</span></span>
                                                </div>
                                            </div>
                                        </div>
                                    }

                                </div>
                            </div>
                            <div>
                                <div className="ml-3 " style={{ border: '1px solid white', boxShadow: '5px 5px 20px gray', borderRadius: '10px', height: '50%' }}>

                                    {
                                        this.state.message === true && <div className="d-flex justify-content-center row">
                                            <div className="col-5">
                                                <div className="d-flex justify-content-end form-group">
                                                    <label className="label ml-2 mr-1 p-1 mt-3 text-info font-weight-bold">
                                                        District
                                                    </label>
                                                    <div style={{ width: '200px' }} >
                                                        <AsyncSelect
                                                            name='districtName'
                                                            defaultValue={this.state.districtList}
                                                            loadOptions={this.fetchDistrict}
                                                            placeholder="District Name"
                                                            onChange={(e: any) => {
                                                                this.onSearchDistrict(e);
                                                            }}
                                                            defaultOptions={false}
                                                        />

                                                    </div>
                                                </div>
                                                <div>
                                                    {
                                                        this.state.districtData ? <div style={{ width: '500px' }}>
                                                            <PieChart diagnosis={this.state.district} ></PieChart>
                                                        </div>
                                                            : <div style={{ height: '520px', width: '500px' }}> <h2 style={{ position: 'relative', top: '120px', border: '1px solid white', boxShadow: '5px 5px 30px gray', borderRadius: '10px', padding: '90px 20px', color: 'red' }}>{this.state.districtMessage}</h2></div>
                                                    }
                                                </div>

                                                <div className="d-flex justify-content-center">

                                                    <span className="font-weight-bold text-primary">District: <span className="font-weight-bold text-warning">{
                                                        this.state.districtList !== '' ? <span>{this.state.districtList}</span> : <span>All</span>
                                                    }</span></span>
                                                </div>
                                            </div>

                                            <div className="col-6">
                                                <div className="d-flex justify-content-end ">
                                                    <label className="label ml-2 mr-1 p-1 mt-3 text-info font-weight-bold">
                                                        Diagnosis
                                                    </label>
                                                    <div style={{ width: '200px' }} >

                                                        <AsyncSelect
                                                            name='diagnosisName'
                                                            defaultValue={this.state.diagnosisListDistrict}
                                                            loadOptions={this.fetchDiagnosisDistrict}
                                                            placeholder="Diagnosis Name"
                                                            onChange={(e: any) => {
                                                                this.onSearchDiagnosisDistrict(e);
                                                            }}
                                                            defaultOptions={false}
                                                        />
                                                    </div>

                                                </div>

                                                {
                                                    this.state.districtDiagnosisInfo === true ? <div>
                                                        {
                                                            this.state.districtDiagnosisData ? <BarChart diagnosis={this.state.districtDiagnosis} ></BarChart> : <BarChartEmpty></BarChartEmpty>
                                                        }
                                                    </div> : <div style={{ height: '520px' }}> <h2 style={{ position: 'relative', top: '139px', border: '1px solid white', boxShadow: '5px 5px 30px gray', borderRadius: '10px', padding: '90px 20px', color: 'red' }}>{this.state.districtDiagnosisInfoMessage}</h2></div>
                                                }


                                            </div>

                                        </div>
                                    }
                                </div>
                                <div className="ml-3 mt-5 " style={{ border: '1px solid white', boxShadow: '5px 5px 20px gray', borderRadius: '10px', height: '50%' }}>

                                    {
                                        this.state.message === true && <div className="d-flex justify-content-center ">
                                            <div>
                                                <div className="d-flex justify-content-end">
                                                    <label className="label ml-2 mr-1 p-1 mt-3 text-info font-weight-bold">
                                                        Division
                                                    </label>
                                                    <div style={{ width: '200px' }} >

                                                        < Select

                                                            name="division"
                                                            options={this.state.divisionList}
                                                            onChange={this.onSearchDivision}
                                                            defaultInputValue={this.state.divisionName}
                                                            isSearchable={true}
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    {
                                                        this.state.divisionData ? <div style={{ width: '500px' }}>
                                                            <PieChart diagnosis={division} ></PieChart>
                                                        </div>
                                                            : <div style={{ height: '520px', width: '500px' }}> <h2 style={{ position: 'relative', top: '120px', border: '1px solid white', boxShadow: '5px 5px 30px gray', borderRadius: '10px', padding: '90px 20px', color: 'red' }}>{this.state.divisionMessage}</h2></div>
                                                    }
                                                </div>

                                                <div className="d-flex justify-content-center">
                                                    <span className="font-weight-bold text-primary">Division: <span className="font-weight-bold text-warning">{
                                                        this.state.divisionName !== '' ? <span>{this.state.divisionName}</span> : <span>All</span>
                                                    }</span></span>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="d-flex justify-content-end">
                                                    <label className="label ml-2 mr-1 p-1 mt-3 text-info font-weight-bold">
                                                        Diagnosis
                                                    </label>
                                                    <div style={{ width: '200px' }} >

                                                        <AsyncSelect
                                                            name='diagnosisName'
                                                            defaultValue={this.state.diagnosisListDivision}
                                                            loadOptions={this.fetchDiagnosisDivision}
                                                            placeholder="Diagnosis Name"
                                                            onChange={(e: any) => {
                                                                this.onSearchDiagnosisDivision(e);
                                                            }}
                                                            defaultOptions={false}
                                                        />
                                                    </div>
                                                </div>
                                                {
                                                    this.state.divisionDiagnosisInfo === true ? <div>
                                                        {
                                                            this.state.divisionDiagnosisData ? <BarChart diagnosis={this.state.divisionDiagnosis} ></BarChart> : <BarChartEmpty></BarChartEmpty>
                                                        }
                                                    </div> : <div style={{ height: '520px' }}> <h2 style={{ position: 'relative', top: '122px', border: '1px solid white', boxShadow: '5px 5px 30px gray', borderRadius: '10px', padding: '90px 20px', color: 'red' }}>{this.state.divisionDiagnosisInfoMessage}</h2></div>
                                                }
                                            </div>

                                        </div>
                                    }

                                </div>

                            </div>

                        </div> : <div className="d-flex justify-content-center mt-5 ">
                            <h1 style={{ border: '1px solid white', boxShadow: '5px 5px 30px gray', borderRadius: '10px', padding: '20px', color: 'red' }}>{this.state.message}</h1>
                        </div>
                    }
                    <div style={{ height: '100px' }}>

                    </div>
                </div>
            );
        }
    }
}
export default DiagnosisChart;
