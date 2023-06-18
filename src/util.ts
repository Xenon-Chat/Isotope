export function assert_is_error (error: unknown): Error {
  if (!(error instanceof Error)) throw new Error(`Non-Error error: ${error}`)
  return error
}
