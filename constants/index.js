const contractAddresses = require("./contractAddresses.json")
const abi = require("./abi.json")

module.exports = {
    abi,
    contractAddresses
}

//Instead of importing abi and contract adresses from individual files to lotteryentrance.jsx, we r doin' this