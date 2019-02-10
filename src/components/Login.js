import React, { useState, useContext } from "react";
import { gql } from "apollo-boost";
import styled from "styled-components";
import Loader from "react-loader-spinner";
import { Card as CCard, Heading, Button as CButton } from "rebass";
import { Mutation } from "react-apollo";
import { authContext } from "../providers";

// Styles scoped

export const ButtonM = styled(CButton)`
  cursor: pointer;
  transition: all 0.2s;
  transform: translateY(0px);
  background-color: #00d8ff;

  &:hover {
    transform: translateY(1px);
  }
`;

const Button = styled(ButtonM)`
  padding: 10px;
`;
const Card = styled(CCard)`
  transition: all 1s ease;
  text-align: center;
`;

const ModalLogin = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.36);
`;

const LoginCard = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  width: 300px;
  transform: translate(-50%, -50%);
`;

export const Input = styled.input`
  outline: none;
  border: none;
  padding: 1em;
  background-color: rgba(89, 97, 114, 0.3);
  border-radius: 4px;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 0px 20px;
  color: whitesmoke;
  width: 80%;
  font-size: 0.3em;

  &::placeholder {
    color: rgba(255, 255, 255, 0.596);
  }
`;

const Span = styled.span`
  font-size: 0.3em;
  color: rgba(255, 255, 255, 0.596);
  margin: 10px;
  cursor: pointer;
`;

const ContainerForm = styled.div`
  text-align: center;
`;

// Define queries
const LOGIN_USER = gql`
  mutation($user: LoginCredentials!) {
    login(user: $user) {
      token
      _id
      nickname
      name
      pic
    }
  }
`;

const SIGNUP_USER = gql`
  mutation($user: newUserCredentials!) {
    signup(user: $user) {
      token
      _id
      nickname
      name
      pic
    }
  }
`;

// Define component
function Login(props) {
  const [isLogin, setIsLogin] = useState(true);
  const [dataForm, setdataForm] = useState({});
  const { dispatch } = useContext(authContext);

  const handleOnChange = {
    onChange: handleInputChange
  };

  function toggleStatusLogin(_) {
    setIsLogin(!isLogin);
    setdataForm({});
  }

  function handleInputChange({ target }) {
    const { name, value } = target;
    setdataForm({ ...dataForm, [name]: value });
  }

  function onComplete(data) {
    const { token, ...user } = isLogin ? data.login : data.signup;
    dispatch({ type: "SET_TOKEN", token, user });
  }

  return (
    <ModalLogin>
      <LoginCard>
        <Card
          fontSize={6}
          fontWeight="bold"
          width={[1]}
          p={4}
          bg="#282c34"
          borderRadius={8}
          boxShadow="0 2px 16px rgba(0, 0, 0, 0.25)"
        >
          <Mutation
            mutation={isLogin ? LOGIN_USER : SIGNUP_USER}
            onCompleted={onComplete}
            variables={{ user: { ...dataForm } }}
          >
            {(mutate, { loading }) => {
              if (loading)
                return (
                  <Loader type="Triangle" height="80" width="80" color="#fff" />
                );
              return (
                <ContainerForm>
                  <Heading as="h6">{isLogin ? "Login" : "Sign Up"}</Heading>
                  {isLogin ? (
                    <>
                      <Input
                        type="text"
                        name="email"
                        placeholder="email"
                        {...handleOnChange}
                      />
                      <Input
                        type="password"
                        name="password"
                        placeholder="password"
                        {...handleOnChange}
                      />
                    </>
                  ) : (
                    <>
                      <Input
                        type="text"
                        name="name"
                        placeholder="name"
                        {...handleOnChange}
                      />
                      <Input
                        type="text"
                        name="email"
                        placeholder="email"
                        {...handleOnChange}
                      />
                      <Input
                        type="text"
                        name="nickname"
                        placeholder="nickname"
                        {...handleOnChange}
                      />
                      <Input
                        type="password"
                        name="password"
                        placeholder="password"
                        {...handleOnChange}
                      />
                    </>
                  )}
                  <Button bg="#00d8ff" fontSize={1} onClick={mutate}>
                    SUBMIT
                  </Button>
                  <Span>
                    <strong onClick={toggleStatusLogin}>
                      {isLogin ? "Sign up" : "Log In"}
                    </strong>
                    , please.{" "}
                  </Span>
                </ContainerForm>
              );
            }}
          </Mutation>
        </Card>
      </LoginCard>
    </ModalLogin>
  );
}

export default Login;
