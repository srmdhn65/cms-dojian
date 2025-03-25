export type QuestionInterface = {
    id: number | null,
    topic_id: string | null,
    topic: any,
    question_text: string | null,
    question_type: string | null,
    options: string[] | null,
    correct_answer: string | null,
    case_study_details: string | null,
    is_selected: boolean | false,
    createdAt: string | null,
    updatedAt: string | null
}