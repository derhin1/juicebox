const {
  client,
  getAllUsers,
  createUser,
  updateUser,
  createPost,
  updatePost,
  getAllPosts,
  getUserById,
} = require("./index");

async function createInitialUsers() {
  try {
    console.log("Starting to create users...");
    const albert = await createUser({
      username: "albert",
      password: "bertie99",
      name: "Al Bert",
      location: "Sidney, Australia",
    });
    const post1 = await createPost({
      authorId: albert.id,
      title: "Testing Post1",
      content: "Testing",
    });
    const sandra = await createUser({
      username: "sandra",
      password: "2sandy4me",
      name: "Just Sandra",
      location: "Ain't tellin'",
    });
    const post2 = await createPost({
      authorId: sandra.id,
      title: "Testing Post2",
      content: "Testing",
    });
    const glamgal = await createUser({
      username: "glamgal",
      password: "soglam",
      name: "Joshua",
      location: "Upper East Side",
    });
    const post3 = await createPost({
      authorId: glamgal.id,
      title: "Testing Post3",
      content: "Testing",
    });
    console.log(albert);
    console.log("Finished creating users!");
  } catch (error) {
    console.error("error creating users!");
    throw error;
  }
}

async function testDB() {
  try {
    console.log("Starting to test database...");
    const users = await getAllUsers();
    console.log("getAllUsers:", users);

    console.log("Calling updateUser on users[0]");
    const updateUserResult = await updateUser(users[0].id, {
      name: "newname Sogood",
      location: "Lesterville, KY",
    });
    console.log("Result:", updateUserResult);

    console.log("Calling getAllPosts...");
    const posts = await getAllPosts();
    console.log("Posts:", posts);

    console.log("Calling updatePost on posts[0]");
    const updatePostResult = await updatePost(posts[0].id, {
      title: "New Title",
      content: "Updated Content",
    });
    console.log("Result:", updatePostResult);

    console.log("Calling getUserById with 1...");
    const albert = await getUserById(1);
    console.log("Result:", albert);

    console.log("Finished database test!");
  } catch (error) {
    console.error(error);
  }
}

async function dropTables() {
  try {
    console.log("Starting to drop tables...");
    await client.query(`
        DROP TABLE IF EXISTS posts;
        DROP TABLE IF EXISTS users;
        `);
    console.log("Finished dropping tables!");
  } catch (error) {
    throw error;
  }
}

async function createTables() {
  try {
    console.log("Starting to create tables...");
    await client.query(`
        CREATE TABLE users(
            id SERIAL PRIMARY KEY,
            username varchar(255) UNIQUE NOT NULL,
            password varchar(255) NOT NULL,
            name varchar(255) NOT NULL,
            location varchar(255) NOT NULL,
            active boolean DEFAULT true
        );
        `);
    await client.query(`
            CREATE TABLE posts(
                id SERIAL PRIMARY KEY,
                "authorId" INTEGER REFERENCES users(id) NOT NULL,
                title varchar(255) NOT NULL,
                content text NOT NULL,
                active boolean DEFAULT true
            );
        `);
    console.log("Finished creating tables!");
  } catch (error) {
    throw error;
  }
}

// async function createPostsTable() {
//   try {
//     console.log("Starting to create the posts table");
//     await client.query(`
//             CREATE TABLE posts(
//                 id SERIAL PRIMARY KEY,
//                 "authorId" INTEGER REFERENCES users(id) NOT NULL,
//                 title varchar(255) NOT NULL,
//                 content text NOT NULL,
//                 active boolean DEFAULT true
//             );
//         `);
//     console.log("Finished creating the posts table");
//   } catch (error) {
//     throw error;
//   }
// }

async function rebuildDB() {
  try {
    client.connect();
    await dropTables();
    await createTables();
    await createInitialUsers();
    // await createPostsTable();
  } catch (error) {
    console.error(error);
  }
}

rebuildDB()
  .then(testDB)
  .catch(console.error)
  .finally(() => {
    client.end();
  });
