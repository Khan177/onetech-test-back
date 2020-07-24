const connectionString =
  "mongodb+srv://khanter:ebash@cluster0.eqpta.mongodb.net/onetech?retryWrites=true&w=majority";
exports.connectionString = () => {
  return connectionString;
};
