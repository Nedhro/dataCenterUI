import axios from 'axios';

const baseUrl = 'http://localhost:8081';

class CollectorService {

    getAllRegistrationCollectionData(data : Object){
        return axios.post(baseUrl+'/getAllDataByfacilityIdAndDates', data);
    }
    getAllDataByfIdAndDatewithsum(data : Object){
        return axios.post(baseUrl+'/getAllDataByfIdAndDatewithsum', data);
    }
}

export default new CollectorService();