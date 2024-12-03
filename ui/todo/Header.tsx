import React from 'react';

interface HeaderProps {
  nick: string;
  role: string;
}

const Header: React.FC<HeaderProps> = ({ nick, role }) => {

  return (
    <header className='p-[20px] w-full flex justify-center items-center'>
      <h1 className='text-2xl'>{nick}: {role}</h1>
    </header>
  );
}
 
export default Header;