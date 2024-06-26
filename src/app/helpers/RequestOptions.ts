import { HttpHeaders, HttpParams } from "@angular/common/http";

export function createRequestOptions(options: any = {}): any {
  // Set default options if not provided
  options = options || {};

  // Set headers
  const headers = options.headers || {};
  const httpHeaders = new HttpHeaders(headers);

  // Set query parameters
  const params = options.params || {};
  let httpParams = new HttpParams();
  Object.keys(params).forEach(key => {
    httpParams = httpParams.append(key, params[key]);
  });

  // Construct the final options object
  const requestOptions: any = {
    headers: httpHeaders,
    params: httpParams,
    // Add other options as needed
  };

  return requestOptions;
}