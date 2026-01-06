import Menu from "./Menu";
import mbdsLogo from "/mbds_logo.png";

function Header() {
  const title = "Student Management System";
  const subTitle = "A la découverte des premières notions de React";

  return (
    <header className="w-full flex flex-col items-center gap-2 md:gap-4 mt-4 mb-2 md:mb-4 md:mt-8">
      <div className="w-full flex justify-center">
        <img src={mbdsLogo} alt="MBDS" className="img-fluid w-32 md:w-64  bg-white p-2 rounded-lg shadow-lg shadow-amber-500/50 md:shadow-amber-500"/>
      </div>
      <h1 className="text-md md:text-3xl font-bold">{title}</h1>
      <h2 className="hidden md:block text-xl">{subTitle}</h2>
    </header>
  );
}

export default Header;