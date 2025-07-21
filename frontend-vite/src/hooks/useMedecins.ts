import { useState, useCallback } from 'react'
import { Medecin, MEDECINS, SPECIALITES } from '../data/medical-data'

export interface NewMedecin {
  nom: string
  prenom: string
  email: string
  telephone: string
  specialiteId: number
}

export function useMedecins() {
  const [medecins, setMedecins] = useState<Medecin[]>(MEDECINS)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addMedecin = useCallback(async (newMedecin: NewMedecin) => {
    setLoading(true)
    setError(null)
    
    try {
      // Simuler un délai d'API
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const medecin: Medecin = {
        id: Math.max(...medecins.map(m => m.id)) + 1,
        ...newMedecin
      }
      
      setMedecins(prev => [...prev, medecin])
      return medecin
    } catch (err) {
      setError('Erreur lors de l\'ajout du médecin')
      throw err
    } finally {
      setLoading(false)
    }
  }, [medecins])

  const deleteMedecin = useCallback(async (id: number) => {
    setLoading(true)
    setError(null)
    
    try {
      // Simuler un délai d'API
      await new Promise(resolve => setTimeout(resolve, 300))
      
      setMedecins(prev => prev.filter(m => m.id !== id))
    } catch (err) {
      setError('Erreur lors de la suppression du médecin')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const updateMedecin = useCallback(async (id: number, updates: Partial<NewMedecin>) => {
    setLoading(true)
    setError(null)
    
    try {
      // Simuler un délai d'API
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setMedecins(prev => prev.map(m => 
        m.id === id ? { ...m, ...updates } : m
      ))
    } catch (err) {
      setError('Erreur lors de la modification du médecin')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const getMedecinsBySpecialite = useCallback((specialiteId: number) => {
    return medecins.filter(m => m.specialiteId === specialiteId)
  }, [medecins])

  const getSpecialiteName = useCallback((specialiteId: number) => {
    const specialite = SPECIALITES.find(s => s.id === specialiteId)
    return specialite?.nom || 'Spécialité inconnue'
  }, [])

  return {
    medecins,
    loading,
    error,
    addMedecin,
    deleteMedecin,
    updateMedecin,
    getMedecinsBySpecialite,
    getSpecialiteName,
    specialites: SPECIALITES
  }
}
