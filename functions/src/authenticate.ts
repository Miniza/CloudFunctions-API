import {db} from "./admin";
const auth = db.auth();

export const authenticate = async (req:any, res:any, next:any) => {
  if (!req.headers.authorization || !req.headers.authorization
      .startsWith("Bearer ")) {
    res.status(401).send("Unauthorized");
    return;
  }
  const idToken = req.headers.authorization.split(" ")[1];
  try {
    const decodedIdToken = await auth.verifyIdToken(idToken);
    req.user = decodedIdToken;
    next();
    return;
  } catch (e) {
    res.status(401).send("Unauthorized");
    return;
  }
};

module.exports = {
  authenticate,
};
