import React from "react";
import styled from "styled-components";
import { Image as BImage } from "rebass";

const Image = styled(BImage)`
  display: block;
`;

const ImageAvatar = ({ pic }) => (
  <div>
    <img
      style={{ display: "block" }}
      src={pic || "http://localhost:4000/static/default.jpg"}
      alt="profile"
    />
  </div>
);

export default ImageAvatar;
