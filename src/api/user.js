import axios from "./axios";

export const getUsersRequest = async () => axios.get(`/users`);
// 2. Obtener un usuario por su ID (para cargar el formulario)
export const getUserRequest = async (id) => axios.get(`/user/${id}`);

// 3. Actualizar un usuario por su ID (se le pasa el id y los nuevos datos)
export const updateUserRequest = async (id, user) => axios.put(`/user/${id}`, user);