import {
  createArrendatario,
  getAllArrendatarios,
  getArrendatarioById,
  deleteArrendatario,
  updateArrendatario,
} from "../models/arrendatariosModel.js";
import { arrendatarioSchema } from "../validations/arrendatario.js";
import { z } from "zod";
import { formatFecha } from "../utils/fecha.js";
import { dataBoolean } from "../utils/datosBolean.js";

export const getArrendatariosController = async (req, res) => {
  try {
    const { limit = 10, offset = 0, search = "" } = req.query;

    const { arrendatarios, totalItems } = await getAllArrendatarios(
      limit,
      offset,
      search
    );

    arrendatarios.forEach((arrendatario) => {
      arrendatario.contribuyente_especial = arrendatario.contribuyente_especial
        ? "si"
        : "no";

      arrendatario.tipo_contribuyente =
        arrendatario.tipo_contribuyente || "nulo";

      arrendatario.fecha = formatFecha(arrendatario.fecha);
    });

    const totalPages = Math.ceil(totalItems / limit);

    const currentPage = Math.floor(offset / limit) + 1;

    res.status(200).json({
      arrendatarios,
      currentPage,
      totalPages,
      totalItems,
    });
  } catch (error) {
    console.error("Error al obtener los arrendatarios:", error);
    res.status(500).json({
      message: `Error al obtener los arrendatarios: ${error.message}`,
    });
  }
};
export const getArrendatarioByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    const arrendatario = await getArrendatarioById(id);

    arrendatario.contribuyente_especial = arrendatario.contribuyente_especial
      ? "si"
      : "no";

    arrendatario.tipo_contribuyente =
      arrendatario.tipo_contribuyente === null
        ? "nulo"
        : arrendatario.tipo_contribuyente;

    arrendatario.fecha = formatFecha(arrendatario.fecha);

    res.status(200).json({
      message: "Arrendatario encontrado con éxito",
      arrendatario,
    });
  } catch (error) {
    console.error("Error al obtener el arrendatario:", error);
    res.status(500).json({
      message: `Error al obtener el arrendatario: ${error.message}`,
    });
  }
};
export const createArrendatarioController = async (req, res) => {
  try {
    const {
      razonSocial,
      rif,
      telefono,
      email,
      contribuyenteEspecial,
      tipoContribuyente,
    } = req.body;

    const contribuyenteEspecialBoolean = dataBoolean(contribuyenteEspecial);

    arrendatarioSchema.parse({
      razonSocial,
      rif,
      telefono,
      email,
      contribuyenteEspecial: contribuyenteEspecialBoolean,
      tipoContribuyente,
    });

    if (
      contribuyenteEspecialBoolean &&
      !["ISLR", "IVA", "Ambos"].includes(tipoContribuyente)
    ) {
      return res.status(400).json({
        message:
          "El valor de tipoContribuyente debe ser uno de los siguientes: 'ISLR', 'IVA', 'Ambos', o NULL",
      });
    }

    if (!contribuyenteEspecialBoolean && tipoContribuyente !== null) {
      return res.status(400).json({
        message:
          "Si contribuyenteEspecial es false, tipoContribuyente debe ser null.",
      });
    }

    const newArrendatario = await createArrendatario(
      razonSocial,
      rif,
      telefono,
      email,
      contribuyenteEspecialBoolean,
      tipoContribuyente
    );

    res.status(201).json({
      message: "Arrendatario creado con éxito",
      arrendatario: newArrendatario,
    });
  } catch (error) {
    console.error("Error en el controlador de crear arrendatario:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Datos de arrendatario inválidos",
        errors: error.errors,
      });
    }
    if (
      error.message.includes("duplicate key value violates unique constraint")
    ) {
      return res.status(400).json({
        message: `El RIF ${req.body.rif} ya está registrado en la base de datos.`,
      });
    }
    res.status(400).json({ message: error.message });
  }
};
export const deleteArrendatarioController = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedArrendatario = await deleteArrendatario(id);
    res.status(200).json({
      message: "Arrendatario eliminado con éxito",
      arrendatario: deletedArrendatario,
    });
  } catch (error) {
    console.error("Error al eliminar el arrendatario:", error);
    res.status(500).json({
      message: `Error al eliminar el arrendatario: ${error.message}`,
    });
  }
};
export const updateArrendatarioController = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      razonSocial,
      rif,
      telefono,
      email,
      contribuyenteEspecial,
      tipoContribuyente,
    } = req.body;
    const contribuyenteEspecialBoolean = dataBoolean(contribuyenteEspecial);
    arrendatarioSchema.parse({
      razonSocial,
      rif,
      telefono,
      email,
      contribuyenteEspecial: contribuyenteEspecialBoolean,
      tipoContribuyente,
    });
    if (
      contribuyenteEspecialBoolean &&
      !["ISLR", "IVA", "Ambos"].includes(tipoContribuyente)
    ) {
      return res.status(400).json({
        message:
          "El valor de tipoContribuyente debe ser uno de los siguientes: 'ISLR', 'IVA', 'Ambos', o NULL",
      });
    }
    if (!contribuyenteEspecialBoolean && tipoContribuyente !== null) {
      return res.status(400).json({
        message:
          "Si contribuyenteEspecial es false, tipoContribuyente debe ser null.",
      });
    }
    const updatedArrendatario = await updateArrendatario(id, {
      razonSocial,
      rif,
      telefono,
      email,
      contribuyenteEspecial: contribuyenteEspecialBoolean,
      tipoContribuyente,
    });

    res.status(200).json({
      message: "Arrendatario actualizado con éxito",
      arrendatario: updatedArrendatario,
    });
  } catch (error) {
    console.error("Error en el controlador de actualizar arrendatario:", error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Datos de arrendatario inválidos",
        errors: error.errors,
      });
    }

    if (
      error.message.includes("duplicate key value violates unique constraint")
    ) {
      return res.status(400).json({
        message: `El RIF ${req.body.rif} ya está registrado en la base de datos.`,
      });
    }

    res.status(400).json({ message: error.message });
  }
};
