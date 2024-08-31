import { Request } from "express";

export type BodyRequest<T> = Request<{}, {}, T>
export type QueryRequest<T> = Request<{}, {}, {}, T>
export type ParamsRequest<T> = Request<T>