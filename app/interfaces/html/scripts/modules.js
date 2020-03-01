async function getModules(){
  let result = await makeRequest('', "POST", "/api/get-installed-modules");
  result = JSON.parse(result);
  const li = document.createElement("li");
  for(const modl of result.res){
    li.innerHTML += `<a target="content" href="/modules/${modl}/${modl}.html"><span>${modl.charAt(0).toUpperCase() + modl.slice(1)}</span></a>`;
  }
  document.getElementById("menu-ul").prepend(li);
}
getModules();
