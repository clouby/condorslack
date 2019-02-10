import React, { useState } from "react";
import styled from "styled-components";
import { Box, Flex as FlexHeight } from "rebass";
import Modal from "./Modal";
import { TextForeground } from "./User";
import UserList from "./UserList";
import Pairs from "./Pairs";
import CreateChannel from "./CreateChannel";
import Channels from "./Channels";

const { CHANNEL, DIRECT } = { CHANNEL: "channel", DIRECT: "direct" };

const Flex = styled(FlexHeight)`
  height: 100%;
`;

const TextIcon = styled(TextForeground)`
  text-transform: uppercase;
  display: flex;
  justify-content: space-between;

  & > span {
    cursor: pointer;
  }
`;

function Rooms(props) {
  const [{ isOpen, action }, changeStatus] = useState({
    isOpen: false,
    action: null
  });

  function openModal(action) {
    return _ => {
      changeStatus({ isOpen: true, action });
    };
  }

  function closeModal() {
    changeStatus({ isOpen: false, action: null });
  }

  return (
    <Flex flexDirection="column">
      <Box flex="1">
        <TextIcon fontSize={1}>
          <strong>channels</strong>
          <span
            role="img"
            aria-label="HeavyPlusSign"
            onClick={openModal(CHANNEL)}
          >
            ➕
          </span>
        </TextIcon>
        <Channels />
      </Box>
      <Box flex="1">
        <TextIcon fontSize={1}>
          <strong>directs</strong>
          <span
            role="img"
            aria-label="HeavyPlusSign"
            onClick={openModal(DIRECT)}
          >
            ➕
          </span>
        </TextIcon>
        <Pairs />
      </Box>
      <Modal isOpen={isOpen} onRequestClose={closeModal}>
        {action === CHANNEL ? (
          <CreateChannel closeModal={closeModal} />
        ) : (
          <UserList closeModal={closeModal} />
        )}
      </Modal>
    </Flex>
  );
}

export default Rooms;
