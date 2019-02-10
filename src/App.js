// Dependencies
import React, { useContext } from "react";
import { ApolloProvider } from "react-apollo";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import styled from "styled-components";
import { Flex as MainFlex, Box as MBox } from "rebass";

// Local Dependencies
import { client } from "./api";
import { authContext } from "./providers";
import Sidebar from "./components/SideBar";
import Chatbox from "./components/Chatbox";
import Login from "./components/Login";
import "./App.css";

const Flex = styled(MainFlex)`
  border-radius: 4px;
  overflow: hidden;
  box-shadow: rgba(0, 0, 0, 0.46) 0px 0px 50px;
  border: 0.5px solid #282828;
  height: 85vh;
`;

const Box = styled(MBox)`
  &:last-child {
    border-left: 0.5px solid rgba(0, 0, 0, 0.46);
  }
`;

function App() {
  const {
    state: { isAuth }
  } = useContext(authContext);

  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <div className="App">
          <header className="App-header">
            <Flex width={1 / 1.5}>
              <Box width={0.2} color="white" bg="#2c313a">
                {isAuth && <Sidebar />}
              </Box>
              <Box p={0} width={1 / 1.2} color="white" bg="#292e36">
                <Switch>
                  <Route path="/:id" exact component={Chatbox} />
                </Switch>
              </Box>
            </Flex>
            {!isAuth && <Login />}
          </header>
        </div>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;
