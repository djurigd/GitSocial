import { ProfileHeader } from "../../components/Profile/ProfileHeader";

import { useParams, Outlet } from "react-router-dom";

import { ProfileProvider } from "../../components/Profile/ProfileProvider";

export default function Profile() {
  const { username } = 'djurigd';

  return(
    <ProfileProvider username={'djurigd'}>
      <ProfileHeader />
      <Outlet />
    </ProfileProvider>
  )
}
