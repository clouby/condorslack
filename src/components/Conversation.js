import React, { useEffect } from "react";
import Moment from "react-moment";
import { Flex, Box, Text, Heading as HHeading } from "rebass";
import styled from "styled-components";
import PerfectScrollbar from "react-perfect-scrollbar";
import { MESSAGE_POSTED } from "./Chatbox";

const BoxLine = styled(Box)`
  &:nth-child(odd) {
    background-color: rgb(105, 105, 105, 0.06);
  }
`;

const FlexContainer = styled(Flex)`
  height: 100%;
`;

const TextMessage = styled(Text)`
  font-size: 0.5em;
  font-family: monospace;
  & > span {
    background-color: beige;
    color: black;
    padding: 3px;
    border-radius: 3px;
  }
`;

const Heading = styled(HHeading)`
  font-size: 0.5em;
  font-weight: 300;
  font-family: sans-serif;
`;

function LineChat({ line }) {
  return (
    <BoxLine p={2} pb={3}>
      <Heading mb={2}>
        <strong>{line.author.name}</strong>
        {" - "}
        <Moment style={{ color: "gray" }} date={line.date} fromNow />
      </Heading>
      <TextMessage>
        <span>{line.message}</span>
      </TextMessage>
    </BoxLine>
  );
}

export class Conversation extends React.Component {
  unsubscribe = null;

  componentDidMount() {
    const { subsToMore, idConversation } = this.props;

    this.unsubscribe = subsToMore({
      document: MESSAGE_POSTED,
      variables: { idConversation },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;

        const { messagePosted } = subscriptionData.data;

        console.log(messagePosted, idConversation);
        if (messagePosted.conversation !== idConversation) return prev;
        return { getConversations: [...prev.getConversations, messagePosted] };
      }
    });
  }

  componentWillUnmount() {
    if (this.unsubscribe) this.unsubscribe();
  }

  render() {
    const { conversation } = this.props;
    return (
      <FlexContainer flexDirection="column">
        <PerfectScrollbar>
          {conversation.map((line, index) => (
            <LineChat line={line} index={index} key={index} />
          ))}
        </PerfectScrollbar>
      </FlexContainer>
    );
  }
}
