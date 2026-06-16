import * as SecureStore from 'expo-secure-store';

const memoryCache = new Map<string, string | null>();

export async function getToken(key: string): Promise<string | null> {
  if (memoryCache.has(key)) return memoryCache.get(key) ?? null;
  const value = await SecureStore.getItemAsync(key);
  memoryCache.set(key, value);
  return value;
}

export function getTokenSync(key: string): string | null {
  return memoryCache.get(key) ?? null;
}

export async function setToken(key: string, value: string): Promise<void> {
  memoryCache.set(key, value);
  await SecureStore.setItemAsync(key, value);
}

export async function removeToken(key: string): Promise<void> {
  memoryCache.set(key, null);
  await SecureStore.deleteItemAsync(key);
}
