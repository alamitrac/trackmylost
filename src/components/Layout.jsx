import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

/**
 * Standard app shell: sticky navbar, routed page content, footer.
 * Auth pages (login/register/admin login) opt out of this layout.
 */
export default function Layout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
