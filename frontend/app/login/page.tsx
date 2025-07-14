"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("handleSubmit triggered")
    console.log("Email:", email, "Password:", password)

    try {
      const response = await axios.post("http://localhost:8088/api/login", {
        username: email,
        password: password,
      })

      console.log("Réponse complète :", response.data)

      const token = response.data.token
      console.log("Token extrait :", token)

      if (!token) {
        setError("Le serveur n'a pas renvoyé de token.")
        return
      }

      localStorage.setItem("token", token)
      setError("")
      await router.push("/dashboard")
    } catch (err: any) {
      console.error("Erreur login :", err)

      if (err.response) {
        console.error("Détails erreur réponse:", err.response.data)
        setError("Erreur serveur : " + (err.response.data.message || "Login échoué"))
      } else if (err.request) {
        console.error("Aucune réponse reçue :", err.request)
        setError("Le serveur ne répond pas.")
      } else {
        console.error("Erreur inconnue :", err.message)
        setError("Une erreur est survenue.")
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-xl font-semibold mb-4">Connexion</h2>

        <input
          type="email"
          placeholder="Adresse email"
          value={email}
          autoComplete="email"
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full mb-3 px-4 py-2 border rounded"
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          className="w-full mb-3 px-4 py-2 border rounded"
        />

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Se connecter
        </button>
      </form>
    </div>
  )
}
