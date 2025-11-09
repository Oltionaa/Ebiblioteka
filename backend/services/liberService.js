import Liber from "../models/liber.js";

class LiberService {
  static async searchBooks(criteria) {
    return await Liber.findByCriteria(criteria);
  }

  static async reserveBook(id_liber, id_perdoruesi) {
    return await Liber.reserve(id_liber, id_perdoruesi);
  }
}

export default LiberService;