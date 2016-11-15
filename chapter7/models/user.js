exports.findUsers = (db, callback) => {
  db.collection("userCollection").find({}, (err, cursor) =>{
    cursor.toArray(callback);
  });
};

exports.insertUser = (user, db, callback) => {
  db.collection("userCollection").insertOne( user, (err, result) => {
    callback(err, result);
  });
};
