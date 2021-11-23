const connection = require("../config/mongoConnection");
const users = require("../data/users");
const products = require("../data/products");

//Important: Do not pass a hashed password to the create function, the password hashing takes place before insertion

async function main() {
  const db = await connection();
  await db.dropDatabase();
  try {
    const michael = await users.create(
      "Michael",
      "Jordan",
      "michael.jordan@gmail.com",
      "646-904-1998",
      "michael.jordan",
      "10/29/1990",
      "male",
      "/public/uploads/profile1.png",
      {
        streetAddress: "170 NY st",
        city: "New York",
        state: "NY",
        zip: "11220",
      },
      "thisisapassword",
      "My name is Michael! Hey!"
    );
    await products.create(
      "Blender",
      ["Kitchen", "Tool", "Electronics"],
      ["Blender", "Mixer"],
      100,
      michael._id,
      [
        "/public/uploads/blender.jpg",
        "/public/uploads/blender.jpg",
        "/public/uploads/blender.jpg",
      ],
      "Working blender. I cut myself with this and so I'm selling this shit",
      michael.address,
      "Available",
      "Barely Used",
      "10/20/2021"
    );
  } catch (e) {
    console.log(e);
  }

  try {
    const john = await users.create(
      "John",
      "Doe",
      "john.doe@gmail.com",
      "551-904-1998",
      "john.doe",
      "11/28/1993",
      "male",
      "/public/uploads/profile4.png",
      {
        streetAddress: "15w 47 st",
        city: "New York",
        state: "NY",
        zip: "11225",
      },
      "mahpasswordmahrules",
      "I am John Doe. People use me for testing."
    );

    await products.create(
      "Chair",
      ["Furniture", "Chair"],
      ["King Chair", "Dining Chair"],
      210,
      john._id,
      [
        "/public/uploads/chair1.jpg",
        "/public/uploads/chair1.jpg",
        "/public/uploads/chair1.jpg",
      ],
      "KING CHAIR. If you sit on this, you'll feel like sitting on throne and ruling 7 kingdom",
      john.address,
      "Available",
      "Not Used",
      "04/14/2020"
    );
  } catch (e) {
    console.log(e);
  }

  try {
    const ariana = await users.create(
      "Ariana",
      "Grande",
      "ariana.grande@gmail.com",
      "201-904-1998",
      "ariana.grande",
      "06/26/1993",
      "female",
      "/public/uploads/profile2.png",
      {
        streetAddress: "150 Paterson st",
        city: "New York",
        state: "NY",
        zip: "16220",
      },
      "female",
      "No bio needed. Everyone knows me."
    );

    await products.create(
      "Keyboard",
      ["Electronics", "Accessories"],
      ["Keyboard", "Computer Accessories"],
      50,
      ariana._id,
      [
        "/public/uploads/keyboard.jpg",
        "/public/uploads/keyboard.jpg",
        "/public/uploads/keyboard.jpg",
      ],
      "Old keyboard. I've used it for many years and still working fine.",
      ariana.address,
      "Not Available",
      "Fairly Used",
      "06/09/2019"
    );
  } catch (e) {
    console.log(e);
  }

  try {
    const iron_man = await users.create(
      "Iron",
      "Man",
      "iron.man@gmail.com",
      "555-444-3333",
      "iron.man",
      "10/10/1989",
      "male",
      "/public/uploads/profile5.png",
      {
        streetAddress: "65 Willow Ave",
        city: "Jersey City",
        state: "NJ",
        zip: "07307",
      },
      "iron.man",
      "Love you 3000"
    );

    await products.create(
      `Dell 19" Monitor`,
      ["Electronics", "Accessories", "Desktop", "Monitor"],
      ["Extended Monitor", "Desktop"],
      50,
      iron_man._id,
      [
        "/public/uploads/keyboard.jpg",
        "/public/uploads/keyboard.jpg",
        "/public/uploads/keyboard.jpg",
      ],
      "Dell 19 inch monitor. Model No - 39487595439",
      iron_man.address,
      "Available",
      "Fairly Used",
      "11/21/2021"
    );
  } catch (e) {
    console.log(e);
  }

  try {
    const ronaldo = await users.create(
      "Ronaldo",
      "Christiano",
      "ronaldo.christiano@gmail.com",
      "545-305-3987",
      "ronaldo.christiano",
      "05/03/1995",
      "male",
      "/public/uploads/ronaldo.jpeg",
      {
        streetAddress: "164 North Ave",
        city: "Hoboken",
        state: "NJ",
        zip: "07307",
      },
      "ronaldo.christiano",
      "FOOTBALL is love"
    );

    await products.create(
      `Dell 19" Monitor`,
      ["Electronics", "Accessories", "Desktop", "Monitor"],
      ["Extended Monitor", "Desktop"],
      70,
      ronaldo._id,
      [
        "/public/uploads/monitor.jpg",
        "/public/uploads/monitor.jpg",
        "/public/uploads/monitor.jpg",
      ],
      "Dell 19 inch Monitor. Model No - 39487595439",
      ronaldo.address,
      "Available",
      "Fairly Used",
      "11/21/2021"
    );
  } catch (e) {
    console.log(e);
  }

  try {
    const alexandra = await users.create(
      "Alexandra",
      "Daddario",
      "alexadra.daddario@gmail.com",
      "874-345-6543",
      "alexadra.daddario",
      "03/16/1986",
      "female",
      "/public/uploads/profile4.jpeg",
      {
        streetAddress: "14th st",
        city: "Hoboken",
        state: "NJ",
        zip: "07307",
      },
      "alexadra.daddario",
      "Actress"
    );

    await products.create(
      "Mastering Nodejs",
      ["Books", "Education", "web Programming"],
      ["Programming Book", "Coding Book", "Learn web developement"],
      30,
      alexandra._id,
      [
        "/public/uploads/nodebook.jpg",
        "/public/uploads/nodebook.jpg",
        "/public/uploads/nodebook.jpg",
      ],
      "One of the best book for mastering in nodejs. It has 40 chapters and it covers nearly everything for web development.",
      alexandra.address,
      "Available",
      "Barely Used",
      "10/03/2021"
    );
  } catch (e) {
    console.log(e);
  }

  console.log("Done seeding database");
  await db.s.client.close();
}

main();
