import {
  assignmentPlanListSchema,
  bookListSchema,
  customerListSchema,
  templateListSchema,
} from "@/lib/validation";
import type { AssignmentPlan, Book, Customer, Template } from "@/types";
import { createLocalStorageCollection } from "./localStorage";

export const storageKeys = {
  customers: "trainer-assignment-pdf:customers",
  assignmentPlans: "trainer-assignment-pdf:assignment-plans",
  books: "trainer-assignment-pdf:books",
  templates: "trainer-assignment-pdf:templates",
} as const;

export const customerStorage = createLocalStorageCollection<Customer>({
  key: storageKeys.customers,
  schema: customerListSchema,
});

export const assignmentPlanStorage = createLocalStorageCollection<AssignmentPlan>({
  key: storageKeys.assignmentPlans,
  schema: assignmentPlanListSchema,
});

export const bookStorage = createLocalStorageCollection<Book>({
  key: storageKeys.books,
  schema: bookListSchema,
});

export const templateStorage = createLocalStorageCollection<Template>({
  key: storageKeys.templates,
  schema: templateListSchema,
});

export const listCustomers = customerStorage.list;
export const saveCustomer = customerStorage.save;
export const findCustomerById = customerStorage.findById;
export const removeCustomer = customerStorage.remove;

export const listAssignmentPlans = assignmentPlanStorage.list;
export const saveAssignmentPlan = assignmentPlanStorage.save;
export const findAssignmentPlanById = assignmentPlanStorage.findById;
export const removeAssignmentPlan = assignmentPlanStorage.remove;

export const listBooks = bookStorage.list;
export const saveBook = bookStorage.save;
export const findBookById = bookStorage.findById;
export const removeBook = bookStorage.remove;

export const listTemplates = templateStorage.list;
export const saveTemplate = templateStorage.save;
export const findTemplateById = templateStorage.findById;
export const removeTemplate = templateStorage.remove;
