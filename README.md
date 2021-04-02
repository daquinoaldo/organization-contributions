# GitHub organization contributions
_A simple dashboard for organization contributions_

Visit the [free online version](https://daquinoaldo.github.io/organization-contributions) without having to deploy your own!

# Use in your project
[app.js](app.js) is the main file. After having imported it you have access tho this functions:
- `getRepos(org)` that provides an array containg athe names of all the repository of that organization.
- `getRepoContributors(owner, repositoryName)` that provides an object containing the repository name and an array of contibutors (tht has the properties name, commit, added and deleted).
- `getContributors(org)` that provides an object containing the organization name, an array of contributors, and an array of repository (each one has the properties name and contributors)

All this functions return promises resolved with the result.

### Example
`getContributors(myorg)` will produce this output:
```
{
    "name": "myorg",
    "repos": [
        {
            "name": "repo1",
            "contributors": [
                {"name": "user1", "commits": 2, "added": 15, "deleted": 0},
                {"name": "user2", "commits": 3, "added": 100, "deleted": 10}
            ]
        },
        {
            "name": "repo2",
            "contributors": [{"name": "user1", "commits": 5, "added": 200, "deleted": 25}]
        }
    ],
    "contributors": [
        {"name": "user1", "commits": 7, "added": 215, "deleted": 25},
        {"name": "user2", "commits": 3, "added": 100, "deleted":10}
    ]
}
```

<br>

**Important:** the GitHub API requests limit is pretty low. You can remove the limit using the [GitHub OAuth App](https://github.com/settings/developers).

Create a [new app](https://github.com/settings/applications/new) and edit [app.js](app.js) assigning your `client_id` and `client_secret` values to the variables at the beginning of the file.  
You can also overwrite this variable after importing the app.js file.
