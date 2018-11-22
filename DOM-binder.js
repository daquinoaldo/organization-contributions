const container = document.getElementById("container")
const search_input = document.getElementById("search_input")

function buildCard(title, contributors = []) {
  const h4 = document.createElement("h4")
  h4.innerHTML = title
  const ul = document.createElement("ul")
  for (let i = 0; i < contributors.length; i++) {
    const contributor = contributors[i]
    const li = document.createElement("li")
    li.innerHTML = "<span class=\"author\">"+contributor.name+":</span> \xa0" +
      "<span class=\"commits\">"+contributor.commits+" commits</span>\xa0" +
      "<span class=\"added\">"+contributor.added+" ++</span> \xa0" +
      "<span class=\"deleted\">"+contributor.deleted+" --</span>"
    ul.appendChild(li)    
  }
  const card = document.createElement("div")
  card.classList = "card"
  card.appendChild(h4)
  card.appendChild(ul)
  return card
}

function emptyNode(node) {
  while (node.firstChild)
    node.removeChild(node.firstChild);
}

function setMessage(message) {
  const span = document.createElement("span")
  span.innerHTML = message
  const card = document.createElement("div")
  card.classList = "card"
  card.id = "main-card"
  card.appendChild(span)
  emptyNode(container)
  container.appendChild(card)
}

function compute() {
  const org = search_input.value
  // Append the org query to the url
  window.history.pushState("", "", window.location.href.split("?")[0]+"?org="+org)
  // Add the loading message in the container
  const loadingMsg = "Loading contributions for "+org+"..."
  console.log(loadingMsg)
  setMessage(loadingMsg)
  // Load the contributions and set the content when loaded
  getContributors(org).then(organization => {
    const orgCard = buildCard(organization.name, organization.contributors)
    orgCard.id = "main-card"
    emptyNode(container)
    container.appendChild(orgCard)
    for (let i = 0; i < organization.repos.length; i++)
      container.appendChild(
        buildCard(organization.name+"/"+organization.repos[i].name,
          organization.repos[i].contributors))
    console.log(organization)
  }).catch(err => {
    console.warn(err)
    setMessage(err)
  })
}

search_input.addEventListener("keyup", (event) => {
  event.preventDefault()
  if (event.keyCode === 13) compute()
})

function parseUrl() {
  const url = new URL(window.location.href)
  const org = url.searchParams.get("org")
  if (org) {
    search_input.value = org
    compute()
  }
}
parseUrl()