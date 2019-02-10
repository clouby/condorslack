import React, { useRef, useEffect } from "react";
import { gql } from "apollo-boost";
import styled from "styled-components";
import { Flex, Box } from "rebass";
import { Input as IInput } from "./UserList";
import { ButtonM } from "./Login";
import { Mutation } from "react-apollo";

const Button = styled(ButtonM)`
  vertical-align: super;
`;

const Input = styled(IInput)`
  &:disabled {
    opacity: 0.4;
  }
`;

const CREATE_CHANNEL = gql`
  mutation($channelName: String!) {
    createChannel(channel: $channelName)
  }
`;

function CreateChannel({ closeModal }) {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  });

  function handleSubmit(mutate) {
    return async _ => {
      if (!inputRef.current || !inputRef.current.value) return;
      const { value: channelName } = inputRef.current;
      await mutate({ variables: { channelName } });
      closeModal();
    };
  }

  return (
    <Mutation mutation={CREATE_CHANNEL}>
      {(mutate, { loading }) => {
        return (
          <Flex justifyContent="center" px={3}>
            <Box width={1} flex={4}>
              <Input
                type="text"
                disabled={loading}
                ref={inputRef}
                placeholder="Create a great group name...✨"
              />
            </Box>
            <Box width={1} flex={1}>
              <Button bg="#86edff" fontSize={1} onClick={handleSubmit(mutate)}>
                CREATE
              </Button>
            </Box>
          </Flex>
        );
      }}
    </Mutation>
  );
}

export default CreateChannel;
