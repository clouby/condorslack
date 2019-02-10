import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import Loader from "react-loader-spinner";
import styled from "styled-components";
import { Flex as AFlex, Box, Text as TText } from "rebass";
import { Query } from "react-apollo";
import { gql } from "apollo-boost";
import { authContext } from "../providers";
import { FlexLoading as FFlexLoading } from "./Chatbox";
import { pairIsMine, alterPairs } from "../utils";

const Flex = styled(AFlex)`
  height: 90%;
`;

export const FlexLoading = styled(FFlexLoading)`
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

const PAIR_ADDED = gql`
  subscription {
    pairAdded {
      _id
      members {
        name
        nickname
        email
      }
    }
  }
`;

const GET_PAIRS = gql`
  query {
    getPairs {
      _id
      members {
        nickname
        name
        email
      }
    }
  }
`;

export const LoadingRoom = props => (
  <FlexLoading justifyContent="center" alignItems="center">
    <Loader type="ThreeDots" height="30" width="30" color="#fff" />
  </FlexLoading>
);

export const ErrorRoom = props => (
  <FlexLoading justifyContent="center" alignItems="center">
    :(
  </FlexLoading>
);

const Nickname = ({ members: [user], idPair, index }) => (
  <Box width={1} pb={1} key={index}>
    <Text>
      <NavLink
        to={{
          pathname: `/${idPair}`,
          state: {
            name: user.name,
            email: user.email
          }
        }}
        activeClassName="active"
      >
        {`@${user.nickname}`}{" "}
      </NavLink>
    </Text>
  </Box>
);

export const SubscribeHandler = class extends React.Component {
  unsubscribe = null;

  componentDidMount() {
    const { subsToMore } = this.props;
    this.unsubscribe = subsToMore();
  }

  componentWillUnmount() {
    if (this.unsubscribe) this.unsubscribe();
  }

  render() {
    return <>{this.props.children}</>;
  }
};

const ListUsers = ({ data }) => {
  return (
    <>
      {data.map(({ members, _id }, index) => (
        <Nickname members={members} idPair={_id} index={index} key={index} />
      ))}
    </>
  );
};

function Pairs(props) {
  const {
    state: { user }
  } = useContext(authContext);

  function prepareSubscribe(subscribeToMore) {
    return () =>
      subscribeToMore({
        document: PAIR_ADDED,
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) {
            return prev;
          }

          const {
            data: { pairAdded }
          } = subscriptionData;

          // BUG: Query fire twice this subscribe, and this function don't duplicate the data
          if (
            prev.getPairs.length > 0 &&
            prev.getPairs.some(({ _id }) => _id === pairAdded._id)
          ) {
            return prev;
          }

          // Verify whether the next pair added is mine
          if (!pairIsMine(pairAdded, user)) {
            return prev;
          }

          //  Put the next pairs
          const getPairs = [...prev.getPairs, pairAdded];

          return { getPairs };
        }
      });
  }

  return (
    <Query query={GET_PAIRS}>
      {({ loading, error, data, subscribeToMore }) => {
        if (loading) return <LoadingRoom />;
        if (error) return <ErrorRoom />;
        const newPairs = alterPairs(data.getPairs, user);
        return (
          <Flex width={1} flexDirection="column" mt={2}>
            <SubscribeHandler subsToMore={prepareSubscribe(subscribeToMore)}>
              <ListUsers data={newPairs} />
            </SubscribeHandler>
          </Flex>
        );
      }}
    </Query>
  );
}

export default Pairs;
