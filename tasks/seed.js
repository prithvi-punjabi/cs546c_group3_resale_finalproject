const connection = require("../config/mongoConnection");
const users = require("../data/users");
const products = require("../data/products");
const comments = require("../data/comments");
const testimonials = require("../data/testimonials");

//Important: Do not pass a hashed password to the create function, the password hashing takes place before insertion

async function main() {
  const db = await connection();
  await db.dropDatabase();
  try {
    const michael = await users.create(
      "Michael",
      "Jordan",
      "prithvidais@gmail.com",
      "646-904-1998",
      "michael.jordan",
      "10/29/1990",
      "male",
      "/public/uploads/michael.jpeg",
      {
        streetAddress: "170 NY st",
        city: "New York",
        state: "NY",
        zip: "11220",
      },
      "michael.jordan",
      "My name is Michael! Hey!"
    );
    const iron_man = await users.create(
      "Iron",
      "Man",
      "iron.man@gmail.com",
      "555-444-3333",
      "iron.man",
      "10/10/1989",
      "male",
      "/public/uploads/ironman.png",
      {
        streetAddress: "65 Willow Ave",
        city: "Jersey City",
        state: "NJ",
        zip: "07307",
      },
      "iron.man",
      "Hell yeah it's me! Captain America sucks, re$ale rules! PS. I am iron man."
    );

    const john = await users.create(
      "John",
      "Doe",
      "john.doe@gmail.com",
      "551-904-1998",
      "john.doe",
      "11/28/1993",
      "male",
      "/public/uploads/johndoe.png",
      {
        streetAddress: "15w 47 st",
        city: "New York",
        state: "NY",
        zip: "11225",
      },
      "john.doe",
      "I am John Doe. People use me for testing."
    );

    const ariana = await users.create(
      "Ariana",
      "Grande",
      "ariana.grande@gmail.com",
      "201-904-1998",
      "ariana.grande",
      "06/26/1994",
      "female",
      "/public/uploads/ariana.png",
      {
        streetAddress: "150 Paterson st",
        city: "New Brunswick",
        state: "NJ",
        zip: "08901",
      },
      "ariana.grande",
      "No bio needed. Everyone knows me. Obviously, I'm the best!"
    );

    const ronaldo = await users.create(
      "Cristiano",
      "Ronaldo",
      "ronaldo.christiano@gmail.com",
      "545-305-3987",
      "cristiano.ronaldo",
      "05/03/1993",
      "male",
      "/public/uploads/ronaldo.png",
      {
        streetAddress: "164 North Ave",
        city: "Hoboken",
        state: "NJ",
        zip: "07307",
      },
      "cristiano.ronaldo",
      "Manchester United -> Real Madrid -> Juventus -> re$ale"
    );

    const alexandra = await users.create(
      "Alexandra",
      "Daddario",
      "alexadra.daddario@gmail.com",
      "874-345-6543",
      "alexandra.daddario",
      "03/16/1990",
      "female",
      "/public/uploads/alexandra.png",
      {
        streetAddress: "14th St Bloomfield St",
        city: "Hoboken",
        state: "NJ",
        zip: "07030",
      },
      "alexandra.daddario",
      "Actress, activist, baywatcher."
    );

    const william = await users.create(
      "William",
      "Shatner",
      "william.shatner@gmail.com",
      "646-904-5886",
      "william.shatner",
      "03/16/1986",
      "male",
      "/public/uploads/william.png",
      {
        streetAddress: "14th st",
        city: "Hoboken",
        state: "NJ",
        zip: "07307",
      },
      "william.shatner",
      "Actor, I was on star wars guys. Also, Boston Legal, I loved that show."
    );

    const patrick = await users.create(
      "Patrick",
      "Hill",
      "patrick.hill@gmail.com",
      "646-904-1223",
      "patrick.hill",
      "05/09/1975",
      "male",
      "/public/uploads/patrick.jpeg",
      {
        streetAddress: "1 Castle Point terrace",
        city: "Hoboken",
        state: "NJ",
        zip: "07030",
      },
      "patrick.hill",
      "I love coffee, prettier.formatting and js. I hate css. I also love re$ale, here's a 100"
    );

    const blender = await products.create(
      "Blender",
      ["Kitchenware", "Electronics"],
      ["Blender", "Mixer"],
      100,
      michael._id,
      [
        "/public/uploads/blender1.jpg",
        "/public/uploads/blender2.jpeg",
        "/public/uploads/blender3.jpeg",
      ],
      "Working blender. I cut myself with this and so I'm selling this shit",
      michael.address,
      "Available",
      "Barely Used",
      "10/20/2021"
    );

    const keyboard = await products.create(
      "Keyboard",
      ["Electronics", "Office and Supplies"],
      ["Keyboard", "Computer Accessories"],
      50,
      michael._id,
      [
        "/public/uploads/keyboard.jpg",
        "/public/uploads/keyboard2.jpeg",
      ],
      "Old keyboard. I've used it for many years and still working fine.",
      michael.address,
      "Available",
      "Fairly Used",
      "06/09/2019"
    );

    const bike = await products.create(
      "Electric Bicycle",
      ["Electronics", "Other"],
      ["Cycle", "E-bike"],
      300,
      iron_man._id,
      [
        "/public/uploads/bicycle1.jpeg",
        "/public/uploads/bicycle2.jpeg",
        "/public/uploads/bicycle3.png",
      ],
      "Electric bike with upto 40 MPH speed. Used around 1 year and it's in very good condition. I just fly around now, so I dont need it!",
      iron_man.address,
      "Available",
      "Barely Used",
      "11/21/2021"
    );

    const monitor = await products.create(
      `Dell 19" Monitor`,
      ["Electronics", "Office and Supplies"],
      ["Extended Monitor", "Desktop"],
      70,
      iron_man._id,
      [
        "/public/uploads/monitor.jpg",
        "/public/uploads/monitor2.jpeg",
      ],
      "Dell 19 inch Monitor. Model No - 39487595439",
      iron_man.address,
      "Available",
      "Fairly Used",
      "11/21/2021"
    );

    const chair = await products.create(
      "Chair",
      ["Furniture", "Household"],
      ["King Chair", "Dining Chair"],
      600,
      john._id,
      [
        "/public/uploads/chair1.jpg",
        "/public/uploads/chair2.jpg",
        "/public/uploads/chair3.jpg",
      ],
      "This royal chair is more like a throne. Sitting on it will make you feel like a king!",
      john.address,
      "Available",
      "New",
      "04/14/2020"
    );

    const printer = await products.create(
      "HP Printer",
      ["Electronics", "Office and Supplies"],
      ["Printer", "Inkjet"],
      150,
      john._id,
      [
        "/public/uploads/printer1.jpg",
        "/public/uploads/printer2.jpg",
        "/public/uploads/printer3.jpg",
      ],
      "Great printer, relatively new. Value for money! I'd buy it asap if I were you.",
      john.address,
      "Available",
      "Barely Used",
      "06/20/2020"
    );

    const table = await products.create(
      "Bedside Table",
      ["Household", "Storage", "Furniture"],
      ["Nightstand", "Table", "Bedroom"],
      39,
      john._id,
      [
        "/public/uploads/table1.jpg",
        "/public/uploads/table2.jpg",
        "/public/uploads/table3.jpg",
      ],
      "Great printer, relatively new. Value for money! I'd buy it asap if I were you.",
      john.address,
      "Available",
      "Fairly Used",
      "06/20/2021"
    );
    
    const shoes = await products.create(
      "Air Jordans",
      ["Footwear"],
      ["Shoes", "Nike", "Jordans"],
      160,
      ronaldo._id,
      [
        "/public/uploads/jordan1.jpeg",
        "/public/uploads/jordan2.jpeg",
      ],
      "Man I love these shoes! Just upgraded to the chicago's though, so selling the university blues at a great price.",
      ronaldo.address,
      "Available",
      "Barely Used",
      "03/05/2021"
    );

    const tshirt = await products.create(
      "Supreme t-shirt",
      ["Clothing"],
      ["Supreme", "Tshirt", "Luxury"],
      300,
      ariana._id,
      [
        "/public/uploads/supreme1.jpeg",
        "/public/uploads/supreme2.jpeg",
      ],
      "Great tshirt, in good shape. I've worn it quite it a bit though, hehe.",
      ariana.address,
      "Available",
      "Fairly Used",
      "11/11/2021"
    );

    const knives = await products.create(
      "Knife set",
      ["Kitchenware"],
      ["Knives", "Metal", "Wood"],
      199,
      alexandra._id,
      [
        "/public/uploads/knives1.jpg",
        "/public/uploads/knives2.jpg",
      ],
      "Great set of knives, just got them as a gift. Already have nice ones, so selling these.",
      alexandra.address,
      "Available",
      "New",
      "04/29/2020"
    );

    const book = await products.create(
      "JavaScript Book",
      ["Books"],
      ["Javscript", "Web", "Programming"],
      25,
      patrick._id,
      [
        "/public/uploads/js1.jpeg",
        "/public/uploads/js2.jpeg",
      ],
      "Great book! It's where I learned from. And now I teach, so it is a great book.",
      patrick.address,
      "Available",
      "Fairly Used",
      "10/22/2021"
    );

    const hdmi = await products.create(
      "HDMI Wire",
      ["Electronics", "Office and Supplies"],
      ["HDMI", "Wire", "Connector"],
      19,
      patrick._id,
      [
        "/public/uploads/hdmi1.jpg",
        "/public/uploads/hdmi2.jpg",
      ],
      "Great HDMI wire, just got a new one so selling this. Very low latency.",
      patrick.address,
      "Available",
      "Fairly Used",
      "08/17/2020"
    );

    const mouse = await products.create(
      "Mouse",
      ["Electronics", "Office and Supplies"],
      ["Mouse", "Bluetooth"],
      40,
      patrick._id,
      [
        "/public/uploads/mouse1.jpg",
        "/public/uploads/mouse2.jpg",
        "/public/uploads/mouse3.jpg",
      ],
      "Got a new mouse on black friday, and a friend gifted me one too. Selling this at 50% off.",
      patrick.address,
      "Available",
      "New",
      "09/09/2021"
    );

    const china = await products.create(
      "Fancy China",
      ["Kitchenware"],
      ["Bowls", "Cups", "Plates"],
      500,
      ariana._id,
      [
        "/public/uploads/china1.jpg",
        "/public/uploads/china2.jpg",
      ],
      "Beautiful china set, looks great and royal. It's quite old, but in perfect condition.",
      ariana.address,
      "Available",
      "Barely Used",
      "01/13/2020"
    );

    const funko = await products.create(
      "Kirk Funko Pop",
      ["Other"],
      ["Star Trek", "Funko Pop", "Fun"],
      50,
      william._id,
      [
        "/public/uploads/funko3.jpg",
        "/public/uploads/funko1.jpg",
      ],
      "Amazing star-trek funko pop. It's from my personal collection. Limited edition, great price.",
      william.address,
      "Available",
      "New",
      "12/01/2021"
    );

    await comments.create(
      blender._id.toString(),
      iron_man._id,
      "Nice! I wanna buy it, paint it red and use it!"
    );

    await comments.create(
      blender._id.toString(),
      john._id,
      "Damn! Good product, good price. Can I buy it?"
    );

    await comments.create(
      keyboard._id.toString(),
      patrick._id,
      "Need this! Can you give me a better rate?"
    );

    await comments.create(
      bike._id.toString(),
      william._id,
      "Hmm, an iron man hand-me-down. Count me in!"
    );

    await comments.create(
      bike._id.toString(),
      alexandra._id,
      "Need this! Sick of driving my bentley everywhere."
    );

    await comments.create(
      monitor._id.toString(),
      patrick._id,
      "Need this to test my apps. I want it."
    );

    await comments.create(
      monitor._id.toString(),
      ariana._id,
      "Can I used this monitor for karaoke?"
    );

    await comments.create(
      chair._id.toString(),
      william._id,
      "Finally a chair worthy of my behind."
    );

    await comments.create(
      printer._id.toString(),
      michael._id,
      "Looks great! Will email you to negotiate further."
    );

    await comments.create(
      printer._id.toString(),
      ronaldo._id,
      "Can it print me a Ballon d'Or?"
    );

    await comments.create(
      shoes._id.toString(),
      michael._id,
      "Oh man, these are named after me! WANT!"
    );

    await comments.create(
      shoes._id.toString(),
      alexandra._id,
      "Great shoes! I have the mochas. I want these!"
    );

    await comments.create(
      tshirt._id.toString(),
      ronaldo._id,
      "I love supreme! I have the cross, want the box."
    );

    await comments.create(
      knives._id.toString(),
      william._id,
      "Wow what shiney knives! I feel like cutting an apple."
    );

    await comments.create(
      book._id.toString(),
      john._id,
      "Man, if Prof. Hill says its a good book, I want it."
    );

    await comments.create(
      book._id.toString(),
      ariana._id,
      "Get in line John, I need to set up my tour website, need this book!"
    );

    await comments.create(
      funko._id.toString(),
      patrick._id,
      "I need this for my collection!!!"
    );

    await comments.create(
      funko._id.toString(),
      john._id,
      "Ah, Star Trek, the good old days."
    );

    await comments.create(
      hdmi._id.toString(),
      alexandra._id,
      "That's a good looking mouse! I need a new one."
    );

    await comments.create(
      mouse._id.toString(),
      michael._id,
      "Bluetooth? I'm confused, where's the wire?"
    );

    await comments.create(
      hdmi._id.toString(),
      iron_man._id,
      "Just what I need to complete my desk setup!"
    );

    await comments.create(
      china._id.toString(),
      william._id,
      "Man this looks just like my wedding china!"
    );

    await comments.create(
      china._id.toString(),
      alexandra._id,
      "Wow, these are gorgeous. But so expensive!"
    );

    await testimonials.create(
      ronaldo._id.toString(),
      ronaldo.profilePicture,
      ronaldo.firstName + " " + ronaldo.lastName,
      "Dude what a BRILLIANT website. Always blows my mind how the creators can be so thorough!"
    );

    await testimonials.create(
      john._id.toString(),
      john.profilePicture,
      john.firstName + " " + john.lastName,
      "Wow I love this website so so so so much!"
    );

    await testimonials.create(
      ariana._id.toString(),
      ariana.profilePicture,
      ariana.firstName + " " + ariana.lastName,
      "This is genuinely my most favorite shopping website EVER! It's way better than amazon etc. re$ale has a clear purpose, and it delivers an exceptional platform and product."
    );

    await testimonials.create(
      iron_man._id.toString(),
      iron_man.profilePicture,
      iron_man.firstName + " " + iron_man.lastName,
      "Man, this is my most favourite site ever. Sometimes I just go on here and look at stuff for fun. re$ale, I love you 3000."
    );

    await testimonials.create(
      patrick._id.toString(),
      patrick.profilePicture,
      patrick.firstName + " " + patrick.lastName,
      "Wow, What a great job you guys have done with re$ale. I wish I could give this website 200/100. I thoroughly enjoyed using it."
    );

    await users.rateUser(michael._id, 5, ariana._id);
    await users.rateUser(patrick._id, 4, john._id);
    await users.rateUser(patrick._id, 5, alexandra._id);
    await users.rateUser(ronaldo._id, 3, william._id);
    await users.rateUser(william._id, 4, iron_man._id);
    await users.rateUser(iron_man._id, 5, patrick._id);
    await users.rateUser(iron_man._id, 2, john._id);
    await users.rateUser(ariana._id, 3, patrick._id);
    await users.rateUser(ronaldo._id, 5, alexandra._id);
    await users.rateUser(ariana._id, 4, michael._id);

  } catch (e) {
    console.log(e);
  }
  console.log("Done seeding database");
  await db.s.client.close();
}

main();
