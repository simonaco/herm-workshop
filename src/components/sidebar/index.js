import React from "react";
import Tree from "./tree";
import { StaticQuery, graphql } from "gatsby";
import styled from "@emotion/styled";
import { ExternalLink } from "react-feather";
import config from "../../../config";

const forcedNavOrder = config.sidebar.forcedNavOrder;

// eslint-disable-next-line no-unused-vars
const ListItem = styled(({ className, active, level, ...props }) => {
  return (
    <li className={className}>
      <a href={props.to} {...props} />
    </li>
  );
})`
  list-style: none;

  a {
    color: #364067;
    text-decoration: none;
    font-weight: ${({ level }) => (level === 0 ? 700 : 400)};
    padding: 0.45rem 0 0.45rem ${props => 2 + (props.level || 0) * 1}rem;
    display: block;
    position: relative;

    &:hover {
      opacity: 0.8 !important;
    }

    ${props =>
      props.active &&
      `
      color: #663399;
      border-color: rgb(230,236,241) !important;
      border-style: solid none solid solid;
      border-width: 1px 0px 1px 1px;
      background-color: #fff;
    `} // external link icon
    svg {
      float: right;
      margin-right: 1rem;
    }
  }
`;

const Sidebar = styled("aside")`
  width: 100%;
  /* background-color: rgb(245, 247, 249); */
  /* border-right: 1px solid #ede7f3; */
  height: 100vh;
  overflow: auto;
  position: fixed;
  padding-left: 0px;
  position: -webkit-sticky;
  position: -moz-sticky;
  position: sticky;
  top: 0;
  padding-right: 0;
  background-color: #fafafb;

  @media only screen and (max-width: 1023px) {
    width: 100%;
    /* position: relative; */
    height: 100vh;
  }
  @media (min-width: 767px) and (max-width: 1023px) {
    padding-left: 0;
  }
  @media only screen and (max-width: 767px) {
    padding-left: 0px;
    background-image: url("/herm-bg.png");
    /* background: #372476; */
    height: auto;
  }
`;

const Divider = styled(props => (
  <li {...props}>
    <hr />
  </li>
))`
  list-style: none;
  padding: 0.5rem 0;

  hr {
    margin: 0;
    padding: 0;
    border: 0;
    border-bottom: 1px solid #ede7f3;
  }
`;

const SidebarLayout = ({ location }) => (
  <StaticQuery
    query={graphql`
      query {
        allMdx {
          edges {
            node {
              fields {
                slug
                title
              }
            }
          }
        }
      }
    `}
    render={({ allMdx }) => {
      return (
        <Sidebar>
          <ul className={"sideBarUL"}>
            <form
              // style="border:1px solid #ccc;padding:3px;text-align:center;"
              action="https://tinyletter.com/codebeast"
              method="post"
              target="popupwindow"
              onsubmit="window.open('https://tinyletter.com/codebeast', 'popupwindow', 'scrollbars=yes,width=800,height=600');return true"
            >
              <p>
                <label for="tlemail">Let me keep you posted on new content:</label>
              </p>
              <p>
                <input
                  type="text"
                  // style="width:140px"
                  placeholder="Type email, hit enter"
                  name="email"
                  id="tlemail"
                />
              </p>
              <input type="hidden" value="1" name="embed" />
            </form>

            <Divider />
            <Tree edges={allMdx.edges} />
            <Divider />
            {config.sidebar.links.map((link, key) => {
              if (link.link !== "" && link.text !== "") {
                return (
                  <ListItem key={key} to={link.link}>
                    {link.text}
                    <ExternalLink size={14} />
                  </ListItem>
                );
              }
            })}
          </ul>
        </Sidebar>
      );
    }}
  />
);

export default SidebarLayout;
