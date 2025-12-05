function Footer() {
  const anneeCourante = new Date().getFullYear();

  return (
    <footer className="w-full text-center py-2 text-sm border-t border-[#3a2546] fixed bottom-0 left-0 bg-[#432866] text-white">
      <p>© {anneeCourante} - LAFLEUR Stanley</p>
    </footer>
  );
}

export default Footer;