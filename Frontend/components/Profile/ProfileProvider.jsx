import { ProfileContext } from "./ProfileContext";
import { useState, useEffect } from "react";
import { graphql } from "@octokit/graphql";
import { supabase } from "../supabaseClient";

// Setup for GraphQL
const gql = graphql.defaults({
    headers: {
      authorization: `token ${import.meta.env.VITE_GHP}`,
    },
  });

// Context provider for profile
export function ProfileProvider({ username, children }) {
  // Profile elements
  const [profile, setProfile] = useState({
    username: "",
    name: "",
    login: "",
    pronouns: "",
    bio: "",
    followers: 0,
    following: 0,
    avatarUrl: ""
  });

  // Querying from GitHub's GraphQL API and Supabase
  useEffect(() => {
    // Get the user's GitHub info for the context
    gql(`
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
    `, { username })
      .then(({ user }) => {
        setProfile({
          name: user.name,
          login: user.login,
          pronouns: user.pronouns,
          bio: user.bio,
          followers: user.followers.totalCount,
          following: user.following.totalCount,
          avatarUrl: user.avatarUrl
        });
      });

      // Get the platform username
      supabase.from('users')
        .select('username')
        .eq('github_username', username)
        .single()
        .then(({ data }) => {
          if (data) setProfile(prev => ({ ...prev, username: data.username }));
      });
  }, [username]);

  return(
    <ProfileContext.Provider value={profile}>
      {children}
    </ProfileContext.Provider>
  )
}