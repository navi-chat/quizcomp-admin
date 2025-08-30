import { QuizType } from '@/lib/types'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import React from 'react'

const QuizCard = ({ quiz }: { quiz: QuizType }) => {
    return (
        <div className='w-sm bg-foreground/5 border rounded-xl overflow-hidden p-2 cursor-pointer' onClick={() => redirect(`/quiz/${quiz.id}`)}>
            <div>
                <Image src={quiz.thumbnail} alt='thumbnail' height={1000} width={1000} className='w-full rounded-lg aspect-video object-cover' />
            </div>
            <div className='pt-2 px-2 flex justify-between items-center'>
                <p className='text-xl font-medium'>{quiz.name}</p>
                <div className='flex gap-2 text-foreground/70'>
                    {quiz.subjects.map((subject) => (
                        <p key={subject}>{subject}</p>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default QuizCard
