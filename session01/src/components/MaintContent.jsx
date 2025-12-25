

function MaintContent({ activePage }) {
  const date = new Date();
  const day = date.getDate(); // (plus logique que getDay)
  const month = date.toLocaleString("fr-FR", { month: "long" });
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  const text = `Bonjour, on est le ${day} ${month} ${year}, et il est ${hours}:${minutes}:${seconds}.`;



  return (
    <main className="w-full flex flex-col items-center mb-8">
      <h2 className="p-2">{text}</h2>

      <div className="w-auto mx-auto">
        
      </div>
    </main>
  );
}

export default MaintContent;

