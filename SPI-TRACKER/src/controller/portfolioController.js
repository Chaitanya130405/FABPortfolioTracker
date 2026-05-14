const { getAllPortfolios } = require("../model/portfolioModel");

const allPortfolios = async (request, response) => {
  const portfolios = await getAllPortfolios();
  return response.json(portfolios);
};

module.exports = {
  allPortfolios,
};
