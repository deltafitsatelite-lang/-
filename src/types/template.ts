import type { EntityId, ISODateTimeString, TemplateCategory } from "./common";

export type Template = {
  id: EntityId;
  name: string;
  category: TemplateCategory;
  content: string;
  createdAt: ISODateTimeString;
  updatedAt: ISODateTimeString;
};
