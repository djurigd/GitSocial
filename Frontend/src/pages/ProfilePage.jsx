import { ProfileHeader } from "../../components/Profile/ProfileHeader";
import { useParams, Outlet } from "react-router-dom";
import { ProfileProvider } from "../../components/Profile/ProfileProvider";
import { useProfile } from "../../components/Profile/ProfileContext";

function CheckProfile() {
  const { login } = useProfile();
  
  if (!login) {
    return null;
  }

  return <Outlet />
}

export function Profile() {
  const { username } = useParams();

  return(
    <ProfileProvider username={username}>
      <ProfileHeader />
      <CheckProfile />
    </ProfileProvider>
  )
}

export default Profile
