import { BaseRepository } from "../repository/baseRepository";
import { checkInternet } from "../providers/internetConnection";
import odinApi from "../providers/odinApi";
import storeModel from "./store";

export type Entity = {
  id: number;
  product_id?: number;
  product: {
    id: number;
    name: string;
    category_id: number;
    category: {
      id: number;
      name: string;
      sort?: number;
      created_at?: string;
      deleted_at?: string;
    };
    price_buy?: string;
    permission_store?: boolean;
    permission_order?: boolean;
    permission_purchase?: boolean;
    cod_product?: string;
    cod_ncm?: number;
    brand?: string;
    unity?: number;
    weight?: string;
    price_sell?: string;
    description?: string;
    created_at?: string;
    deleted_at?: string;
  };
  store_id?: number;
  price_unit?: string;
  permission: boolean;
  price_sell?: string;
  unity?: string;
  unity_taxable?: string;
  price_taxable?: string;
  cfop?: number;
  icms_origin?: number;
  icms_tax_situation?: string;
  tax_regime?: number;
  pis_tax_situation?: string;
  pis_aliquot_value?: string;
  pis_aliquot_percentage?: string;
  cofins_tax_situation?: string;
  cofins_aliquot_value?: string;
  cofins_aliquot_percentage?: string;
  additional_information?: string;
  price_permission: boolean;
  icms_aliquot_percentage?: string;
  bc_icms?: string;
  bc_icms_st?: string;
  redution_icms?: string;
  aliquot_final_consumer?: string;
  quantity?: number;
  created_at: string;
  deleted_at?: string;
};

type PurchaseProduct = {
  id: number;
  name: string;
  sort: number;
  products: {
    id: number;
    name: string;
    category_id: number;
    price_buy: string;
    permission_store: boolean;
    permission_order: boolean;
    cod_product: string;
    cod_ncm: string;
    brand: string;
    unity: number;
    weight: string;
    price_sell: string;
    created_at: string;
    deleted_at: string;
  }[];
};
class Product extends BaseRepository<Entity> {
  loggedUser: Entity | null = null;
  constructor(storageName = "Product") {
    super(storageName);
  }

  async getProducts(): Promise<Entity[]> {
    const hasInternet = await checkInternet();
    if (hasInternet) {
      const store = await storeModel.getOne();
      const {
        data: { content },
      } = await odinApi.get(`products_store/store/${store?.company_id}`);
      await this.clear();
      await this.createMany(content);
      return content;
    } else {
      return await this.getAll();
    }
  }

  async getSelfService(): Promise<Entity | undefined> {
    const products = await this.getAll();
    return products.find((_product) => _product.product.category_id === 1);
  }

  async getAllPurchaseProducts(): Promise<PurchaseProduct[]> {
    const hasInternet = await checkInternet();
    if (!hasInternet) {
      return [];
    }
    const {
      data: { content },
    } = await odinApi.get("/product_categories/products/purchases");

    return content;
  }
}

export default new Product();
