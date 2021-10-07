import axios from 'axios';

const baseUrl = 'http://192.168.1.118:5984';

class CollectorService {

    getAllRegistrationCollectionData(data: Object) {
        return axios.post(baseUrl + '/getAllDataByfacilityIdAndDates', data);
    }
    getAllDataByfIdAndDatewithsum(data: Object) {
        return axios.post(baseUrl + '/getAllDataByfIdAndDatewithsum', data);
    }
    getAllDistrictList(data: Object) {
        return axios.get(baseUrl + '/district/' + data);
    }
    getAllFacilityList(data: Object) {
        return axios.get(baseUrl + '/facilityName/' + data);
    }
    getAllCard() {
        return axios.get(baseUrl + '/getTotalsForCards');
    }
}

export default new CollectorService();