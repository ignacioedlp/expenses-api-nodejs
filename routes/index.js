var express = require("express");
var router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

//!GET: /api/v1/
router.get("/", function (req, res, next) {
  res.json({
    message: "Hello World",
  });
});

//!GET: /api/v1/budgets
router.get("/budgets", async function (req, res, next) {
  const budgets = await prisma.budget.findMany();
  res.json(budgets);
});

//!GET: /api/v1/budget/:idBudget
router.get("/budget/:idBudget", async function (req, res, next) {
  const { idBudget } = req.params;

  const budget = await prisma.budget.findUnique({
    where: {
      id: Number(idBudget),
    },
  });
  res.json(budget);
});

//!GET: /api/v1/budget/byType/:typeBudget
router.get("/budget/byType/:typeBudget", async function (req, res, next) {
  const { typeBudget } = req.params;

  const budget = await prisma.budget.findMany({
    where: {
      type: typeBudget,
    },
  });
  res.json(budget);
});

//!POST: /api/v1/budget
router.post("/budget", async function (req, res, next) {
  const { type, amount, concept } = req.body;
  console.log(req.body);
  await prisma.budget.create({
    data: {
      type,
      amount,
      concept,
      createdAt: new Date(),
    },
  });
  res.json({
    message: "Budget created",
  });
});

//!PUT: /api/v1/budget/:idBudget
router.put("/budget/:idBudget", async function (req, res, next) {
  const { idBudget } = req.params;
  const { type, amount, concept } = req.body;
  console.log(req.body);
  await prisma.budget.update({
    where: {
      id: Number(idBudget),
    },
    data: {
      type,
      amount,
      concept,
      updatedAt: new Date(),
    },
  });
  res.json({
    message: "Budget updated",
  });
});

//!GET: /api/v1/Totalbalance
router.get("/Totalbalance", async function (req, res, next) {
  const ingresos = await prisma.budget.findMany({
    where: {
      type: "ingreso",
    },
  });
  const egresos = await prisma.budget.findMany({
    where: {
      type: "egreso",
    },
  });

  let totalBalance = 0;
  ingresos.forEach((ingreso) => {
    totalBalance += ingreso.amount;
  });
  egresos.forEach((egreso) => {
    totalBalance -= egreso.amount;
  });
  res.json({
    totalBalance,
  });
});

//!DELETE /api/v1/budget/:id
router.delete("/budget/:idBudget", async function (req, res, next) {
  const { idBudget } = req.params;
  await prisma.budget.delete({
    where: {
      id: Number(idBudget),
    },
  });
  res.json({
    message: "Budget deleted",
  });
});

module.exports = router;
