import pool from "../database/database.js";
import fs from "fs/promises";

const getBests = async (req, res) => {
  let [rows] = await pool.query("select * from legjobbak;");
  return res.status(200).json(rows);
};
const addBest = async (req, res) => {
  const nev = req.body.nev;
  if (!nev) return res.status(400).json({ err: "Meg kell adnia a nevet!" });

  let [row] = await pool.query(`select * from legjobbak where nev = '${nev}'`);
  if (row.length > 0)
    return res
      .status(406)
      .json({ err: "Ez az előadó már hozzá van adva legjobbakhoz!" });

  [row] = await pool.query(`insert into legjobbak (nev) values('${nev}');`);
  if (row.affectedRows > 0)
    return res
      .status(201)
      .json({ msg: "Az előadó sikeresen felkerült a rendszerbe!" });
  return res
    .status(500)
    .json({ err: "Az előadó nem került fel a rendszerbe!" });
};
const deleteBest = async (req, res) => {
  const nev = req.params.nev;
  if (!nev) {
    return res.status(400).json({ err: "Adja meg az előadó nevét!" });
  }
  const [rows] = await pool.query(`delete from legjobbak where nev='${nev}';`);
  if (rows.affectedRows > 0)
    return res.status(202).json({ msg: "A törlés sikeres!" });
  else return res.status(406).json({ msg: "Nem található ilyen előadó!" });
};
const updateBest = async (req, res) => {
  const regi_nev = req.body.regi_nev;
  const uj_nev = req.body.uj_nev;
  if (!regi_nev)
    return res.status(400).json({ err: "Adja meg az előadó régi nevét!" });
  if (!uj_nev)
    return res.status(400).json({ err: "Adja meg az előadó új nevét!" });
  const [rows] = await pool.query(
    `update legjobbak set nev='${uj_nev}' where nev='${regi_nev}';`
  );
  if (rows.affectedRows > 0)
    return res.status(202).json({ msg: "A módosítás sikeres!" });
  else return res.status(406).json({ msg: "Nem található ilyen előadó!" });
};
const bestOfArtists = async (req, res) => {
  let sorok = [];
  const [rows] = await pool.query(
    `select * from zenek where zenek.eloado in (select nev from legjobbak);`
  );
  // if (rows.length > 0) {
  //   for (let i = 0; i < rows.length; i++) {
  //     sorok[i] = {};
  //     sorok[i].id = rows[i].id;
  //     sorok[i].cim = rows[i].cim;
  //     sorok[i].eloado = rows[i].eloado;
  //     sorok[i].mufaj = rows[i].mufaj;
  //     sorok[i].hossz = rows[i].hossz;
  //     sorok[i].kiadas = rows[i].kiadas;
  //     const data = await fs.readFile(rows[i].elokep);
  //     sorok[i].elokep = data.toString("base64");
  //   }
  // }
  // return res.status(200).json(sorok);
  return res.status(200).json(rows);
};

export { getBests, addBest, deleteBest, updateBest, bestOfArtists };
