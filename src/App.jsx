import React, { useState } from "react";
import ResultatsGels from "./components/ResultatsGels";
import ResultatsBODACC from "./components/ResultatsBODACC"; 

export default function App() {
  const [company, setCompany] = useState({ name: "", siret: "" });
  const [person, setPerson] = useState({
    lastName: "",
    firstName: "",
    birthDate: "",
    birthDept: "",
  });

  const [tempCompany, setTempCompany] = useState({ ...company });
  const [tempPerson, setTempPerson] = useState({ ...person });

  const parseDate = (dateStr) => {
    if (!dateStr) return {};
    const [annee, mois, jour] = dateStr.split("-");
    return { jour, mois, annee };
  };

  const handleSearchCompany = (e) => {
    e.preventDefault();
    setCompany({ ...tempCompany });
  };

  const handleSearchPerson = (e) => {
    e.preventDefault();
    setPerson({ ...tempPerson });
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-bold">Recherche</h1>

      {/* Formulaire entreprise */}
      <form
        onSubmit={handleSearchCompany}
        className="space-y-2 border p-4 rounded"
      >
        <h2 className="font-semibold">Entreprise</h2>
        <input
          type="text"
          placeholder="Nom commercial"
          value={tempCompany.name}
          onChange={(e) =>
            setTempCompany({ ...tempCompany, name: e.target.value })
          }
          className="border p-1 w-full"
        />
        <input
          type="text"
          placeholder="SIRET"
          value={tempCompany.siret}
          onChange={(e) =>
            setTempCompany({ ...tempCompany, siret: e.target.value })
          }
          className="border p-1 w-full"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          Rechercher
        </button>
      </form>

      {/* Formulaire personne */}
      <form
        onSubmit={handleSearchPerson}
        className="space-y-2 border p-4 rounded"
      >
        <h2 className="font-semibold">Personne</h2>
        <input
          type="text"
          placeholder="Nom"
          value={tempPerson.lastName}
          onChange={(e) =>
            setTempPerson({ ...tempPerson, lastName: e.target.value })
          }
          className="border p-1 w-full"
        />
        <input
          type="text"
          placeholder="Prénom"
          value={tempPerson.firstName}
          onChange={(e) =>
            setTempPerson({ ...tempPerson, firstName: e.target.value })
          }
          className="border p-1 w-full"
        />
        <input
          type="date"
          value={tempPerson.birthDate}
          onChange={(e) =>
            setTempPerson({ ...tempPerson, birthDate: e.target.value })
          }
          className="border p-1 w-full"
        />
        <input
          type="text"
          placeholder="Département de naissance"
          value={tempPerson.birthDept}
          onChange={(e) =>
            setTempPerson({ ...tempPerson, birthDept: e.target.value })
          }
          className="border p-1 w-full"
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-3 py-1 rounded"
        >
          Rechercher
        </button>
      </form>

      {/* Résultats du Gel des avoirs */}
      <div className="border p-4 rounded">
        <h2 className="font-semibold">Résultats du Gel des avoirs</h2>
        <ResultatsGels
          nom={person.lastName}
          prenom={person.firstName}
          departement={person.birthDept}
        />
      </div>

      {/* Résultats OpenDataSoft - Rétablissements personnels */}
      <div className="border p-4 rounded">
        <h2 className="font-semibold">Résultats Rétablissements Personnels</h2>
        <ResultatsBODACC
          nom={person.lastName}
          prenom={person.firstName}
          dateNaissance={parseDate(person.birthDate)}
        />
      </div>

      {/* Résultats entreprise */}
      <div className="border p-4 rounded">
        <h2 className="font-semibold">Résultats Entreprise</h2>
        <div className="space-y-2">
          <div>Nom commercial : {company.name}</div>
          <div>SIRET : {company.siret}</div>
        </div>
      </div>
    </div>
  );
}
