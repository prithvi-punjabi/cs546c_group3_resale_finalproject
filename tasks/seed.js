const connection = require("../config/mongoConnection");
const users = require("../data/users");

async function main() {
  const db = await connection();
  await db.dropDatabase();

  const user1 = await users.create(
    "Prithvi",
    "Punjabi",
    "prithvi@gmail.com",
    "646-904-0663",
    "prithvi46",
    "06/05/1999",
    "male",
    "/pathtoimage",
    {
      streetAddress: "1220 Hudson Street",
      city: "Hoboken",
      state: "NJ",
      zip: 07030,
    },
    "thisisapassword",
    "My name is Prithvi! Hey!"
  );
  console.log(user1);
  console.log("Done seeding database");
  await db.s.client.close();
}

main();
