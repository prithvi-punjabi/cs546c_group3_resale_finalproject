module.exports = {
	ErrorMessage(msg) {
		return {
			status: "Error",
			message: msg,
		};
	},
	SuccessMessage(msg) {
		return {
			status: "Success",
			message: msg,
		};
	},
};
