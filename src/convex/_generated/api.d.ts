/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth_emailOtp from "../auth/emailOtp.js";
import type * as auth from "../auth.js";
import type * as cart from "../cart.js";
import type * as emails from "../emails.js";
import type * as http from "../http.js";
import type * as migrateData from "../migrateData.js";
import type * as orders from "../orders.js";
import type * as products from "../products.js";
import type * as recentlyViewed from "../recentlyViewed.js";
import type * as seedData from "../seedData.js";
import type * as storage from "../storage.js";
import type * as storageUtils from "../storageUtils.js";
import type * as subscribers from "../subscribers.js";
import type * as updateProductImages from "../updateProductImages.js";
import type * as users from "../users.js";
import type * as wishlist from "../wishlist.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  "auth/emailOtp": typeof auth_emailOtp;
  auth: typeof auth;
  cart: typeof cart;
  emails: typeof emails;
  http: typeof http;
  migrateData: typeof migrateData;
  orders: typeof orders;
  products: typeof products;
  recentlyViewed: typeof recentlyViewed;
  seedData: typeof seedData;
  storage: typeof storage;
  storageUtils: typeof storageUtils;
  subscribers: typeof subscribers;
  updateProductImages: typeof updateProductImages;
  users: typeof users;
  wishlist: typeof wishlist;
}>;
declare const fullApiWithMounts: typeof fullApi;

export declare const api: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "internal">
>;

export declare const components: {};
