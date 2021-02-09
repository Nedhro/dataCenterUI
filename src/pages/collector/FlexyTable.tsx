import React from 'react';
import CollectorService from "../../service/CollectorService";
import '../../static/scss/Custom.scss';
import '../../static/scss/Table.scss';
import ReactFlexyTable from 'react-flexy-table';
import 'react-flexy-table/dist/index.css';

class FlexyTable extends React.Component<any, any>{
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
        console.log(this.dataConfig);
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
        console.log(event.target.value);
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
          totalresult: {},
          column: {}
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
        console.log(JSON.stringify(data))
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

                const datafinal = resultData.map((data : any)=>{
                  let config = {
                      "Facility Name (Id)": data.facilityId || "N/A",
                      "Opd Patients": data.numberOfOpdPatient || 0,
                      "Emergency Patients": data.numberOfEmergencyPatient || 0,
                      "Free Patients": data.numberOfPaidPatient || 0,
                      "Paid Patients": data.numberOfFreePatient || 0,
                      "Total Collection": data.totalCollection || 0,
                      "Collection Date": data.sentTime || "N/A"
                  };
                  return config;
              });
              
                this.setState({
                    isLoaded: true,
                    items: datafinal,
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
      
        const { error, isLoaded, items } = this.state;
        if (error) {
          return <div className="text-center font-weight-bold"> Error: {error.message}</div>;
        } else if (!isLoaded) {
          return <div className="text-center font-weight-bold"> Loading...</div>;
        } else {
          return (
        <div className="container-fluid">
           <h4 className="mb-0 mt-0 pb-0 pt-0" style={{ textAlign: 'center',marginTop:0, marginBottom:0 }}>Data Center Dashboard</h4>
               <form className="form-inline m-0 p-0" onSubmit={this.mySubmitHandler}>
               <div className="form-group mb-0 mt-0 p-2 filter">
                   <input className="text p-1 text-info" onChange={this.changeHandler} placeholder="Facility Name" type="text" name="facilityId" id="facilityId"/>
                   <label  className="label ml-2 p-1 mr-1 text-info font-weight-bold"> Start Date: </label>
                 <input className="text m-1 p-1" onChange={this.changeHandler} pattern="MM-dd-yyyy" type="date" name="startDate" id="startDate"/>
                 <label  className="label ml-2 mr-1 p-1 text-info font-weight-bold"> End Date: </label>
                <input className="text m-1 p-1" onChange={this.changeHandler} pattern="MM-dd-yyyy" type="date" name="endDate" id="endDate"/> <br/>
                 <button type="submit" className="btn btn-info font-weight-bold m-2 p-2"> Filter </button>
              </div>
            </form>
          <ReactFlexyTable 
          className="table table-stripped table-hover table-sm dataCenter"
          data={items} sortable globalSearch showExcelButton/>
        </div>
          );
        }
      }
}
export default FlexyTable;
