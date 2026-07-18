/* smoke-test seed — headless/test use ONLY.
   Guarded: does nothing unless the URL says ?smokeseed, so a human stumbling
   onto /smoke.html can never wipe real progress. */
if (location.search.includes("smokeseed")) {
  localStorage.clear();
  localStorage.setItem("qq_profiles_v1", JSON.stringify({ names: ["Rachel", "jzn"], active: "jzn" }));
  localStorage.setItem("qq_state_v1::jzn", JSON.stringify({ name: "jzn", fullAccess: true, hsk2Open: true }));
} else {
  document.body.innerHTML = "<h2 style='padding:40px;text-align:center'>smoke test page — add ?smokeseed to run (wipes local progress!)</h2>";
  throw new Error("smoke seed not requested");
}
