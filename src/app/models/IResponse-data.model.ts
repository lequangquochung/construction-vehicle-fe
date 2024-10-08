export interface IResponseData<T> {
    success: boolean,
    data?: T,
    message: string,
  }