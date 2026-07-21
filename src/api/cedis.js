import axios from "./axios";

export const getCedisRequest = async () => axios.get(`/cedis`);

export const createCediRequest = async (cedi) => axios.post(`/cedis`, cedi);

export const updateCediRequest = async (id, cedi) =>
  axios.put(`/cedi/${id}`, cedi);

export const deleteCediRequest = async (id) => axios.delete(`/cedi/${id}`);

export const getCediRequest = async (id) => axios.get(`/cedi/${id}`);

export const getCedisByRegionRequest = (region) => 
  axios.get(`/cedi?region=${region}`);

// En tu archivo de rutas de axios
export const getDelegadosVencidosRequest = () => axios.get("/delegados/vencidos");

// Asegúrate de que coincida con lo que pusiste en el navegador
export const getDelegadosProximosRequest = () => axios.get("/delegados/proximos");

export const getCedisBrechasRequest = () => axios.get("/cedis/brechas");

export const getComitesAlertasRequest = () => axios.get("/cedis/comites-alertas");

//export const getSanCristobalRequest = () => axios.get('/cedis/san-cristobal');

// Función para obtener un CEDI por su nombre/slug
export const getCediDetRequest = (ciudad) => axios.get(`/cedis/${ciudad}`);

// Función para actualizar un CEDI por su ID (usando el _id de MongoDB)
export const updateCedisRequest = (id, data) => axios.put(`/cedis/${id}`, data);

export const getCedisByNameRequest = (nombre) => axios.get(`/cedis/${nombre}`);

export const getNationalReportRequest = () => axios.get('/reporte-nacional');

export const getRegionalReportRequest = (region) => 
    axios.get(`/reporte-regional?region=${region}`);
