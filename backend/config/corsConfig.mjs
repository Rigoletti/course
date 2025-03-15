import cors from "cors";

const configureCors = () => {
  return cors({
    origin: "http://localhost:5173",
    credentials: true,
  });
};

export default configureCors;