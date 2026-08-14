/**
 * A calendar date serialized as a `YYYY-MM-DD` ISO string, matching the runtime
 * shape of the values Vite imports from `content/data/*.json`.
 */
export type ISODateString = `${number}-${number}-${number}`;
