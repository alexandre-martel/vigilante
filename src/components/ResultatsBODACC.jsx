import React, { useEffect, useState } from "react";

const ResultatsBODACC = ({ nom, prenom, departement }) => {
  const [results, setResults] = useState([]);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    if (!nom && !prenom && !departement) {
      setResults([]);
      return;
    }

    const queryParts = [];
    if (nom) queryParts.push(`listepersonnes like '%"nom": "${nom}"%'`);
    if (prenom) queryParts.push(`listepersonnes like '%"prenom": "${prenom}"%'`);
    if (departement) queryParts.push(`numerodepartement = '${departement}'`);

    const url = `https://bodacc-datadila.opendatasoft.com/api/explore/v2.1/catalog/datasets/annonces-commerciales_qualif/records?where=${encodeURIComponent(
      queryParts.join(" AND ")
    )}`;

    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        // Filtrer uniquement les enregistrements valides avec fields

        setResults(json.results || []);
      })
      .catch((err) => {
        console.error("Erreur API:", err);
        setResults([]);
      });
  }, [nom, prenom, departement]);

  if (!results.length) return <div>Aucun résultat trouvé</div>;

  return (
  <div>
    {results.map((r) => {
      const id = r.id;
      const isOpen = expanded[id] || false;

      // Parse les champs JSON stringifiés
      let personne = null;
      try {
        personne = r.listepersonnes ? JSON.parse(r.listepersonnes) : null;
      } catch (e) {
        console.warn("Erreur parsing listepersonnes", e);
      }

      let jugement = null;
      try {
        jugement = r.jugement ? JSON.parse(r.jugement) : null;
      } catch (e) {
        console.warn("Erreur parsing jugement", e);
      }

      return (
        <div key={id} className="p-3 border-b">
          {/* Infos essentielles */}
          <strong>{r.commercant || personne?.personne?.nom || "Inconnu"}</strong>
          <div>📅 {r.dateparution || "N/A"}</div>
          <div>⚖️ {r.tribunal || "N/A"}</div>
          <div>
            📄 {r.familleavis_lib || "N/A"} – {r.typeavis_lib || "N/A"}
          </div>

          {/* Bouton pour déplier */}
          <button
            onClick={() =>
              setExpanded((prev) => ({ ...prev, [id]: !isOpen }))
            }
            className="text-blue-600 mt-2"
          >
            {isOpen ? "Masquer détails ▲" : "Voir détails ▼"}
          </button>

          {/* Bloc dépliable */}
          {isOpen && (
            <div className="mt-2 text-sm bg-gray-50 p-2 rounded space-y-1">
              <div>Département: {r.departement_nom_officiel || "N/A"}</div>
              <div>Ville: {r.ville || "N/A"}</div>
              <div>CP: {r.cp || "N/A"}</div>
              <div>
                SIREN/RCS: {r.registre?.join(", ") || personne?.personne?.numeroImmatriculation?.numeroIdentification || "N/A"}
              </div>
              {jugement && (
                <div>
                  <strong>Jugement:</strong> {jugement.nature} ({jugement.date})  
                  <div className="italic">{jugement.complementJugement}</div>
                </div>
              )}
              {r.url_complete && (
                <a
                  href={r.url_complete}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-500 underline"
                >
                  Consulter l’annonce complète
                </a>
              )}
            </div>
          )}
        </div>
      );
    })}
  </div>
);
};

export default ResultatsBODACC;
