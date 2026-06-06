import { ProfileHeader } from "./ProfileHeader";

import { useParams, Outlet } from "react-router-dom";

import { ProfileProvider } from "./ProfileProvider";

export function Profile() {
  const { username } = useParams();

  return(
    <ProfileProvider username={username}>
      <ProfileHeader />
      <Outlet />
    </ProfileProvider>
  )
}