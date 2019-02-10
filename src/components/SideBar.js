import React, { useContext } from "react";
import styled from "styled-components";
import { Flex as SideFlex, Box } from "rebass";
import { authContext } from "../providers";
import User from "./User";
import Rooms from "./Rooms";

const Flex = styled(SideFlex)`
  height: 100%;
`;

function Sidebar() {
  const {
    state: { user, isAuth },
    dispatch
  } = useContext(authContext);

  return (
    <Flex flexDirection="column" justifyContent="center">
      <Box flex="1" p={3}>
        <User user={user} isAuth={isAuth} dispatchAuth={dispatch} />
      </Box>
      <Box flex="12" p={3}>
        <Rooms />
      </Box>
    </Flex>
  );
}

export default Sidebar;
