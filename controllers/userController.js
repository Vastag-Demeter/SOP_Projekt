import pool from "../database/database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const register = async (req, res) => {
  const email = req.body.email;
  const nev = req.body.nev;
  let jelszo = req.body.jelszo;

  if (!email || !nev || !jelszo) {
    return res
      .status(406)
      .json({ err: "Nincs minden adat megadva a regisztrációhoz!" });
  }

  let query = `select * from felhasznalok where email = ?;`;

  let [rows] = await pool.query(query, [email]);
  if (rows.length > 0)
    return res
      .status(406)
      .json({ err: "Már van ilyen email címmel regisztrált felhasználó!" });

  jelszo = await bcrypt.hash(jelszo, 10);
  query = `insert into felhasznalok (email, nev, jelszo) values ('${email}','${nev}','${jelszo}')`;

  [rows] = await pool.query(query);
  if (rows.affectedRows > 0)
    return res.status(201).json({ msg: "A regisztráció sikeres!" });
  else return res.status(500).json({ err: "A regisztrráció sikertelen!" });
};

const login = async (req, res) => {
  const email = req.body.email;
  const jelszo = req.body.jelszo;

  if (!email || !jelszo)
    return res.status(406).json({ err: "Minden adatot meg kell adni!" });

  const query = `select * from felhasznalok where email = '${email}'`;
  let [rows] = await pool.query(query);
  if (rows.length == 0)
    return res
      .status(400)
      .json({ err: "Nem található felhasználó a megadott email címmel!" });

  if (!(await bcrypt.compare(jelszo, rows[0].jelszo)))
    return res.status(400).json({ err: "A jelszó nem megfelelő!" });

  const user = { name: rows[0].nev };
  const token = await jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "30m",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 30,
  });
  console.log(`User ${user.name} has logged in!`);
  res.status(200).json({ msg: token });
};

const logout = async (req, res) => {
  res.cookie("jwt", "", { maxAge: 0 });
  console.log(`${req.user.name} has signed out!`);
  return res.status(202).json({ msg: "Token törölve!" });
};

export { register, login, logout };
