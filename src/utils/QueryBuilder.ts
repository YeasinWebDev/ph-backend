import { Query } from "mongoose";
import { excludeFields } from "../app/modules/tour/tour.constant";

export class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public readonly query: Record<string, string>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, string>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  filter(): this {
    const filter = Object.entries(this.query).reduce<Record<string, string>>((acc, [key, value]) => {
      if (!excludeFields.includes(key)) {
        acc[key] = value;
      }
      return acc;
    }, {});

    this.modelQuery = this.modelQuery.find(filter);
    return this;
  }

  search(searchField: string[]): this {
    const search = this.query.search || "";

    const searchQuery = {
      $or: searchField.map((field) => ({
        [field]: {
          $regex: search,
          $options: "i",
        },
      })),
    };

    this.modelQuery = this.modelQuery.find(searchQuery);

    return this;
  }

  sort(): this {
    const sort = this.query.sort || "-createdAt";
    this.modelQuery = this.modelQuery.sort(sort as string);

    return this;
  }

  fields(): this {
    const fields = ((this.query.fields as string) || "").split(",").join(" ") || "";

    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }

  pagination(): this {
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);

    return this;
  }

  async getMeta() {
    const total = await this.modelQuery.model.countDocuments(this.modelQuery.getFilter());
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;
    const totalPage = Math.ceil(total / limit);

    return { total, page, limit, totalPage };
  }

  getResults(): Promise<T[]> {
    return this.modelQuery;
  }
}
