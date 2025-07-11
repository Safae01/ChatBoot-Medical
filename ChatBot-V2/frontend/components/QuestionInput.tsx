"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import type { Question } from "../types/medical"

interface QuestionInputProps {
  question: Question
  onAnswer: (answer: string | string[]) => void
}

export function QuestionInput({ question, onAnswer }: QuestionInputProps) {
  const [textAnswer, setTextAnswer] = useState("")
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [selectedOption, setSelectedOption] = useState("")

  const handleSubmit = () => {
    if (question.type === "text") {
      if (textAnswer.trim()) {
        onAnswer(textAnswer.trim())
        setTextAnswer("")
      }
    } else if (question.type === "select") {
      if (selectedOption) {
        onAnswer(selectedOption)
        setSelectedOption("")
      }
    } else if (question.type === "multiselect") {
      if (selectedOptions.length > 0) {
        onAnswer(selectedOptions)
        setSelectedOptions([])
      }
    }
  }

  const handleMultiSelectChange = (option: string, checked: boolean) => {
    if (checked) {
      setSelectedOptions((prev) => [...prev, option])
    } else {
      setSelectedOptions((prev) => prev.filter((item) => item !== option))
    }
  }

  return (
    <div className="bg-white p-4 border rounded-lg shadow-sm">
      {question.type === "text" && (
        <div className="flex gap-2">
          <Input
            value={textAnswer}
            onChange={(e) => setTextAnswer(e.target.value)}
            placeholder="Tapez votre réponse..."
            onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
          />
          <Button onClick={handleSubmit} disabled={!textAnswer.trim()}>
            Envoyer
          </Button>
        </div>
      )}

      {question.type === "select" && (
        <div className="space-y-2">
          {question.options?.map((option) => (
            <Button
              key={option}
              variant={selectedOption === option ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() => {
                setSelectedOption(option)
                onAnswer(option)
              }}
            >
              {option}
            </Button>
          ))}
        </div>
      )}

      {question.type === "multiselect" && (
        <div className="space-y-3">
          <div className="space-y-2">
            {question.options?.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={option}
                  checked={selectedOptions.includes(option)}
                  onCheckedChange={(checked) => handleMultiSelectChange(option, checked as boolean)}
                />
                <label htmlFor={option} className="text-sm cursor-pointer">
                  {option}
                </label>
              </div>
            ))}
          </div>
          <Button onClick={handleSubmit} disabled={selectedOptions.length === 0} className="w-full">
            Valider la sélection
          </Button>
        </div>
      )}
    </div>
  )
}
