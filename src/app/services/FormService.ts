import axios, { AxiosResponse } from "axios";
import axiosInstance from "./utils/axiosIntance";
// import { ILocalityModel } from "../models/ILocalityModel";

class FormService {
  public async getAllCustomers(): Promise<any> {
    const response = await axiosInstance.get(`api/customer/getAll`);
    return response.data;
  }

  public async createLocalities(data): Promise<any> {
    const response: AxiosResponse = await axios.post(
      "/api/publiapp/localities",
      { data: data }
    );

    return response;
  }

  public async updateLocalities(data): Promise<any> {
    const response: AxiosResponse = await axios.put(
      "/api/publiapp/localities",
      { data: data }
    );
    return response;
  }

  public async deleteLocalityById(id: any): Promise<any> {
    const response = await axios.delete(`/api/publiapp/localities/${id}`);
    return response.data;
  }
}

export default new FormService();
