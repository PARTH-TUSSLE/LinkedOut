import React from 'react'

function Navbar() {
  return (
    <div className="w-screen h-14 flex justify-between p-2">
      <h1 className="text-2xl font-bold cursor-pointer">LinkedOut</h1>
      <button className="bg-neutral-800 text-white border-2 rounded-xl px-2 py-1 cursor-pointer ">
        Be a part!
      </button>
    </div>
  );
}

export default Navbar
