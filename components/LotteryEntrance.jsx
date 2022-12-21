import { useWeb3Contract } from "react-moralis"
import { abi, contractAddresses } from "../constants/index" // even "../constants" will work
import { useMoralis } from "react-moralis"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { useNotification } from "web3uikit"

//Moralis knows the chain ID because of <MoralisProvider> tag in app.js

export default function LotteryEntrance() {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis() //pull out chainId and rename it to chainIdHex
    const chainId = parseInt(chainIdHex) //the chainId we get from Moralis is in Hex. So we r convertin' it to int
    const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null // see the contractAddresses file
    const [entranceFee, setEntranceFee] = useState("0")
    const [numOfPlayers, setNumOfPlayers] = useState("0")
    const [recentWinner, setRecentWinner] = useState("0")

    const dispach = useNotification()

    const {
        runContractFunction: enterRaffle,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        params: {},
        msgValue: entranceFee,
    })

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getEntranceFee",
        params: {},
    })

    const { runContractFunction: getNumOfPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getNumOfPlayers",
        params: {},
    })

    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getRecentWinner",
        params: {},
    })

    async function updateUI() {
        const entranceFee_fromCall = (await getEntranceFee()).toString()
        const numOfPlayers_fromCall = (await getNumOfPlayers()).toString()
        const recentWinner_fromCall = await getRecentWinner()
        setEntranceFee(entranceFee_fromCall)
        setNumOfPlayers(numOfPlayers_fromCall)
        setRecentWinner(recentWinner_fromCall)
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            //const updateUI = await getEntranceFee() //This won't work cuz u can't use await inside useEffect()
            updateUI()
        }
    }, [isWeb3Enabled]) //on refresh: isWeb3Enabled is false. Then it changes to true (via useEffect (see ManualHeader.jsx).
    // Thats why we r putin' isWeb3Enabled in dependencies array
    const entranceFee_formatted = ethers.utils.formatUnits(entranceFee, "ether")

    const handleSuccess = async function (tx) {
        await tx.wait(1)
        handleNewNotification(tx)
        updateUI()
    }
    //If u don't put updateUI() inside handleSuccess, u'll need to refresh the page to see the updated nuo. of players

    const handleNewNotification = function () {
        dispach({
            type: "info",
            message: "Transaction complete",
            title: "Tx notification",
            position: "topR",
            icon: "bell",
        })
    }

    if (raffleAddress) {
        return (
            <div className="p-5">
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
                    onClick={async () => {
                        await enterRaffle({
                            onSuccess: handleSuccess,
                            onError: (error) => console.log(error),
                        })
                    }}
                    disabled={isLoading || isFetching}
                >
                    {isLoading || isFetching ? (
                        <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                    ) : (
                        <div>Enter Raffle</div>
                    )}
                </button>
                <div>Entrance Fee: {entranceFee_formatted} ETH </div>
                <div>Number of players: {numOfPlayers} </div>
                <div>Latest winner: {recentWinner} </div>
            </div>
        )
    } else {
        return <div> Please Connect to LocalHost </div>
    }
}
