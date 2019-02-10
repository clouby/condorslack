import React, { Suspense, lazy, useContext, useState, useRef } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import styled from "styled-components";
import { Flex, Box, Heading, Text as BText } from "rebass";
import Modal from "./Modal";
import { authContext } from "../providers";
import { Mutation } from "react-apollo";
import { gql } from "apollo-boost";
import { Input as IInput } from "./Chatbox";
import { ButtonM } from "./Login";

const ImageAvatar = lazy(() => import("./ImageAvatar"));

const Avatar = styled.div`
  border-radius: 50px;
  background: whitesmoke;
  text-align: center;
  overflow: hidden;
  width: 37px;
  margin-right: 8px;

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
    cursor: pointer;
  }
`;

const Input = styled(IInput)`
  font-size: 0.5em;
`;

export const TextForeground = styled(BText)`
  color: rgba(255, 255, 255, 0.596);
`;

const SpanClose = styled.span`
  opacity: 0;
  cursor: pointer;
`;

const TextPass = styled(TextForeground)`
  display: flex;
  width: 100%;
  justify-content: space-between;

  &:hover > span:last-child {
    opacity: 1;
  }
`;

const UPLOAD_FILE = gql`
  mutation($file: Upload!) {
    uploadPicture(file: $file)
  }
`;

function User({ user, isAuth, dispatchAuth, history }) {
  const { dispatch } = useContext(authContext);
  const [modalStatus, setModalStatus] = useState(false);
  const [inputKey, setInputKey] = useState(new Date().getTime());
  const imageRef = useRef(null);

  function onCloseModal() {
    setModalStatus(false);
  }

  function onOpenModal(e) {
    setModalStatus(true);
  }

  function onCloseSession() {
    const confirm = window.confirm("Are you sure?");
    if (confirm) {
      dispatch({ type: "REMOVE_TOKEN" });
      history.replace("/");
    }
  }

  function loadImage(mutate) {
    return async _ => {
      console.dir(imageRef.current);
      const [file] = imageRef.current.files;
      const { data } = await mutate({ variables: { file } });
      dispatch({ type: "UPDATE_USER", pic: data.uploadPicture });

      setInputKey(new Date().getTime());
      onCloseModal();
    };
  }

  return (
    <Flex alignItems="center">
      <Box flex="0 0 10px">
        <Avatar onClick={onOpenModal}>
          {isAuth && (
            <Suspense
              fallback={
                <div
                  style={{
                    width: "37px",
                    height: "37px",
                    backgroundColor: "rgba(255, 255, 255, 0.596)"
                  }}
                />
              }
            >
              <ImageAvatar pic={user.pic} />
            </Suspense>
          )}
        </Avatar>
      </Box>
      <Box flex="4">
        <Heading as="h5" fontSize={2}>
          {user ? user.name : ""}
        </Heading>
        <TextPass fontSize={0}>
          <span>{user ? `@${user.nickname}` : ""}</span>{" "}
          <SpanClose onClick={onCloseSession}>x</SpanClose>
        </TextPass>
      </Box>
      <Modal isOpen={modalStatus} onRequestClose={onCloseModal}>
        <Mutation mutation={UPLOAD_FILE}>
          {(mutate, { loading }) => {
            return (
              <Flex
                fontSize={3}
                p={2}
                justifyContent="space-around"
                alignItems="center"
              >
                <Box>
                  <Input
                    type="file"
                    ref={imageRef}
                    disabled={loading}
                    accept="image/*"
                  />
                </Box>
                <Box fontSize={1}>
                  <ButtonM onClick={loadImage(mutate)}>LOAD</ButtonM>
                </Box>
              </Flex>
            );
          }}
        </Mutation>
      </Modal>
    </Flex>
  );
}

User.propTypes = {
  user: PropTypes.object,
  isAuth: PropTypes.bool
};

export default withRouter(User);
