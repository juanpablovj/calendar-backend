const { response } = require("express");
const Evento = require("../models/Evento");

const getEvento = async (req, res = response) => {
  const eventos = await Evento.find().populate("user", "name");

  res.status(200).json({
    ok: true,
    msg: eventos,
  });
};

const crearEvento = async (req, res = response) => {
  const evento = new Evento(req.body);

  try {
    evento.user = req.uid;

    const eventoGuardado = await evento.save();

    return res.status(201).json({
      ok: true,
      msg: eventoGuardado,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ ok: false, msg: "Habla con el admin" });
  }
};

const actualizarEvento = async (req, res = response) => {
  const eventoId = req.params.id;
  const { uid } = req;
  try {
    const evento = await Evento.findById(eventoId);
    console.log(evento);

    if (!evento) {
      return res.status(500).json({
        ok: false,
        msg: "Ese id del evento no existe",
      });
    }

    if (evento.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: "No tiene el derecho de editar el evento",
      });
    }

    const nuevoEvento = {
      ...req.body,
      user: uid,
    };

    const eventoActualizado = await Evento.findByIdAndUpdate(
      eventoId,
      nuevoEvento,
      { new: true }
    );

    return res.status(200).json({
      ok: true,
      msg: eventoActualizado,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Hable con el admin",
    });
  }
};

const eliminarEvento = async (req, res = response) => {
  const eventoId = req.params.id;
  const { uid } = req;
  try {
    const evento = await Evento.findById(eventoId);
    console.log(evento);

    if (!evento) {
      return res.status(500).json({
        ok: false,
        msg: "Ese id del evento no existe",
      });
    }

    if (evento.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: "No tiene el derecho de eliminar el evento",
      });
    }

    await Evento.findByIdAndDelete(eventoId);

    return res.status(200).json({
      ok: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      ok: false,
      msg: "Hable con el admin",
    });
  }
};

module.exports = { getEvento, crearEvento, actualizarEvento, eliminarEvento };
