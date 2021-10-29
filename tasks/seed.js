const connection = require("../config/mongoConnection");
const users = require("../data/users");

async function main() {
  const db = await connection();
  await db.dropDatabase();
  try {
    const user1 = await users.create(
      "Michael",
      "Jordan",
      "mj@gmail.com",
      "646-904-1998",
      "michael23",
      "10/29/1990",
      "male",
      "/pathtoimage",
      {
        streetAddress: "170 NY street",
        city: "New York",
        state: "NY",
        zip: "11220",
      },
      "thisisapassword",
      "My name is Michael! Hey!"
    );
    console.log(user1);
  } catch (e) {
    console.log(e);
  }
  console.log("Done seeding database");
  await db.s.client.close();
}

main();
