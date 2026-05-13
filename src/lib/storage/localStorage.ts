import type { z } from "zod";

export type LocalStorageSchema<T> = z.ZodType<T>;

export type StorageEntity = {
  id: string;
  createdAt?: string;
  updatedAt?: string;
};

export type LocalStorageCollection<T extends StorageEntity> = {
  key: string;
  list: () => T[];
  findById: (id: string) => T | undefined;
  save: (entity: T) => T;
  saveAll: (entities: T[]) => T[];
  remove: (id: string) => void;
  clear: () => void;
};

const canUseLocalStorage = () =>
  typeof window !== "undefined" && typeof window.localStorage !== "undefined";

export function readLocalStorage<T>(
  key: string,
  fallbackValue: T,
  schema?: LocalStorageSchema<T>,
): T {
  if (!canUseLocalStorage()) {
    return fallbackValue;
  }

  const rawValue = window.localStorage.getItem(key);

  if (rawValue === null) {
    return fallbackValue;
  }

  try {
    const parsedValue: unknown = JSON.parse(rawValue);

    if (!schema) {
      return parsedValue as T;
    }

    const validationResult = schema.safeParse(parsedValue);

    if (!validationResult.success) {
      console.warn(`localStorageのデータ形式が不正です: ${key}`, validationResult.error);
      return fallbackValue;
    }

    return validationResult.data;
  } catch (error) {
    console.warn(`localStorageの読み込みに失敗しました: ${key}`, error);
    return fallbackValue;
  }
}

export function writeLocalStorage<T>(key: string, value: T): void {
  if (!canUseLocalStorage()) {
    return;
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`localStorageへの保存に失敗しました: ${key}`, error);
  }
}

export function removeLocalStorage(key: string): void {
  if (!canUseLocalStorage()) {
    return;
  }

  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.warn(`localStorageの削除に失敗しました: ${key}`, error);
  }
}

type CreateLocalStorageCollectionOptions<T extends StorageEntity> = {
  key: string;
  schema: LocalStorageSchema<T[]>;
};

export function createLocalStorageCollection<T extends StorageEntity>({
  key,
  schema,
}: CreateLocalStorageCollectionOptions<T>): LocalStorageCollection<T> {
  const list = () => readLocalStorage<T[]>(key, [], schema);

  const saveAll = (entities: T[]) => {
    writeLocalStorage(key, entities);
    return entities;
  };

  const findById = (id: string) => list().find((entity) => entity.id === id);

  const save = (entity: T) => {
    const entities = list();
    const now = new Date().toISOString();
    const entityToSave = {
      ...entity,
      createdAt: entity.createdAt ?? now,
      updatedAt: now,
    };
    const existingIndex = entities.findIndex((currentEntity) => currentEntity.id === entity.id);
    const nextEntities = [...entities];

    if (existingIndex >= 0) {
      nextEntities[existingIndex] = entityToSave;
    } else {
      nextEntities.push(entityToSave);
    }

    writeLocalStorage(key, nextEntities);
    return entityToSave;
  };

  const remove = (id: string) => {
    const nextEntities = list().filter((entity) => entity.id !== id);
    writeLocalStorage(key, nextEntities);
  };

  const clear = () => removeLocalStorage(key);

  return {
    key,
    list,
    findById,
    save,
    saveAll,
    remove,
    clear,
  };
}
