"use client"

import type { Question, FileData} from "../types/medical"
interface Props {
  files: FileData[]
}

export function FileViewer({ files }: Props) {
  if (!files || files.length === 0) return null

  const openFile = (file: FileData) => {
    const newWindow = window.open()
    if (newWindow) {
      if (file.type.startsWith("image/")) {
        newWindow.document.write(`
          <html>
            <head><title>${file.name}</title></head>
            <body style="margin:0; display:flex; justify-content:center; align-items:center; min-height:100vh; background:#f0f0f0;">
              <img src="${file.url}" style="max-width:100%; max-height:100%; object-fit:contain;" alt="${file.name}" />
            </body>
          </html>
        `)
      } else {
        newWindow.location.href = file.url
      }
    }
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return "🖼️"
    if (type === "application/pdf") return "📄"
    if (type.includes("word")) return "📝"
    return "📎"
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
  }

  return (
    <div className="space-y-2">
      {files.map((file, index) => (
        <div key={index} className="border rounded p-2 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-lg">{getFileIcon(file.type)}</span>
              <div>
                <p className="font-medium text-sm">{file.name}</p>
                <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
              </div>
            </div>
            <button
              onClick={() => openFile(file)}
              className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200"
            >
              👁️ Voir
            </button>
          </div>

          {/* Aperçu image */}
          {file.type.startsWith("image/") && (
            <div className="mt-2">
              <img
                src={file.url || "/placeholder.svg"}
                alt={file.name}
                className="max-w-full h-24 object-cover rounded cursor-pointer"
                onClick={() => openFile(file)}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
