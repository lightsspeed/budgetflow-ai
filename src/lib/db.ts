import { get, set, del, keys } from "idb-keyval";

export async function persistData<T>(key: string, data: T): Promise<void> {
  await set(key, data);
}

export async function loadData<T>(key: string): Promise<T | undefined> {
  return await get<T>(key);
}

export async function removeData(key: string): Promise<void> {
  await del(key);
}

export async function getAllKeys(): Promise<string[]> {
  return await keys();
}
