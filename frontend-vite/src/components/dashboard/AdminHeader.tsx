import React from "react"
import { Search } from "lucide-react"

interface AdminHeaderProps {
  title?: string
}

export function AdminHeader({ title = "Administration" }: AdminHeaderProps) {
  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-white border-b border-gray-200 shadow-sm z-10">
      <div className="px-6 py-4 h-full">
        <div className="flex items-center justify-between h-full">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent w-64"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
