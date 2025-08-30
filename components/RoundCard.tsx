'use client'
import { QuestionType, RoundType } from '@/lib/types'
import React, { useEffect, useState } from 'react'
import CustomButton from './custom-button'
import { Button } from './ui/button'
import CreateQuestion from './CreateQuestion'
import { getQuestionsByRoundId } from '@/lib/actions/questions.actions'

const RoundCard = ({ round }: { round: RoundType }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [questions, setQuestions] = useState<QuestionType[]>()
    useEffect(() => {
        const initialCall = async () => {
            const res = await getQuestionsByRoundId(round.id)
            setQuestions(res.data as unknown as QuestionType[])
        }
        if (isOpen === false) {
            initialCall()
        }
    }, [isOpen])
    return (
        <div className='bg-foreground/5 w-full border rounded-sm overflow-hidden'>
            <CreateQuestion isOpen={isOpen} setIsOpen={setIsOpen} round_id={round.id} />
            <div className='w-full bg-foreground/10 border-b py-2 px-4 text-lg flex justify-between items-center'>
                <p>
                    {round.name}
                </p>
                <Button variant={"outline"} onClick={() => setIsOpen(!isOpen)}>Add Question</Button>
            </div>
            <table className='w-full *:**:text-center *:**:px-2'>
                <thead>
                    <tr className='*:font-normal *:border-r *:py-2 bg-foreground/5 *:last:border-r-0'>
                        <th className='w-min'>Index</th>
                        <th className='w-max'>Question</th>
                        <th className='w-min'>Option A</th>
                        <th className='w-min'>Option B</th>
                        <th className='w-min'>Option C</th>
                        <th className='w-min'>Option D</th>
                        <th className='w-min'>Answer</th>
                        <th className='w-min'>Actions</th>
                    </tr>
                </thead>
                <tbody className='last:*:border-b-0 *:border-b-1 *:**:border-r *:**:last:border-r-0 *:**:border-b *:last:**:border-b-0 *:first:**:border-t'>
                    {questions?.map((question) => (
                        <tr className='*:font-normal *:py-2'>
                            <td>{question.index}</td>
                            <td>{question.statement}</td>
                            <td>{`${question.options.optionA}`}</td>
                            <td>{`${question.options.optionB}`}</td>
                            <td>{`${question.options.optionC}`}</td>
                            <td>{`${question.options.optionD}`}</td>
                            <td>{`${question.correct_answer}`}</td>
                            <td></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default RoundCard
