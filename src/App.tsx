import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import ECommerce from './pages/Dashboard/ECommerce';
import ProtectRoute from './helpers/authorization';
import UserController from './pages/Users/UsersController';
import UserAddController from './pages/UserAdd/controller';
import UserEditController from './pages/UserEdit/controller';
import TopicController from './pages/Topic/TopicList/controller';
import TopicAddController from './pages/Topic/TopicForm/controller';
import QuestionController from './pages/Question/QuestionList/controller';
import QuestionFormController from './pages/Question/QuestionForm/controller';
import BadgeController from './pages/Badge/List/controller';
import BadgeFormController from './pages/Badge/Form/controller';
import { Toaster } from 'react-hot-toast';



function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);

  }, []);

  return loading ? (
    <Loader />
  ) : (
    <>
      <div><Toaster   position="top-right"
  reverseOrder={false}/></div>
      <Routes>
        <Route
          path="/auth/signin"
          element={
            <>
              <PageTitle title="Signin | Admin Dashboard" />
              <SignIn />
            </>
          }
        />
        <Route
          path="/auth/signup"
          element={
            <>
              <PageTitle title="Signup | Admin Dashboard" />
              <SignUp />
            </>
          }
        />
        <Route path="/" element={<ProtectRoute />}>
          <Route
            index
            element={
              <>
                <PageTitle title="eCommerce Dashboard | Admin Dashboard" />
                <ECommerce />
              </>
            }
          />
          <Route
            path="/users"
            element={
              <>
                <PageTitle title="Users | Admin Dashboard" />
                <UserController />
              </>
            }
          />
          <Route
            path="users/create" // Note the corrected path
            element={
              <>
                <PageTitle title="Add Users | Admin Dashboard" />
                <UserAddController />
              </>
            }
          />
          <Route
            path="users/:id/edit" // Note the corrected path
            element={
              <>
                <PageTitle title="Ubah Users | Admin Dashboard" />
                <UserEditController />
              </>
            }
          />
          <Route
            path="/topics"
            element={
              <>
                <PageTitle title="Topik | Admin Dashboard" />
                <TopicController />
              </>
            }
          />
            <Route
            path="/topics/form"
            element={
              <>
                <PageTitle title="Topic Add | Admin Dashboard" />
                <TopicAddController />
              </>
            }
          />
          <Route
            path="/topics/form/:itemId"
            element={
              <>
                <PageTitle title="Topic Edit | Admin Dashboard" />
                <TopicAddController />
              </>
            }
          />
          <Route
            path="/questions"
            element={
              <>
                <PageTitle title="Question | Admin Dashboard" />
                <QuestionController />
              </>
            }
          />
          <Route
            path="/questions/form"
            element={
              <>
                <PageTitle title="Question Form | Admin Dashboard" />
                <QuestionFormController />
              </>
            }
          />
            <Route
            path="/questions/form/:itemId"
            element={
              <>
                <PageTitle title="Question Edit | Admin Dashboard" />
                <QuestionFormController />
              </>
            }
          />
           <Route
            path="/badges"
            element={
              <>
                <PageTitle title="Badges | Admin Dashboard" />
                <BadgeController />
              </>
            }
          />
        </Route>
        <Route
            path="/badges/form"
            element={
              <>
                <PageTitle title="Badges Form | Admin Dashboard" />
                <BadgeFormController />
              </>
            }
          />
            <Route
            path="/badges/form/:itemId"
            element={
              <>
                <PageTitle title="Badges Edit | Admin Dashboard" />
                <BadgeFormController />
              </>
            }
          />
      </Routes>
    </>
  );
}

export default App;
