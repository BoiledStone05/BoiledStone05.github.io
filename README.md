# Boiled Stone

Site musical et visuel statique, hébergé sur GitHub Pages. HTML, CSS et JavaScript natifs, sans compilation ni dépendance à installer.

## Développement local

Depuis le dossier du site, lancer `python -m http.server 4173`, puis ouvrir `http://localhost:4173`.

## Contenu

- Un seul lecteur public : le profil SoundCloud `boiled_stone`, avec un lien vers l’URL de partage fournie. Le lecteur se charge à son ouverture, sans lecture automatique.
- La piste bonus se révèle avec `↑ ↑ ↓ ↓ ← → ← →`. Les quatre boutons directionnels du pied de page permettent aussi cette saisie sur écran tactile. La révélation dure le temps de la page et ne demande aucune touche supplémentaire.
- Galerie : six images à l’ouverture, six autres dans « Prolonger l’exploration ». Agrandissement, téléchargement, navigation par flèches, fermeture avec Échap et retour du focus à l’image d’origine.
- La page et les liens restent utilisables sans JavaScript ; la visionneuse et le code secret nécessitent JavaScript.

## Images et typographie

Douze visuels du dossier Background ont été convertis en WebP à qualité 93, avec leurs dimensions d’origine. Les versions de galerie et d’accueil sont adaptées à leur affichage ; les originaux du Bureau n’ont pas été modifiés. Le bilan se trouve dans `image-optimization.json`.

La police Space Grotesk est hébergée localement. Sa licence SIL Open Font License est conservée dans `assets/fonts/OFL.txt`.

## Vérifications

`node --check assets/site.js` vérifie la syntaxe JavaScript. Le site se déploie directement depuis la branche principale avec GitHub Pages.
