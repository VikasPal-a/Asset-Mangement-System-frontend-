// import { apiUrl } from "./api";

// export const getEmployees = async () => {
//   const response = await apiUrl.get("/employees");

//   return response.data;
// };

import axios from "axios";

export const getEmployees = async () => {
  const response = await axios.post(
    "https://app.unios.in/pdpl-web/agents-list-by-date",
    {
      date: "no",
    },
    {
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": JSON.stringify(
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJzYWxlc0BwbHVzZGlzdHJpYnV0aW9ucy5pbiIsInVzZXJfdHlwZSI6IkFkbWluIiwiaWF0IjoxNzg3ODEzMzM3fQ.i09PWqQPktgO7yPsawW-PXE5KVm8_XAK8AoaPDd3rEo",
        ),
      },
    },
  );

  return response.data;
};
