import { Resource } from "../types/models.js";

export const resources: Resource[] = [
  {
    id: "1",
    title: "JavaScript Basics",
    url: "https://developer.mozilla.org/",
    type: "Article",
    description: "Навчальний ресурс з JavaScript",
    author: "MDN",
    createdAt: new Date().toISOString(),
  },
];
