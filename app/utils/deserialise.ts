/* eslint-disable @typescript-eslint/no-explicit-any */
import { SubmitOptions, useSubmit } from "@remix-run/react";
import { z } from "zod";

export function useMySubmit(): (
  target: Record<string, {}>,
  options?: SubmitOptions,
) => void {
  const submit = useSubmit();
  return async (event, options) => {
    const data =
      typeof event === "object" ? jsonToFormData(event as any) : event;
    return submit(data, options);
  };
}
export async function deserialise<S>(
  request: Request,
  type: z.ZodType<S>,
): Promise<S> {
  const formData = await request.formData();
  return deserialiseFormData(formData, type);
}
export async function deserialiseFormData<S>(
  formData: FormData,
  type: z.ZodType<S>,
): Promise<S> {
  const object = formDataToJson(formData);
  return type.parse(object);
}

const jsonKey = "json";
export function jsonToFormData(jsonObject: { [key: string]: any }): FormData {
  const formData = new FormData();
  formData.set(jsonKey, JSON.stringify(jsonObject));
  return formData;
}

export function formDataToJson(formData: FormData): { [key: string]: any } {
  const jsonStr = formData.get(jsonKey);
  return JSON.parse(jsonStr as string);
}

export function jsonToQueryParams(object: { [key: string]: any }): string {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(object)) {
    if (Array.isArray(value)) {
      value.forEach((item) => params.append(key, item));
    } else {
      params.append(key, value);
    }
  }

  return params.toString();
}

export function queryParamsToJson(searchParams: URLSearchParams): {
  [key: string]: any;
} {
  const parsedParams: { [key: string]: any } = {};

  searchParams.forEach((value, key) => {
    if (parsedParams[key]) {
      if (Array.isArray(parsedParams[key])) {
        parsedParams[key].push(value);
      } else {
        parsedParams[key] = [parsedParams[key], value];
      }
    } else {
      parsedParams[key] = value;
    }
  });
  return parsedParams;
}
