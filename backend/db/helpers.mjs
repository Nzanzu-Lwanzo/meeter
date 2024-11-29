import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path, { dirname } from "node:path";

const usersDbFilePath = path.join(
  dirname(fileURLToPath(import.meta.url)),
  "./users.json"
);

export const getAllUsers = async () => {
  const _users = await readFile(usersDbFilePath, { encoding: "utf-8" });
  const users = JSON.parse(_users);

  return users;
};

export const registerUser = async ({ name, id }) => {
  const users = await getAllUsers();

  users.push({
    id,
    name,
  });

  const users_ = JSON.stringify(users);
  await writeFile(usersDbFilePath, users_, { encoding: "utf-8" });

  return;
};

export const getAUser = async (id) => {
  /**@type {Array} */
  const users = await getAllUsers();

  const user = users.find((user) => user.id === id);

  return user;
};

export const deleteAllUsers = async () => {
  try {
    writeFile(usersDbFilePath, JSON.stringify([]), { encoding: "utf-8" });
    return true;
  } catch (e) {
    return false;
  }
};
