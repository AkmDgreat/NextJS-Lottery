import { useEffect } from "react"
import { useMoralis } from "react-moralis"

export default function ManualHeader() {
    const { enableWeb3, account, isWeb3Enabled, Moralis, deactivateWeb3, isWeb3EnableLoading } = useMoralis()

    //When we refresh:
    //If our wallet is connected, we want to automatically reconnect the wallet
    //If our wallet isn't connected, we don't want metamask to pop up

    useEffect(() => {
        if (
            typeof window !== "undefined" && //nextJS sometimes hv problem with window object. So, we r makin' sure that windo object is defined
            window.localStorage.getItem("connected") && // if wallet is connected, then "connected" will be present in localstorage
            !isWeb3Enabled // on refresh, wallet disconnects
        ) {
            enableWeb3()
        }
    }, [isWeb3Enabled])

    useEffect(() => {
        Moralis.onAccountChanged((account) => {
            console.log(`Account changed to ${account}`)
            if (account == null) {
                window.localStorage.removeItem("connected")
                deactivateWeb3() // deactivateWeb3() sets isWeb3Enabled to false
            }
        })
    }, [])

    //strictMode renders every component twice
    //If u pass an empty array: useEffect will run only on load
    //If u pass nothing(ie. not even an empty array):it will run when any component re-renders
    //If u pass an arg: useEffect will be triggered on load AND when the arg changes

    if (account) {
        return (
            <div>
                Connected to {account.slice(0, 6)}...{account.slice(account.length - 4)}
            </div>
        )
    } else {
        return (
            <button
                onClick={async () => {
                    await enableWeb3()
                    if (typeof window !== "undefined") {
                        window.localStorage.setItem("connected", "injected") //set the connected-injected key value pair. Application => local Storage => http://localhost:3000
                    }
                }}
                disabled={isWeb3EnableLoading} //Disable the button while wallet is loadin'
            >
                Connect
            </button>
        )
    }
}
