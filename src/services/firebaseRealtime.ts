import { ref, set, get, update } from "firebase/database";
import { uid } from "uid";
import { db } from "./firebase";
import { GAME_VARIANT } from "../components/utils/constants";

function getDB() {
  return db;
}

async function setUser(username: string, user: any) {
  var u = uid(16);
  localStorage.setItem("uid", u);
  localStorage.setItem("user", username);

  await set(ref(db, GAME_VARIANT + "users/" + u), user);

  return u;
}

const getUsers = async () => {
  return await get(ref(db, GAME_VARIANT + "users/"));
};

const getUserByUid = async (uid: any) => {
  return await get(ref(db, GAME_VARIANT + "users/" + uid));
};

async function updateUserByUid(uid: any, score: any) {
  await update(ref(db, GAME_VARIANT + "users/" + uid), {
    score: score,
    timestamp: new Date().getTime(),
  });
}

export {
  getDB,
  setUser,
  getUsers,
  getUserByUid,
  updateUserByUid
};
