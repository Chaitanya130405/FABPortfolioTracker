const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());

app.use("/api", require("./routes/investorRoute"));
app.use("/api", require("./routes/fundRoute"));
app.use("/api", require("./routes/portfolioRoute"));
app.use("/api", require("./routes/sipRoute"));
app.use("/api", require("./routes/transactionRoute"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
