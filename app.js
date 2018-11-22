function httpGetAsync(url) {
  return new Promise((resolve, reject) => {
    const xmlHttp = new XMLHttpRequest()
    xmlHttp.onloadend = () => {
      if (xmlHttp.status == 200)
        resolve(xmlHttp.responseText)
      else if (xmlHttp.status === 404)
        reject(404)
    }
    xmlHttp.open("GET", url, true) 
    xmlHttp.send(null)
  })
}

function getRepos(org) {
  return new Promise((resolve, reject) => {
    const url = "https://api.github.com/orgs/"+org+"/repos"
    httpGetAsync(url).then(res => {
      const json = JSON.parse(res)
      const repos = []
      for (let i = 0; i < json.length; i++) {
        repos.push(json[i].name)
      }
      resolve(repos)
    }).catch(err => reject(err))
  })
}

function getRepoContributors(org, repo) {
  return new Promise((resolve, reject) => {
    const url = "https://api.github.com/repos/"+org+"/"+repo+"/stats/contributors"
    httpGetAsync(url).then(res => {
      const json = JSON.parse(res)
      const developers = []
      for (let i = 0; i < json.length; i++) {
        const obj = json[i]
        const developer = {
          name: obj.author.login,
          commits: 0,
          added: 0,
          deleted: 0
        }
        for (let j = 0; j < obj.weeks.length; j++) {
          const week = obj.weeks[j]
          developer.commits += week.c
          developer.added += week.a
          developer.deleted += week.d
        }
        developers.push(developer)
      }
      resolve(developers)
    }).catch(err => reject(err))
  })
}

function getContributors(org) {
  return new Promise((resolve, reject) => {
    // prepare and empty organization
    const organization = {
      name: org,
      repos: [],
      contributors: []
    }
    const promises = []
    // retrieve the repository names list
    getRepos(org).then(repos => {
      for (let i = 0; i < repos.length; i++)
        // for each one add the name and its contributors to the organization 
        promises.push(getRepoContributors(org, repos[i]).then(contributors => {
          const repo = {
            name: repos[i],
            contributors: contributors
          }
          organization.repos.push(repo)
          // and update the organization contributtors with global stats
          for (let j = 0; j < contributors.length; j++) {
            const contributor = contributors[j]
            let developer = organization.contributors.find(obj => obj.name === contributor.name)
            // if it doesn't exists create a new one
            if (!developer) {
              developer = {
                name: contributor.name,
                commits: contributor.commits,
                added: contributor.added,
                deleted: contributor.deleted
              }
              organization.contributors.push(developer)
            }
            // else just update its stats
            else {
              developer.commits += contributor.commits,
              developer.added += contributor.added,
              developer.deleted += contributor.deleted
            }
          }
        }))
        Promise.all(promises).then(() => resolve(organization))
    }).catch(err => reject("Organization "+org+" not found"))
  })
}
