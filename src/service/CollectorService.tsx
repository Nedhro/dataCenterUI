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
        return axios.post('http://192.168.1.209:5984/getAllDiagnosisTotalCountInfoByDate', data);
    }
}

export default new CollectorService();