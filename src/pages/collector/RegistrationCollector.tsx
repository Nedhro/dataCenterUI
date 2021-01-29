
import React from "react";
import CollectorService from "../../service/CollectorService";

class RegistrationCollector extends React.Component<any, any>{
    baseUrl = 'http://localhost:8081';
    dataConfig: any= {};

    constructor(props:any) {
        super(props);
        this.state = {
          error: null,
          isLoaded: false,
          items: []
        };
      }

      componentDidMount(){
          this.getRegData();
      }

    getRegData() {
        let date_ob = new Date();
        let date = ("0" + date_ob.getDate()).slice(-2);
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        let year = date_ob.getFullYear();
        let dateNow = month+"-"+date+"-"+year;
        console.log(dateNow.toString());
        this.dataConfig = {
            "facilityId": null,
            "startDate": dateNow,
            "endDate": dateNow
        }
         console.log(JSON.stringify(this.dataConfig))
         
        // const requestOptions = {
        //             body: JSON.stringify(this.dataConfig),
        //             method: 'POST',
        //             headers: { 'Content-Type': 'application/json' }
        // }
        CollectorService.getAllRegistrationCollectionData(this.dataConfig)
        .then(
            (res): any=>{
                console.log(res);
                this.setState({
                    isLoaded: true,
                    items: res.data.content
                  });
            },
            (error) =>{
                this.setState({
                    isLoaded: true,
                    error
                  }); 
            });
    }

    // componentDidMount() {
    //     let date_ob = new Date();
    //     let date = ("0" + date_ob.getDate()).slice(-2);
    //     let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    //     let year = date_ob.getFullYear();
    //     let dateNow = month+"-"+date+"-"+year;
    //     console.log(dateNow);
        
    //     this.dataConfig = {
    //         "startDate": dateNow,
    //         "endDate": dateNow
    //     }
    //     const requestOptions = {
    //         body: JSON.stringify(this.dataConfig),
    //         method: 'GET',
    //         headers: { 'Content-Type': 'application/json' }
    //     }
    //     fetch(this.baseUrl+'/getAllDataByfacilityIdAndDates', requestOptions)
    //       .then(res => res.json())
    //       .then(
    //         (result) => {
    //           this.setState({
    //             isLoaded: true,
    //             items: result.content
    //           });
    //         },
    //         (error) => {
    //           this.setState({
    //             isLoaded: true,
    //             error
    //           });
    //         }
    //       )
    //   }

    render() {
        const { error, isLoaded, items } = this.state;
        if (error) {
          return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
          return <div>Loading...</div>;
        } else {
          return (
        <div className="container">
            <h3>Registration completion table</h3>
            <div className="container">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Facility Id</th>
                            <th>OPD Patients</th>
                            <th>Emergency Patients</th>
                            <th>Total Patients</th>
                            <th>Collected Date</th>
                        </tr>
                    </thead>
                    <tbody>
                    {items.map((i:any) => (
                        <tr key={i.id}>
                            <td>{ i.facilityId || 'Not Mentioned'}</td>
                            <td>{i.numberOfOpdPatient || 0}</td>
                            <td>{i.numberOfEmergencyPatient || 0}</td>
                            <td>{i.totalCollection || 0}</td>
                            <td>{i.sentTime || 'Not specified'}</td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
          );
        }
      }
}

export default RegistrationCollector;