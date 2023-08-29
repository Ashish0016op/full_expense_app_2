const expenseDetails = require('../model/expenseData');
const loginDetails = require('../model/loginDetails');
const totalExp=require('../model/totalExpenses');
const sequelize = require('../util/database');

exports.getAllData = async (req, res, next) => {
    try {
        const leaderboardData = await loginDetails.findAll({
            attributes: ['Username'],
            include: [
                {
                    model: totalExp,
                    attributes: ['totalExpense'],
                },
            ],
            order: [[totalExp, 'totalExpense', 'DESC']],
        });

        res.status(200).json(leaderboardData);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Server error' });
    }
};


