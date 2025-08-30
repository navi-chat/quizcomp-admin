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
import { createRound } from "@/lib/actions/rounds.actions"
import { useParams } from "next/navigation"
import { Textarea } from "./ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { createQuestion } from "@/lib/actions/questions.actions"

const formSchema = z.object({
    statement: z.string().min(2).max(300),
    options: z.object({
        optionA: z.string().min(1),
        optionB: z.string().min(1),
        optionC: z.string().min(1),
        optionD: z.string().min(1),
    }),
    correct_answer: z.string().min(1),
    max_points: z.number(),
})

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"]
const MAX_SIZE_MB = 5
const MAX_SIZE = MAX_SIZE_MB * 1024 * 1024

const CreateQuestion = ({ isOpen, setIsOpen, round_id }: { isOpen: boolean, setIsOpen: (value: boolean) => void, round_id: string }) => {
    const [loading, setLoading] = React.useState(false)
    const params = useParams()
    const quizid = params.id as string;

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            statement: "",
            options: {},
            max_points: 5
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true)
        const quiz = await createQuestion({ ...values, round_id: round_id, options: values.options })
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
                    <DialogTitle className="flex items-center gap-3"><FilePen /> Create Question</DialogTitle>
                </DialogHeader>
                <DialogDescription className="h-0" />
                <div className="px-5 pb-6 pt-0">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                            {/* Quiz Name */}
                            <FormField
                                control={form.control}
                                name="statement"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Textarea placeholder="Question" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex w-full gap-4 *:w-full">
                                <FormField
                                    control={form.control}
                                    name="options.optionA"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input placeholder="Option A" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="options.optionB"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input placeholder="Option B" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="flex w-full *:w-full gap-4">
                                <FormField
                                    control={form.control}
                                    name="options.optionC"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input placeholder="Option C" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="options.optionD"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input placeholder="Option D" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="correct_answer"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Select {...field} onValueChange={field.onChange}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Correct Answer" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="optionA">Option A</SelectItem>
                                                    <SelectItem value="optionB">Option B</SelectItem>
                                                    <SelectItem value="optionC">Option C</SelectItem>
                                                    <SelectItem value="optionD">Option D</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="max_points"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input type="number" placeholder="Max Points" {...field}
                                                onChange={(e) => field.onChange(Number(e.target.value))} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Submit */}
                            <CustomButton disabled={loading} type="submit" className="w-full py-4 justify-center bg-primary shadow-primary/70">
                                Add Question {loading ? <Loader2 className=" animate-spin size-5" /> : <ChevronRight />}
                            </CustomButton>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default CreateQuestion
