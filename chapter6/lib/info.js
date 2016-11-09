exports.getInfo = function() {
  return  {
    authors: [
      {
        name: "Arthur Dent",
        occupation: "Sandwichmaker",
        location: "England",
      },
      {
        name: "Ford Prefect",
        occupation: "Reporter",
        location: "Betelgeuse",
      },
      {
        name: "Zaphod Beeblebrox",
        occupation: "President",
        location: "Galaxy",
      }
    ]
  };
};

exports.getRandomUser = function() {
  var users = exports.getInfo().authors;
  return users[Math.floor(Math.random() * users.length)];
}
