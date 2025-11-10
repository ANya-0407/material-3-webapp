export type BackendResult<D = undefined, E = Record<string, string | undefined>> = 
    | { success: true; data: D; errors?: never }
    | { success: false; data?: never; errors: E };
