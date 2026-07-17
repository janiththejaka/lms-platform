class HealthService {
  getHealthStatus() {
    return {
      success: true,
      message: "LMS API is running successfully",
    };
  }
}

export default new HealthService();