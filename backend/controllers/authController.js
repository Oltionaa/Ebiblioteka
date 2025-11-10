import AuthService from "../services/authService.js";

class AuthController {
  static async register(req, res) {
    try {
      const result = await AuthService.register(req.body);
      res.status(201).json(result);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  static async login(req, res) {
    try {
      const result = await AuthService.login(req.body);
      res.status(200).json(result);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
}

export { AuthController };