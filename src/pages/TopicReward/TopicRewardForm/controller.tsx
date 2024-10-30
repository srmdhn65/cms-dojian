import  { useState, useEffect } from 'react';
import apiServices from '../../../services/apiServices';
import showToast from '../../../helpers/toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from 'react-router-dom';
import schema, { QuestionForm } from './validation';
import FormQuestion from '.';
import { TopicInterface } from '../../../types/topics';
import { QuestionInterface } from '../../../types/question';
interface CardData {
  id: number;
  text: string;
  color: string;
  isSelected: boolean;
}
const QuestionFormController: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { itemId } = useParams();
  const [isEdit, setIsEdit] = useState(false);
  const [topicList, setTopicList] = useState<TopicInterface[]>([]);
  const [questionTypeSelected, setQuestionTypeSelected] = useState<string>('');
  const [topicSelected, setTopicSelected] = useState<string>('');
  const [correctAnswer, setCorrectAnswer] = useState<string>('')
  const [questionText, setQuestionText] = useState<string>('')
  const [caseStudy, setCaseStudy] = useState<string>('')
  const [cards, setCards] = useState<CardData[]>([
    { id: 1, text: '', color: 'bg-blue-600', isSelected: false },
    { id: 2, text: '', color: 'bg-teal-500', isSelected: false },
    { id: 3, text: '', color: 'bg-yellow-500', isSelected: false },
    { id: 4, text: '', color: 'bg-pink-500', isSelected: false },
]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<QuestionForm>({
    resolver: zodResolver(schema.post),
  });
  useEffect(() => {
    fetchItems();
    if (itemId) {
      setIsEdit(true);
      fetchItemDetails();
    }
  }, []);
  const fetchItems = async () => {
    try {
      let params = '';
      const response = await apiServices.getData(
        'api/admin/topics-pluck',
        {
          name: params,
        },
        true,
      );
      const data = response.data;
      if (response.status === 200) {
        let datas = data.data
        setTopicList(datas);
      } else {
        setTopicList([]);
      }
    } catch (error) {
      setTopicList([]);

    }
  };

  const fetchItemDetails = async () => {
    try {
      setLoading(true);
      await apiServices.getData(`api/admin/questions/${itemId}`, {}, true).then((response)=> {
        const data: QuestionInterface = response.data.data;
        register('question_type', {
          value: data.question_type || '',
          required: true,
          valueAsNumber: true,
        })
        register('topic_id', {
          value: data.topic_id || '',
          required: true,
          valueAsNumber: true,
        })
        setQuestionTypeSelected(data.question_type || '');
        setTopicSelected(String(data.topic_id));
        setCorrectAnswer(data.correct_answer || '');
        setQuestionText(data.question_text || '');
        setCaseStudy(data.case_study_details || '');
        if(data.question_type === 'mcq' || data.question_type === 'case_study'){
          setCards([]);
          setCards(data.options!.map((item, index) => ({
            id: index + 1,
            text: item,
            color: getRandomColor(),
            isSelected: item === data.correct_answer,
          })));
        }

      }).catch((error) => {
        showToast('error', 'Failed to load question details');
      }).finally(() => setLoading(false));
    } catch (error) {
      setLoading(false);
      showToast('error', 'An error occurred while fetching data');
    }
  };
  const submitData = async (data: QuestionForm) => {
    try {
      data.question_text = questionText;
      let options: string[] = [];
      if (questionTypeSelected === 'mcq' || questionTypeSelected === 'case_study') {
        options = cards.map((card) => card.text);
        for (const key in cards) {
          if(cards[key].text === ''){
            showToast('error', 'Please fill all answer option');
            return;
          }
        }
        if (correctAnswer === '') {
          showToast('error', 'Please select a correct answer');
          return;
        }
      }
      const body = {
        ...data,
        options: options,
        correct_answer: correctAnswer,
        case_study_details: questionTypeSelected === 'case_study' ? caseStudy : null
      };
      setLoading(true);
      if (isEdit) {
        await apiServices
        .patchData(`api/admin/questions/${itemId}`, body, {}, true)
        .then((response) => {
          showToast('success', response.data.message);
          navigate('/questions');
        })
        .catch((error) => {
          showToast('error', error.response.data.message);
          return '';
        }).finally(() => setLoading(false));
      }else{
        await apiServices
        .postData('api/admin/questions', body, {}, true)
        .then((response) => {
          showToast('success', response.data.message);
          navigate('/questions');
        })
        .catch((error) => {
          showToast('error', error.response.data.message);
          return '';
        }).finally(() => setLoading(false));
      }
    } catch (error) {}
  };


// Predefined color array
const colors = ['bg-blue-600', 'bg-teal-500', 'bg-yellow-500', 'bg-pink-500', 'bg-purple-500', 'bg-red-500', 'bg-green-500'];

// Function to get a random color
const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
};

// Function to handle deleting a card
const handleDelete = (id: number) => {
    if(cards.length > 1)
    setCards(cards.filter((card) => card.id !== id))
};

// Function to handle selecting a card
const handleSelect = (id: number, value: string) => {
  setCards(cards.map((card) =>
      card.id === id
          ? { ...card, isSelected: true, text: value } // Select the clicked card
          : { ...card, isSelected: false,} // Deselect all other cards

  ));
  setCorrectAnswer(value);
};

// Function to add a new card with a random color
const handleAddCard = () => {
    if(cards.length < 5)
    setCards([...cards, { id: cards.length + 1, text: '', color: getRandomColor(), isSelected: false }]);
};

const handleAnswer = (value: string) => {
  setCorrectAnswer(value);
};
  return (
    <FormQuestion
      topicList={topicList}
      questionText={questionText}
      setCaseStudy={setCaseStudy}
      correctAnswer={correctAnswer}
      setQuestionText={setQuestionText}
      handleAnswer={handleAnswer}
      questionTypeSelected={questionTypeSelected!}
      setQuestionTypeSelected={setQuestionTypeSelected!}
      topicSelected={topicSelected!}
      setTopicSelected={setTopicSelected!}
      register={register}
      cards={cards}
      handleDelete={handleDelete}
      handleSelect={handleSelect}
      handleAddCard={handleAddCard}
      handleSubmit={handleSubmit}
      errors={errors}
      submitData={submitData}
      loading={loading}
    />
  );
};

export default QuestionFormController;


