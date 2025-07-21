export interface ValidationResult {
    isValid: boolean
    error?: string
  }

  export function validateInput(questionId: string, value: string | string[]): ValidationResult {
    const stringValue = Array.isArray(value) ? value.join("") : value

    switch (questionId) {
      case "nom":
      case "prenom":
        if (!stringValue.trim()) return { isValid: false, error: "Ce champ est requis" }
        if (stringValue.length < 2) return { isValid: false, error: "Minimum 2 caractères" }
        if (!/^[a-zA-ZÀ-ÿ\s-']+$/.test(stringValue)) return { isValid: false, error: "Lettres uniquement" }
        break

      case "age":
        const age = Number.parseInt(stringValue)
        if (isNaN(age)) return { isValid: false, error: "Âge invalide" }
        if (age < 0 || age > 120) return { isValid: false, error: "Âge entre 0 et 120 ans" }
        break

      case "telephone":
        if (!/^(\+33|0)[1-9](\d{8})$/.test(stringValue.replace(/\s/g, ""))) {
          return { isValid: false, error: "Format: 01 23 45 67 89" }
        }
        break

      case "email":
        if (stringValue && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(stringValue)) {
          return { isValid: false, error: "Email invalide" }
        }
        break

      case "symptomes":
        if (!stringValue.trim()) return { isValid: false, error: "Décrivez vos symptômes" }
        if (stringValue.length < 10) return { isValid: false, error: "Soyez plus précis (min 10 caractères)" }
        break

      default:
        break
    }

    return { isValid: true }
  }
