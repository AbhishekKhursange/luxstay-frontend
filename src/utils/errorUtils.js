export const getErrorMsg = (err, fallback = 'Something went wrong.') => {
  if (typeof err.response?.data === 'string' && err.response.data.length > 0) {
    return err.response.data
  }
  return err.response?.data?.message || fallback
}