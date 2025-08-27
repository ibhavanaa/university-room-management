import axios from "../utils/axiosInstance";

const userService = {
  getAllUsers: async () => {
    const res = await axios.get("/users");
    return res.data;
  },

  createUser: async (data) => {
    const res = await axios.post("/users", data);
    return res.data;
  },

  deleteUser: async (id) => {
    const res = await axios.delete(`/users/${id}`);
    return res.data;
  },
};

export default userService;
