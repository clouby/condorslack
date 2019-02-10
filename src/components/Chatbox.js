import React, { useRef, useState } from "react";
import styled from "styled-components";
import Loader from "react-loader-spinner";
import { gql } from "apollo-boost";
import { Flex, Box, Heading, Text } from "rebass";
import { Query, Mutation } from "react-apollo";

// Local Dependencies
import { Input as IInput, ButtonM } from "./Login";
import { Conversation } from "./Conversation";

export const FlexFullHeight = styled(Flex)`
  height: 100%;
`;

export const FlexLoading = styled(FlexFullHeight)`
  opacity: 0.3;
`;

const BoxConversation = styled(Box)`
  height: 50%;
`;

const Button = styled(ButtonM)`
  border-radius: 50px;
  height: 42px;
  outline: none;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 8px 20px;
`;

export const Input = styled(IInput)`
  font-size: 0.5em;

  &:disabled {
    opacity: 0.4;
  }
`;

const HeaderChatContainer = styled(Flex)`
  border-bottom: 0.5px solid rgba(0, 0, 0, 0.46);
  background: rgba(42, 47, 57, 0.5);
  height: 1.9em;
`;

const Badge = styled(Text)`
  color: gray;
`;

const GET_CONVERSATIONS = gql`
  query($id: String!) {
    getConversations(_id: $id) {
      message
      conversation
      date
      author {
        name
      }
    }
  }
`;

const POST_MESSAGE = gql`
  mutation($idConversation: String!, $message: String!) {
    postMessage(idConversation: $idConversation, message: $message)
  }
`;

export const MESSAGE_POSTED = gql`
  subscription($idConversation: String!) {
    messagePosted(idConversation: $idConversation) {
      _id
      message
      conversation
      date
      author {
        name
      }
    }
  }
`;

const RenderHeader = ({ state }) => {
  if (!state) return <Heading>-</Heading>;
  return (
    <>
      {state.name && <Heading fontFamily="sans-serif">{state.name}🔥</Heading>}
      {state.email && (
        <Badge fontSize={0} ml={1}>
          • {state.email}
        </Badge>
      )}
    </>
  );
};

function Chatbox({ match: { params }, location: { state } }) {
  const messageEl = useRef(null);

  function handleSubmit(mutate) {
    return async _ => {
      if (!messageEl.current || !messageEl.current.value) return;
      const { value } = messageEl.current;
      await mutate({
        variables: { idConversation: params.id, message: value.trim() }
      });
      messageEl.current.value = "";
    };
  }
  return (
    <Query
      query={GET_CONVERSATIONS}
      fetchPolicy="network-only"
      variables={{ id: params.id }}
    >
      {({ data, loading, error, subscribeToMore }) => {
        if (loading)
          return (
            <FlexLoading justifyContent="center" alignItems="center">
              <Loader type="Triangle" height="80" width="80" color="#fff" />
            </FlexLoading>
          );
        if (error) {
          return (
            <FlexLoading justifyContent="center" alignItems="center">
              <Text>
                This chat ID doesn't exist.
                <span role="img" aria-labelledby="ConfusedFace">
                  😕
                </span>
              </Text>
            </FlexLoading>
          );
        }
        return (
          <FlexFullHeight flexDirection="column" height={1}>
            <HeaderChatContainer
              width={1}
              pl={2}
              color="powderblue"
              alignItems="center"
            >
              <RenderHeader state={state} />
            </HeaderChatContainer>
            <BoxConversation width={1} flex="1">
              <Conversation
                conversation={data.getConversations}
                subsToMore={subscribeToMore}
                idConversation={params.id}
              />
            </BoxConversation>
            <Mutation mutation={POST_MESSAGE}>
              {(mutate, { loading }) => {
                return (
                  <Flex
                    width={1}
                    p={3}
                    justifyContent="space-around"
                    alignItems="center"
                  >
                    <Input
                      ref={messageEl}
                      disabled={loading}
                      placeholder="Type a message..."
                    />
                    <Button
                      fontSize={1}
                      disabled={loading}
                      onClick={handleSubmit(mutate)}
                    >
                      SEND
                    </Button>
                  </Flex>
                );
              }}
            </Mutation>
          </FlexFullHeight>
        );
      }}
    </Query>
  );
}

export default Chatbox;
