import { compare } from "fast-json-patch";
import { Category, CreateCategory } from "~/types/category";
import { PaginationResponse } from "~/types/pagination";
import axiosClient from "~/utils/axios-client";

export class CategoriesController {
  async create(data: CreateCategory): Promise<Category> {
    return await axiosClient.post("/api/v1/Categories", data);
  }

  async getById(id: string): Promise<Category> {
    return await axiosClient.get(`/api/v1/Categories/${id}`);
  }

  async find(): Promise<PaginationResponse<Category>> {
    return await axiosClient.get("/api/v1/Categories");
  }

  async update(category: Category, newData: CreateCategory): Promise<Category> {
    const operations = compare(category, { ...category, ...newData });
    return await axiosClient.patch(
      `/api/v1/Categories/${category.id}`,
      operations
    );
  }

  async delete(id: string): Promise<void> {
    await axiosClient.delete(`/api/v1/Categories/${id}`);
  }
}
