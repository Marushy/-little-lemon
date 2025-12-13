import * as SQLite from "expo-sqlite";

let db = null;

// Initialize and open DB
export const initializeDB = async () => {
  if (db) return db;
  db = await SQLite.openDatabaseAsync("little_lemon.db");
  return db;
};

export const dropMenuTable = async () => {
  if (!db) await initializeDB();
  await db.execAsync("DROP TABLE IF EXISTS menu;");
};

export const createTable = async () => {
  if (!db) await initializeDB();
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS menu (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      description TEXT,
      price TEXT,
      image TEXT,
      category TEXT
    );
  `);
};

export const getMenuItems = async () => {
  if (!db) await initializeDB();
  return await db.getAllAsync("SELECT * FROM menu;");
};

export const saveMenuItems = async (items) => {
  if (!db) await initializeDB();

  let multiStatement = "DELETE FROM menu;\n";

  items.forEach((item) => {
    const title = (item.title ?? "").replace(/'/g, "''");
    const description = (item.description ?? "").replace(/'/g, "''");
    const price = item.price ?? "";
    const image = item.image ?? "";
    const category = item.category ?? "";

    multiStatement += `
      INSERT INTO menu (title, description, price, image, category)
      VALUES ('${title}', '${description}', '${price}', '${image}', '${category}');
    `;
  });

  await db.execAsync(multiStatement);
};

export const getMenuItemsByCategories = async (categories) => {
  if (!db) await initializeDB();

  if (!categories || categories.length === 0) {
    return await getMenuItems();
  }

  const placeholders = categories.map((_) => "?").join(",");
  const sql = `SELECT * FROM menu WHERE category IN (${placeholders});`;

  return await db.getAllAsync(sql, categories);
};

export const getMenuItemsBySearchAndCategories = async (
  searchText,
  categories
) => {
  if (!db) await initializeDB();

  let sql = "SELECT * FROM menu";
  const params = [];

  if (categories?.length) {
    const placeholders = categories.map(() => "?").join(",");
    sql += ` WHERE category IN (${placeholders})`;
    params.push(...categories);
  }

  if (searchText?.trim()) {
    if (params.length) sql += " AND";
    else sql += " WHERE";
    sql += " title LIKE ?";
    params.push(`%${searchText}%`);
  }

  return await db.getAllAsync(sql, params);
};
