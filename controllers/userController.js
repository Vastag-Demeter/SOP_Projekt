import pool from "../database/database.js";

const register = async (req, res) => {
  const email = req.body.email;
  const nev = req.body.nev;
  const jelszo = req.body.jelszo;

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
};

export { register, login };
