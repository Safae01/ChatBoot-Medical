"use client"

import type React from "react"

import { useState, useRef } from "react"
import type { Question, FileData} from "../types/medical"

interface Props {
  onFilesSelected: (files: FileData[]) => void
  accept?: string
}

export function FileUpload({ onFilesSelected, accept = "*" }: Props) {
  const [uploadedFiles, setUploadedFiles] = useState<FileData[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    const newFiles: FileData[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(`Le fichier ${file.name} est trop volumineux (max 5MB)`)
        continue
      }

      try {
        const base64 = await fileToBase64(file)
        const fileData: FileData = {
          name: file.name,
          type: file.type,
          size: file.size,
          url: base64,
          uploadDate: new Date(),
        }
        newFiles.push(fileData)
      } catch (error) {
        console.error(`Erreur lors du traitement de ${file.name}:`, error)
      }
    }

    const allFiles = [...uploadedFiles, ...newFiles]
    setUploadedFiles(allFiles)
    setIsUploading(false)

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index)
    setUploadedFiles(newFiles)
  }

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return "🖼️"
    if (type === "application/pdf") return "📄"
    if (type.includes("word")) return "📝"
    return "📎"
  }

  return (
    <div className="space-y-4">
      {/* Zone d'upload */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple
          onChange={handleFileSelect}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <div className="space-y-2">
            <div className="text-4xl">📁</div>
            <div className="text-gray-600">
              <p className="font-medium">Cliquez pour sélectionner</p>
              <p className="text-sm">Radios, analyses, documents (max 5MB)</p>
            </div>
          </div>
        </label>
      </div>

      {/* Loading */}
      {isUploading && (
        <div className="flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-blue-600">Traitement...</span>
        </div>
      )}

      {/* Fichiers uploadés */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">Fichiers sélectionnés :</h4>
          {uploadedFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div className="flex items-center space-x-3">
                <span className="text-xl">{getFileIcon(file.type)}</span>
                <div>
                  <p className="font-medium text-sm">{file.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <button onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700" title="Supprimer">
                ❌
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Boutons */}
      <div className="flex gap-2">
        {uploadedFiles.length > 0 && (
          <button
            onClick={() => onFilesSelected(uploadedFiles)}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Valider ({uploadedFiles.length})
          </button>
        )}
        <button
          onClick={() => onFilesSelected([])}
          className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
        >
          Passer
        </button>
      </div>
    </div>
  )
}
