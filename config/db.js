const { connect } = require("mongoose");

const connectDB = async () => {
  const { name, port, host } = db.connection;
  const uri = process.env.MONGO_DB_URI;
  const db = await connect(uri);
  console.log(
    `MongoDB connected: db-name: ${name}, PORT: ${port}, host: ${host}`.cyan
  );
};

module.exports = connectDB;
