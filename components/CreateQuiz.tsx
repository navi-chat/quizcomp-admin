"use client"

import {
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle
} from "@/components/ui/dialog"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
    Form, FormControl, FormField, FormItem, FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import React, { useEffect } from "react"
import CustomButton from "./custom-button"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { ChevronDownIcon, ChevronRight, FilePen, ImageIcon, Loader2, Trash2, X } from "lucide-react"
import { Calendar } from "./ui/calendar"
import { createQuiz } from "@/lib/actions/quizzes.actions"

const formSchema = z.object({
    name: z.string().min(2).max(50),
    subjects: z.array(z.string().min(1)),
    date: z.string().min(1), // Final combined Date+Time in string format
    thumbnail: z.instanceof(File)
})

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"]
const MAX_SIZE_MB = 5
const MAX_SIZE = MAX_SIZE_MB * 1024 * 1024

const CreateQuiz = ({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (value: boolean) => void }) => {
    const [open, setOpen] = React.useState(false)
    const [loading, setLoading] = React.useState(false)
    const [date, setDate] = React.useState<Date | undefined>(undefined)
    const [time, setTime] = React.useState("10:30:00")
    const [subjectInput, setSubjectInput] = React.useState("")

    const [thumbnailPreview, setThumbnailPreview] = React.useState<string | null>(null)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            subjects: [],
            date: "",
        },
    })

    // Add subject on Enter
    const handleSubjectKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && subjectInput.trim()) {
            e.preventDefault()
            const currentSubjects = form.getValues("subjects")
            form.setValue("subjects", [...currentSubjects, subjectInput.trim()])
            setSubjectInput("")
        }
    }

    // Remove subject by index
    const removeSubject = (index: number) => {
        const currentSubjects = form.getValues("subjects")
        form.setValue("subjects", currentSubjects.filter((_, i) => i !== index))
    }

    React.useEffect(() => {
        return () => {
            if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview)
        }
    }, [thumbnailPreview])

    // Handle thumbnail selection
    const onSelectThumbnail: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validate type/size
        if (!ALLOWED_TYPES.includes(file.type)) {
            form.setError("thumbnail", { message: "Only PNG, JPG, or WEBP allowed" })
            return
        }
        if (file.size > MAX_SIZE) {
            form.setError("thumbnail", { message: `Max file size is ${MAX_SIZE_MB} MB` })
            return
        }

        // Clear any previous error
        form.clearErrors("thumbnail")

        // Create preview
        if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview)
        const url = URL.createObjectURL(file)
        setThumbnailPreview(url)

        // Set file in form
        form.setValue("thumbnail", file, { shouldValidate: true })
    }

    // Submit
    useEffect(() => {
        if (date && time) {
            const [hours, minutes, seconds] = time.split(":").map(Number)
            const combined = new Date(date)
            combined.setHours(hours, minutes, seconds || 0)
            form.setValue("date", combined.toISOString())
        }
    }, [date, time])

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true)
        const quiz = await createQuiz({ ...values })
        if (quiz.error) {
            console.log(quiz.error)
        }
        setLoading(false)
        form.reset()
        setIsOpen(false)
    }

    return (
        <Dialog open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-3"><FilePen /> Create Quiz</DialogTitle>
                </DialogHeader>
                <DialogDescription className="h-0" />
                <div className="px-5 pb-6 pt-0">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                            {/* Quiz Name */}
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input placeholder="Quiz Name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="thumbnail"
                                render={() => (
                                    <FormItem>
                                        <FormControl>
                                            <div className="flex items-start gap-4">
                                                <label
                                                    htmlFor="thumbnail"
                                                    className="flex items-center gap-2 border rounded-md px-3 py-2 cursor-pointer bg-input/30 hover:bg-input/50 transition-all"
                                                >
                                                    <ImageIcon size={18} />
                                                    <span>Upload thumbnail</span>
                                                </label>
                                                <input
                                                    id="thumbnail"
                                                    type="file"
                                                    accept="image/png,image/jpeg,image/webp"
                                                    className="hidden"
                                                    onChange={onSelectThumbnail}
                                                />
                                                {thumbnailPreview ? (
                                                    <div className="relative">
                                                        <img
                                                            src={thumbnailPreview}
                                                            alt="Thumbnail preview"
                                                            className="h-16 w-28 object-cover rounded-md border"
                                                        />
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-muted-foreground items-center flex h-10">PNG, JPG, or WEBP up to {MAX_SIZE_MB} MB</span>
                                                )}
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Date + Time + DPQ */}
                            <div className="flex gap-4">
                                {/* Date Picker */}
                                <div className="flex flex-col gap-3 w-full">
                                    <Popover open={open} onOpenChange={setOpen}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                id="date-picker"
                                                className="w-full justify-between font-normal h-12"
                                                type="button"
                                            >
                                                {date ? date.toLocaleDateString() : "Select date"}
                                                <ChevronDownIcon />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={date}
                                                captionLayout="dropdown"
                                                onSelect={(d) => {
                                                    setDate(d)
                                                    setOpen(false)
                                                }}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                {/* Time Picker */}
                                <div className="flex flex-col gap-3 w-full">
                                    <Input
                                        type="time"
                                        step="1"
                                        value={time}
                                        onChange={(e) => setTime(e.target.value)}
                                        className="bg-background"
                                    />
                                </div>
                            </div>

                            {/* Subjects Tag Input */}
                            <FormField
                                control={form.control}
                                name="subjects"
                                render={() => (
                                    <FormItem>
                                        <FormControl>
                                            <div className="flex flex-wrap gap-2 border p-2 rounded-md bg-input/30 border-input h-12 pl-4">
                                                {form.watch("subjects").map((subj, index) => (
                                                    <span key={index} className="flex items-center gap-1 bg-foreground/10 px-2 pl-4 py-1 rounded-lg text-sm">
                                                        {subj}
                                                        <X size={14} className="cursor-pointer" onClick={() => removeSubject(index)} />
                                                    </span>
                                                ))}
                                                <input
                                                    value={subjectInput}
                                                    onChange={(e) => setSubjectInput(e.target.value)}
                                                    onKeyDown={handleSubjectKeyDown}
                                                    placeholder="Add subject"
                                                    className="flex-1 outline-none bg-transparent"
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Submit */}
                            <CustomButton disabled={loading} type="submit" className="w-full py-4 justify-center bg-primary shadow-primary/70">
                                Create Quiz {loading ? <Loader2 className=" animate-spin size-5" /> : <ChevronRight />}
                            </CustomButton>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default CreateQuiz
