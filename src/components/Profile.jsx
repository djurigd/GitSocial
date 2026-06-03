import { ProfileHeader } from "./ProfileHeader";

import { useParams, Outlet } from "react-router-dom";

import { ProfileProvider } from "./ProfileProvider";

export function Profile() {
  const { username } = 'djurigd';

  return(
    <ProfileProvider username={'djurigd'}>
      <ProfileHeader />
      <Outlet />
    </ProfileProvider>
  )
}