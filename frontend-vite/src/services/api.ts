import axios from "axios"

// Configuration de l'API
const API_BASE_URL = "http://localhost:8088/api"

// ✅ Types pour les réponses API
export interface LoginResponse {
  token: string
  user?: {
    id: string
    email: string
    roles: string[] // <-- corrigé
  }
}

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
}

// ✅ Service d'authentification
export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, {
        email,
        password,
      })

      console.log("Réponse complète :", response.data)

      const token = response.data.token
      if (!token) {
        throw new Error("Le serveur n'a pas renvoyé de token.")
      }

      // Adapter la réponse backend à la structure frontend
      const role = response.data.role
      const roles = role ? [role] : []

      return {
        token,
        user: {
          id: response.data.id,
          email: email, // On utilise l'email de la requête
          roles: roles, // Convertir le rôle unique en tableau
        }
      }
    } catch (err: any) {
      console.error("Erreur login :", err)

      if (err.response) {
        throw new Error(
          "Erreur serveur : " + (err.response.data.message || "Login échoué")
        )
      } else if (err.request) {
        throw new Error("Le serveur ne répond pas.")
      } else {
        throw new Error("Une erreur est survenue.")
      }
    }
  },

  logout(): void {
    localStorage.removeItem("token")
    localStorage.removeItem("user")

    const token = localStorage.getItem("token")
    if (token) {
      axios.post(`${API_BASE_URL}/logout`, {}, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      }).catch(error => {
        console.log("Logout API non disponible:", error.message)
      })
    }
  },

  async getCurrentUser() {
    const token = localStorage.getItem("token")
    if (!token) {
      throw new Error("Pas de token")
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/me`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      })
      return response.data
    } catch (error) {
      throw new Error("Token invalide")
    }
  }
}

// ✅ Requêtes authentifiées
export const apiRequest = async (endpoint: string, options: any = {}) => {
  const token = localStorage.getItem("token")

  const config = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { "Authorization": `Bearer ${token}` }),
      ...options.headers,
    },
  }

  try {
    const response = await axios(`${API_BASE_URL}${endpoint}`, config)
    return response.data
  } catch (error: any) {
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      window.location.href = "/login"
      throw new Error("Session expirée")
    }

    throw new Error(error.response?.data?.message || "Erreur API")
  }
}
