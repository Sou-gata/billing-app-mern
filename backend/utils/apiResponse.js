class ApiResponse {
    constructor(statusCode = 200, data = {}, message = "Success") {
        this.message = message;
        this.data = data;
        this.statusCode = statusCode;
        this.success = true;
    }
}

module.exports = ApiResponse;
