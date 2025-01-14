import React, { useEffect, useState } from "react";
import { Button, Alert, Row, Col } from "react-bootstrap";
import { Navigate, Link, useLocation, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslation } from "react-i18next";
import classNames from "classnames";




// components
import { VerticalForm, FormInput } from "../../components/";

import AuthLayout from "./AuthLayout";
import { APICore, setAuthorization } from "../../helpers/api/apiCore";
import apiServices from "../../services/apiServices";
import showToast from "../../helpers/toast";
import CustomButton from "../../components/CustomButton";


interface UserData {
  email: string;
  password: string;
}

/* bottom links */
const BottomLink = () => {
  const { t } = useTranslation();

  return (
    <Row className="mt-3">
      <Col className="text-center">
        <p>
          <Link to={"/auth/forget-password"} className="text-white-50 ms-1">
            {t("Forgot your password?")}
          </Link>
        </p>
        <p className="text-white-50">
          {t("Don't have an account?")}{" "}
          <Link to={"/auth/register"} className="text-white ms-1">
            <b>{t("Sign Up")}</b>
          </Link>
        </p>
      </Col>
    </Row>
  );
};

/* social links */
const SocialLinks = () => {
  const socialLinks = [
    {
      variant: "primary",
      icon: "facebook",
    },
    {
      variant: "danger",
      icon: "google",
    },
    {
      variant: "info",
      icon: "twitter",
    },
    {
      variant: "secondary",
      icon: "github",
    },
  ];
  return (
    <>
      <ul className="social-list list-inline mt-3 mb-0">
        {(socialLinks || []).map((item, index: number) => {
          return (
            <li key={index} className="list-inline-item">
              <Link
                to="#"
                className={classNames(
                  "social-list-item",
                  "border-" + item.variant,
                  "text-" + item.variant
                )}
              >
                <i className={classNames("mdi", "mdi-" + item.icon)}></i>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
};
const api = new APICore();

const Login = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isLoading, setLoading] = useState(false);


  /*
  form validation schema
  */
  const schemaResolver = yupResolver(
    yup.object().shape({
      email: yup.string().required(t("Please enter Email")),
      password: yup.string().required(t("Please enter Password")),
    })
  );

  /*
  handle form submission
  */
  const onSubmit = async (formData: UserData) => {
    try {
      setLoading(true);
      await apiServices
        .postData(`login`, formData, {}, false)
        .then((response) => {
          showToast('success', 'Berhasil Login');
          const data = response.data.data;
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data))
          api.setLoggedInUser(data);
          setAuthorization(data.token);
          navigate('/');
        })
        .catch((error) => {
          showToast('error', error || 'Terjadi kesalahan pada server');
        }).finally(() => {
          setLoading(false);
        });
    } catch (error) {
      console.error("error", error);
      // showToast('error', 'Terjadi kesalahan pada server');
    }
  };

  return (
    <>


      <AuthLayout
        helpText={t(
          "Enter your email address and password to access admin panel."
        )}
      // bottomLinks={<BottomLink />}
      >


        <VerticalForm<UserData>
          onSubmit={onSubmit}
          resolver={schemaResolver}
          defaultValues={{ email: "test", password: "test" }}
        >
          <FormInput
            label={t("Email")}
            type="text"
            name="email"
            placeholder="Enter your email"
            containerClass={"mb-3"}
          />
          <FormInput
            label={t("Password")}
            type="password"
            name="password"
            placeholder="Enter your password"
            containerClass={"mb-3"}
          ></FormInput>

          <div className="text-center d-grid">
            <CustomButton type="submit" label="Login" loading={isLoading} />
          </div>
        </VerticalForm>

        {/* <div className="text-center">
          <h5 className="mt-3 text-muted">{t("Sign in with")}</h5>
          <SocialLinks />
        </div> */}
      </AuthLayout>
    </>
  );
};

export default Login;
