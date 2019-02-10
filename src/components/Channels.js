import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import Loader from "react-loader-spinner";
import styled from "styled-components";
import { Flex as AFlex, Box, Text as TText } from "rebass";
import { Query } from "react-apollo";
import { gql } from "apollo-boost";
import { authContext } from "../providers";
import { FlexLoading } from "./Chatbox";
import { LoadingRoom, ErrorRoom, SubscribeHandler } from "./Pairs";

const Flex = styled(AFlex)`
  height: 90%;
`;

const Text = styled(TText)`
  font-size: 1rem;
  color: #bfe6f2;
  cursor: pointer;
  & > a {
    color: #bfe6f2;
    text-decoration: none;
    &.active {
      font-weight: bold;
    }
  }

  &:hover {
    font-weight: bold;
  }
`;

const CHANNEL_ADDED = gql`
  subscription {
    channelAdded {
      _id
      channel
    }
  }
`;

const GET_CHANNELS = gql`
  query {
    getChannels {
      _id
      channel
    }
  }
`;

const Channel = ({ data: { channel, _id } }) => {
  const regExP = new RegExp(" ", "g");
  const hashtag = channel
    .trim()
    .toLowerCase()
    .replace(regExP, "_");
  return (
    <Box width={1} pb={1}>
      <Text>
        <NavLink
          to={{
            pathname: `/${_id}`,
            state: {
              name: channel
            }
          }}
          activeClassName="active"
        >
          {`#${hashtag}`}{" "}
        </NavLink>
      </Text>
    </Box>
  );
};

const ListChannels = ({ data }) => {
  return (
    <>
      {data && data.map((data, index) => <Channel data={data} key={index} />)}
    </>
  );
};

function Channels(props) {
  function prepareSubscribe(subsToMore) {
    return () =>
      subsToMore({
        document: CHANNEL_ADDED,
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) return prev;
          const { channelAdded } = subscriptionData.data;
          const ref = [...prev.getChannels, channelAdded];

          const nextChannels = ref.sort((a, b) => {
            if (a.channel < b.channel) {
              return -1;
            }
            if (a.channel > b.channel) {
              return 1;
            }
            return 0;
          });

          return { getChannels: [...nextChannels] };
        }
      });
  }
  return (
    <Query query={GET_CHANNELS}>
      {({ loading, error, data, subscribeToMore }) => {
        if (loading) return <LoadingRoom />;
        if (error) return <ErrorRoom />;
        return (
          <Flex width={1} flexDirection="column" mt={2}>
            <SubscribeHandler subsToMore={prepareSubscribe(subscribeToMore)}>
              <ListChannels data={data.getChannels} />
            </SubscribeHandler>
          </Flex>
        );
      }}
    </Query>
  );
}

export default Channels;
