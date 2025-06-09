import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

type CreateSalaryParams = {
  dataAdmissao: Date;
  salarioBruto: number;
};

export const createSalary = async (salary: CreateSalaryParams) => {
  const response = await api.post("/", salary);
  return response.data;
};

type GetSalariesParams = {
  dataAdmissaoInicio: string | undefined;
  dataAdmissaoFim: string | undefined;
  salarioBrutoInicio: number | undefined;
  salarioBrutoFim: number | undefined;
  page: number;
  limit: number;
};

export const getSalaries = async (params: GetSalariesParams) => {
  const response = await api.get("/registros", {
    params: {
      page: params.page,
      limit: params.limit,
      ...(params.dataAdmissaoInicio && {
        dataAdmissaoInicio: params.dataAdmissaoInicio,
      }),
      ...(params.dataAdmissaoFim && {
        dataAdmissaoFim: params.dataAdmissaoFim,
      }),
      ...(params.salarioBrutoInicio && {
        salarioBrutoInicio: params.salarioBrutoInicio,
      }),
      ...(params.salarioBrutoFim && {
        salarioBrutoFim: params.salarioBrutoFim,
      }),
    },
  });

  return response.data;
};
