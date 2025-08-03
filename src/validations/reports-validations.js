// src/validations/reports.js

/**
 * Validation rules for reports form
 */

// Required field validation
export const required = (fieldName = 'Campo') => {
  return (val) => (val !== null && val !== undefined && val !== '') || `${fieldName} é obrigatório`
}

// Minimum length validation
export const minLength = (min, fieldName = 'Campo') => {
  return (val) => (!val || val.length >= min) || `${fieldName} deve ter pelo menos ${min} caracteres`
}

// Maximum length validation
export const maxLength = (max, fieldName = 'Campo') => {
  return (val) => (!val || val.length <= max) || `${fieldName} deve ter no máximo ${max} caracteres`
}

// Report type validation
export const isValidReportType = (val) => {
  const validTypes = [
    'pothole',
    'damaged_bridge',
    'missing_signs',
    'impassable_road',
    'landslide',
    'flooding',
    'deteriorated_asphalt',
    'other'
  ]
  return !val || validTypes.includes(val) || 'Tipo de problema inválido'
}

// Title validation
export const isValidTitle = (val) => {
  return (!!val && val.length >= 5 && val.length <= 100) ||
    'Título deve ter entre 5 e 100 caracteres'
}

// Description validation
export const isValidDescription = (val) => {
  return (!!val && val.length >= 20 && val.length <= 1000) ||
    'Descrição deve ter entre 20 e 1000 caracteres'
}

// Location address validation
export const isValidAddress = (val) => {
  return !!val || 'Endereço ou referência é obrigatório'
}

// City validation
export const isValidCity = (val) => {
  return (!!val && val.length >= 2) || 'Cidade deve ter pelo menos 2 caracteres'
}

// Province validation
export const isValidProvince = (val) => {
  const mozambiqueProvinces = [
    'Maputo Província',
    'Gaza',
    'Inhambane',
    'Sofala',
    'Manica',
    'Tete',
    'Zambézia',
    'Nampula',
    'Cabo Delgado',
    'Niassa',
    'Maputo Cidade'
  ]
  return !val || mozambiqueProvinces.some(province =>
    province.toLowerCase().includes(val.toLowerCase()) ||
    val.toLowerCase().includes(province.toLowerCase())
  ) || 'Província deve ser válida para Moçambique'
}

// Latitude validation
export const isValidLatitude = (val) => {
  if (!val) return 'Latitude é obrigatória'
  const lat = parseFloat(val)
  return (lat >= -90 && lat <= 90) || 'Latitude deve estar entre -90 e 90'
}

// Longitude validation
export const isValidLongitude = (val) => {
  if (!val) return 'Longitude é obrigatória'
  const lng = parseFloat(val)
  return (lng >= -180 && lng <= 180) || 'Longitude deve estar entre -180 e 180'
}

// Severity level validation
export const isValidSeverity = (val) => {
  return (val && val >= 1 && val <= 5) || 'Nível de gravidade deve ser entre 1 e 5'
}

// Phone validation (Mozambique format)
export const isValidMozambiquePhone = (val) => {
  if (!val) return true // Optional field
  // Mozambique phone numbers: +258 followed by 8 or 9 digits
  const phonePattern = /^(\+258|258)?[0-9]{8,9}$/
  return phonePattern.test(val.replace(/\s+/g, '')) || 'Formato de telefone inválido'
}

// Photo file validation
export const isValidPhoto = (file) => {
  if (!file) return true // Optional

  // Check file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (!validTypes.includes(file.type)) {
    return 'Formato de imagem inválido. Use JPEG, PNG ou WebP'
  }

  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024 // 5MB in bytes
  if (file.size > maxSize) {
    return 'Imagem deve ter no máximo 5MB'
  }

  return true
}

// Multiple photos validation
export const isValidPhotos = (files) => {
  if (!files || files.length === 0) return true // Optional

  if (files.length > 3) {
    return 'Máximo de 3 fotos permitidas'
  }

  for (let i = 0; i < files.length; i++) {
    const validation = isValidPhoto(files[i])
    if (validation !== true) {
      return `Foto ${i + 1}: ${validation}`
    }
  }

  return true
}

// Location validation (combined)
export const isValidLocation = (location) => {
  if (!location) return 'Localização é obrigatória'

  const errors = []

  if (!location.address) errors.push('Endereço')
  if (!location.city) errors.push('Cidade')
  if (!location.province) errors.push('Província')
  if (!location.latitude) errors.push('Latitude')
  if (!location.longitude) errors.push('Longitude')

  if (errors.length > 0) {
    return `Campos obrigatórios da localização: ${errors.join(', ')}`
  }

  // Validate coordinate ranges
  const lat = parseFloat(location.latitude)
  const lng = parseFloat(location.longitude)

  if (isNaN(lat) || lat < -90 || lat > 90) {
    return 'Latitude inválida'
  }

  if (isNaN(lng) || lng < -180 || lng > 180) {
    return 'Longitude inválida'
  }

  return true
}

// Complete report validation
export const validateReport = (report, photos = []) => {
  const errors = {}

  // Type validation
  if (!report.type) {
    errors.type = 'Tipo de problema é obrigatório'
  } else if (isValidReportType(report.type) !== true) {
    errors.type = isValidReportType(report.type)
  }

  // Title validation
  if (isValidTitle(report.title) !== true) {
    errors.title = isValidTitle(report.title)
  }

  // Description validation
  if (isValidDescription(report.description) !== true) {
    errors.description = isValidDescription(report.description)
  }

  // Location validation
  if (isValidLocation(report.location) !== true) {
    errors.location = isValidLocation(report.location)
  }

  // Severity validation
  if (isValidSeverity(report.severity) !== true) {
    errors.severity = isValidSeverity(report.severity)
  }

  // Contact phone validation (if consent given)
  if (report.contactConsent && isValidMozambiquePhone(report.contactPhone) !== true) {
    errors.contactPhone = isValidMozambiquePhone(report.contactPhone)
  }

  // Photos validation
  if (photos.length > 0 && isValidPhotos(photos) !== true) {
    errors.photos = isValidPhotos(photos)
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// Export combined validation rules for Quasar form components
export const reportFormRules = {
  type: [required('Tipo de problema'), isValidReportType],
  title: [isValidTitle],
  description: [isValidDescription],
  'location.address': [isValidAddress],
  'location.city': [isValidCity],
  'location.province': [isValidProvince],
  'location.latitude': [isValidLatitude],
  'location.longitude': [isValidLongitude],
  severity: [isValidSeverity],
  contactPhone: [isValidMozambiquePhone]
}
