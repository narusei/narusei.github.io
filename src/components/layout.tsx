import * as React from 'react';
import { Link } from 'gatsby';

type LayoutProps = {
  title: GatsbyTypes.Maybe<string>;
};

const Layout: React.FC<LayoutProps> = ({ title, children }) => {
  const header = (
    <div className="text-gray-600 body-font shadow">
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        <Link
          className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0"
          to="/"
          itemProp="url"
        >
          <span className="md:ml-3 text-xl">{title}</span>
        </Link>
        <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
          <Link
            className="mr-5 hover:text-gray-900"
            to={'/blog'}
            itemProp="url"
          >
            Blog
          </Link>
          <Link className="mr-5 hover:text-gray-900" to="/work" itemProp="url">
            Work
          </Link>
          <Link className="hover:text-gray-900" to="/about" itemProp="url">
            About
          </Link>
        </nav>
      </div>
    </div>
  );

  const footer = (
    <div>
      <div className="bg-gray-100">
        <div className="container mx-auto py-4 px-5 flex flex-wrap flex-col sm:flex-row justify-center">
          <p className="text-gray-500 text-sm text-center sm:text-left">
            © 2022 Narusei —
            <a
              href="https://twitter.com/narusei_dev"
              rel="noopener noreferrer"
              className="text-gray-600 ml-1"
              target="_blank"
            >
              @narusei_dev
            </a>
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen">
      <header>{header}</header>
      <main className="flex-grow">{children}</main>
      <footer>{footer}</footer>
    </div>
  );
};

export default Layout;
