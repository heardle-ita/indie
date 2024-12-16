const admin = require("firebase-admin");
const serviceAccount = JSON.parse(process.env.FIREBASE_CRED);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://heardleita-default-rtdb.europe-west1.firebasedatabase.app"
});

const TIME_TO_DELETE = 604800000; // 7 days

// As an admin, the app has access to read and write all data, regardless of Security Rules
const db = admin.database();
const usersRef = db.ref(process.env.GAME_VARIANT + "/users");

// Function to remove all users
const removeOrResetUsers = async () => {
  try {
    const snapshot = await usersRef.once('value');

    // Check if there are users in the database
    if (snapshot.exists()) {
      // Array to store promises for update operations
      const updatePromises = [];
      const actualTime = new Date().getTime();

      snapshot.forEach((userSnapshot) => {
        if (!userSnapshot.val().timestamp || actualTime - userSnapshot.val().timestamp >= TIME_TO_DELETE) {
          // Use remove method to delete the node
          updatePromises.push(usersRef.child(userSnapshot.key).remove());
        } else {
          // Use update method to update the score for specific user
          updatePromises.push(usersRef.child(userSnapshot.key).update({ score: 0 }));
        }
      });

      // Wait for all update promises to complete
      await Promise.all(updatePromises);

      console.log('All users removed or updated successfully.');
    } else {
      console.log('No users to remove.');
    }
  } catch (error) {
    console.error('Error removing users:', error);
  } finally {
    // Exit the script
    process.exit(0);
  }
};

// Call the function to remove all users
removeOrResetUsers();

