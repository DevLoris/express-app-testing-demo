# Mes conventions

## Commentaire
Le code doit être commenté de manière compréhensible humainement, et de manière suffisante pour qu'une personne tierce puisse modifier le code à sa guise.
-> Lisibilité, compréhension

## En anglais, please
Les variables, les noms de fichier doivent être en anglais. Comme les langages de dév. Ca éviter d'avoir du franglais aussi. 
-> Lisibilité du code

## Des variables bien nommées
Les variables doivent être nommées clairement et de manière précise pour connaitre leur rôle et leur contenu
-> Lisibilité du code

## Un code bien découpé
Pensez lisible. Il faut que le code soit découpé de manière logique afin d'éviter des fonctions à rallonge et incompréhensible
-> Lisibilité du code

## Bien nommer ses commits
Avoir des commits bien nommés qui disent ce qui a été fait, résolu
-> Gain de temps au moment du code review, simplicité de lecture

## Readme 
Faire un vrai readme qui explique le projet, comment l'installer, les dépendances etc
-> Gain de temps, centralisation des informations 

## Librairies inutiles
Eviter de mettre des énormes librairies pour une fonctionnalité qui serait développable en 2 minutes...
-> Allègement du projet



# Choix d'infrastructure

## Infra : 
cloud storage google pour ne pas avoir d'infra à gérer, ni de sysadmin. Gain de temps et financier. Possibilité du coup aussi d'avoir plus ou moins de monde

## 2 développeurs 
- pour ajouter du cache et passer en PWA
- (sauver structure de la page pour gagner du temps de chargement et limiter le trafic)
- personnes x 2000€ / mois  = 4000€
    
- 2 dévs pour pouvoir évoluer aussi et partage de connaissance + aide mise en place des services
    
## DB NoSQL pour enregistrer les urls des images en cache
- Firebase Data store
- 1 user = 2 search par minute = 10000 * 2 = 20000
    
- En se basant sur le pricing : https://firebase.google.com/pricing
- 0.06$ = 5 minutes
- 0.72$ = 1 heure
- 17,28$ la journée 
- Le mois environ 520$ (environ 440 euros)
    
    
- Pas de sys-admin à payer du coup. On économise un salaire.    

## Sécurité : 
- Audit de sécurité dés qu'on modifie des éléments relatifs au serveur etc (pour éviter que ça casse des choses)
- 1000€ le pentest environ 

## App Engine Scalable :
- 6 instances au minimum : 176$ / mo (150€)
    
## Stockage des images :
- 1000 images -> 3mo -> 100 users pour ca
- 300mo pour 10K user
- 1GO = 30K user (marges)
- Prévoir 100GO de stockage pour 3M d'images
- => 2.60 € pour 100 GO
- => mettre une centaine d'euros pour être ultra large
    

## Total
- => Total : 5000€ / mo ? + couts variables (si Pentest ; si plus ou moins d'instance )
- +   marge = 40% -> 2000€ de plus -> 7000€

    
- Besoin de NoSQL pour cacher les recherches précédentes et éviter de faire des millions de call api similaires