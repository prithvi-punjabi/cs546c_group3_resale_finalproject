const moment = require("moment");
const { ObjectId } = require("mongodb");

module.exports = {
	checkNonNull() {
		for (let i = 0; i < arguments.length; i++) {
			const val = arguments[i];
			if (val == null) throw `A field is either null or not passed`; //used == to also consider undefined values
		}
	},

	checkNumber(num, varName) {
		if (varName == null) varName = "Parameter";
		if (num == null) throw `Must pass ${varName}`;
		num = parseFloat(num);
		if (isNaN(num)) throw `${varName} must be a number`;
	},

	checkString(str, varName) {
		if (!varName) varName = "Parameter";
		if (str == null) throw `Must pass ${varName}`;
		if (typeof str !== "string") throw `${varName} must be a string`;
		if (str.trim().length == 0)
			throw `${varName} must not be just empty spaces`;
	},

	checkPassword(str) {
		this.checkString(str, "Password");
		const regEx =
			/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/g;
		if (!str.match(regEx))
			throw `Password must contain at least one upper, one lower, one special character and one number`;
	},

	checkPhoneNumber(phone) {
		if (phone == null) throw `Must pass phone number`;
		const regEx = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/g;
		if (!phone.match(regEx)) throw `Invalid phone number`;
	},

	checkEmail(email) {
		if (email == null) throw `Must pass email address`;
		let regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/g;
		if (!email.match(regex)) throw `Invalid email address`;
	},

	checkDate(date, varName) {
		if (varName == null) varName = "Date";
		if (!moment(date, "MM/DD/YYYY").isValid())
			throw `Invalid ${varName} (Required format: MM/DD/YYYY)`;
	},

	checkDesignation(designation) {
		if (designation == null) throw `Must pass designation`;
		if (common.designation[designation.toLowerCase()] == null)
			throw `Invalid designation`;
	},

	isValidObject(obj) {
		return typeof obj == "object" && !Array.isArray(obj);
	},

	checkLocation(location) {
		if (!this.isValidObject(location)) {
			throw "Location must be an object";
		}
		this.checkString(location.streetAddress, "location.streetAddress");
		this.checkString(location.city, "location.city");
		this.checkString(location.state, "location.state");
		this.checkString(location.zip, "location.zip");
	},

	isEmptyObject(obj) {
		if (this.isValidObject(obj)) {
			return Object.keys(obj).length == 0;
		}
		return true;
	},

	isValidObjectID(id) {
		if (!ObjectId.isValid(id)) {
			throw `Invalid id: ${id}`;
		}
		return ObjectId(id);
	},

	verifyToken(req, res, next) {
		const authHeader = req.headers.authorization;
		const token = authHeader && authHeader.split(" ")[1];
		if (token == null)
			res.status(401).json(messageUtils.ErrorMessage(`Require Access Token`));

		jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
			if (err)
				res
					.status(403)
					.json(
						messageUtils.ErrorMessage(
							`Access token is either Invalid or Expired`
						)
					);

			req.user = user;
			next();
		});
	},
};
