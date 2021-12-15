const MongoClient = require("mongodb").MongoClient;
const settings = require("./settings.json");
const mongoConfig = settings.mongoConfig;

let _connection = undefined;
let _db = undefined;

module.exports = async () => {
	if (!_connection) {
		_connection = await MongoClient.connect(process.env.MONGODB_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		_db = await _connection.db(mongoConfig.database);
	}
	return _db;
};
