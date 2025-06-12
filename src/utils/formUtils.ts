/**
 * Filters out empty, null, and undefined values from an object.
 * 
 * This utility is commonly used to clean form data before sending API requests,
 * ensuring only fields with actual values are included in the payload.
 * 
 * @template T - The type of the input object
 * @param {T} data - The object to filter
 * @returns {Partial<T>} A new object containing only the non-empty fields
 * 
 * @example
 * const formData = { username: "john", email: "", age: null, bio: undefined };
 * const filtered = filterNonEmptyFields(formData);
 * // Result: { username: "john" }
 */
export const filterNonEmptyFields = <T extends Record<string, any>>(data: T): Partial<T> => {
    return Object.keys(data).reduce<Partial<T>>((acc, key) => {
        const k = key as keyof T;
        const value = data[k];
        if (value !== undefined && value !== null && value !== "") {
            acc[k] = value;
        }
        return acc;
    }, {});
};
