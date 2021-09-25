import React from "react";
import CollectorService from "../../service/CollectorService";
import "../../static/scss/Custom.scss";
import "../../static/scss/Table.scss";
// import ReactFlexyTable from "react-flexy-table";
import "react-flexy-table/dist/index.css";
// import CoordinateChart from "../charts/CoordinateChart";
// import Select from "react-select";
import AsyncSelect from "react-select/async";
import { toast } from 'react-toastify';
// Import toastify css file
import 'react-toastify/dist/ReactToastify.css';
// toast-configuration method, 
// it is compulsory method.
toast.configure();
class BillingInfo extends React.Component<any, any> {
    dataConfig: any = {};
    timerID: any;
    dataToExport: any;
    changeHandler = (event: any) => {
        let nam = event.target.name;
        // let facilityId = null;
        let department = "";
        let totalAmount = "";
        let date = "";
        // console.log(nam)
        if (nam === "department") {
            department = event.target.value;
            this.dataConfig.department = department;
        }
        if (nam === "totalAmount") {
            totalAmount = event.target.value;
            this.dataConfig.totalAmount = totalAmount;
        }
        if (nam === "date") {
            date = event.target.value;
            this.dataConfig.date = date;
        }
        if (this.state.facilityList !== "") {
            let facilityName = this.state.facilityList;
            this.dataConfig.facilityName = facilityName;
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

    mySubmitHandler = (event: any) => {
        event.preventDefault();
        console.log(this.dataConfig);
        CollectorService.billingData(this.dataConfig.facilityName, this.dataConfig.department, this.dataConfig.date, this.dataConfig.totalAmount).then(
            (res): any => {
                console.log(res.data)
                if (res.data.statusCode === 201) {
                    toast.success(res.data.message, {
                        position: "bottom-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: 'colored'
                    });
                }
                if (res.data.statusCode === 400) {
                    toast.error(res.data.message, {
                        position: "bottom-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: 'colored'
                    });
                }
                // else if (res.data.statusCode === 400) {
                //     this.setState({
                //         facilityData: false,
                //         facilityDataMessage: res.data.message,
                //     });
                // }

            },
            (error) => {
                this.setState({
                    isLoaded: true,
                    error,
                });
            }
        )

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
            facilityList: '',
        };
        this.changeHandler = this.changeHandler.bind(this);
        this.mySubmitHandler = this.mySubmitHandler.bind(this);
    }

    componentDidMount() {

    }
    componentWillUnmount() {
        clearInterval(this.timerID);
    }
    fetchFacility = (inputValue: any, callback: any) => {
        setTimeout(() => {
            CollectorService.getAllFacilityList(inputValue)
                .then((data:any) => {
                    // console.log(data);
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

    };




    render() {
        const {
            // error,
            // isLoaded,
            dateOfToday,
        } = this.state;




        // if (error) {
        //     return (
        //         <div className="text-center font-weight-bold">
        //             Error: {error.message}
        //         </div>
        //     );
        // } else if (!isLoaded) {
        //     return <div className="text-center font-weight-bold">Loading...</div>;
        // } else {
        return (
            <div className="container-fluid">
                <h4
                    className="mb-0 mt-0 pb-0 pt-0"
                    style={{ textAlign: "center", marginTop: 0, marginBottom: 0 }}
                >
                    SHR DASHBOARD
                </h4>
                <br />
                <div className="d-flex justify-content-center mt-5" >
                    <div style={{ textAlign: "center", border: '1px solid white', borderRadius: '20px', boxShadow: '10px 10px 50px gray', width: '25%' }}>
                        <h2 className="text-info mt-3">Billing Info</h2>
                        <br />
                        <form className=" m-0 p-0" onSubmit={this.mySubmitHandler}>
                            <div className="form-group col-12 ml-1 pl-0 filter">

                                <div className="d-flex justify-content-center form-inline">
                                    <label className="label ml-2 p-1 mr-3 text-info font-weight-bold">
                                        Date:
                                    </label>
                                    <input
                                        style={{ width: '237px', height: '55px', position: 'relative', left: '2px' }}
                                        className="text p-1 mr-3"
                                        onChange={this.changeHandler}
                                        pattern="MM-dd-yyyy"
                                        type="date"
                                        name="date"
                                        id="date"
                                        defaultValue={dateOfToday}
                                    />
                                </div>
                                <div className="row form-inline"  >
                                    <label className="label ml-4 p-1 mr-1 text-info font-weight-bold col-3">
                                        Facility Name:
                                    </label>
                                    <div className="col-6">
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
                                    <label className="label ml-2 p-1 mr-1 text-info font-weight-bold">
                                        Department:
                                    </label>
                                    <input
                                        style={{ width: '300px', height: '55px' }}
                                        className="text p-1 ml-2"
                                        onChange={this.changeHandler}
                                        placeholder="Department"
                                        type="text"
                                        name="department"
                                        id="department"
                                    />
                                </div>
                                <div>
                                    <label className="label ml-2 p-1 mr-4 text-info font-weight-bold">
                                        Total Amount:
                                    </label>
                                    <input
                                        style={{ width: '300px', height: '55px', position: 'relative', right: '12px' }}
                                        className="text p-1 "
                                        onChange={this.changeHandler}
                                        placeholder="Total Amount"
                                        type="number"
                                        name="totalAmount"
                                        id="totalAmount"
                                    />
                                </div>
                                <div className="d-flex justify-content-end">

                                    <button
                                        type="submit"
                                        className="btn btn-info font-weight-bold mr-3 px-4"
                                    >
                                        Save
                                    </button>
                                </div>


                            </div>
                        </form>
                    </div>

                </div>


            </div>
        );
        // }
    }
}
export default BillingInfo;
