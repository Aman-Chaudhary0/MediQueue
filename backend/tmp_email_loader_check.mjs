import("./src/utils/email.js")
  .then(() => {
    console.log("email util loaded");
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
  
