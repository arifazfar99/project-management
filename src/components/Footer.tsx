import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="py-6 text-center text-sm text-gray-500 border-t border-gray-200">
      <p>© {new Date().getFullYear()} . Made by Arif Azfar Azri</p>
    </footer>
  );
};

export default Footer;
