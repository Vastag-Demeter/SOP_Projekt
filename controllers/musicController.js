import { buffer } from "stream/consumers";
import pool from "../database/database.js";
import fs from "fs";
const isValidTime = async (time) => {
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
  return timeRegex.test(time);
};

const addMusic = async (req, res) => {
  const cim = req.body.cim;
  const eloado = req.body.eloado;
  const mufaj = req.body.mufaj;
  const hossz = req.body.hossz;
  let kiadas = req.body.kiadas;
  const elokep = req.body.elokep;

  if (!cim) return res.status(406).json({ err: "Adja meg a címét!" });
  if (!eloado) return res.status(406).json({ err: "Adja meg az előadót!" });
  if (!mufaj) return res.status(406).json({ err: "Adja meg a műfajt!" });
  if (!hossz)
    return res.status(406).json({ err: "A hossz megadása kötelező!" });
  if (!(await isValidTime(hossz)))
    return res
      .status(406)
      .json({ err: "A hossz formátuma, nem megfelelő(HH:MM:SS)!" });
  if (!kiadas)
    return res.status(406).json("A kiadás idejének megadása kötelező!");
  kiadas = new Date(kiadas);
  if (isNaN(kiadas.getTime()))
    return res.status(406).json({ err: "A kiadás formátuma nem megfelelő!" });

  if (!elokep)
    return res.status(406).json({ err: "Az előkép megadása kötelező!" });

  const base64Data = elokep.replace(/^data:image\/\w+;base64/, "");
  const binaryData = Buffer.from(base64Data, "base64");

  const path = `./elokepek/${eloado}-${cim}.png`;

  try {
    const kiadas_format = `${kiadas.getFullYear()}.${String(
      kiadas.getMonth() + 1
    ).padStart(2, "0")}.${String(kiadas.getDate()).padStart(2, "0")}`;
    fs.writeFile(path, binaryData, (err) => {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .json({ error: "Hiba történt a fájl mentésekor" });
      }
      console.log("A kép mentve lett");
    });

    const query = `insert into zenek (cim, eloado, mufaj, hossz, kiadas, elokep) values ('${cim}','${eloado}','${mufaj}','${hossz}',STR_TO_DATE('${kiadas_format}', '%Y.%m.%d'),'${path}');`;
    let [rows] = await pool.query(query);
    if (rows.affectedRows > 0) {
      return res.status(201).json({ err: "Sikeresen felkerült a rendszerbe!" });
    } else return res.status(500).json({ err: "A létrehozás sikertelen!" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err: "A létrehozás sikertelen!" });
  }
};

const getMusic = async (req, res) => {
  let query = "select id, cim,eloado,mufaj,hossz,kiadas,elokep from zenek";
  let [rows] = await pool.query(query);
  if (rows.length > 0) {
    for (let i = 0; i < rows.length; i++) {
      fs.readFile(rows[i].elokep, (err, data) => {
        if (err) {
          console.log(err);
          return res.status(500).json("Hiba történt az előkép beolvasásakor!");
        }
        rows[i].elokep = data.toString("base64");
        res.send(rows[i]);
      });
    }
    return res.status(200); //.json(rows);
  }
  return res.status(200);
};
export { addMusic, getMusic };
