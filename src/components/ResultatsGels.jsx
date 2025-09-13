import React, { useEffect, useState } from "react";

const ResultatsGels = ({ nom, prenom, dateNaissance }) => {
  const [data, setData] = useState([]);
  const [results, setResults] = useState([]);

  // Charger le JSON au montage
  useEffect(() => {
    fetch("/Registrenationaldesgels.json")
      .then((res) => res.json())
      .then((json) => setData(json.Publications.PublicationDetail || []));
  }, []);

  // Filtrer à chaque changement d'input ou de data
  useEffect(() => {
    // Si aucun argument fourni, ne rien afficher
    if (!nom && !prenom && (!dateNaissance || Object.keys(dateNaissance).length === 0)) {
      setResults([]);
      return;
    }

    if (!data.length) return;

    const filtres = data.filter((item) => {
      if (item.Nature !== "Personne physique") return false;

      const nomMatch =
        !nom ||
        item.Nom.toLowerCase().includes(nom.trim().toLowerCase());

      const prenomObj = item.RegistreDetail.find(
        (d) => d.TypeChamp === "PRENOM"
      );
      const prenoms = prenomObj ? prenomObj.Valeur.map((v) => v.Prenom.toLowerCase()) : [];
      const prenomMatch =
        !prenom ||
        prenoms.some((p) =>
          p.includes(prenom.trim().toLowerCase())
        );

      const dateObj = item.RegistreDetail.find(
        (d) => d.TypeChamp === "DATE_DE_NAISSANCE"
      );
      const date = dateObj ? dateObj.Valeur[0] : {};
      const jourMatch =
        !dateNaissance?.jour || date.Jour === dateNaissance.jour;
      const moisMatch =
        !dateNaissance?.mois || date.Mois === dateNaissance.mois;
      const anneeMatch =
        !dateNaissance?.annee || date.Annee === dateNaissance.annee;

      return nomMatch && prenomMatch && jourMatch && moisMatch && anneeMatch;
    });

    setResults(filtres);
  }, [nom, prenom, dateNaissance, data]);

  // Si pas de résultats ou aucun argument, ne rien afficher
  if (!results.length) return null;

  return (
    <div>
      {results.map((personne) => (
        <div key={personne.IdRegistre} className="p-2 border-b">
          <strong>{personne.Nom}</strong>
          <div>
            {personne.RegistreDetail.map((detail, i) => (
              <div key={i}>
                <em>{detail.TypeChamp}:</em>{" "}
                {detail.Valeur.map((v, j) => (
                  <span key={j}>
                    {Object.values(v).join(" ")}{" "}
                  </span>
                ))}
              </div>
            ))}
          </div>
          <br />
        </div>
      ))}
    </div>
  );
};

export default ResultatsGels;