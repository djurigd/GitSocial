import { ProfileHeader } from "../../components/Profile/ProfileHeader";
import { useParams, Outlet } from "react-router-dom";
import { ProfileProvider } from "../ProfileProvider";
import { useProfile } from "../../components/Profile/ProfileContext";

// Check if the user exists
function CheckProfile() {
  const { login } = useProfile();
  
  // If the user doesn't exist, don't display anything
  if (!login) {
    return <></>;
  }

  // Display the children routes
  return <Outlet />
}

// User profile display
export function Profile() {
  const { username } = useParams();
  
  return(
    <ProfileProvider username={username}>
      <ProfileHeader />
      <CheckProfile />
    </ProfileProvider>
  )
}
