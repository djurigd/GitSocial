import { useState } from 'react';
import { Link } from 'react-router-dom';

export function ProfileNav() {
  const [page, setPage] = useState({});

  const pages = [
    { to: "/:profileId", page: "Posts" },
    { to: "/:profileId/Projects", page: "Projects" }
  ];
  return(
    <>
      <nav>
        <ul>
          {pages.map((link, id) => (
            <li key={id} 
                className="nav-button" 
                id={page === id? "current" : ""}>
                    <Link to={link.to} 
                        className="nav-button" 
                        id={page === id ? "current" : ""} 
                        onClick={() => setPage(id)}>
                          {link.page}
                    </Link>
              </li>
          ))}
        </ul>
      </nav>
    </>
  )
}