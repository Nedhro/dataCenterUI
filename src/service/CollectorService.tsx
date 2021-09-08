import axios from 'axios';

const baseUrl = 'http://192.168.1.199:5984';

class CollectorService {

    getAllRegistrationCollectionData(data: Object) {
        return axios.post(baseUrl + '/getAllDataByfacilityIdAndDates', data);
    }
    getAllDataByfIdAndDatewithsum(data: Object) {
        return axios.post(baseUrl + '/getAllDataByfIdAndDatewithsum', data);
    }
    getAllDiagnosisData(data: Object) {
        return axios.post('http://192.168.1.118:5984/getAllDiagnosisTotalCountInfoByDate', data);
    }
    billingData(facilityName: any, department: any, date: any, totalAmount: any) {
        return axios.post('http://192.168.1.118:5984/billingInfo?facilityName=' + facilityName + '&department=' + department + '&date=' + date + '&totalAmount=' + totalAmount);
    }
    // getDistrictList() {
    //     return axios.get('http://192.168.1.118:5984/district/nator');
    // }
    // http://192.168.1.118:5984/billingInfo?facilityName=NITOR&department=Radiology&date=05-09-2021&totalAmount=1000
}

export default new CollectorService();