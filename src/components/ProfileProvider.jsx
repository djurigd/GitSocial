import { ProfileContext } from "./ProfileContext";
import { useState, useEffect } from "react";
import { graphql } from "@octokit/graphql";

const gql = graphql.defaults({
    headers: {
      authorization: `token ${import.meta.env.VITE_GHP}`,
    },
  });

export function ProfileProvider({ username, children }) {
  const [profile, setProfile] = useState({
    name: "",
    login: "",
    pronouns: "",
    bio: "",
    followers: 0,
    following: 0,
    avatarUrl: ""
  });

  

  useEffect(() => {
    gql((`
      query GetProfile($username: String!) {
        user(login: $username) {
          name
          login
          pronouns
          bio
          followers { totalCount }
          following { totalCount }
          avatarUrl
        }
      }
    `), { username })
      .then(({ user }) => {
        setProfile({
          name: user.name,
          login: user.login,
          pronouns: user.pronouns,
          bio: user.bio,
          followers: user.followers,
          following: user.following,
          avatarUrl: user.avatarUrl
        });
      });
  }, [username]);

  return(
    <ProfileContext.Provider value={profile}>
      {children}
    </ProfileContext.Provider>
  )
}