// Shared client-side validation rules

export const EMAIL_RE = /^\S+@\S+\.\S+$/
export const PASSWORD_RE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/
export const PHONE_RE = /^\+?[0-9\s()-]{7,20}$/

export const rules = {
  required: (label) => (v) =>
    !String(v ?? '').trim() ? `${label} is required` : '',

  email: () => (v) =>
    !EMAIL_RE.test(String(v ?? '').trim()) ? 'Enter a valid email address' : '',

  minLength: (n, label) => (v) =>
    String(v ?? '').length < n ? `${label} must be at least ${n} characters` : '',

  maxLength: (n, label) => (v) =>
    String(v ?? '').length > n ? `${label} cannot exceed ${n} characters` : '',

  strongPassword: () => (v) =>
    !PASSWORD_RE.test(String(v ?? ''))
      ? 'Use 8+ characters with uppercase, lowercase, number, and special character'
      : '',

  passwordMatch: (getOther) => (v) =>
    v !== getOther() ? 'Passwords do not match' : '',

  phone: (label = 'Phone number') => (v) => {
    const s = String(v ?? '').trim()
    if (!s) return ''
    const digits = s.replace(/\D/g, '').length
    return !PHONE_RE.test(s) || digits < 10 || digits > 15
      ? `${label} is invalid`
      : ''
  },

  age: () => (v) => {
    if (v === '' || v == null) return ''
    const n = Number(v)
    return isNaN(n) || n < 0 || n > 150 ? 'Age must be between 0 and 150' : ''
  },

  otp: () => (v) =>
    !/^\d{4,8}$/.test(String(v ?? '').trim()) ? 'Enter a valid 4–8 digit OTP' : '',
}

/** Validate a single field — returns first error string or '' */
export const validateField = (value, fieldRules = []) => {
  for (const rule of fieldRules) {
    const msg = rule(value)
    if (msg) return msg
  }
  return ''
}

/** Validate all fields in a schema, returns { field: errorMsg } */
export const validateAll = (schema, values) => {
  const errors = {}
  for (const field of Object.keys(schema)) {
    errors[field] = validateField(values[field], schema[field])
  }
  return errors
}

export const hasErrors = (errors) => Object.values(errors).some(Boolean)

/** Returns Tailwind border classes based on whether field has error */
export const fieldClass = (error) =>
  `w-full border rounded-md focus:outline-none focus:ring-2 ${
    error
      ? 'border-red-400 focus:ring-red-300'
      : 'border-gray-300 focus:ring-blue-600'
  }`
