import { Link } from "react-router-dom"

function Header() {

   return (
      <header className="header">

         {/* LEFT SIDE */}
         <div className="header-left">

            <Link
               to="/"
               className="home-button"
            >
               GitSocial
            </Link>

         </div>

         {/* CENTER */}
         <div className="header-center">

            <input
               type="text"
               placeholder="Search users..."
               className="search-bar"
            />

         </div>

         {/* RIGHT SIDE */}
         <div className="header-right">

            <div className="profile-icon">
               👤
            </div>

         </div>

      </header>
   )
}

export default Header