import axios from 'axios';

const baseUrl = 'http://localhost:5984';

class CollectorService {

    getAllRegistrationCollectionData(data: Object) {
        return axios.post(baseUrl + '/getAllDataByfacilityIdAndDates', data);
    }
    getAllDataByfIdAndDatewithsum(data: Object) {
        return axios.post(baseUrl + '/getAllDataByfIdAndDatewithsum', data);
    }
    getAllDiagnosisData(data: Object) {
        return axios.post(baseUrl + '/getAllDiagnosisTotalCountInfoByDate', data);
    }
    billingData(facilityName: any, department: any, date: any, totalAmount: any) {
        return axios.post(baseUrl + '/billingInfo?facilityName=' + facilityName + '&department=' + department + '&date=' + date + '&totalAmount=' + totalAmount);
    }
    getAllDistrictList(data: Object) {
        return axios.get(baseUrl + '/district/' + data);
    }
    getAllDiagnosisList(data: Object) {
        return axios.get(baseUrl + '/diagnosis/' + data);
    }
    getAllFacilityList(data: Object) {
        return axios.get(baseUrl + '/facilityName/' + data);
    }
}

export default new CollectorService();