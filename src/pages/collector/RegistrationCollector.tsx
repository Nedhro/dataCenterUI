import React from 'react';
import CollectorService from "../../service/CollectorService";
import '../../static/scss/Custom.scss';

// //Bootstrap and jQuery libraries
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'jquery/dist/jquery.min.js';
// //Datatable Modules
// import "datatables.net-dt/js/dataTables.dataTables";
// import "datatables.net-dt/css/jquery.dataTables.min.css";
// import $ from 'jquery';

class RegistrationCollector extends React.Component<any, any>{
    dataConfig : any = {};
    changeHandler = (event: any) => {
        let nam = event.target.name;
        let facilityId = null;
        let startDate ='';
        let endDate ='';
       if(nam === 'facilityId'){
         facilityId = event.target.value;
         this.dataConfig.facilityId = facilityId;
       }
       if(nam === 'startDate'){
         startDate = event.target.value;
         this.dataConfig.startDate = this.formateDate(startDate);
        }
        if(nam === 'endDate'){
         endDate = event.target.value;
         this.dataConfig.endDate = this.formateDate(endDate);
        }
    }

    formateNowDate = (data : any) =>{
        let formattedNowDate ='';
        let date = ("0" + data.getDate()).slice(-2);
        let month = ("0" + (data.getMonth() + 1)).slice(-2);
        let year = data.getFullYear();
        formattedNowDate = month+"-"+date+"-"+year;
        return formattedNowDate;
    }

    formateDate = (data : any) =>{
        let formattedDate ='';
        let dateArray = data.split('-');
        formattedDate = dateArray[1]+"-"+dateArray[2]+"-"+dateArray[0];
        return formattedDate;
    }

    mySubmitHandler = (event: any) => {
        event.preventDefault();
        let facilityId = this.dataConfig.facilityId;
        let startDate = this.dataConfig.startDate;
        let endDate = this.dataConfig.endDate;

        let date_ob = new Date();
        let dateNow = this.formateNowDate(date_ob);

        if (facilityId === null || facilityId === "") {
            this.dataConfig = {
                "facilityId": null,
                "startDate": startDate || dateNow,
                "endDate": endDate || dateNow
            }
            this.getRegData(this.dataConfig);
        }
        if(facilityId !== null && startDate !=='' && endDate !==''){
            this.dataConfig = {
                "facilityId": facilityId,
                "startDate": startDate,
                "endDate": endDate
            }
            this.getRegData(this.dataConfig);
        }

        if(facilityId !== null && startDate ==='' && endDate ===''){
            this.dataConfig = {
                "facilityId": facilityId,
                "startDate": dateNow,
                "endDate": dateNow
            }
            this.getRegData(this.dataConfig);
        }

      }
    timerID: any;

    constructor(props:any) {
        super(props);
        this.state = {
          error: null,
          isLoaded: false,
          items: [],
          totalresult: {}
        };
        this.dataConfig = {
            "facilityId": null,
            "startDate": '',
            "endDate": ''
        };
        this.changeHandler = this.changeHandler.bind(this);
        this.mySubmitHandler = this.mySubmitHandler.bind(this);
        
      }

      componentDidMount(){
        // $(document).ready(function () {
        //   $('#tableData').DataTable();
        // });
        let date_ob = new Date();
        let dateNow = this.formateNowDate(date_ob);
        this.dataConfig = {
            "facilityId": null,
            "startDate": dateNow,
            "endDate": dateNow
        }
        this.getRegData(this.dataConfig);
        this.timerID = setInterval(() => this.getRegData(this.dataConfig), 5*60*1000);  
      }
      componentWillUnmount() {
        clearInterval(this.timerID);
      }
    getRegData(data: any) {
        CollectorService.getAllRegistrationCollectionData(data)
        .then(
            (res): any=>{
                const resultObj = {
                    "opdTotal" : 0,
                    "emergencyTotal": 0,
                    "paidSum": 0,
                    "freeSum": 0,
                    "collectionTotal": 0
                };
                const resultData = res.data.content;
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
            
                this.setState({
                    isLoaded: true,
                    items: res.data.content,
                    totalresult : resultObj
                  });
            },
            (error) =>{
                this.setState({
                    isLoaded: true,
                    error
                  });
            });
    }

    render() {
        const { error, isLoaded, items, totalresult } = this.state;
        if (error) {
          return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
          return <div>Loading...</div>;
        } else {
          return (
        <div className="container-fluid text-center">
            <h3 className="d-inline-block">
                <span className="font-weight-bold">Data Center Dashboard</span>
            </h3>
            <form className="form-inline ml-2" onSubmit={this.mySubmitHandler}>
                <div className="form-group m-0 p-2 filter">
                    <input className="text p-1 text-info" onChange={this.changeHandler} placeholder="Facility Name" type="text" name="facilityId" id="facilityId"/>
                    <label  className="label ml-2 p-1 mr-1 text-info font-weight-bold"> Start Date: </label>
                    <input className="text m-1 p-1" onChange={this.changeHandler} pattern="MM-dd-yyyy" type="date" name="startDate" id="startDate"/>
                    <label  className="label ml-2 mr-1 p-1 text-info font-weight-bold"> End Date: </label>
                    <input className="text m-1 p-1" onChange={this.changeHandler} pattern="MM-dd-yyyy" type="date" name="endDate" id="endDate"/> <br/>
                    <button type="submit" className="btn btn-info font-weight-bold m-2 p-2"> Filter </button>
                </div>
            </form>
            <div className="container-fluid tableReg">
                <table className="table table-bordered table-hover table-sm" id="tableData">
                    <thead>
                        <tr>
                            <th>Facility Name</th>
                            <th>OPD Patients</th>
                            <th>Emergency Patients</th>
                            <th>Free Patients</th>
                            <th>Paid Patients</th>
                            <th>Total Collection</th>
                            <th>Collection Date</th>
                        </tr>
                    </thead>
                    <tbody>
                    {items?.map((i:any) => (
                        <tr key={i.id}>
                            <td>{i.facilityId || 'Not Mentioned'}</td>
                            <td>{i.numberOfOpdPatient || 0}</td>
                            <td>{i.numberOfEmergencyPatient || 0}</td>
                            <td>{i.numberOfPaidPatient || 0}</td>
                            <td>{i.numberOfFreePatient || 0}</td>
                            <td>{i.totalCollection || 0}</td>
                            <td>{i.sentTime || 'Not specified'}</td>
                        </tr>
                        )) || ' **** No Data Available ***'}
                            <tr className="font-weight-bold">
                                <td> Total ::</td>
                                <td> {totalresult.opdTotal}</td>
                                <td> {totalresult.emergencyTotal}</td>
                                <td> {totalresult.paidSum}</td>
                                <td> {totalresult.freeSum}</td>
                                <td> {totalresult.collectionTotal}</td>
                                <td> ***</td>
                            </tr>
                    </tbody>
                </table>
            </div>
        </div>
          );
        }
      }
}
export default RegistrationCollector;
