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

const formSchema = z.object({
    name: z.string().min(2).max(50),
    time_per_question: z.number().min(30),
})

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"]
const MAX_SIZE_MB = 5
const MAX_SIZE = MAX_SIZE_MB * 1024 * 1024

const CreateRound = ({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (value: boolean) => void }) => {
    const [loading, setLoading] = React.useState(false)
    const params = useParams()
    const quizid = params.id as string;

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            time_per_question: 60
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true)
        const quiz = await createRound({ ...values }, quizid)
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
                    <DialogTitle className="flex items-center gap-3"><FilePen /> Create Round</DialogTitle>
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
                                            <Input placeholder="Round Name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />


                            {/* DPQ */}
                            <FormField
                                control={form.control}
                                name="time_per_question"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input type="number" placeholder="Time per Question" {...field}
                                                onChange={(e) => field.onChange(Number(e.target.value))} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Submit */}
                            <CustomButton disabled={loading} type="submit" className="w-full py-4 justify-center bg-primary shadow-primary/70">
                                Create Round {loading ? <Loader2 className=" animate-spin size-5" /> : <ChevronRight />}
                            </CustomButton>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default CreateRound
