import axios from "axios";

const baseUrl = "http://localhost:5984";

class CollectorService {
  getAllRegistrationCollectionData(data: Object) {
    return axios.post(baseUrl + "/getAllDataByfacilityIdAndDates", data);
  }
  getAllDataByfIdAndDatewithsum(data: Object) {
    return axios.post(baseUrl + "/getAllDataByfIdAndDatewithsum", data);
  }
  getAllCard() {
    return axios.get(baseUrl + "/getTotalsForCards");
  }
}

export default new CollectorService();
