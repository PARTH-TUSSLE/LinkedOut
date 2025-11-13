import React from 'react'
import Navbar from '../../components/Navbar/page'

function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Navbar/>
      {children}
    </div>
  )
}

export default UserLayout
