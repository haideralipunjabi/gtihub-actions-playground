const nunjucks = require("nunjucks");
const fs = require("fs");
const { extension } = require("mime-types");
const axios = require('axios');
const workspace = process.env.workspace;
function download(url, path) {
    return axios({
      url,
      responseType: 'stream',
    }).then(response=>
      new Promise((resolve,reject)=>{
        const ext = extension(response.headers['content-type'])
        response.data.pipe(fs.createWriteStream(`${path}.${ext}`))
        .on('finish', ()=> resolve(ext))
        .on('error', e=>reject(e));
      }))
}

async function createFile(data) {
  console.log(data.name);
  let username = data.name.toLowerCase().replace(/ /g, "");
  let downloadPromises = []
  if (Object.keys(data).includes("profilepicture")) {
    downloadPromises.push(await download(
      data.profilepicture,
      `${workspace}/public/images/devs/${username}`,
    ).then(ext=>{
        data.image_profile_pic = `${username}.${ext}`;
    }));
  }
  if (Object.keys(data).includes("workspacepicture")) {
    downloadPromises.push(await download(
      data.workspacepicture,
      `${workspace}/public/images/workspace/${username}`
    ).then(ext=>{
      data.image_workspace_pic = `${username}.${ext}`;
  }));
  }

  Promise.all(downloadPromises).then(()=>{
    nunjucks.configure(`${workspace}/.github/workflows/templates`);

    let res = nunjucks.render("developer.njk", { data: data });
    fs.writeFile(`${workspace}/pages/devs/${username}.mdx`, res, (err) => {
      if (err) return console.log(err);
    });
  })

  
}
const Questions = [
  "Who are you, and what do you do?",
  "What hardware do you use?",
  "What does your workspace look like?",
  "Image of your workspace",
  "What software do you use?",
  "What programming language would you use if your life depended on it?",
  "What is your favourite food to have while programming?",
  "What kind of music do you prefer while working?",
  "What is the one piece of advice you would give to a developer getting started?",
  "How can we improve the software development culture in Kashmir?",
  "One thing that you want to plug about yourself or someone else.",
];

const data = JSON.parse(process.env.workflow_data);

let questions = [];
Questions.forEach((q, i) => {
  if (Object.keys(data).includes(`question${i + 1}`)) {
    questions.push({
      question: q,
      response: data[`question${i + 1}`],
    });
  }
});
data["questions"] = questions;
createFile(data);
