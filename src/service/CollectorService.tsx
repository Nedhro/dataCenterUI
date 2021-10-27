import axios from "axios";

const baseUrl = "http://localhost:5984";

class CollectorService {
  getAllRegistrationCollectionData(data: Object) {
    return axios.post(baseUrl + "/getAllDataByfacilityIdAndDates", data);
  }
  getAllDataByfIdAndDatewithsum(data: Object) {
    return axios.post(baseUrl + "/getAllDataByfIdAndDatewithsum", data);
  }
  getAllCard(data: Object) {
    return axios.post(baseUrl + "/getTotalsForCards", data);
  }
}

export default new CollectorService();
