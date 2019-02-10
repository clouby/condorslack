import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Box as BBox, Flex as BFlex, Heading } from "rebass";
import { Query, Mutation } from "react-apollo";
import Loader from "react-loader-spinner";
import { gql } from "apollo-boost";
import PerfectScrollbar from "react-perfect-scrollbar";

import { Input as PInput } from "./Login";
import { TextForeground } from "./User";

const Flex = styled(BFlex)`
  max-height: 500px;
  width: 100%;
  overflow: hidden;
`;

const SpanCenter = styled.span`
  display: block;
  text-align: center;
  margin-bottom: 0.4em;
  font-size: 35px;
`;

const ChatSpan = styled.span`
  font-size: 20px;
  cursor: pointer;
`;

export const Input = styled(PInput)`
  vertical-align: super;
`;

const BoxUser = styled(BBox)`
  padding: 15px;

  &.load {
    pointer-events: none;
    opacity: 0.4;
  }

  &:hover {
    background: rgba(0, 0, 0, 0.15);
  }
`;

const SearchContainer = styled.div`
  text-align: center;
  display: flex;
  justify-content: center;
  min-height: 45px;
  padding: 15px;
`;

const LoaderCenter = styled(Loader)`
  text-align: center;
`;

const GET_USERS = gql`
  query {
    getUsers {
      _id
      name
      nickname
    }
  }
`;

const CREATE_PAIR = gql`
  mutation($_id: String!) {
    createPair(pairId: $_id) {
      _id
    }
  }
`;

function RenderUser({ filtered, closeModal }) {
  function rebuildQuery({ mutate }) {
    return async _ => {
      await mutate();
      closeModal();
    };
  }

  function user({ name, nickname, _id }, index) {
    return (
      <Mutation key={index} mutation={CREATE_PAIR} variables={{ _id }}>
        {(mutate, { loading }) => (
          <BoxUser className={loading && "load"}>
            <BFlex alignItems="center" justifyContent="space-between">
              <BBox>
                <Heading as="h3" color="#fff">
                  {name}
                </Heading>
                <TextForeground fontSize={0}>{`@${nickname}`}</TextForeground>
              </BBox>
              <BBox>
                <ChatSpan onClick={rebuildQuery({ mutate })}>
                  <span role="img" aria-label="Dialog">
                    💬
                  </span>
                </ChatSpan>
              </BBox>
            </BFlex>
          </BoxUser>
        )}
      </Mutation>
    );
  }

  return (
    <>
      {filtered.length > 0 ? filtered.map(user) : <SpanCenter>⛔</SpanCenter>}
    </>
  );
}

function UserList({ closeModal }) {
  // Immutable array of users
  const [users, setUsers] = useState([]);
  // Filtered users
  const [filtered, setFilter] = useState([]);
  // Input that change the list
  const [inputFilter, setInputFilter] = useState();

  // get the new list
  useEffect(() => {
    setFilter(users);
  }, [users]);

  // When type on filter, change the filtered array
  useEffect(() => {
    if (!inputFilter) return setFilter(_ => users);
    const regVal = new RegExp(inputFilter, "gi");
    const newUsers = users.filter(({ nickname }) => regVal.test(nickname));
    setFilter(_ => newUsers);
  }, [inputFilter]);

  // Change input status
  const filterUser = ({ target: { value } }) => setInputFilter(value);

  // Initialize array fetched
  const onComplete = ({ getUsers }) => setUsers(getUsers);

  return (
    <Flex flexDirection="column">
      <Query
        query={GET_USERS}
        fetchPolicy="network-only"
        onCompleted={onComplete}
      >
        {({ loading, error, data: { getUsers }, refetch }) => {
          if (loading)
            return (
              <LoaderCenter
                type="Triangle"
                height="40"
                width="40"
                color="#fff"
              />
            );
          if (error) return <div>error :/</div>;
          console.log(getUsers);
          return (
            <>
              <SearchContainer>
                <Input
                  type="text"
                  placeholder="Type nickname..."
                  onChange={filterUser}
                />
              </SearchContainer>
              <PerfectScrollbar>
                <RenderUser
                  filtered={filtered}
                  refetchQuery={refetch}
                  closeModal={closeModal}
                />
              </PerfectScrollbar>
            </>
          );
        }}
      </Query>
    </Flex>
  );
}

export default UserList;
