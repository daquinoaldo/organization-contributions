# GitHub organization contributions
_A simple dashboard for organization contributions_

# Use in your project
[app.js](app.js) is the main file. After having imported it you have access tho this functions:
- `getRepos(org)` that provides an array containg athe names of all the repository of that organization.
- `getRepoContributors(owner, repositoryName)` that provides an object containing the repository name and an array of contibutors (tht has the properties name, commit, added and deleted).
- `getContributors(org)` that provides an object containing the organization name, an array of contributors, and an array of repository (each one has the properties name and contributors)

All this functions return promises resolved with the result.
