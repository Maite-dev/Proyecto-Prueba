import {
  createEstadoDeCuentaBancario,
  getAllEstadoDeCuentaBancario,
  getEstadoDeCuentaBancarioById,
  updateEstadoDeCuentaBancario,
  deleteEstadoDeCuentaBancario,
} from "../models/estadoDeCuentaBancarioModel.js";

export const create = async (req, res) => {
  try {
    const registros = Array.isArray(req.body) ? req.body : [req.body];

    if (registros.length === 0 || !registros[0]) {
      return res.status(400).json({
        message: "El array de registros está vacío o no contiene datos válidos",
      });
    }

    const data = await createEstadoDeCuentaBancario(registros);
    res.status(200).json({
      message: "Registros creados correctamente",
      data,
    });
  } catch (error) {
    console.error("Error en el controlador create:", error.message);
    res.status(500).json({
      message: "Error al procesar la solicitud",
      error: error.message,
    });
  }
};
export const getAll = async (req, res) => {
  try {
    const { limit = 10, offset = 0, search = "" } = req.query;

    const parsedLimit = parseInt(limit, 10) || 10;
    const parsedOffset = parseInt(offset, 10) || 0;

    const { estadoDeCuenta, totalItems } = await getAllEstadoDeCuentaBancario(
      parsedLimit,
      parsedOffset,
      search
    );

    const currentPage = Math.ceil(parsedOffset / parsedLimit) + 1;
    const totalPages = Math.ceil(totalItems / parsedLimit);

    res.status(200).json({
      estadoDeCuenta,
      currentPage,
      totalPages,
      totalItems,
    });
  } catch (error) {
    console.error(
      "Error al obtener el estado de cuenta bancario:",
      error.message
    );
    res.status(500).json({
      message: "Error al obtener el estado de cuenta bancario",
      error: error.message,
    });
  }
};
export const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const estadoDeCuenta = await getEstadoDeCuentaBancarioById(parseInt(id));

    res.status(200).json({
      message: "Estado de cuenta bancario obtenido con éxito",
      data: estadoDeCuenta,
    });
  } catch (error) {
    res.status(404).json({
      message: "Error al obtener el estado de cuenta bancario",
      error: error.message,
    });
  }
};
export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      fecha,
      referencia,
      concepto,
      cargo,
      abono,
      saldo,
      codigo_operacion: codigoOperacion,
      tipo_operacion: tipoOperacion,
    } = req.body;

    if (!id || isNaN(parseInt(id, 10))) {
      return res.status(400).json({
        message: "El ID proporcionado no es válido.",
      });
    }

    const estadoDeCuentaActualizado = await updateEstadoDeCuentaBancario(
      parseInt(id, 10),
      fecha,
      referencia,
      concepto,
      cargo,
      abono,
      saldo,
      codigoOperacion,
      tipoOperacion
    );

    res.status(200).json({
      message: "Estado de cuenta bancario actualizado con éxito",
      data: estadoDeCuentaActualizado,
    });
  } catch (error) {
    console.error("Error en la actualización:", error.message);
    res.status(500).json({
      message: "Error al actualizar el estado de cuenta bancario",
      error: error.message,
    });
  }
};
export const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const estadoDeCuentaEliminado = await deleteEstadoDeCuentaBancario(
      parseInt(id)
    );

    res.status(200).json({
      message: "Estado de cuenta bancario eliminado con éxito",
      data: estadoDeCuentaEliminado,
    });
  } catch (error) {
    res.status(404).json({
      message: "Error al eliminar el estado de cuenta bancario",
      error: error.message,
    });
  }
};
