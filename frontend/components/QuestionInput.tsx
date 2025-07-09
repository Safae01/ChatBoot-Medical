    "use client"

    import { useState } from "react"
    import { Button } from "@/components/ui/button"
    import { Input } from "@/components/ui/input"
    import { Checkbox } from "@/components/ui/checkbox"
    import type { Question } from "../types/medical"
    import { validateInput } from "../utils/validation"

    interface QuestionInputProps {
    question: Question
    onAnswer: (answer: string | string[] | File) => void
    }

    export function QuestionInput({ question, onAnswer }: QuestionInputProps) {
    const [textAnswer, setTextAnswer] = useState("")
    const [selectedOptions, setSelectedOptions] = useState<string[]>([])
    const [selectedOption, setSelectedOption] = useState("")
    const [fileAnswer, setFileAnswer] = useState<File | null>(null)
    const [error, setError] = useState("")

    const handleSubmit = () => {
        let answer: string | string[] | File | null = null

        if (question.type === "text") {
        if (textAnswer.trim()) {
            answer = textAnswer.trim()
            setTextAnswer("")
        }
        } else if (question.type === "select") {
        if (selectedOption) {
            answer = selectedOption
            setSelectedOption("")
        }
        } else if (question.type === "multiselect") {
        if (selectedOptions.length > 0) {
            answer = selectedOptions
            setSelectedOptions([])
        }
        } else if (question.type === "file") {
        if (fileAnswer) {
            answer = fileAnswer
            setFileAnswer(null)
        }
        }

        if (answer !== null) {
        setError("")
        onAnswer(answer)
        } else {
        setError("Veuillez fournir une réponse valide.")
        }
    }

    const handleMultiSelectChange = (option: string, checked: boolean) => {
        setSelectedOptions((prev) =>
        checked ? [...prev, option] : prev.filter((item) => item !== option)
        )
    }

    return (
        <div className="bg-white p-4 border rounded-lg shadow-sm space-y-2">
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
                    handleSubmit()
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
                    onCheckedChange={(checked) =>
                        handleMultiSelectChange(option, checked as boolean)
                    }
                    />
                    <label htmlFor={option} className="text-sm cursor-pointer">
                    {option}
                    </label>
                </div>
                ))}
            </div>
            <Button
                onClick={handleSubmit}
                disabled={selectedOptions.length === 0}
                className="w-full"
            >
                Valider la sélection
            </Button>
            </div>
        )}

        {question.type === "file" && (
            <div className="space-y-2">
            <Input
                type="file"
                onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) setFileAnswer(file)
                }}
            />
            <Button
                onClick={handleSubmit}
                disabled={!fileAnswer}
                className="w-full"
            >
                Envoyer le fichier
            </Button>
            </div>
        )}

        {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
    )
    }
