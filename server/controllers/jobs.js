const User = require("../db/model/user");

const getDashboardStats = async (req, res) => {
    const totalCount = await User.find().count()
    res.status(200).json({
        totalUsers: totalCount -1,
    })
}

module.exports = {
    getDashboardStats
}
