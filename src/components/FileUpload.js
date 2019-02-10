import React, { useRef } from "react";
import { gql } from "apollo-boost";
import { Query, Mutation } from "react-apollo";

const GET_MAGNOLIA = gql`
  query {
    magnolia
  }
`;

const CREATE_USER = gql`
  mutation($name: String!) {
    createUser(name: $name)
  }
`;

const UPLOAD_FILE = gql`
  mutation($file: Upload!) {
    uploadPicture(file: $file)
  }
`;

function FileUpload(props) {
  const fileRef = useRef(null);

  function sendName(mutate) {
    return e => {
      const [file] = fileRef.current.files;
      console.log(file);
      mutate({ variables: { file } });
    };
  }

  return (
    <>
      <Mutation mutation={UPLOAD_FILE}>
        {mutate => {
          return (
            <>
              <input type="file" ref={fileRef} />
              <button onClick={sendName(mutate)}>SEND</button>
            </>
          );
        }}
      </Mutation>
    </>
  );
}

export default FileUpload;
