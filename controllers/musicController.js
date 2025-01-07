import pool from "../database/database.js";
import fs from "fs/promises";

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
  const elokep = req.file;
  if (!cim) return res.status(400).json({ err: "Adja meg a címét!" });
  if (!eloado) return res.status(400).json({ err: "Adja meg az előadót!" });
  if (!mufaj) return res.status(400).json({ err: "Adja meg a műfajt!" });
  if (!hossz)
    return res.status(400).json({ err: "A hossz megadása kötelező!" });
  if (!(await isValidTime(hossz)))
    return res
      .status(400)
      .json({ err: "A hossz formátuma, nem megfelelő(HH:MM:SS)!" });

  if (!kiadas)
    return res.status(400).json("A kiadás idejének megadása kötelező!");
  kiadas = new Date(kiadas);
  if (isNaN(kiadas.getTime()))
    return res.status(400).json({ err: "A kiadás formátuma nem megfelelő!" });
  const kiadas_format = `${kiadas.getFullYear()}.${String(
    kiadas.getMonth() + 1
  ).padStart(2, "0")}.${String(kiadas.getDate()).padStart(2, "0")}`;

  if (!elokep) return res.status(400).json({ err: "Töltse fel az előképet!" });

  let query = `select * from zenek where eloado='${eloado}' and cim='${cim}';`;
  let [rows] = await pool.query(query);
  if (rows.length > 0)
    return res
      .status(406)
      .json({ err: "Már van ilyen előadó, ilyen címmel a rendszerben!" });

  try {
    query = `insert into zenek (cim, eloado, mufaj, hossz, kiadas, elokep) values ('${cim}','${eloado}','${mufaj}','${hossz}',STR_TO_DATE('${kiadas_format}', '%Y.%m.%d'),'${elokep.path}');`;
    [rows] = await pool.query(query);
    if (rows.affectedRows > 0) {
      return res.status(201).json({ msg: "Sikeresen felkerült a rendszerbe!" });
    } else return res.status(500).json({ err: "A létrehozás sikertelen!" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err: "A létrehozás sikertelen!" });
  }
};

const getMusic = async (req, res) => {
  let query = "select id, cim,eloado,mufaj,hossz,kiadas,elokep from zenek";
  let [rows] = await pool.query(query);
  return res.status(200).json(rows);
};

const deleteMusic = async (req, res) => {
  const zene_id = parseInt(req.params.id);
  if (!zene_id) {
    return res.status(400).json({ err: "Adja meg a zene id-jét!" });
  }
  if (!Number.isInteger(zene_id)) {
    return res.status(400).json({ err: "Az id legyen egész szám!" });
  }
  let query = `select elokep from zenek where id='${zene_id}'`;
  let [rows] = await pool.query(query);
  if (rows.length > 0) {
    try {
      fs.unlink(rows[0].elokep, (err) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ err: "Hiba a fájl törlésekor!" });
        }
      });
    } catch (err) {
      console.log(err);
    }
  }

  query = `delete from zenek where id = '${zene_id}';`;
  [rows] = await pool.query(query);
  if (rows.affectedRows > 0) {
    return res.status(200).json({ msg: "A törlés sikeres!" });
  }
  return res.status(406).json({ err: "Nem található zene a megadott id-vel!" });
};

const update_zene = async (id, adat, ertek) => {
  try {
    const query = `update zenek set ${adat} = '${ertek}' where id = '${id}';`;
    const [rows] = await pool.query(query);
    return rows.affectedRows > 0;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const updateMusic = async (req, res) => {
  const zene_id = req.body.id;
  const cim = req.body.cim;
  const eloado = req.body.eloado;
  const mufaj = req.body.mufaj;
  const hossz = req.body.hossz;
  let kiadas = req.body.kiadas;
  const elokep = req.file;
  let update;
  let eredmenyek = [];

  if (!zene_id) {
    return res.status(400).json({ err: "Adja meg a zene id-jét!" });
  }
  let [elozo] = await pool.query(
    `select eloado, cim, elokep from zenek where id='${zene_id}';`
  );
  if (elozo.length == 0)
    return res.status(406).json({ err: "Nincs zene a megadott id-vel!" });
  console.log(`Az előző út: ${elozo[0].elokep}`);

  if (cim !== undefined && cim != "") {
    update = update_zene(zene_id, "cim", cim);
    if (update) {
      eredmenyek.push("A cím frissítése sikeres!");
    } else eredmenyek.push("A címet nem sikerült frissíteni!");
  }

  if (eloado !== undefined && eloado != "") {
    update = update_zene(zene_id, "eloado", eloado);
    if (update) {
      eredmenyek.push("Az előadó frissítése sikeres!");
    } else eredmenyek.push("Az előadót nem sikerült frissíteni!");
  }

  if (mufaj !== undefined && mufaj != "") {
    update = update_zene(zene_id, "mufaj", mufaj);
    if (update) eredmenyek.push("A műfaj frissítése sikeres!");
    else eredmenyek.push("A műfajt nem sikerült frissíteni!");
  }
  if (hossz !== undefined && hossz != "" && isValidTime(hossz)) {
    update = update_zene(zene_id, "hossz", hossz);
    if (update) eredmenyek.push("A hossz frissítése sikeres!");
    else eredmenyek.push("A hosszt nem sikerült frissíteni!");
  }

  if (kiadas !== undefined && kiadas != "") {
    kiadas = new Date(kiadas);
    if (isNaN(kiadas.getTime()))
      eredmenyek.push("A kiadás típusa nem megfelelő, nem lesz frissítve!");
    else {
      const kiadas_format = `${kiadas.getFullYear()}.${String(
        kiadas.getMonth() + 1
      ).padStart(2, "0")}.${String(kiadas.getDate()).padStart(2, "0")}`;
      update = update_zene(zene_id, "kiadas", kiadas_format);
      if (update) eredmenyek.push("A kiadás frissítése sikeres!");
      else eredmenyek.push("A kiadást nem sikerült frissíteni!");
    }
  }

  if (elokep !== undefined) {
    try {
      fs.unlink(elozo[0].elokep, (err) => {
        if (err) {
          console.log(err);
          return res.status(500).json("Hiba a fájl törlésekor!");
        }
      });
      const [rows] = await pool.query(
        `update zenek set elokep='${elokep.path}' where id='${zene_id}';`
      );
      if (rows.affectedRows > 0)
        eredmenyek.push("Az előkép frissítése sikeres!");
      else eredmenyek.push("Az előképet nem sikerült frissíteni!");
    } catch (err) {
      console.log(err);
      eredmenyek.push("Az előképet nem sikerült frissíteni!");
    }
  }

  return res.status(201).json(eredmenyek);
};

export { addMusic, getMusic, deleteMusic, updateMusic };
