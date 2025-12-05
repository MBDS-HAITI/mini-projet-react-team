import Menu from "./Menu";
import mbdsLogo from "/mbds_logo.png";

function Header() {
  const title = "Introduction à React";
  const subTitle = "A la découverte des premières notions de React";

  return (
    <header className="w-full flex flex-col items-center mt-8">
      <div className="w-full flex justify-center">
        <img src={mbdsLogo} alt="MBDS" className="img-fluid w-64  bg-white p-2 rounded-lg shadow-lg shadow-amber-500"/>
      </div>
      <h1>{title}</h1>
      <h2>{subTitle}</h2>
    </header>
  );
}

export default Header;