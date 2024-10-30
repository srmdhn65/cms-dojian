import {
  FieldErrors,
  UseFormHandleSubmit,
  UseFormRegister,
} from 'react-hook-form';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';

import DefaultLayout from '../../../layout/DefaultLayout';
import CustomButton from '../../../components/Button/CustomButton';
import { QuestionForm } from './validation';
import SelectCustomObject from '../../../components/Select/SelectCustom';
import { QuestionType } from '../../../config/constant-cms';
import TextEditorCustom from '../../../components/Input/TextEditorCustom';
import { TopicInterface } from '../../../types/topics';
import Card from '../../../components/Card/Card';
import TextInput from '../../../components/Input/TextInput';
import BoxedText from '../../../components/Card/CardText';
import Loader from '../../../common/Loader';

interface CardData {
  id: number;
  text: string;
  color: string;
  isSelected: boolean;
}
interface Props {
  register: UseFormRegister<QuestionForm>;
  topicList: TopicInterface[];
  cards: CardData[];
  setQuestionText: React.Dispatch<React.SetStateAction<string>>;
  handleAnswer: (id: string) => void;
  handleDelete: (id: number) => void;
  handleSelect: (id: number, value: string) => void;
  handleAddCard: () => void;
  questionTypeSelected: string;
  correctAnswer: string;
  setQuestionTypeSelected: React.Dispatch<React.SetStateAction<string>>;
  topicSelected: string;
  questionText: string;
  setCaseStudy: React.Dispatch<React.SetStateAction<string>>;
  setTopicSelected: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: UseFormHandleSubmit<QuestionForm, QuestionForm>;
  errors: FieldErrors<QuestionForm>;
  submitData: (data: QuestionForm) => Promise<void>;
  loading: boolean;
}
const FormQuestion: React.FC<Props> = (props) => {



  return (
    props.loading ? (
      <Loader/>
    ) : (
      <DefaultLayout>
        <div className="mx-auto max-w-270">
          <Breadcrumb pageName="Topic Form" />
          <div className="col-span-5 xl:col-span-3">
            <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
              <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                </h3>
              </div>
              <div className="p-7">
                <form onSubmit={props.handleSubmit(props.submitData)}>
                  <div className="flex flex-col gap-5.5 sm:flex-row">
                    <SelectCustomObject
                      title="Tipe Soal"
                      items={QuestionType}
                      placeholder="Pilih Salah satu"
                      defaultValue={
                        {
                          label: QuestionType.find((item) => item.value.toString() === props.questionTypeSelected)?.label || '',
                          value: props.questionTypeSelected
                        }
                      }
                      onChange={(selectedOption) => {
                        props.setQuestionTypeSelected(selectedOption.value);
                        props.register('question_type', {
                          value: selectedOption.value,
                          setValueAs: (value: string) => value,
                          valueAsNumber: false,
                        })
                      }} // Handle selected option
                      errors={props.errors.topic_id?.message} updateType='question_type'
                    />
                    <SelectCustomObject
                      title="Topic"
                      items={props.topicList.map((item) => ({
                        label: item.name || '',
                        value: item.id?.toString() || '',
                      }))}
                      defaultValue={
                        {
                          label: props.topicList.find((item) => item.id?.toString() === props.topicSelected)?.name || '',
                          value: props.topicSelected
                        }
                      }
                                          placeholder="Pilih Salah satu"
                      onChange={(selectedOption) => {
                        props.setTopicSelected(selectedOption.value);
                        props.register('topic_id', {
                          value: selectedOption.value,
                        })
                      }} // Handle selected option
                      errors={props.errors.topic_id?.message} updateType='topic_id'
                    />
                  </div>
                  <TextEditorCustom
                    labelTitle="Question"
                    placeholder="Enter Question"
                    defaultValue={props.questionText}
                    updateType="question_text"
                    updateFormValue={(data) => {
                      props.setQuestionText(data.value);
                      props.register('question_text', {
                        value: data.value || '',
                        required: true,
                      })
                    }}
                    error={props.errors.question_text?.message}
                  />
                    {
                    props.questionTypeSelected === 'case_study' ? 
                     
                    <TextInput
                    labelTitle="Case Study Detail"
                    placeholder="Type here"
                    updateType="case_study"
                    defaultValue={props.correctAnswer}
                    updateFormValue={(value) => {
                      props.setCaseStudy(value.value);
  
                    }} 
                    />
                    : null
                  }
                  {
                    props.questionTypeSelected === 'mcq' || props.questionTypeSelected === 'case_study' ? <div className="flex space-x-4 mb-8">
                      {props.cards.map((card) => (
                        <Card
                          key={card.id}
                          color={card.color}
                          text={card.text}
                          isSelected={card.isSelected}
                          onDelete={() => props.handleDelete(card.id)}
                          onSelect={(value) => props.handleSelect(card.id, value)}
                        />
                      ))}
                      <button
                        className="px-4 py-2 bg-blue-600 text-white rounded-md focus:outline-none hover:bg-blue-500"
                        onClick={props.handleAddCard}
                        type='button'
                      >
                        Add New
                      </button>
                    </div> : <TextInput
                      labelTitle="Answer"
                      placeholder="Type answer here"
                      updateType="correct_answer"
                      defaultValue={props.correctAnswer}
                      updateFormValue={(value) => {
                        props.handleAnswer(value.value);
                      }}
  
                    // error={props.errors.question_text?.message}
                    // register={{
                    //   ...props.register('question_text'),
                    // }}
                    />
                  }
                
                  {
                    props.questionTypeSelected === 'fill_the_blank' || props.questionTypeSelected === 'word_association' ? (
                      <div className="text-center mb-4">
                      <h1 className="text-black dark:text-white mb-2 text-2xl font-bold">
                        Jawaban yang akan tampil
                      </h1>
                      {/* BoxedText will contain the answer boxes */}
                      <BoxedText text={props.correctAnswer} />
                    </div>
                    ) : null
                  }
                  <div className="flex justify-end gap-4.5">
                    <CustomButton label="Save" type="submit" />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </DefaultLayout>
    )
  )
};

export default FormQuestion;
