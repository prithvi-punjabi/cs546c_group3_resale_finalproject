const errorCode = require("./common").errorCode;
const { ObjectId } = require("mongodb");

module.exports = {
	parseObjectId(id, varName) {
		if (varName == null) varName = "Id";
		if (typeof id === "string") {
			try {
				return ObjectId(id.trim());
			} catch (e) {
				const error = new Error(`Invalid ${varName} (${e.message})`);
				error.code = errorCode.BAD_REQUEST;
				throw error;
			}
		}
		return id;
	},
	isEmptyObject(obj) {
		return obj == null || Object.keys(obj).length == 0;
	},
	isEmptyObject(obj) {
		return obj == null || Object.keys(obj).length == 0;
	},
};
